import { useJQuery, component, directive, filter, View } from './wex.js'
import { shareState } from './shared-state.js'
import { createAsyncComponent } from './async.js'
import { createRouter } from './router.js'
import { createWire, $wire } from './wire'

// use in browser
if (typeof jQuery !== 'undefined') {
  useJQuery(jQuery)
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