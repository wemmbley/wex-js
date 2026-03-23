import { useJQuery, component, directive, filter, View } from './wex.js'
import { shareState } from './shared-state.js'
import { createAsyncComponent } from './async.js'
import { createRouter } from './router.js'
import { createWire, $wire } from './wire'
import { setupModal } from './modal.js'  // директива регистрируется сразу при импорте

// use in browser
if (typeof jQuery !== 'undefined') {
  useJQuery(jQuery)
  setupModal(jQuery)  // патчим $.fn.modal когда $ уже готов
}

export {
  component,
  directive,
  filter,
  View,
  useJQuery,
  shareState,
  createAsyncComponent,
  createRouter,
  createWire,
  $wire,
}

if (typeof window !== 'undefined') {
  window.$wire = $wire
}