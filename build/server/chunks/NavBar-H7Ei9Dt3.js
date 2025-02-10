import 'clsx';
import { p as push, f as ensure_array_like, h as attr, e as escape_html, j as stringify, c as pop, k as sanitize_props, l as spread_props, m as slot } from './index3-mfzAvakF.js';
import { g as goto } from './client-DvPMQ8Cs.js';
import { I as Icon } from './Icon-C3dCdepI.js';

class NavBarData {
  logo;
  logoLink;
  curLink = "#/";
  links;
  constructor(links, curLink, logo = null, logoLink = null) {
    this.links = links;
    this.curLink = curLink;
    this.logo = logo;
    this.logoLink = logoLink;
  }
}
function House($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
      }
    ],
    [
      "path",
      {
        "d": "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "house" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function NavBar($$payload, $$props) {
  push();
  let { navBarData } = $$props;
  function handleClick(link) {
    navBarData.curLink = link;
  }
  const each_array = ensure_array_like(navBarData.links);
  $$payload.out += `<nav class="w-full flex justify-between items-center"><div class="flex-col justify-center items-center mx-10">`;
  House($$payload, {
    size: "40px",
    class: "cursor-pointer",
    onclick: () => {
      handleClick("/");
      goto();
    }
  });
  $$payload.out += `<!----></div> <div class="flex"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let link = each_array[$$index];
    if (link.displayInNav) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<a${attr("class", `flex flex-col justify-center items-center h-16 w-32 text-lg cursor-pointer ${stringify(link.url == navBarData.curLink ? "text-green-200 border-b-4" : "text-white ")}`)}${attr("href", link.url)}><p>${escape_html(link.linkText)}</p></a>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></nav>`;
  pop();
}

export { NavBar as N, NavBarData as a };
//# sourceMappingURL=NavBar-H7Ei9Dt3.js.map
