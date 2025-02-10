import { p as push, f as ensure_array_like, c as pop, x as copy_payload, y as assign_payload, e as escape_html, w as bind_props, l as spread_props } from './index3-mfzAvakF.js';
import { R as Root, D as Dialog_content, a as Dialog_title } from './index4-DUPVSf4e.js';
import { L as Label } from './label-Dcp_yKNn.js';
import { P as Plus, I as Input, D as Dialog_footer } from './input-CVQAS9R1.js';
import { B as Button } from './button-CuLYtK6I.js';
import { S as Sonner_1, R as Root$1, a as Select_trigger, b as Select_content, c as Select_item } from './sonner-C-Bu81nO.js';
import { S as Separator } from './separator-vOnfT4vP.js';
import { a as ConnectionProtocols, C as ConnectionTypes, g as getProtocolName, b as getConnectionTypeName } from './protocols-BWs_B1An.js';
import { t as toast } from './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import 'clsx';
import { l as layoutClientHandler } from './LayoutClientHandler.svelte-BywpuRZh.js';
import { C as Check } from './stores2-CM1iPXui.js';
import { R as Root$2, T as Trigger, P as Popover_content, C as Command, a as Chevrons_up_down, b as Command_input, c as Command_list, d as Command_group, e as Command_item } from './index6-Bhn8PMYX.js';
import { t as tick } from './scroll-lock-Dm1gjRYu.js';
import { c as cn } from './utils2-BrUvaHVG.js';
import './utils-DYrZMOqC.js';
import './Icon-C3dCdepI.js';
import 'tailwind-variants';
import './events-G3NK2fJC.js';
import './index2-DmlwT2z5.js';
import './Train.svelte-B8RiRVnW.js';
import 'tailwind-merge';

function pathItem($$payload, port) {
  $$payload.out += `<div class="flex flex-1 justify-start items-center gap-2"><p>${escape_html(port.path ?? "Undefined Path")}</p> <div class="flex flex-col justify-center items-start text-[0.6rem] leading-3 text-gray-400"><p>${escape_html(port.friendlyName ?? "Undefined Name")}</p> <p>${escape_html(port.manufacturer ?? "Undefined Manufacturer")}</p></div></div>`;
}
function SerialConnection($$payload, $$props) {
  push();
  let {
    serialPath = void 0,
    serialBaudRate = void 0
  } = $$props;
  let serialPorts = [];
  let serialPathSearch = "";
  let serialPathOpen = false;
  let triggerRef = null;
  const selectedSerialPath = serialPorts.find((port) => port.path === serialPath);
  function closeAndFocusSerialPathTrigger() {
    serialPathOpen = false;
    tick().then(() => {
      triggerRef?.focus();
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="grid grid-cols-4 items-center gap-4 w-full">`;
    Label($$payload2, {
      for: "serialPath",
      class: "text-right",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Serial Path`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <!---->`;
    Root$2($$payload2, {
      get open() {
        return serialPathOpen;
      },
      set open($$value) {
        serialPathOpen = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        {
          let child = function($$payload4, { props }) {
            Button($$payload4, spread_props([
              { variant: "outline", class: "w-full" },
              props,
              {
                role: "combobox",
                "aria-expanded": serialPathOpen,
                children: ($$payload5) => {
                  if (selectedSerialPath) {
                    $$payload5.out += "<!--[-->";
                    pathItem($$payload5, selectedSerialPath);
                  } else {
                    $$payload5.out += "<!--[!-->";
                    $$payload5.out += `<p class="text-left flex-1">Select a serial port...</p>`;
                  }
                  $$payload5.out += `<!--]--> `;
                  Chevrons_up_down($$payload5, { class: "ml-2 size-4 shrink-0 opacity-50" });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              }
            ]));
          };
          Trigger($$payload3, {
            class: "col-span-3",
            get ref() {
              return triggerRef;
            },
            set ref($$value) {
              triggerRef = $$value;
              $$settled = false;
            },
            child,
            $$slots: { child: true }
          });
        }
        $$payload3.out += `<!----> <!---->`;
        Popover_content($$payload3, {
          class: "p-0 w-full",
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Command($$payload4, {
              class: "w-full",
              shouldFilter: false,
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Command_input($$payload5, {
                  placeholder: "Type to add a custom port",
                  get value() {
                    return serialPathSearch;
                  },
                  set value($$value) {
                    serialPathSearch = $$value;
                    $$settled = false;
                  }
                });
                $$payload5.out += `<!----> <!---->`;
                Command_list($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->`;
                    Command_group($$payload6, {
                      children: ($$payload7) => {
                        const each_array = ensure_array_like(serialPorts);
                        if (serialPathSearch?.trim() && !serialPorts.some((port) => port.path === serialPathSearch)) {
                          $$payload7.out += "<!--[-->";
                          $$payload7.out += `<!---->`;
                          Command_item($$payload7, {
                            class: "w-80 h-10",
                            value: "CustomFilter",
                            onSelect: () => {
                              serialPorts = [
                                ...serialPorts,
                                {
                                  path: serialPathSearch,
                                  friendlyName: "Custom Port",
                                  isCustom: true
                                }
                              ];
                              serialPath = serialPathSearch;
                              closeAndFocusSerialPathTrigger();
                            },
                            children: ($$payload8) => {
                              $$payload8.out += `<div class="flex flex-1 justify-start items-center gap-2"><p>${escape_html(serialPathSearch)}</p> <div class="flex flex-col justify-center items-start text-[0.6rem] leading-3 text-gray-400"><p>Custom Port</p></div></div> `;
                              Check($$payload8, {
                                class: cn("mr-2 size-4", serialPath !== serialPathSearch && "text-transparent")
                              });
                              $$payload8.out += `<!---->`;
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out += `<!---->`;
                        } else {
                          $$payload7.out += "<!--[!-->";
                        }
                        $$payload7.out += `<!--]--> <!--[-->`;
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          let port = each_array[$$index];
                          if (port.path.includes(serialPathSearch)) {
                            $$payload7.out += "<!--[-->";
                            $$payload7.out += `<!---->`;
                            Command_item($$payload7, {
                              value: port.path,
                              onSelect: () => {
                                if (serialPath == port.path) {
                                  if (port.isCustom) {
                                    serialPorts = serialPorts.filter((p) => p.path !== port.path);
                                    serialPath = void 0;
                                  }
                                } else {
                                  serialPath = port.path;
                                }
                                closeAndFocusSerialPathTrigger();
                              },
                              class: "h-10",
                              children: ($$payload8) => {
                                pathItem($$payload8, port);
                                $$payload8.out += `<!----> `;
                                Check($$payload8, {
                                  class: cn("mr-2 size-4", serialPath !== port.path && "text-transparent")
                                });
                                $$payload8.out += `<!---->`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload7.out += `<!---->`;
                          } else {
                            $$payload7.out += "<!--[!-->";
                          }
                          $$payload7.out += `<!--]-->`;
                        }
                        $$payload7.out += `<!--]-->`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!---->`;
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
    $$payload2.out += `<!----></div> <div class="grid grid-cols-4 items-center gap-4">`;
    Label($$payload2, {
      for: "serialBaudRate",
      class: "text-right",
      children: ($$payload3) => {
        $$payload3.out += `<!---->Baud Rate`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Input($$payload2, {
      id: "serialBaudRate",
      type: "number",
      class: "col-span-3",
      get value() {
        return serialBaudRate;
      },
      set value($$value) {
        serialBaudRate = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { serialPath, serialBaudRate });
  pop();
}
function ConnectionAdd($$payload, $$props) {
  push();
  let { layout } = $$props;
  let editMode = false;
  let connName = void 0;
  let connProtocol = ConnectionProtocols.DCCEX.toString();
  let connType = ConnectionTypes.Serial.toString();
  let serialPath = void 0;
  let serialBaudRate = void 0;
  async function saveChanges() {
    if (connName === void 0) {
      toast.error("Please fill in all fields");
      return;
    }
    if (connType === ConnectionTypes.Serial.toString() && (serialPath === void 0 || serialBaudRate === void 0)) {
      toast.error("Please fill in all serial connection fields");
      return;
    }
    const data = {
      connName,
      protocol: Number(connProtocol),
      connType: Number(connType),
      serialPath,
      serialBaudRate
    };
    fetch(`/api/layout/${layout.uuid}/connections/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        editMode = false;
        toast.success("Connection added successfully");
        layoutClientHandler.refreshLayouts();
      } else {
        toast.error("Failed to add connection");
      }
    }).catch((error) => {
      toast.error("Error adding connection");
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<button class="border-primary border-2 flex p-3 rounded-md w-96 h-16 justify-center items-center select-none">`;
    Plus($$payload2, { size: 30 });
    $$payload2.out += `<!----> <p class="text-xl">Add Connection</p></button> <!---->`;
    Root($$payload2, {
      open: editMode,
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Dialog_content($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Dialog_title($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->Add Connection`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="grid grid-cols-4 items-center gap-4">`;
            Label($$payload4, {
              for: "connName",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Name`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "connName",
              class: "col-span-3",
              get value() {
                return connName;
              },
              set value($$value) {
                connName = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div> <div class="grid grid-cols-4 items-center gap-4">`;
            Label($$payload4, {
              for: "connProtocol",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Protocol`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Root$1($$payload4, {
              type: "single",
              name: "connProtocol",
              get value() {
                return connProtocol;
              },
              set value($$value) {
                connProtocol = $$value;
                $$settled = false;
              },
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Select_trigger($$payload5, {
                  class: "w-80",
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->${escape_html(getProtocolName(Number(connProtocol)))}`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> <!---->`;
                Select_content($$payload5, {
                  children: ($$payload6) => {
                    const each_array = ensure_array_like(Object.keys(ConnectionProtocols).filter((key) => isNaN(Number(key))));
                    $$payload6.out += `<!--[-->`;
                    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                      let protocolName = each_array[i];
                      $$payload6.out += `<!---->`;
                      Select_item($$payload6, {
                        value: ConnectionProtocols[protocolName].toString(),
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->${escape_html(getProtocolName(ConnectionProtocols[protocolName]))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!---->`;
                    }
                    $$payload6.out += `<!--]-->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----></div> `;
            Separator($$payload4, {});
            $$payload4.out += `<!----> <div class="grid grid-cols-4 items-center gap-4">`;
            Label($$payload4, {
              for: "connType",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Hardware`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Root$1($$payload4, {
              type: "single",
              name: "connType",
              get value() {
                return connType;
              },
              set value($$value) {
                connType = $$value;
                $$settled = false;
              },
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Select_trigger($$payload5, {
                  class: "col-span-3",
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->${escape_html(getConnectionTypeName(Number(connType)))}`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> <!---->`;
                Select_content($$payload5, {
                  children: ($$payload6) => {
                    const each_array_1 = ensure_array_like(Object.keys(ConnectionTypes).filter((key) => isNaN(Number(key))));
                    $$payload6.out += `<!--[-->`;
                    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
                      let connType2 = each_array_1[i];
                      $$payload6.out += `<!---->`;
                      Select_item($$payload6, {
                        value: ConnectionTypes[connType2].toString(),
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->${escape_html(getConnectionTypeName(ConnectionTypes[connType2]))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!---->`;
                    }
                    $$payload6.out += `<!--]-->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----></div> `;
            if (connType === ConnectionTypes.Serial.toString()) {
              $$payload4.out += "<!--[-->";
              SerialConnection($$payload4, {
                get serialPath() {
                  return serialPath;
                },
                set serialPath($$value) {
                  serialPath = $$value;
                  $$settled = false;
                },
                get serialBaudRate() {
                  return serialBaudRate;
                },
                set serialBaudRate($$value) {
                  serialBaudRate = $$value;
                  $$settled = false;
                }
              });
            } else {
              $$payload4.out += "<!--[!-->";
            }
            $$payload4.out += `<!--]--> `;
            Separator($$payload4, {});
            $$payload4.out += `<!----> <!---->`;
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
function ConnectionEdit($$payload, $$props) {
  push();
  let { connection } = $$props;
  let editMode = false;
  let connName = connection.name;
  let connProtocol = connection.protocol.toString();
  let connType = connection.hardware.toString();
  let serialPath = void 0;
  let serialBaudRate = void 0;
  function saveChanges() {
    if (connType === ConnectionTypes.Serial.toString() && (serialPath === void 0 || serialBaudRate === void 0)) {
      toast.error("Please fill in all serial connection fields");
      return;
    }
    const data = {
      connName,
      protocol: Number(connProtocol),
      connType: Number(connType),
      serialPath,
      serialBaudRate
    };
    fetch(`/api/layout/${connection.layoutUUID}/${connection.uuid}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        editMode = false;
        toast.success("Connection updated successfully");
        layoutClientHandler.refreshLayouts();
      } else {
        toast.error("Failed to update connection");
      }
    }).catch((error) => {
      toast.error("Error updating connection");
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<button class="border-primary border-2 px-3 flex rounded-md gap-3 w-96 h-16 items-center select-none"><p class="text-xl">${escape_html(connection.name)}</p> <div class="flex-col flex items-start"><p class="text-sm text-gray-400">Protocol: ${escape_html(getProtocolName(Number(connProtocol)))}</p> <p class="text-sm text-gray-400">Type: ${escape_html(getConnectionTypeName(Number(connType)))}</p></div></button> <!---->`;
    Root($$payload2, {
      open: editMode,
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Dialog_content($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Dialog_title($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->Edit Connection`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="grid grid-cols-4 items-center gap-4">`;
            Label($$payload4, {
              for: "connName",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Name`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, {
              id: "connName",
              class: "col-span-3",
              get value() {
                return connName;
              },
              set value($$value) {
                connName = $$value;
                $$settled = false;
              }
            });
            $$payload4.out += `<!----></div> <div class="grid grid-cols-4 items-center gap-4">`;
            Label($$payload4, {
              for: "connProtocol",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Protocol`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Root$1($$payload4, {
              type: "single",
              name: "connProtocol",
              get value() {
                return connProtocol;
              },
              set value($$value) {
                connProtocol = $$value;
                $$settled = false;
              },
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Select_trigger($$payload5, {
                  class: "w-80",
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->${escape_html(getProtocolName(Number(connProtocol)))}`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> <!---->`;
                Select_content($$payload5, {
                  children: ($$payload6) => {
                    const each_array = ensure_array_like(Object.keys(ConnectionProtocols).filter((key) => isNaN(Number(key))));
                    $$payload6.out += `<!--[-->`;
                    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                      let protocolName = each_array[i];
                      $$payload6.out += `<!---->`;
                      Select_item($$payload6, {
                        value: ConnectionProtocols[protocolName].toString(),
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->${escape_html(getProtocolName(ConnectionProtocols[protocolName]))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!---->`;
                    }
                    $$payload6.out += `<!--]-->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----></div> `;
            Separator($$payload4, {});
            $$payload4.out += `<!----> <div class="grid grid-cols-4 items-center gap-4">`;
            Label($$payload4, {
              for: "connType",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out += `<!---->Hardware`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Root$1($$payload4, {
              type: "single",
              name: "connType",
              get value() {
                return connType;
              },
              set value($$value) {
                connType = $$value;
                $$settled = false;
              },
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Select_trigger($$payload5, {
                  class: "w-80",
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->${escape_html(getConnectionTypeName(Number(connType)))}`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!----> <!---->`;
                Select_content($$payload5, {
                  children: ($$payload6) => {
                    const each_array_1 = ensure_array_like(Object.keys(ConnectionTypes).filter((key) => isNaN(Number(key))));
                    $$payload6.out += `<!--[-->`;
                    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
                      let connType2 = each_array_1[i];
                      $$payload6.out += `<!---->`;
                      Select_item($$payload6, {
                        value: ConnectionTypes[connType2].toString(),
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->${escape_html(getConnectionTypeName(ConnectionTypes[connType2]))}`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!---->`;
                    }
                    $$payload6.out += `<!--]-->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----></div> `;
            if (connType === ConnectionTypes.Serial.toString()) {
              $$payload4.out += "<!--[-->";
              SerialConnection($$payload4, {
                get serialPath() {
                  return serialPath;
                },
                set serialPath($$value) {
                  serialPath = $$value;
                  $$settled = false;
                },
                get serialBaudRate() {
                  return serialBaudRate;
                },
                set serialBaudRate($$value) {
                  serialBaudRate = $$value;
                  $$settled = false;
                }
              });
            } else {
              $$payload4.out += "<!--[!-->";
            }
            $$payload4.out += `<!--]--> `;
            Separator($$payload4, {});
            $$payload4.out += `<!----> <!---->`;
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
  const each_array = ensure_array_like(data.layout.connections.values());
  $$payload.out += `<div class="m-4"><h1 class="text-4xl my-10">Connections</h1> <div class="flex flex-wrap gap-3"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let connection = each_array[$$index];
    ConnectionEdit($$payload, { connection });
  }
  $$payload.out += `<!--]--> `;
  ConnectionAdd($$payload, { layout: data.layout });
  $$payload.out += `<!----></div></div> `;
  Sonner_1($$payload, {});
  $$payload.out += `<!---->`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DDxtHuKX.js.map
