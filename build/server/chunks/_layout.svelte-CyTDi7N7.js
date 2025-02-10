import 'clsx';
import { p as push, c as pop, f as ensure_array_like, q as spread_attributes, t as clsx, h as attr, j as stringify, e as escape_html, w as bind_props, x as copy_payload, y as assign_payload, k as sanitize_props, l as spread_props, m as slot } from './index3-mfzAvakF.js';
import { g as goto } from './client-DvPMQ8Cs.js';
import { g as gStore, M as Modes, a as MouseMoving } from './cellStore.svelte-Di5C4PHc.js';
import { R as Root, D as Dialog_content, a as Dialog_title, u as useDialogDescription } from './index4-DUPVSf4e.js';
import { D as Dialog_header } from './dialog-header-DbgSuPRm.js';
import { c as cn, u as useId, b as box, m as mergeProps } from './utils2-BrUvaHVG.js';
import { I as Icon } from './Icon-C3dCdepI.js';
import './utils-DYrZMOqC.js';
import './exports-D0QHgeSL.js';
import './scroll-lock-Dm1gjRYu.js';
import './events-G3NK2fJC.js';
import 'tailwind-merge';

function Eye($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "3" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "eye" },
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
function Pencil($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ],
    ["path", { "d": "m15 5 4 4" }]
  ];
  Icon($$payload, spread_props([
    { name: "pencil" },
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
function Dialog_description$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    children,
    child,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const descriptionState = useDialogDescription({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, descriptionState.props);
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
function Dialog_description($$payload, $$props) {
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
    Dialog_description$1($$payload2, spread_props([
      {
        class: cn("text-muted-foreground text-sm", className)
      },
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
function Canvas($$payload, $$props) {
  push();
  let curScale = 1;
  let mouseX = 0;
  let mouseY = 0;
  MouseMoving.None;
  let dialogOpen = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<main><canvas class="bg-gray-300"></canvas> <div class="absolute flex gap-2 bottom-0 right-0 py-1 px-3 bg-gray-700 rounded-tl-md text-white"><p class="text-sm">X: ${escape_html(mouseX)}</p> <p class="text-sm">Y: ${escape_html(mouseY)}</p> <p class="text-sm">Scale: ${escape_html(curScale)}</p></div> <!---->`;
    Root($$payload2, {
      get open() {
        return dialogOpen;
      },
      set open($$value) {
        dialogOpen = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Dialog_content($$payload3, {
          class: "select-none",
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Dialog_header($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Dialog_title($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->Are you sure absolutely sure?`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> <!---->`;
                Dialog_description($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.`;
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
    $$payload2.out += `<!----></main>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function PanelSelector($$payload, $$props) {
  push();
  let {
    mode = gStore.isEdit ? Modes.Edit : Modes.Operate,
    onchanged,
    disabled,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const modes = [
    {
      mode: Modes.Operate,
      icon: Eye,
      name: "Operate"
    },
    { mode: Modes.Edit, icon: Pencil, name: "Edit" }
  ];
  const each_array = ensure_array_like(modes);
  $$payload.out += `<div${spread_attributes({
    class: clsx(cn("size-full gap-1 flex rounded-t-md border-8 border-primary border-b-0", disabled ? "bg-primary-disabled" : "bg-primary", className)),
    ...restProps
  })}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let m = each_array[$$index];
    $$payload.out += `<button${attr("disabled", disabled, true)} type="button"${attr("class", `w-10 grow rounded-t-sm flex justify-center items-center gap-2 p-2 ${stringify(m.mode == mode ? "text-white bg-secondary cursor-default disabled:bg-secondary-disabled" : "text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled")} `)}><!---->`;
    m.icon($$payload, { size: "20px" });
    $$payload.out += `<!----> ${escape_html(m.name)}</button>`;
  }
  $$payload.out += `<!--]--></div> <div class="w-full bg-primary h-40 p-2 pt-0 rounded-b-md"><div class="flex size-full bg-secondary rounded-sm p-4 items-center">`;
  children?.($$payload);
  $$payload.out += `<!----></div></div>`;
  bind_props($$props, { mode });
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  $$payload.out += `<div class="max-h-[85vh] flex flex-col mx-10 my-8">`;
  PanelSelector($$payload, {
    onchanged: (mode) => goto(`${mode == Modes.Edit ? "edit" : "operate"}`),
    children: ($$payload2) => {
      children($$payload2);
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> <div class="grow relative overflow-scroll mt-2 rounded-md overflow-x-hidden overflow-y-hidden">`;
  Canvas($$payload);
  $$payload.out += `<!----></div></div>`;
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CyTDi7N7.js.map
