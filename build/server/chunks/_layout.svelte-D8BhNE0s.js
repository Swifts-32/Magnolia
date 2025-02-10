import { p as push, d as store_get, u as unsubscribe_stores, c as pop } from './index3-mfzAvakF.js';
import { p as page } from './stores-CaILRD6-.js';
import { N as NavBar, a as NavBarData } from './NavBar-H7Ei9Dt3.js';
import 'clsx';
import './utils-DYrZMOqC.js';
import './client-DvPMQ8Cs.js';
import './exports-D0QHgeSL.js';
import './Icon-C3dCdepI.js';

function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  const curLink = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  const links = [
    {
      linkText: "Home",
      url: `/layouts/${store_get($$store_subs ??= {}, "$page", page).params.id}`,
      displayInNav: true,
      displayInFooter: false
    },
    {
      linkText: "Throttle",
      url: `/layouts/${store_get($$store_subs ??= {}, "$page", page).params.id}/throttle`,
      displayInNav: true,
      displayInFooter: false
    },
    {
      linkText: "Panel",
      url: `/layouts/${store_get($$store_subs ??= {}, "$page", page).params.id}/panel`,
      displayInNav: true,
      displayInFooter: false
    },
    {
      linkText: "Settings",
      url: `/layouts/${store_get($$store_subs ??= {}, "$page", page).params.id}/settings`,
      displayInNav: true,
      displayInFooter: false
    }
  ];
  const navBarData = new NavBarData(links, curLink);
  $$payload.out += `<div class="flex flex-col h-dvh">`;
  NavBar($$payload, { navBarData });
  $$payload.out += `<!----> `;
  children($$payload);
  $$payload.out += `<!----></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-D8BhNE0s.js.map
