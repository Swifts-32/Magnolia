import { p as push, e as escape_html, d as store_get, u as unsubscribe_stores, c as pop } from './index3-mfzAvakF.js';
import { p as page } from './stores-CaILRD6-.js';
import 'clsx';
import './utils-DYrZMOqC.js';
import './client-DvPMQ8Cs.js';
import './exports-D0QHgeSL.js';

function _error($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<p class="text-8xl flex justify-center mt-40">We are sorry...</p> <p class="flex justify-center m-10 text-lg">Error: ${escape_html(store_get($$store_subs ??= {}, "$page", page).status)} - ${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _error as default };
//# sourceMappingURL=_error.svelte-L_FoPkrX.js.map
