/**
 * modal.js
 * Bootstrap 5 modal integration — часть Wex-стека.
 *
 * Импортируется как side-effect в index.js:
 *   import './modal.js'
 *
 * Не использует window.$ напрямую — регистрирует директиву через
 * тот же directive() что и весь стек, а $.fn.modal патчится внутри
 * useJQuery() через хук который мы сюда экспортируем.
 */

import { directive } from './wex.js'

// ─── $.fn.modal патчится при вызове useJQuery ─────────────────────────────
// Экспортируем функцию-установщик. index.js передаёт её в useJQuery
// или вызывает вручную после useJQuery(jQuery).
// Смотри index.js — там: setupModal($)

export function setupModal($) {
    if (!$) return

    $.fn.modal = function (action, options) {
        return this.each(function () {
            const el = this
            const bs = window.bootstrap

            if (!bs) {
                console.warn('[wex-modal] Bootstrap 5 не найден — $.fn.modal не работает')
                return
            }

            const getInstance = ()     => bs.Modal.getInstance(el)
            const getOrCreate = (opts) => getInstance() || new bs.Modal(el, opts || {})

            if (typeof action === 'object' || action === undefined) {
                getOrCreate(action)
                return
            }

            switch (action) {
                case 'show':         getOrCreate(options).show();  break
                case 'hide':         getInstance()?.hide();        break
                case 'toggle':       el.classList.contains('show') ? getInstance()?.hide() : getOrCreate(options).show(); break
                case 'handleUpdate': getInstance()?.handleUpdate(); break
                case 'dispose':      getInstance()?.dispose();     break
                default: console.warn(`[wex-modal] Неизвестный action: "${action}"`)
            }
        })
    }
}

// ─── Директива w-modal ────────────────────────────────────────────────────
// Регистрируется сразу при импорте модуля — directive() не требует $,
// он просто пишет в globalDirectives массив внутри wex.js

directive('w-modal', null, function ($el, attrs) {
    const modalKey = attrs['w-modal']
    const { scope, view } = this

    // ── guard ────────────────────────────────────────────────────────────
    const rawState = scope.data

    if (!rawState || !('modal' in rawState)) {
        console.error(
            `[wex-modal] Бро, всё хорошо — ты просто кое-что забыл!\n` +
            `Добавь поле "modal" в стейт и внутри него ключ "${modalKey}":\n\n` +
            `  .state({\n` +
            `    modal: {\n` +
            `      ${modalKey}: false,\n` +
            `    }\n` +
            `  })`
        )
        return
    }

    if (!(modalKey in rawState.modal)) {
        console.error(
            `[wex-modal] Бро, всё хорошо — ты просто кое-что забыл!\n` +
            `Поле "modal" есть, но в нём нет ключа "${modalKey}":\n\n` +
            `  .state({\n` +
            `    modal: {\n` +
            `      ${modalKey}: false,  // ← добавь это\n` +
            `    }\n` +
            `  })`
        )
        return
    }
    // ── /guard ──────────────────────────────────────────────────────────

    const getModalEl  = () => document.getElementById(modalKey)
    const getInstance = () => {
        const bs = window.bootstrap
        if (!bs) return null
        const el = getModalEl()
        return el ? (bs.Modal.getInstance(el) || new bs.Modal(el)) : null
    }

    // Клик — toggle через view.on, делегированный на корень вью
    const selector = `[w-modal="${modalKey}"]`
    const onClick  = (state) => {
        state.modal[modalKey] = !state.modal[modalKey]
    }
    view.on('click', selector, onClick)

    // Стейт → Bootstrap
    const syncToBootstrap = () => {
        const value    = rawState.modal[modalKey]
        const instance = getInstance()
        if (!instance) return
        const modalEl  = getModalEl()
        const isOpen   = modalEl?.classList.contains('show')
        if (value && !isOpen)  instance.show()
        if (!value && isOpen)  instance.hide()
    }

    syncToBootstrap()

    // Bootstrap → стейт + хуки Wex
    const modalEl = getModalEl()

    const onBsShow   = () => { rawState.modal[modalKey] = true;  view.emit('$modalShow',   modalKey) }
    const onBsShown  = () => {                                    view.emit('$modalShown',  modalKey) }
    const onBsHide   = () => {                                    view.emit('$modalHide',   modalKey) }
    const onBsHidden = () => { rawState.modal[modalKey] = false; view.emit('$modalHidden', modalKey) }

    if (modalEl) {
        modalEl.addEventListener('show.bs.modal',   onBsShow)
        modalEl.addEventListener('shown.bs.modal',  onBsShown)
        modalEl.addEventListener('hide.bs.modal',   onBsHide)
        modalEl.addEventListener('hidden.bs.modal', onBsHidden)
    }

    return () => {
        view.off('click', selector, onClick)
        if (modalEl) {
            modalEl.removeEventListener('show.bs.modal',   onBsShow)
            modalEl.removeEventListener('shown.bs.modal',  onBsShown)
            modalEl.removeEventListener('hide.bs.modal',   onBsHide)
            modalEl.removeEventListener('hidden.bs.modal', onBsHidden)
        }
    }
})