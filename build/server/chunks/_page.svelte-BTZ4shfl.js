import { p as push, f as ensure_array_like, e as escape_html, c as pop, x as copy_payload, y as assign_payload, q as spread_attributes, w as bind_props, o as once, l as spread_props } from './index3-mfzAvakF.js';
import './client-DvPMQ8Cs.js';
import { l as layoutClientHandler } from './LayoutClientHandler.svelte-BywpuRZh.js';
import { R as Root$1, D as Dialog_content, a as Dialog_title } from './index4-DUPVSf4e.js';
import { L as Label, C as Chevron_down } from './label-Dcp_yKNn.js';
import { P as Plus, D as Dialog_footer, I as Input } from './input-CVQAS9R1.js';
import { B as Button } from './button-CuLYtK6I.js';
import 'clsx';
import { u as useId, n as noop, b as box, m as mergeProps, a as useRefById, i as getDataDisabled, j as getDataOrientation, c as cn, g as getDataOpenClosed, y as getAriaDisabled, t as getAriaExpanded } from './utils2-BrUvaHVG.js';
import { C as Context, i as END, y as isBrowser, H as HOME, A as ARROW_UP, x as ARROW_RIGHT, w as ARROW_LEFT, e as ARROW_DOWN, b as SPACE, c as ENTER } from './scroll-lock-Dm1gjRYu.js';
import { t as toast } from './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import { D as Dialog_header } from './dialog-header-DbgSuPRm.js';
import './utils-DYrZMOqC.js';
import './exports-D0QHgeSL.js';
import './protocols-BWs_B1An.js';
import './Train.svelte-B8RiRVnW.js';
import './Icon-C3dCdepI.js';
import 'tailwind-variants';
import 'tailwind-merge';
import './events-G3NK2fJC.js';
import './index2-DmlwT2z5.js';

function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function getNextKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_LEFT : ARROW_RIGHT,
    vertical: ARROW_DOWN
  }[orientation];
}
function getPrevKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_RIGHT : ARROW_LEFT,
    vertical: ARROW_UP
  }[orientation];
}
function getDirectionalKeys(dir = "ltr", orientation = "horizontal") {
  if (!["ltr", "rtl"].includes(dir))
    dir = "ltr";
  if (!["horizontal", "vertical"].includes(orientation))
    orientation = "horizontal";
  return {
    nextKey: getNextKey(dir, orientation),
    prevKey: getPrevKey(dir, orientation)
  };
}
function useRovingFocus(props) {
  const currentTabStopId = box(null);
  function getCandidateNodes() {
    if (!isBrowser) return [];
    const node = document.getElementById(props.rootNodeId.current);
    if (!node) return [];
    if (props.candidateSelector) {
      const candidates = Array.from(node.querySelectorAll(props.candidateSelector));
      return candidates;
    } else {
      const candidates = Array.from(node.querySelectorAll(`[${props.candidateAttr}]:not([data-disabled])`));
      return candidates;
    }
  }
  function focusFirstCandidate() {
    const items = getCandidateNodes();
    if (!items.length) return;
    items[0]?.focus();
  }
  function handleKeydown(node, e, both = false) {
    const rootNode = document.getElementById(props.rootNodeId.current);
    if (!rootNode || !node) return;
    const items = getCandidateNodes();
    if (!items.length) return;
    const currentIndex = items.indexOf(node);
    const dir = getElemDirection(rootNode);
    const { nextKey, prevKey } = getDirectionalKeys(dir, props.orientation.current);
    const loop = props.loop.current;
    const keyToIndex = {
      [nextKey]: currentIndex + 1,
      [prevKey]: currentIndex - 1,
      [HOME]: 0,
      [END]: items.length - 1
    };
    if (both) {
      const altNextKey = nextKey === ARROW_DOWN ? ARROW_RIGHT : ARROW_DOWN;
      const altPrevKey = prevKey === ARROW_UP ? ARROW_LEFT : ARROW_UP;
      keyToIndex[altNextKey] = currentIndex + 1;
      keyToIndex[altPrevKey] = currentIndex - 1;
    }
    let itemIndex = keyToIndex[e.key];
    if (itemIndex === void 0) return;
    e.preventDefault();
    if (itemIndex < 0 && loop) {
      itemIndex = items.length - 1;
    } else if (itemIndex === items.length && loop) {
      itemIndex = 0;
    }
    const itemToFocus = items[itemIndex];
    if (!itemToFocus) return;
    itemToFocus.focus();
    currentTabStopId.current = itemToFocus.id;
    props.onCandidateFocus?.(itemToFocus);
    return itemToFocus;
  }
  function getTabIndex(node) {
    const items = getCandidateNodes();
    const anyActive = currentTabStopId.current !== null;
    if (node && !anyActive && items[0] === node) {
      currentTabStopId.current = node.id;
      return 0;
    } else if (node?.id === currentTabStopId.current) {
      return 0;
    }
    return -1;
  }
  return {
    setCurrentTabStopId(id) {
      currentTabStopId.current = id;
    },
    getTabIndex,
    handleKeydown,
    focusFirstCandidate,
    currentTabStopId
  };
}
const ACCORDION_ROOT_ATTR = "data-accordion-root";
const ACCORDION_TRIGGER_ATTR = "data-accordion-trigger";
const ACCORDION_ITEM_ATTR = "data-accordion-item";
const ACCORDION_HEADER_ATTR = "data-accordion-header";
class AccordionBaseState {
  opts;
  rovingFocusGroup;
  constructor(opts) {
    this.opts = opts;
    useRefById(this.opts);
    this.rovingFocusGroup = useRovingFocus({
      rootNodeId: this.opts.id,
      candidateAttr: ACCORDION_TRIGGER_ATTR,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    [ACCORDION_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class AccordionSingleState extends AccordionBaseState {
  opts;
  isMulti = false;
  constructor(opts) {
    super(opts);
    this.opts = opts;
    this.includesItem = this.includesItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }
  includesItem(item) {
    return this.opts.value.current === item;
  }
  toggleItem(item) {
    this.opts.value.current = this.includesItem(item) ? "" : item;
  }
}
class AccordionMultiState extends AccordionBaseState {
  #value;
  isMulti = true;
  constructor(props) {
    super(props);
    this.#value = props.value;
    this.includesItem = this.includesItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }
  includesItem(item) {
    return this.#value.current.includes(item);
  }
  toggleItem(item) {
    if (this.includesItem(item)) {
      this.#value.current = this.#value.current.filter((v) => v !== item);
    } else {
      this.#value.current = [...this.#value.current, item];
    }
  }
}
class AccordionItemState {
  opts;
  root;
  #isActive = once(() => this.root.includesItem(this.opts.value.current));
  get isActive() {
    return this.#isActive();
  }
  #isDisabled = once(() => this.opts.disabled.current || this.root.opts.disabled.current);
  get isDisabled() {
    return this.#isDisabled();
  }
  constructor(opts) {
    this.opts = opts;
    this.root = opts.rootState;
    this.updateValue = this.updateValue.bind(this);
    useRefById({ ...opts, deps: () => this.isActive });
  }
  updateValue() {
    this.root.toggleItem(this.opts.value.current);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "data-state": getDataOpenClosed(this.isActive),
    "data-disabled": getDataDisabled(this.isDisabled),
    "data-orientation": getDataOrientation(this.root.opts.orientation.current),
    [ACCORDION_ITEM_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class AccordionTriggerState {
  opts;
  itemState;
  #root;
  #isDisabled = once(() => this.opts.disabled.current || this.itemState.opts.disabled.current || this.#root.opts.disabled.current);
  constructor(opts, itemState) {
    this.opts = opts;
    this.itemState = itemState;
    this.#root = itemState.root;
    this.onkeydown = this.onkeydown.bind(this);
    this.onclick = this.onclick.bind(this);
    useRefById(opts);
  }
  onclick(e) {
    if (this.#isDisabled()) return;
    if (e.button !== 0) return e.preventDefault();
    this.itemState.updateValue();
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    if (e.key === SPACE || e.key === ENTER) {
      e.preventDefault();
      this.itemState.updateValue();
      return;
    }
    this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    disabled: this.#isDisabled(),
    "aria-expanded": getAriaExpanded(this.itemState.isActive),
    "aria-disabled": getAriaDisabled(this.#isDisabled()),
    "data-disabled": getDataDisabled(this.#isDisabled()),
    "data-state": getDataOpenClosed(this.itemState.isActive),
    "data-orientation": getDataOrientation(this.#root.opts.orientation.current),
    [ACCORDION_TRIGGER_ATTR]: "",
    tabindex: 0,
    //
    onclick: this.onclick,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
class AccordionHeaderState {
  opts;
  item;
  constructor(opts, item) {
    this.opts = opts;
    this.item = item;
    useRefById(opts);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "heading",
    "aria-level": this.opts.level.current,
    "data-heading-level": this.opts.level.current,
    "data-state": getDataOpenClosed(this.item.isActive),
    "data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
    [ACCORDION_HEADER_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
const AccordionRootContext = new Context("Accordion.Root");
const AccordionItemContext = new Context("Accordion.Item");
function useAccordionRoot(props) {
  const { type, ...rest } = props;
  const rootState = type === "single" ? new AccordionSingleState(rest) : new AccordionMultiState(rest);
  return AccordionRootContext.set(rootState);
}
function useAccordionItem(props) {
  const rootState = AccordionRootContext.get();
  return AccordionItemContext.set(new AccordionItemState({ ...props, rootState }));
}
function useAccordionTrigger(props) {
  return new AccordionTriggerState(props, AccordionItemContext.get());
}
function useAccordionHeader(props) {
  return new AccordionHeaderState(props, AccordionItemContext.get());
}
function Accordion($$payload, $$props) {
  push();
  let {
    disabled = false,
    children,
    child,
    type,
    value = void 0,
    ref = null,
    id = useId(),
    onValueChange = noop,
    loop = true,
    orientation = "vertical",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  value === void 0 && (value = type === "single" ? "" : []);
  const rootState = useAccordionRoot({
    type,
    value: box.with(() => value, (v) => {
      value = v;
      onValueChange(v);
    }),
    id: box.with(() => id),
    disabled: box.with(() => disabled),
    loop: box.with(() => loop),
    orientation: box.with(() => orientation),
    ref: box.with(() => ref, (v) => ref = v)
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
  bind_props($$props, { value, ref });
  pop();
}
function Accordion_item$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    disabled = false,
    value = useId(),
    children,
    child,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const itemState = useAccordionItem({
    value: box.with(() => value),
    disabled: box.with(() => disabled),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, itemState.props);
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
function Accordion_header($$payload, $$props) {
  push();
  let {
    id = useId(),
    level = 2,
    children,
    child,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const headerState = useAccordionHeader({
    id: box.with(() => id),
    level: box.with(() => level),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, headerState.props);
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
function Accordion_trigger$1($$payload, $$props) {
  push();
  let {
    disabled = false,
    ref = null,
    id = useId(),
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useAccordionTrigger({
    disabled: box.with(() => disabled),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ type: "button", ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Accordion_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Accordion_item$1($$payload2, spread_props([
      { class: cn("border-b", className) },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Accordion_trigger($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    level = 3,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Accordion_header($$payload2, {
      level,
      class: "flex",
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Accordion_trigger$1($$payload3, spread_props([
          {
            class: cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            children: ($$payload4) => {
              children?.($$payload4);
              $$payload4.out += `<!----> `;
              Chevron_down($$payload4, {
                class: "size-4 shrink-0 transition-transform duration-200"
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          }
        ]));
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const Root = Accordion;
function LayoutAdd($$payload, $$props) {
  push();
  let editMode = false;
  let layoutName = void 0;
  function saveChanges() {
    if (!layoutName) {
      toast.error("Layout name is required");
      return;
    }
    const data = { layoutName };
    fetch(`/api/layout/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        editMode = false;
        toast.success("Layout created successfully");
        layoutClientHandler.refreshLayouts();
      } else {
        console.error("Failed to create layout");
        toast.error("Failed to create layout");
      }
    }).catch((error) => {
      console.error("Error creating layout:", error);
      toast.error("Error creating layout");
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<button class="border-primary border-2 p-2 m-5 rounded-md size-52 select-none flex justify-center place-items-center">`;
    Plus($$payload2, { size: 40 });
    $$payload2.out += `<!----> <p class="text-xl">Add new layout</p></button> <!---->`;
    Root$1($$payload2, {
      open: editMode,
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Dialog_content($$payload3, {
          interactOutsideBehavior: "ignore",
          escapeKeydownBehavior: "ignore",
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Dialog_header($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Dialog_title($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->Add New Layout`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="w-full"><!---->`;
            Root($$payload4, {
              type: "single",
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Accordion_item($$payload5, {
                  value: "general",
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->`;
                    Accordion_trigger($$payload6, {
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->General`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> <div class="grid grid-cols-4 mt-2 mb-4 items-center gap-4">`;
                    Label($$payload6, {
                      for: "layoutName",
                      class: "text-right",
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->Name`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> `;
                    Input($$payload6, {
                      id: "layoutName",
                      class: "col-span-3",
                      get value() {
                        return layoutName;
                      },
                      set value($$value) {
                        layoutName = $$value;
                        $$settled = false;
                      }
                    });
                    $$payload6.out += `<!----></div>`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----></div> <!---->`;
            Dialog_footer($$payload4, {
              children: ($$payload5) => {
                Button($$payload5, {
                  type: "reset",
                  class: "w-28",
                  variant: "outline",
                  onclick: () => editMode = false,
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->Cancel`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> `;
                Button($$payload5, {
                  type: "submit",
                  class: "w-28",
                  onclick: saveChanges,
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->Save`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function _page($$payload, $$props) {
  push();
  const each_array = ensure_array_like(layoutClientHandler.layouts.values());
  $$payload.out += `<div class="mx-10 flex flex-col justify-center"><h1 class="text-center text-8xl mx-10 my-5">Your are Home</h1> <hr class="my-10"> <div class="flex"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let layout = each_array[$$index];
    $$payload.out += `<button class="border-primary border-2 p-2 rounded-md size-52 m-5 select-none"><p class="text-3xl text-center">${escape_html(layout.name)}</p></button>`;
  }
  $$payload.out += `<!--]--> `;
  LayoutAdd($$payload);
  $$payload.out += `<!----></div></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BTZ4shfl.js.map
