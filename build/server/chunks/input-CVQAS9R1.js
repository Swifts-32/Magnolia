import { k as sanitize_props, l as spread_props, m as slot, p as push, q as spread_attributes, t as clsx, w as bind_props, c as pop } from './index3-mfzAvakF.js';
import { I as Icon } from './Icon-C3dCdepI.js';
import { c as cn } from './utils2-BrUvaHVG.js';

function Plus($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "M12 5v14" }]
  ];
  Icon($$payload, spread_props([
    { name: "plus" },
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
function Dialog_footer($$payload, $$props) {
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
    class: clsx(cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Input($$payload, $$props) {
  push();
  let {
    class: className = void 0,
    value = void 0,
    readonly = void 0,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$payload.out += `<input${spread_attributes({
    class: clsx(cn("border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)),
    value,
    readonly,
    ...rest
  })}>`;
  bind_props($$props, { value });
  pop();
}

export { Dialog_footer as D, Input as I, Plus as P };
//# sourceMappingURL=input-CVQAS9R1.js.map
