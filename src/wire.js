var strategies = {
  drop: function(serverState, key, incoming) {
    serverState[key] = incoming
  },
  push: function(serverState, key, incoming) {
    var current = serverState[key]
    if (Array.isArray(current) && Array.isArray(incoming)) {
      serverState[key] = current.concat(incoming)
    } else {
      serverState[key] = incoming
    }
  },
  nomerge: function() {},
  error: function(serverState, key, incoming, failHandlers) {
    var current = serverState[key]
    var isEmpty = current === null || current === undefined
      || (Array.isArray(current) && current.length === 0)
      || (typeof current === 'object' && !Array.isArray(current) && Object.keys(current).length === 0)
    if (!isEmpty) {
      var err = new Error('wire:error — ключ "' + key + '" уже содержит данные')
      err.strategy = 'error'
      err.key = key
      failHandlers.forEach(function(fn) { fn(err) })
      return
    }
    serverState[key] = incoming
  },
  // зарезервировано — умный мерж по id для пагинации
  merge: function(serverState, key, incoming) {
    var current = serverState[key]
    if (Array.isArray(current) && Array.isArray(incoming)) {
      serverState[key] = current.concat(incoming)
    } else {
      serverState[key] = incoming
    }
  },
}

function noopAjax() {
  // заглушка когда jQuery недоступен — используется в тестах
  // никогда не резолвится, просто возвращает deferred
  return {
    done:   function() { return this },
    fail:   function() { return this },
    always: function() { return this },
  }
}

function defaultAjax(options) {
  if (typeof $ !== 'undefined' && $.ajax) return $.ajax(options)
  throw new Error('$wire: jQuery не найден. Подключите jQuery или передайте ajax в опциях createWire.')
}

function createWire(options) {
  options   = options || {}
  var ajaxFn    = options.ajax || defaultAjax
  var csrf      = options.csrf || null
  var pending   = {}
  var listeners = {}

  function emit(event) {
    var args = Array.prototype.slice.call(arguments, 1)
    ;(listeners[event] || []).forEach(function(fn) { fn.apply(null, args) })
  }

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(fn)
    return wire
  }

  function request(method, url, data, strategy) {
    strategy = strategy || 'drop'

    var doneHandlers   = []
    var failHandlers   = []
    var alwaysHandlers = []
    var hasDone        = false
    var state          = null
    var target   = null;

    var chain = {
      to: function(ref) {
        target = ref
        return chain
      },

      // .before(fn) вызывает fn немедленно при регистрации —
      // это позволяет писать .get().before(fn) и fn вызовется до ответа
      before: function(fn) {
        fn()
        return chain
      },
      done: function(fn) {
        hasDone = true
        doneHandlers.push(fn)
        return chain
      },
      fail:      function(fn) { failHandlers.push(fn);   return chain },
      always:    function(fn) { alwaysHandlers.push(fn); return chain },
      withState: function(s)  { state = s;               return chain },

      // TODO: затычки для w-wire декларативного сахара
      // _prefetch:   null,
      // _bindView:   null,
      // _watchState: null,
    }

    pending[url] = true
    emit('$wiring', 'start', url)

    var ajaxOptions = { url: url, method: method.toUpperCase(), headers: {} }
    if (csrf) ajaxOptions.headers['X-CSRF-TOKEN'] = csrf
    if (data && (method === 'post' || method === 'put')) {
      ajaxOptions.data        = JSON.stringify(data)
      ajaxOptions.contentType = 'application/json'
    }

    var req = ajaxFn(ajaxOptions)

    req.done(function(responseData) {
      emit('$wiring', 'done', url)

      // если указан .to() — пишем туда напрямую
      if (target !== null) {
        // пишем всё содержимое ответа прямо туда
        if (Array.isArray(target)) {
          target.length = 0
          responseData.forEach(function(item) { target.push(item) })
        } else {
          Object.assign(target, responseData)
        }
        doneHandlers.forEach(function(fn) { fn(responseData) })
        return
      }

      // авто-мерж всегда
      if (state && state.server && typeof responseData === 'object' && responseData !== null) {
        var strategyFn = strategies[strategy] || strategies.drop
        Object.keys(responseData).forEach(function(key) {
          strategyFn(state.server, key, responseData[key], failHandlers)
        })
      }

      // .done() просто дополнительный колбэк, не отменяет мерж
      doneHandlers.forEach(function(fn) { fn(responseData) })
    })

    req.fail(function(jqXHR, textStatus) {
      emit('$wiring', 'fail', url)
      failHandlers.forEach(function(fn) { fn(jqXHR, textStatus) })
    })

    req.always(function() {
      delete pending[url]
      emit('$wiring', 'always', url)
      alwaysHandlers.forEach(function(fn) { fn() })
    })

    return chain
  }

  // $wire()       → true если хоть один запрос активен
  // $wire('/url') → true если этот URL активен
  function wire(url) {
    if (url === undefined) return Object.keys(pending).length > 0
    return !!pending[url]
  }

  wire.get    = function(url, strategy)       { return request('get',    url, null, strategy) }
  wire.post   = function(url, data, strategy) { return request('post',   url, data, strategy) }
  wire.put    = function(url, data, strategy) { return request('put',    url, data, strategy) }
  wire.delete = function(url, strategy)       { return request('delete', url, null, strategy) }
  wire.on     = on

  return wire
}

const $wire = createWire()

export { createWire, $wire, noopAjax }