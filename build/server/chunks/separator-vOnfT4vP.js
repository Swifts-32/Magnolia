import { p as push, l as spread_props, c as pop, q as spread_attributes, w as bind_props, o as once } from './index3-mfzAvakF.js';
import { c as cn, u as useId, b as box, m as mergeProps, a as useRefById, j as getDataOrientation, k as getAriaHidden, l as getAriaOrientation } from './utils2-BrUvaHVG.js';
import 'clsx';

const SEPARATOR_ROOT_ATTR = "data-separator-root";
class SeparatorRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: this.opts.decorative.current ? "none" : "separator",
    "aria-orientation": getAriaOrientation(this.opts.orientation.current),
    "aria-hidden": getAriaHidden(this.opts.decorative.current),
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    [SEPARATOR_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
function useSeparatorRoot(props) {
  return new SeparatorRootState(props);
}
function Separator$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    decorative = false,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useSeparatorRoot({
    ref: box.with(() => ref, (v) => ref = v),
    id: box.with(() => id),
    decorative: box.with(() => decorative),
    orientation: box.with(() => orientation)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Separator($$payload, $$props) {
  push();
  let {
    class: className = void 0,
    orientation = "horizontal",
    decorative = void 0,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$payload.out += `<!---->`;
  Separator$1($$payload, spread_props([
    {
      class: cn("bg-border shrink-0", orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]", className),
      orientation,
      decorative
    },
    rest
  ]));
  $$payload.out += `<!---->`;
  pop();
}

export { Separator as S };
//# sourceMappingURL=separator-vOnfT4vP.js.map
