import { p as push, d as store_get, u as unsubscribe_stores, c as pop } from './index3-mfzAvakF.js';
import { N as NavBar, a as NavBarData } from './NavBar-H7Ei9Dt3.js';
import { p as page } from './stores-CaILRD6-.js';
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
      url: "/",
      displayInNav: true,
      displayInFooter: false
    },
    {
      linkText: "Settings",
      url: "/settings",
      displayInNav: true,
      displayInFooter: false
    }
  ];
  const navbarData = new NavBarData(links, curLink);
  NavBar($$payload, { navBarData: navbarData });
  $$payload.out += `<!----> `;
  children($$payload);
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Cq2CeF0a.js.map
