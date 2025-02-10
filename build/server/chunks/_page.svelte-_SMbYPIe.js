import 'clsx';
import { p as push, c as pop, h as attr, e as escape_html, j as stringify, k as sanitize_props, l as spread_props, m as slot, n as rest_props, x as copy_payload, y as assign_payload, w as bind_props, q as spread_attributes, o as once } from './index3-mfzAvakF.js';
import { g as gStore, C as CellTypes } from './cellStore.svelte-Di5C4PHc.js';
import { twMerge } from 'tailwind-merge';
import { t as toggleVariants } from './index5-BE4_qQtv.js';
import { c as cn, u as useId, n as noop, b as box, m as mergeProps, a as useRefById, f as getDisabled, h as getAriaPressed, i as getDataDisabled } from './utils2-BrUvaHVG.js';
import { P as fallback } from './utils-DYrZMOqC.js';
import { B as Button } from './button-CuLYtK6I.js';
import { S as Separator } from './separator-vOnfT4vP.js';
import { I as Icon } from './Icon-C3dCdepI.js';
import { T as Trash_2 } from './trash-2-Dl4C8hkB.js';
import 'tailwind-variants';

function Clipboard_paste($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z"
      }
    ],
    [
      "path",
      {
        "d": "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10"
      }
    ],
    ["path", { "d": "m17 10 4 4-4 4" }]
  ];
  Icon($$payload, spread_props([
    { name: "clipboard-paste" },
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
function Copy($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "copy" },
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
function Redo_2($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m15 14 5-5-5-5" }],
    [
      "path",
      {
        "d": "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "redo-2" },
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
function Rotate_ccw($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    ],
    ["path", { "d": "M3 3v5h5" }]
  ];
  Icon($$payload, spread_props([
    { name: "rotate-ccw" },
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
function Rotate_cw($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
      }
    ],
    ["path", { "d": "M21 3v5h-5" }]
  ];
  Icon($$payload, spread_props([
    { name: "rotate-cw" },
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
function Scissors($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "6", "cy": "6", "r": "3" }],
    ["path", { "d": "M8.12 8.12 12 12" }],
    ["path", { "d": "M20 4 8.12 15.88" }],
    ["circle", { "cx": "6", "cy": "18", "r": "3" }],
    ["path", { "d": "M14.8 14.8 20 20" }]
  ];
  Icon($$payload, spread_props([
    { name: "scissors" },
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
function Undo_2($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M9 14 4 9l5-5" }],
    [
      "path",
      {
        "d": "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "undo-2" },
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
const TOGGLE_ROOT_ATTR = "data-toggle-root";
class ToggleRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
    this.onclick = this.onclick.bind(this);
  }
  #togglePressed() {
    if (!this.opts.disabled.current) {
      this.opts.pressed.current = !this.opts.pressed.current;
    }
  }
  onclick(_) {
    if (this.opts.disabled.current) return;
    this.#togglePressed();
  }
  #snippetProps = once(() => ({ pressed: this.opts.pressed.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    [TOGGLE_ROOT_ATTR]: "",
    id: this.opts.id.current,
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "aria-pressed": getAriaPressed(this.opts.pressed.current),
    "data-state": getToggleDataState(this.opts.pressed.current),
    disabled: getDisabled(this.opts.disabled.current),
    onclick: this.onclick
  }));
  get props() {
    return this.#props();
  }
}
function useToggleRoot(props) {
  return new ToggleRootState(props);
}
function getToggleDataState(condition) {
  return condition ? "on" : "off";
}
function Toggle$1($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId(),
    pressed = false,
    onPressedChange = noop,
    disabled = false,
    type = "button",
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const toggleState = useToggleRoot({
    pressed: box.with(() => pressed, (v) => {
      pressed = v;
      onPressedChange(v);
    }),
    disabled: box.with(() => disabled ?? false),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, toggleState.props, { type });
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, {
      props: mergedProps,
      ...toggleState.snippetProps
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload, toggleState.snippetProps);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, pressed });
  pop();
}
function ToolbarTools($$payload, $$props) {
  let { name, rows = 2, children } = $$props;
  $$payload.out += `<div class="grid justify-items-stretch ml-2 mr-2 h-full"><div class="grid place-content-center grid-flow-col gap-2 grid-rows-2"${attr("style", `grid-template-rows: repeat(${stringify(rows)}, minmax(0, 1fr));`)}>`;
  children?.($$payload);
  $$payload.out += `<!----></div> <p class="justify-self-center content-end pt-2">${escape_html(name)}</p></div>`;
}
function Toggle($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "variant", "size", "pressed"]);
  push();
  let className = fallback($$props["class"], void 0);
  let variant = fallback($$props["variant"], "default");
  let size = fallback($$props["size"], "default");
  let pressed = fallback($$props["pressed"], false);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Toggle$1($$payload2, spread_props([
      {
        class: cn(toggleVariants({ variant, size, className }))
      },
      $$restProps,
      {
        get pressed() {
          return pressed;
        },
        set pressed($$value) {
          pressed = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          slot($$payload3, $$props, "default", {}, null);
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { class: className, variant, size, pressed });
  pop();
}
function ToolbarButton($$payload, $$props) {
  push();
  let {
    name,
    cellType,
    size = "default",
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let selected = gStore.curTool == cellType;
  function handleToggle() {
    if (selected) {
      gStore.setTool(null);
    } else {
      gStore.setTool(cellType);
    }
  }
  if (size == "default") {
    $$payload.out += "<!--[-->";
    Button($$payload, spread_props([
      {
        size: "sm",
        onclick: handleToggle,
        class: twMerge("w-28 justify-start p-1 flex gap-0 select-none", selected ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "bg-primary text-primary-foreground bg-primary/90", className)
      },
      restProps,
      {
        children: ($$payload2) => {
          children?.($$payload2);
          $$payload2.out += `<!----> ${escape_html(name)}`;
        },
        $$slots: { default: true }
      }
    ]));
  } else {
    $$payload.out += "<!--[!-->";
    if (size == "icon") {
      $$payload.out += "<!--[-->";
      Toggle($$payload, spread_props([
        {
          size: "icon",
          onclick: handleToggle,
          class: className
        },
        restProps,
        {
          children: ($$payload2) => {
            children?.($$payload2);
            $$payload2.out += `<!---->`;
          },
          $$slots: { default: true }
        }
      ]));
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _page($$payload, $$props) {
  push();
  Separator($$payload, { orientation: "vertical" });
  $$payload.out += `<!----> `;
  ToolbarTools($$payload, {
    name: "",
    rows: 3,
    children: ($$payload2) => {
      Button($$payload2, {
        class: "size-8",
        size: "icon",
        children: ($$payload3) => {
          Scissors($$payload3, { size: 20 });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        class: "size-8",
        size: "icon",
        children: ($$payload3) => {
          Copy($$payload3, { size: 20 });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        class: "size-8",
        size: "icon",
        children: ($$payload3) => {
          Clipboard_paste($$payload3, { size: 20 });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    }
  });
  $$payload.out += `<!----> `;
  Separator($$payload, { orientation: "vertical" });
  $$payload.out += `<!----> `;
  ToolbarTools($$payload, {
    name: "Edit",
    children: ($$payload2) => {
      $$payload2.out += `<div class="flex gap-2">`;
      Button($$payload2, {
        size: "icon",
        children: ($$payload3) => {
          Undo_2($$payload3, {});
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        size: "icon",
        children: ($$payload3) => {
          Redo_2($$payload3, {});
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        size: "icon",
        onclick: () => gStore.rotateCellLeft(gStore.getSelectedCell()),
        children: ($$payload3) => {
          Rotate_ccw($$payload3, {});
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        size: "icon",
        onclick: () => gStore.rotateCellRight(gStore.getSelectedCell()),
        children: ($$payload3) => {
          Rotate_cw($$payload3, {});
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----></div> `;
      ToolbarButton($$payload2, {
        cellType: CellTypes.delete,
        size: "icon",
        class: "bg-destructive hover:bg-destructive/90",
        children: ($$payload3) => {
          Trash_2($$payload3, {});
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    }
  });
  $$payload.out += `<!----> `;
  Separator($$payload, { orientation: "vertical" });
  $$payload.out += `<!----> `;
  ToolbarTools($$payload, {
    name: "Track",
    children: ($$payload2) => {
      ToolbarButton($$payload2, {
        name: "Straight",
        cellType: CellTypes.straight,
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><line y2="30" x2="30" y1="10" x1="10" stroke-width="4" stroke="#005fbf" fill="none"></line></svg>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      ToolbarButton($$payload2, {
        name: "Curve",
        cellType: CellTypes.curve,
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" d="m5,27.5l18,0l10,-15" stroke-width="4" stroke="#005fbf" fill="none"></path></svg>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      ToolbarButton($$payload2, {
        name: "Buffer",
        cellType: CellTypes.buffer,
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><line y2="20" x2="30" y1="20" x1="5" stroke-width="4" stroke="#005fbf" fill="none"></line><line y2="30" x2="30" y1="10" x1="30" stroke-width="6" stroke="#bf0000" fill="none"></line></svg>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    }
  });
  $$payload.out += `<!----> `;
  Separator($$payload, { orientation: "vertical" });
  $$payload.out += `<!----> `;
  ToolbarTools($$payload, {
    name: "Turnouts",
    children: ($$payload2) => {
      Button($$payload2, {
        size: "sm",
        class: "w-48 pl-1 flex justify-start",
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#005fbf" stroke-width="4" x1="5" y1="25" x2="35" y2="25"></line><line fill="none" stroke="#005fbf" stroke-width="4" x1="15" y1="25" x2="35" y2="15"></line></svg> Left-Hand Turnout`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        size: "sm",
        class: "w-48 pl-1 flex justify-start",
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#005fbf" stroke-width="4" x1="5" y1="15" x2="35" y2="15"></line><line fill="none" stroke="#005fbf" stroke-width="4" x1="15" y1="15" x2="35" y2="25"></line></svg> Right-Hand Turnout`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        size: "sm",
        class: "w-48 pl-1 flex justify-start",
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#005fbf" stroke-width="4" x1="5" y1="20" x2="35" y2="20"></line><line fill="none" stroke="#005fbf" stroke-width="4" x1="15" y1="20" x2="35" y2="30"></line><line fill="none" stroke="#005fbf" stroke-width="4" x1="15" y1="20" x2="35" y2="10"></line></svg> Three-Way Turnout`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Button($$payload2, {
        size: "sm",
        class: "w-48 pl-1 flex justify-start",
        children: ($$payload3) => {
          $$payload3.out += `<svg width="40" height="40" class="mr-2" xmlns="http://www.w3.org/2000/svg"><line stroke="#005fbf" fill="none" stroke-width="4" x1="5" y1="20" x2="20" y2="20"></line><line fill="none" stroke="#005fbf" stroke-width="4" x1="20" y1="20" x2="35" y2="30"></line><line fill="none" stroke="#005fbf" stroke-width="4" x1="20" y1="20" x2="35" y2="10"></line></svg> Wye Turnout`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    }
  });
  $$payload.out += `<!----> `;
  Separator($$payload, { orientation: "vertical" });
  $$payload.out += `<!---->`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-_SMbYPIe.js.map
