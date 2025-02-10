import { p as push, c as pop, e as escape_html } from './index3-mfzAvakF.js';
import 'clsx';
import './client-DvPMQ8Cs.js';
import './utils-DYrZMOqC.js';
import './exports-D0QHgeSL.js';

function layoutButton($$payload, name, onclick) {
  $$payload.out += `<button class="border-secondary border-2 p-4 rounded-md w-52 h-12 select-none flex items-center justify-start"><p class="text-2xl">${escape_html(name)}</p></button>`;
}
function _layout($$payload, $$props) {
  push();
  let { data, children } = $$props;
  $$payload.out += `<div class="flex"><div class="w-max m-4 p-4 h-full border-primary border-2 rounded-md"><h1 class="text-4xl my-10">Settings</h1> <div class="flex flex-col gap-3">`;
  layoutButton($$payload, "Trains");
  $$payload.out += `<!----> `;
  layoutButton($$payload, "Accessories");
  $$payload.out += `<!----> `;
  layoutButton($$payload, "Connections");
  $$payload.out += `<!----></div></div> `;
  children($$payload);
  $$payload.out += `<!----></div>`;
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CmSEO-Ns.js.map
