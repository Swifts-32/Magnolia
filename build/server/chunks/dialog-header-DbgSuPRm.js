import { p as push, q as spread_attributes, t as clsx, w as bind_props, c as pop } from './index3-mfzAvakF.js';
import { c as cn } from './utils2-BrUvaHVG.js';

function Dialog_header($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    class: clsx(cn("flex flex-col space-y-1.5 text-center sm:text-left", className)),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}

export { Dialog_header as D };
//# sourceMappingURL=dialog-header-DbgSuPRm.js.map
