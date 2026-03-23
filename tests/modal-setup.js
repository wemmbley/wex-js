/**
 * jest.setup.js
 * Мок-окружение: jQuery + Bootstrap Modal + минимальный Wex
 *
 * Устанавливает глобальные объекты которые wex-modal.js ожидает найти
 * в window при загрузке в браузере.
 */

// ─── jQuery-мок ───────────────────────────────────────────────────────────────
// Нам нужен jQuery с поддержкой .on/.off/.each и $.fn расширения.
// В jsdom доступен реальный jQuery через require если поставить пакет,
// но для изоляции делаем минимальный функциональный мок.

const makeEl = (el) => {
    if (!el) {
        // пустой jQuery-объект
        el = document.createElement('div')
    }
    const $el = {
        _el: el,
        _events: {},

        each(fn) {
            fn.call(el, 0, el)
            return $el
        },

        on(event, callback) {
            el.addEventListener(event, callback)
            $el._events[event] = $el._events[event] || []
            $el._events[event].push(callback)
            return $el
        },

        off(event, callback) {
            el.removeEventListener(event, callback)
            return $el
        },

        attr(name, value) {
            if (value === undefined) return el.getAttribute(name)
            el.setAttribute(name, value)
            return $el
        },

        get length() {
            return el ? 1 : 0
        },

        [0]: el,
    }
    return $el
}

const jQuery = (selector) => {
    if (typeof selector === 'string') {
        const el = document.querySelector(selector)
        return makeEl(el)
    }
    if (selector && selector.nodeType) {
        return makeEl(selector)
    }
    return makeEl(null)
}

jQuery.fn = {}
global.$ = jQuery

// ─── Bootstrap Modal мок ──────────────────────────────────────────────────────
// Имитирует bootstrap.Modal API:
//   new bootstrap.Modal(el, opts)
//   instance.show()
//   instance.hide()
//   bootstrap.Modal.getInstance(el)

const instanceMap = new WeakMap()

class MockModal {
    constructor(el, options = {}) {
        this._el      = el
        this._options = options
        this._shown   = false
        instanceMap.set(el, this)
    }

    show() {
        this._el.classList.add('show')
        this._shown = true
        this._el.dispatchEvent(new Event('show.bs.modal'))
        // имитируем асинхронность Bootstrap — shown после show
        this._el.dispatchEvent(new Event('shown.bs.modal'))
    }

    hide() {
        this._el.classList.remove('show')
        this._shown = false
        this._el.dispatchEvent(new Event('hide.bs.modal'))
        this._el.dispatchEvent(new Event('hidden.bs.modal'))
    }

    handleUpdate() {}

    dispose() {
        instanceMap.delete(this._el)
    }

    static getInstance(el) {
        return instanceMap.get(el) || null
    }
}

global.bootstrap = { Modal: MockModal }

// ─── Wex (jqvm) мок ───────────────────────────────────────────────────────────
// Нам нужен только directive() — он регистрирует нашу директиву.
// Сохраняем зарегистрированные директивы чтобы тесты могли вызывать affect напрямую.

const registeredDirectives = {}

const jqvm = {
    directive(name, compile, affect) {
        registeredDirectives[name] = { name, compile, affect }
    },
    _getDirective(name) {
        return registeredDirectives[name]
    },
}

global.jqvm   = jqvm
global._jqvmDirectives = registeredDirectives