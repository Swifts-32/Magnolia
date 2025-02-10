import { p as push, f as ensure_array_like, c as pop, x as copy_payload, y as assign_payload, e as escape_html, k as sanitize_props, l as spread_props, m as slot, w as bind_props } from './index3-mfzAvakF.js';
import { R as Root, D as Dialog_content, a as Dialog_title } from './index4-DUPVSf4e.js';
import { L as Label } from './label-Dcp_yKNn.js';
import { P as Plus, I as Input, D as Dialog_footer } from './input-CVQAS9R1.js';
import { B as Button } from './button-CuLYtK6I.js';
import { t as toast } from './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import 'clsx';
import { l as layoutClientHandler } from './LayoutClientHandler.svelte-BywpuRZh.js';
import { S as Sonner_1, R as Root$1, a as Select_trigger, b as Select_content, c as Select_item } from './sonner-C-Bu81nO.js';
import { D as Dialog_header } from './dialog-header-DbgSuPRm.js';
import { S as Separator } from './separator-vOnfT4vP.js';
import { I as Icon } from './Icon-C3dCdepI.js';
import { T as Trash_2 } from './trash-2-Dl4C8hkB.js';
import './utils-DYrZMOqC.js';
import './utils2-BrUvaHVG.js';
import 'tailwind-merge';
import './scroll-lock-Dm1gjRYu.js';
import './events-G3NK2fJC.js';
import 'tailwind-variants';
import './index2-DmlwT2z5.js';
import './protocols-BWs_B1An.js';
import './Train.svelte-B8RiRVnW.js';
import './stores2-CM1iPXui.js';

function Train_front($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M8 3.1V7a4 4 0 0 0 8 0V3.1" }],
    ["path", { "d": "m9 15-1-1" }],
    ["path", { "d": "m15 15 1-1" }],
    [
      "path",
      {
        "d": "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"
      }
    ],
    ["path", { "d": "m8 19-2 3" }],
    ["path", { "d": "m16 19 2 3" }]
  ];
  Icon($$payload, spread_props([
    { name: "train-front" },
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
function ConnectionSelector($$payload, $$props) {
  push();
  let {
    connections,
    selectedConnectionUUID = void 0
  } = $$props;
  const selectedConnection = (() => {
    if (selectedConnectionUUID) {
      return connections.get(selectedConnectionUUID);
    }
  })();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">`;
    Label($$payload2, {
      for: "trainConnection",
      class: "text-right",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Connection`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <!---->`;
    Root$1($$payload2, {
      type: "single",
      name: "trainConnection",
      get value() {
        return selectedConnectionUUID;
      },
      set value($$value) {
        selectedConnectionUUID = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Select_trigger($$payload3, {
          class: "col-span-3",
          children: ($$payload4) => {
            $$payload4.out += `<!---->${escape_html(selectedConnection?.name ?? "Select Connection")}`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Select_content($$payload3, {
          children: ($$payload4) => {
            const each_array = ensure_array_like(connections);
            $$payload4.out += `<!--[-->`;
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let [connUUID, connection] = each_array[$$index];
              $$payload4.out += `<!---->`;
              Select_item($$payload4, {
                value: connUUID,
                children: ($$payload5) => {
                  $$payload5.out += `<div class="flex flex-col"><p>${escape_html(connection.name)}</p> <p class="text-sm">UID: ${escape_html(connUUID)}</p></div>`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { selectedConnectionUUID });
  pop();
}
function TrainAdd($$payload, $$props) {
  push();
  let { layout } = $$props;
  let editMode = false;
  let selectedConnectionUUID = void 0;
  let trainName = void 0;
  let trainAddress = void 0;
  async function saveChanges() {
    if (trainName === void 0 || trainAddress === void 0 || selectedConnectionUUID === void 0) {
      toast.error("Please fill in all fields");
      return;
    }
    const data = {
      name: trainName,
      address: trainAddress,
      connUUID: selectedConnectionUUID
    };
    fetch(`/api/layout/${layout.uuid}/trains/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        editMode = false;
        toast.success("Train added successfully");
        layoutClientHandler.refreshLayouts();
      } else {
        toast.error("Failed to add train");
      }
    }).catch((error) => {
      toast.error("Error adding train: " + error);
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<button class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none">`;
    Plus($$payload2, { size: 40, strokeWidth: 1 });
    $$payload2.out += `<!----> <p class="text-2xl text-start">Add Train</p></button> <!---->`;
    Root($$payload2, {
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
                    $$payload6.out += `<!---->Add Train`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="w-full"><div class="grid grid-cols-4 my-2 items-center gap-4">`;
            Label($$payload4, {
              for: "trainName",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Name`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "trainName",
              class: "col-span-3",
              get value() {
                return trainName;
              },
              set value($$value) {
                trainName = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div> <div class="grid grid-cols-4 my-2 items-center gap-4">`;
            Label($$payload4, {
              for: "trainAddress",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Address`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "trainAddress",
              class: "col-span-3",
              get value() {
                return trainAddress;
              },
              set value($$value) {
                trainAddress = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div> `;
            ConnectionSelector($$payload4, {
              connections: layout.connections,
              get selectedConnectionUUID() {
                return selectedConnectionUUID;
              },
              set selectedConnectionUUID($$value) {
                selectedConnectionUUID = $$value;
                $$settled = false;
              }
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
function TrainEdit($$payload, $$props) {
  push();
  let { train, layout } = $$props;
  let editMode = false;
  let selectedConnectionUUID = train.connUUID;
  let trainName = train.name;
  let trainAddress = train.address.toString();
  async function saveChanges() {
    if (trainName === void 0 || trainAddress === void 0 || selectedConnectionUUID === void 0) {
      toast.error("Please fill in all fields");
      return;
    }
    const data = {
      uuid: train.uuid,
      name: trainName,
      address: trainAddress,
      connUUID: selectedConnectionUUID
    };
    fetch(`/api/layout/${layout.uuid}/trains/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        editMode = false;
        toast.success("Train edited successfully");
        layoutClientHandler.refreshLayouts();
      } else {
        toast.error("Failed to edit train");
      }
    }).catch((error) => {
      toast.error("Error editing train: " + error);
    });
  }
  function deleteTrain() {
    if (!train.connUUID) {
      toast.error("Train is not connected to a connection");
      return;
    }
    const data = { uuid: train.uuid, connUUID: train.connUUID };
    fetch(`/api/layout/${layout.uuid}/trains/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        toast.success("Train deleted successfully");
        editMode = false;
        layoutClientHandler.refreshLayouts();
      } else {
        toast.error("Failed to delete train");
      }
    }).catch((error) => {
      toast.error("Error deleting train: " + error);
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<button class="border-primary border-2 p-3 flex rounded-md w-[500px] gap-3 items-center h-20 select-none">`;
    Train_front($$payload2, { size: 40, strokeWidth: 1 });
    $$payload2.out += `<!----> <p class="text-2xl text-start">${escape_html(train.name)}</p> <div class="flex-col flex items-start"><p class="text-sm text-gray-400">Addr: ${escape_html(train.address)}</p> <p class="text-sm text-gray-400">Connection: ${escape_html(layout.connections.get(train.connUUID)?.name ?? "None")}</p></div></button> <!---->`;
    Root($$payload2, {
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
                    $$payload6.out += `<!---->Edit Train`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="w-full"><div class="grid grid-cols-4 my-2 items-center gap-4">`;
            Label($$payload4, {
              for: "trainName",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Name`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "trainName",
              class: "col-span-3",
              get value() {
                return trainName;
              },
              set value($$value) {
                trainName = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div> <div class="grid grid-cols-4 my-2 items-center gap-4">`;
            Label($$payload4, {
              for: "trainAddress",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Address`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "trainAddress",
              class: "col-span-3",
              get value() {
                return trainAddress;
              },
              set value($$value) {
                trainAddress = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div> `;
            ConnectionSelector($$payload4, {
              connections: layout.connections,
              get selectedConnectionUUID() {
                return selectedConnectionUUID;
              },
              set selectedConnectionUUID($$value) {
                selectedConnectionUUID = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----> `;
            Separator($$payload4, { class: "mt-8" });
            $$payload4.out += `<!----> <div class="flex justify-end my-4">`;
            Button($$payload4, {
              class: "w-full bg-destructive text-destructive-foreground",
              onclick: deleteTrain,
              children: ($$payload5) => {
                Trash_2($$payload5, { size: 20 });
                $$payload5.out += `<!----> Delete Train`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----></div> `;
            Separator($$payload4, {});
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
  let { data } = $$props;
  const each_array = ensure_array_like(data.layout.getTrains().values());
  $$payload.out += `<div class="m-4"><h1 class="text-4xl my-10">Trains</h1> <div class="flex flex-wrap gap-3"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let train = each_array[$$index];
    TrainEdit($$payload, { train, layout: data.layout });
  }
  $$payload.out += `<!--]--> `;
  TrainAdd($$payload, { layout: data.layout });
  $$payload.out += `<!----></div></div> `;
  Sonner_1($$payload, {});
  $$payload.out += `<!---->`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DOaZ68SQ.js.map
