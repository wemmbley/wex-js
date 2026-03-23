const { createWire } = require('../src/wire')

function makeState(server = {}) {
  return { server, storage: {}, count: 0 }
}

function mockAjax(response, { status = 200 } = {}) {
  return jest.fn(() => {
    const handlers = { done: [], fail: [], always: [] }
    const deferred = {
      done:   (fn) => { handlers.done.push(fn);   return deferred },
      fail:   (fn) => { handlers.fail.push(fn);   return deferred },
      always: (fn) => { handlers.always.push(fn); return deferred },
      _resolve: () => {
        if (status >= 200 && status < 300) {
          handlers.done.forEach(fn => fn(response))
        } else {
          handlers.fail.forEach(fn => fn({ status }, 'error'))
        }
        handlers.always.forEach(fn => fn())
      }
    }
    return deferred
  })
}

// ─────────────────────────────────────────────
// 1. Создание $wire
// ─────────────────────────────────────────────

describe('createWire', () => {

  it('возвращает объект с методами get post put delete', () => {
    const $wire = createWire()
    expect(typeof $wire.get).toBe('function')
    expect(typeof $wire.post).toBe('function')
    expect(typeof $wire.put).toBe('function')
    expect(typeof $wire.delete).toBe('function')
  })

  it('$wire как функция-чекер возвращает false если нет активных запросов', () => {
    const $wire = createWire()
    expect($wire()).toBe(false)
    expect($wire('/api/catalog')).toBe(false)
  })

})

// ─────────────────────────────────────────────
// 2. Цепочка колбэков
// ─────────────────────────────────────────────

describe('цепочка .before .done .fail .always', () => {

  it('возвращает объект с методами цепочки', () => {
    const ajax  = mockAjax({})
    const $wire = createWire({ ajax })
    const chain = $wire.get('/api/test')
    expect(typeof chain.before).toBe('function')
    expect(typeof chain.done).toBe('function')
    expect(typeof chain.fail).toBe('function')
    expect(typeof chain.always).toBe('function')
  })

  it('цепочка возвращает себя для chaining', () => {
    const ajax  = mockAjax({})
    const $wire = createWire({ ajax })
    const chain = $wire.get('/api/test')
    expect(chain.before(() => {})).toBe(chain)
    expect(chain.done(() => {})).toBe(chain)
    expect(chain.fail(() => {})).toBe(chain)
    expect(chain.always(() => {})).toBe(chain)
  })

  it('вызывает .done при успешном ответе', (done) => {
    const ajax  = mockAjax({ catalog: ['a', 'b'] })
    const $wire = createWire({ ajax })

    $wire.get('/api/catalog')
      .done(data => {
        expect(data).toEqual({ catalog: ['a', 'b'] })
        done()
      })

    ajax.mock.results[0].value._resolve()
  })

  it('вызывает .fail при ошибке сервера', (done) => {
    const ajax  = mockAjax({}, { status: 500 })
    const $wire = createWire({ ajax })

    $wire.get('/api/catalog')
      .fail(err => {
        expect(err.status).toBe(500)
        done()
      })

    ajax.mock.results[0].value._resolve()
  })

  it('вызывает .always и при успехе и при ошибке', (done) => {
    let count = 0
    const check = () => { count++; if (count === 2) done() }

    const ajaxOk  = mockAjax({ catalog: [] })
    const ajaxErr = mockAjax({}, { status: 500 })

    createWire({ ajax: ajaxOk  }).get('/ok' ).always(check)
    createWire({ ajax: ajaxErr }).get('/err').always(check)

    ajaxOk.mock.results[0].value._resolve()
    ajaxErr.mock.results[0].value._resolve()
  })

  it('вызывает .before до отправки запроса', () => {
    const order = []
    const ajax  = mockAjax({ items: [] })
    const $wire = createWire({ ajax })

    $wire.get('/api/items')
      .before(() => order.push('before'))
      .done(()   => order.push('done'))

    expect(order).toEqual(['before'])
    ajax.mock.results[0].value._resolve()
    expect(order).toEqual(['before', 'done'])
  })

})

// ─────────────────────────────────────────────
// 3. Авто-мерж в state.server
// ─────────────────────────────────────────────

describe('авто-мерж в state.server', () => {

  it('пишет ответ в state.server если .done не написан', (done) => {
    const ajax  = mockAjax({ catalog: ['a', 'b'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: [] })

    $wire.get('/api/catalog').withState(state)
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(state.server.catalog).toEqual(['a', 'b'])
      done()
    })
  })

  it('НЕ пишет в state.server если .done написан', (done) => {
    const ajax  = mockAjax({ catalog: ['a', 'b'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: [] })
    let manualCalled = false

    $wire.get('/api/catalog')
      .withState(state)
      .done(() => { manualCalled = true })

    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(manualCalled).toBe(true)
      expect(state.server.catalog).toEqual([])
      done()
    })
  })

  it('.fail и .always не выключают авто-мерж', (done) => {
    const ajax  = mockAjax({ catalog: ['x'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: [] })

    $wire.get('/api/catalog')
      .withState(state)
      .fail(() => {})
      .always(() => {})

    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(state.server.catalog).toEqual(['x'])
      done()
    })
  })

})

// ─────────────────────────────────────────────
// 4. Стратегии мержа
// ─────────────────────────────────────────────

describe('стратегии мержа', () => {

  it('drop (дефолт) — удаляет всё, записывает новое', (done) => {
    const ajax  = mockAjax({ catalog: ['B', 'D'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: ['A', 'B', 'C'] })

    $wire.get('/api/catalog', 'drop').withState(state)
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(state.server.catalog).toEqual(['B', 'D'])
      done()
    })
  })

  it('push — добавляет в конец, не трогает существующее', (done) => {
    const ajax  = mockAjax({ catalog: ['B', 'D'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: ['A', 'B', 'C'] })

    $wire.get('/api/catalog', 'push').withState(state)
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(state.server.catalog).toEqual(['A', 'B', 'C', 'B', 'D'])
      done()
    })
  })

  it('nomerge — не пишет в state.server вообще', (done) => {
    const ajax  = mockAjax({ catalog: ['B', 'D'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: ['A'] })

    $wire.get('/api/catalog', 'nomerge').withState(state)
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(state.server.catalog).toEqual(['A'])
      done()
    })
  })

  it('error — бросает если ключ не пустой', (done) => {
    const ajax  = mockAjax({ catalog: ['B', 'D'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: ['A'] })
    let failCalled = false

    $wire.get('/api/catalog', 'error')
      .withState(state)
      .fail(() => { failCalled = true })

    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(failCalled).toBe(true)
      expect(state.server.catalog).toEqual(['A'])
      done()
    })
  })

  it('error — пишет если ключ пустой массив', (done) => {
    const ajax  = mockAjax({ catalog: ['B', 'D'] })
    const $wire = createWire({ ajax })
    const state = makeState({ catalog: [] })

    $wire.get('/api/catalog', 'error').withState(state)
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(state.server.catalog).toEqual(['B', 'D'])
      done()
    })
  })

})

// ─────────────────────────────────────────────
// 5. $wire как чекер состояния
// ─────────────────────────────────────────────

describe('$wire() — чекер активных запросов', () => {

  it('возвращает true пока запрос активен', () => {
    const ajax  = mockAjax({ catalog: [] })
    const $wire = createWire({ ajax })

    $wire.get('/api/catalog')
    expect($wire()).toBe(true)
    expect($wire('/api/catalog')).toBe(true)
  })

  it('возвращает false после завершения запроса', () => {
    const ajax  = mockAjax({ catalog: [] })
    const $wire = createWire({ ajax })

    $wire.get('/api/catalog')
    ajax.mock.results[0].value._resolve()

    expect($wire()).toBe(false)
    expect($wire('/api/catalog')).toBe(false)
  })

  it('возвращает false для незапущенного URL', () => {
    const $wire = createWire()
    expect($wire('/api/never-called')).toBe(false)
  })

})

// ─────────────────────────────────────────────
// 6. Событие $wiring
// ─────────────────────────────────────────────

describe('событие $wiring', () => {

  it('вызывает $wiring start перед запросом', () => {
    const events = []
    const ajax   = mockAjax({ catalog: [] })
    const $wire  = createWire({ ajax })

    $wire.on('$wiring', (status, url) => events.push({ status, url }))
    $wire.get('/api/catalog')

    expect(events[0]).toEqual({ status: 'start', url: '/api/catalog' })
  })

  it('вызывает $wiring done после успеха', (done) => {
    const events = []
    const ajax   = mockAjax({ catalog: [] })
    const $wire  = createWire({ ajax })

    $wire.on('$wiring', (status, url) => events.push({ status, url }))
    $wire.get('/api/catalog')
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(events.some(e => e.status === 'done')).toBe(true)
      done()
    })
  })

  it('вызывает $wiring fail после ошибки', (done) => {
    const events = []
    const ajax   = mockAjax({}, { status: 500 })
    const $wire  = createWire({ ajax })

    $wire.on('$wiring', (status, url) => events.push({ status, url }))
    $wire.get('/api/catalog')
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(events.some(e => e.status === 'fail')).toBe(true)
      done()
    })
  })

  it('вызывает $wiring always в любом случае', (done) => {
    const statuses = []
    const ajax     = mockAjax({ catalog: [] })
    const $wire    = createWire({ ajax })

    $wire.on('$wiring', (status) => statuses.push(status))
    $wire.get('/api/catalog')
    ajax.mock.results[0].value._resolve()

    setImmediate(() => {
      expect(statuses).toContain('always')
      done()
    })
  })

})

// ─────────────────────────────────────────────
// 7. CSRF
// ─────────────────────────────────────────────

describe('CSRF', () => {

  it('передаёт csrf токен если он передан в опциях', () => {
    const ajax  = mockAjax({})
    const $wire = createWire({ ajax, csrf: 'test-token-123' })

    $wire.post('/api/save', { name: 'test' })

    const callArgs = ajax.mock.calls[0][0]
    expect(callArgs.headers['X-CSRF-TOKEN']).toBe('test-token-123')
  })

  it('не падает если csrf не передан', () => {
    const ajax  = mockAjax({})
    const $wire = createWire({ ajax })

    expect(() => $wire.post('/api/save', {})).not.toThrow()
  })

})
