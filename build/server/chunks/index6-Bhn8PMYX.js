import { p as push, w as bind_props, c as pop, q as spread_attributes, x as copy_payload, y as assign_payload, l as spread_props, o as once, k as sanitize_props, m as slot, e as escape_html, h as attr } from './index3-mfzAvakF.js';
import { I as Icon } from './Icon-C3dCdepI.js';
import { n as noop, b as box, u as useId, m as mergeProps, c as cn, a as useRefById, g as getDataOpenClosed, t as getAriaExpanded, p as srOnlyStyles, w as watch, v as getDataSelected, i as getDataDisabled, x as getAriaSelected, y as getAriaDisabled } from './utils2-BrUvaHVG.js';
import 'clsx';
import { C as Context, P as Portal, c as ENTER, b as SPACE, m as isElement, d as afterTick, n as afterSleep, p as getFirstNonCommentChild, i as END, H as HOME, A as ARROW_UP, q as k, r as p, e as ARROW_DOWN, s as j, u as n } from './scroll-lock-Dm1gjRYu.js';
import { N as is_array, Q as get_prototype_of, S as object_prototype } from './utils-DYrZMOqC.js';
import { F as Floating_layer, a as Floating_layer_anchor, P as Popper_layer_force_mount, b as Popper_layer, h as getFloatingContentCSSVars } from './stores2-CM1iPXui.js';

const empty = [];
function snapshot(value, skip_warning = false) {
  return clone(value, /* @__PURE__ */ new Map(), "", empty);
}
function clone(value, cloned, path, paths, original = null) {
  if (typeof value === "object" && value !== null) {
    var unwrapped = cloned.get(value);
    if (unwrapped !== void 0) return unwrapped;
    if (value instanceof Map) return (
      /** @type {Snapshot<T>} */
      new Map(value)
    );
    if (value instanceof Set) return (
      /** @type {Snapshot<T>} */
      new Set(value)
    );
    if (is_array(value)) {
      var copy = (
        /** @type {Snapshot<any>} */
        Array(value.length)
      );
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var i = 0; i < value.length; i += 1) {
        var element = value[i];
        if (i in value) {
          copy[i] = clone(element, cloned, path, paths);
        }
      }
      return copy;
    }
    if (get_prototype_of(value) === object_prototype) {
      copy = {};
      cloned.set(value, copy);
      if (original !== null) {
        cloned.set(original, copy);
      }
      for (var key in value) {
        copy[key] = clone(value[key], cloned, path, paths);
      }
      return copy;
    }
    if (value instanceof Date) {
      return (
        /** @type {Snapshot<T>} */
        structuredClone(value)
      );
    }
    if (typeof /** @type {T & { toJSON?: any } } */
    value.toJSON === "function") {
      return clone(
        /** @type {T & { toJSON(): any } } */
        value.toJSON(),
        cloned,
        path,
        paths,
        // Associate the instance with the toJSON clone
        value
      );
    }
  }
  if (value instanceof EventTarget) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
  try {
    return (
      /** @type {Snapshot<T>} */
      structuredClone(value)
    );
  } catch (e) {
    return (
      /** @type {Snapshot<T>} */
      value
    );
  }
}
function Chevrons_up_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m7 15 5 5 5-5" }],
    ["path", { "d": "m7 9 5-5 5 5" }]
  ];
  Icon($$payload, spread_props([
    { name: "chevrons-up-down" },
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
function Search($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "11", "cy": "11", "r": "8" }
    ],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  Icon($$payload, spread_props([
    { name: "search" },
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
function findNextSibling(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function findPreviousSibling(el, selector) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.matches(selector))
      return sibling;
    sibling = sibling.previousElementSibling;
  }
}
const COMMAND_ROOT_ATTR = "data-command-root";
const COMMAND_LIST_ATTR = "data-command-list";
const COMMAND_INPUT_ATTR = "data-command-input";
const COMMAND_EMPTY_ATTR = "data-command-empty";
const COMMAND_GROUP_ATTR = "data-command-group";
const COMMAND_GROUP_ITEMS_ATTR = "data-command-group-items";
const COMMAND_GROUP_HEADING_ATTR = "data-command-group-heading";
const COMMAND_ITEM_ATTR = "data-command-item";
const COMMAND_INPUT_LABEL_ATTR = "data-command-input-label";
const COMMAND_VALUE_ATTR = "data-value";
const COMMAND_GROUP_SELECTOR = `[${COMMAND_GROUP_ATTR}]`;
const COMMAND_GROUP_ITEMS_SELECTOR = `[${COMMAND_GROUP_ITEMS_ATTR}]`;
const COMMAND_GROUP_HEADING_SELECTOR = `[${COMMAND_GROUP_HEADING_ATTR}]`;
const COMMAND_ITEM_SELECTOR = `[${COMMAND_ITEM_ATTR}]`;
const COMMAND_VALID_ITEM_SELECTOR = `${COMMAND_ITEM_SELECTOR}:not([aria-disabled="true"])`;
const CommandRootContext = new Context("Command.Root");
const CommandListContext = new Context("Command.List");
const CommandGroupContainerContext = new Context("Command.Group");
class CommandRootState {
  opts;
  #updateScheduled = false;
  allItems = /* @__PURE__ */ new Set();
  allGroups = /* @__PURE__ */ new Map();
  allIds = /* @__PURE__ */ new Map();
  // attempt to prevent the harsh delay when user is typing fast
  key = 0;
  viewportNode = null;
  inputNode = null;
  labelNode = null;
  // published state that the components and other things can react to
  commandState = null;
  // internal state that we mutate in batches and publish to the `state` at once
  _commandState = null;
  #snapshot() {
    return this._commandState;
  }
  #scheduleUpdate() {
    if (this.#updateScheduled) return;
    this.#updateScheduled = true;
    afterTick(() => {
      this.#updateScheduled = false;
      const currentState = this.#snapshot();
      const hasStateChanged = !Object.is(this.commandState, currentState);
      if (hasStateChanged) {
        this.commandState = currentState;
        this.opts.onStateChange?.current?.(snapshot(currentState));
      }
    });
  }
  setState(key, value, opts) {
    if (Object.is(this._commandState[key], value)) return;
    this._commandState[key] = value;
    if (key === "search") {
      this.#filterItems();
      this.#sort();
      this.#selectFirstItem();
    } else if (key === "value") {
      if (!opts) {
        this.#scrollSelectedIntoView();
      }
    }
    this.#scheduleUpdate();
  }
  constructor(opts) {
    this.opts = opts;
    const defaultState = {
      /** Value of the search query */
      search: "",
      /** Currently selected item value */
      value: this.opts.value.current ?? "",
      filtered: {
        /** The count of all visible items. */
        count: 0,
        /** Map from visible item id to its search store. */
        items: /* @__PURE__ */ new Map(),
        /** Set of groups with at least one visible item. */
        groups: /* @__PURE__ */ new Set()
      }
    };
    this._commandState = defaultState;
    this.commandState = defaultState;
    useRefById(opts);
    this.onkeydown = this.onkeydown.bind(this);
  }
  #score(value, keywords) {
    const filter = this.opts.filter.current ?? computeCommandScore;
    const score = value ? filter(value, this._commandState.search, keywords) : 0;
    return score;
  }
  #sort() {
    if (!this._commandState.search || this.opts.shouldFilter.current === false) {
      if (!this.commandState.value) this.#selectFirstItem();
      return;
    }
    const scores = this._commandState.filtered.items;
    const groups = [];
    for (const value of this._commandState.filtered.groups) {
      const items = this.allGroups.get(value);
      let max = 0;
      if (!items) {
        groups.push([value, max]);
        continue;
      }
      for (const item of items) {
        const score = scores.get(item);
        max = Math.max(score ?? 0, max);
      }
      groups.push([value, max]);
    }
    const listInsertionElement = this.viewportNode;
    const sorted = this.#getValidItems().sort((a, b) => {
      const valueA = a.getAttribute("id");
      const valueB = b.getAttribute("id");
      const scoresA = scores.get(valueA) ?? 0;
      const scoresB = scores.get(valueB) ?? 0;
      return scoresB - scoresA;
    });
    for (const item of sorted) {
      const group = item.closest(COMMAND_GROUP_ITEMS_SELECTOR);
      if (group) {
        const itemToAppend = item.parentElement === group ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
        if (itemToAppend) {
          group.appendChild(itemToAppend);
        }
      } else {
        const itemToAppend = item.parentElement === listInsertionElement ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
        if (itemToAppend) {
          listInsertionElement?.appendChild(itemToAppend);
        }
      }
    }
    const sortedGroups = groups.sort((a, b) => b[1] - a[1]);
    for (const group of sortedGroups) {
      const element = listInsertionElement?.querySelector(`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${encodeURIComponent(group[0])}"]`);
      element?.parentElement?.appendChild(element);
    }
  }
  setValue(value, opts) {
    if (value !== this.opts.value.current && value === "") {
      afterTick(() => {
        this.key++;
      });
    }
    this.setState("value", value, opts);
    this.opts.value.current = value;
  }
  #selectFirstItem() {
    afterTick(() => {
      const item = this.#getValidItems().find((item2) => item2.getAttribute("aria-disabled") !== "true");
      const value = item?.getAttribute(COMMAND_VALUE_ATTR);
      this.setValue(value || "");
    });
  }
  #filterItems() {
    if (!this._commandState.search || this.opts.shouldFilter.current === false) {
      this._commandState.filtered.count = this.allItems.size;
      return;
    }
    this._commandState.filtered.groups = /* @__PURE__ */ new Set();
    let itemCount = 0;
    for (const id of this.allItems) {
      const value = this.allIds.get(id)?.value ?? "";
      const keywords = this.allIds.get(id)?.keywords ?? [];
      const rank = this.#score(value, keywords);
      this._commandState.filtered.items.set(id, rank);
      if (rank > 0) itemCount++;
    }
    for (const [groupId, group] of this.allGroups) {
      for (const itemId of group) {
        const currItem = this._commandState.filtered.items.get(itemId);
        if (currItem && currItem > 0) {
          this._commandState.filtered.groups.add(groupId);
          break;
        }
      }
    }
    this._commandState.filtered.count = itemCount;
  }
  #getValidItems() {
    const node = this.opts.ref.current;
    if (!node) return [];
    const validItems = Array.from(node.querySelectorAll(COMMAND_VALID_ITEM_SELECTOR)).filter((el) => !!el);
    return validItems;
  }
  #getSelectedItem() {
    const node = this.opts.ref.current;
    if (!node) return;
    const selectedNode = node.querySelector(`${COMMAND_VALID_ITEM_SELECTOR}[aria-selected="true"]`);
    if (!selectedNode) return;
    return selectedNode;
  }
  #scrollSelectedIntoView() {
    afterSleep(1, () => {
      const item = this.#getSelectedItem();
      if (!item) return;
      const grandparent = item.parentElement?.parentElement;
      if (!grandparent) return;
      const firstChildOfParent = getFirstNonCommentChild(grandparent);
      if (firstChildOfParent && firstChildOfParent.dataset?.value === item.dataset?.value) {
        item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR)?.scrollIntoView({ block: "nearest" });
        return;
      }
      item.scrollIntoView({ block: "nearest" });
    });
  }
  #updateSelectedToIndex(index) {
    const items = this.#getValidItems();
    const item = items[index];
    if (item) {
      this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    }
  }
  #updateSelectedByItem(change) {
    const selected = this.#getSelectedItem();
    const items = this.#getValidItems();
    const index = items.findIndex((item) => item === selected);
    let newSelected = items[index + change];
    if (this.opts.loop.current) {
      newSelected = index + change < 0 ? items[items.length - 1] : index + change === items.length ? items[0] : items[index + change];
    }
    if (newSelected) {
      this.setValue(newSelected.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    }
  }
  #updateSelectedByGroup(change) {
    const selected = this.#getSelectedItem();
    let group = selected?.closest(COMMAND_GROUP_SELECTOR);
    let item;
    while (group && !item) {
      group = change > 0 ? findNextSibling(group, COMMAND_GROUP_SELECTOR) : findPreviousSibling(group, COMMAND_GROUP_SELECTOR);
      item = group?.querySelector(COMMAND_VALID_ITEM_SELECTOR);
    }
    if (item) {
      this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
    } else {
      this.#updateSelectedByItem(change);
    }
  }
  // keep id -> { value, keywords } mapping up to date
  registerValue(id, value, keywords) {
    if (value === this.allIds.get(id)?.value) return;
    this.allIds.set(id, { value, keywords });
    this._commandState.filtered.items.set(id, this.#score(value, keywords));
    this.#sort();
    return () => {
      this.allIds.delete(id);
    };
  }
  registerItem(id, groupId) {
    this.allItems.add(id);
    if (groupId) {
      if (!this.allGroups.has(groupId)) {
        this.allGroups.set(groupId, /* @__PURE__ */ new Set([id]));
      } else {
        this.allGroups.get(groupId).add(id);
      }
    }
    this.#filterItems();
    this.#sort();
    this.#scheduleUpdate();
    return () => {
      this.allIds.delete(id);
      this.allItems.delete(id);
      this.commandState.filtered.items.delete(id);
      const selectedItem = this.#getSelectedItem();
      this.#filterItems();
      if (selectedItem?.getAttribute("id") === id) this.#selectFirstItem();
      this.#scheduleUpdate();
    };
  }
  registerGroup(id) {
    if (!this.allGroups.has(id)) {
      this.allGroups.set(id, /* @__PURE__ */ new Set());
    }
    return () => {
      this.allIds.delete(id);
      this.allGroups.delete(id);
    };
  }
  #last() {
    return this.#updateSelectedToIndex(this.#getValidItems().length - 1);
  }
  #next(e) {
    e.preventDefault();
    if (e.metaKey) {
      this.#last();
    } else if (e.altKey) {
      this.#updateSelectedByGroup(1);
    } else {
      this.#updateSelectedByItem(1);
    }
  }
  #prev(e) {
    e.preventDefault();
    if (e.metaKey) {
      this.#updateSelectedToIndex(0);
    } else if (e.altKey) {
      this.#updateSelectedByGroup(-1);
    } else {
      this.#updateSelectedByItem(-1);
    }
  }
  onkeydown(e) {
    switch (e.key) {
      case n:
      case j: {
        if (this.opts.vimBindings.current && e.ctrlKey) {
          this.#next(e);
        }
        break;
      }
      case ARROW_DOWN:
        this.#next(e);
        break;
      case p:
      case k: {
        if (this.opts.vimBindings.current && e.ctrlKey) {
          this.#prev(e);
        }
        break;
      }
      case ARROW_UP:
        this.#prev(e);
        break;
      case HOME:
        e.preventDefault();
        this.#updateSelectedToIndex(0);
        break;
      case END:
        e.preventDefault();
        this.#last();
        break;
      case ENTER: {
        if (!e.isComposing && e.keyCode !== 229) {
          e.preventDefault();
          const item = this.#getSelectedItem();
          if (item) {
            item?.click();
          }
        }
      }
    }
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "application",
    [COMMAND_ROOT_ATTR]: "",
    tabindex: -1,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
class CommandEmptyState {
  opts;
  root;
  #isInitialRender = true;
  #shouldRender = once(() => this.root._commandState.filtered.count === 0 && this.#isInitialRender === false || this.opts.forceMount.current);
  get shouldRender() {
    return this.#shouldRender();
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({ ...opts, deps: () => this.shouldRender });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "presentation",
    [COMMAND_EMPTY_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CommandGroupContainerState {
  opts;
  root;
  headingNode = null;
  #shouldRender = once(() => {
    if (this.opts.forceMount.current) return true;
    if (this.root.opts.shouldFilter.current === false) return true;
    if (!this.root.commandState.search) return true;
    return this.root.commandState.filtered.groups.has(this.opts.id.current);
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  trueValue = "";
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.trueValue = opts.value.current;
    useRefById({ ...opts, deps: () => this.shouldRender });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "presentation",
    hidden: this.shouldRender ? void 0 : true,
    "data-value": this.trueValue,
    [COMMAND_GROUP_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CommandGroupHeadingState {
  opts;
  group;
  constructor(opts, group) {
    this.opts = opts;
    this.group = group;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.group.headingNode = node;
      }
    });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    [COMMAND_GROUP_HEADING_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CommandGroupItemsState {
  opts;
  group;
  constructor(opts, group) {
    this.opts = opts;
    this.group = group;
    useRefById(opts);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "group",
    [COMMAND_GROUP_ITEMS_ATTR]: "",
    "aria-labelledby": this.group.headingNode?.id ?? void 0
  }));
  get props() {
    return this.#props();
  }
}
class CommandInputState {
  opts;
  root;
  #selectedItemId = once(() => {
    const item = this.root.viewportNode?.querySelector(`${COMMAND_ITEM_SELECTOR}[${COMMAND_VALUE_ATTR}="${encodeURIComponent(this.opts.value.current)}"]`);
    if (!item) return;
    return item?.getAttribute("id") ?? void 0;
  });
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.inputNode = node;
      }
    });
    watch(() => this.opts.ref.current, () => {
      const node = this.opts.ref.current;
      if (node && this.opts.autofocus.current) {
        afterSleep(10, () => node.focus());
      }
    });
    watch(() => this.opts.value.current, () => {
      if (this.root.commandState.search !== this.opts.value.current) {
        this.root.setState("search", this.opts.value.current);
      }
    });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    type: "text",
    [COMMAND_INPUT_ATTR]: "",
    autocomplete: "off",
    autocorrect: "off",
    spellcheck: false,
    "aria-autocomplete": "list",
    role: "combobox",
    "aria-expanded": getAriaExpanded(true),
    "aria-controls": this.root.viewportNode?.id ?? void 0,
    "aria-labelledby": this.root.labelNode?.id ?? void 0,
    "aria-activedescendant": this.#selectedItemId()
  }));
  get props() {
    return this.#props();
  }
}
class CommandItemState {
  opts;
  root;
  #group = null;
  #trueForceMount = once(() => {
    return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
  });
  trueValue = "";
  #shouldRender = once(() => {
    if (this.#trueForceMount() || this.root.opts.shouldFilter.current === false || !this.root.commandState.search) {
      return true;
    }
    const currentScore = this.root.commandState.filtered.items.get(this.opts.id.current);
    if (currentScore === void 0) return false;
    return currentScore > 0;
  });
  get shouldRender() {
    return this.#shouldRender();
  }
  #isSelected = once(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
  get isSelected() {
    return this.#isSelected();
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.#group = CommandGroupContainerContext.getOr(null);
    this.trueValue = opts.value.current;
    useRefById({
      ...opts,
      deps: () => Boolean(this.root.commandState.search)
    });
    watch(
      [
        () => this.opts.id.current,
        () => this.#group?.opts.id.current,
        () => this.opts.forceMount.current
      ],
      () => {
        if (this.opts.forceMount.current) return;
        return this.root.registerItem(this.opts.id.current, this.#group?.opts.id.current);
      }
    );
    watch(
      [
        () => this.opts.value.current,
        () => this.opts.ref.current
      ],
      () => {
        if (!this.opts.ref.current) return;
        if (!this.opts.value.current && this.opts.ref.current.textContent) {
          this.trueValue = this.opts.ref.current.textContent.trim();
        }
        this.root.registerValue(this.opts.id.current, this.trueValue, opts.keywords.current.map((kw) => kw.trim()));
        this.opts.ref.current.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
      }
    );
    this.onclick = this.onclick.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
  }
  #onSelect() {
    if (this.opts.disabled.current) return;
    this.#select();
    this.opts.onSelect?.current();
  }
  #select() {
    if (this.opts.disabled.current) return;
    this.root.setValue(this.trueValue, true);
  }
  onpointermove(_) {
    if (this.opts.disabled.current || this.root.opts.disablePointerSelection.current) return;
    this.#select();
  }
  onclick(_) {
    if (this.opts.disabled.current) return;
    this.#onSelect();
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "aria-disabled": getAriaDisabled(this.opts.disabled.current),
    "aria-selected": getAriaSelected(this.isSelected),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "data-selected": getDataSelected(this.isSelected),
    "data-value": this.trueValue,
    [COMMAND_ITEM_ATTR]: "",
    role: "option",
    onpointermove: this.onpointermove,
    onclick: this.onclick
  }));
  get props() {
    return this.#props();
  }
}
class CommandListState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "listbox",
    "aria-label": this.opts.ariaLabel.current,
    [COMMAND_LIST_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CommandLabelState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.labelNode = node;
      }
    });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    [COMMAND_INPUT_LABEL_ATTR]: "",
    for: this.opts.for?.current,
    style: srOnlyStyles
  }));
  get props() {
    return this.#props();
  }
}
function useCommandRoot(props) {
  return CommandRootContext.set(new CommandRootState(props));
}
function useCommandEmpty(props) {
  return new CommandEmptyState(props, CommandRootContext.get());
}
function useCommandItem(props) {
  const group = CommandGroupContainerContext.getOr(null);
  return new CommandItemState({ ...props, group }, CommandRootContext.get());
}
function useCommandGroupContainer(props) {
  return CommandGroupContainerContext.set(new CommandGroupContainerState(props, CommandRootContext.get()));
}
function useCommandGroupHeading(props) {
  return new CommandGroupHeadingState(props, CommandGroupContainerContext.get());
}
function useCommandGroupItems(props) {
  return new CommandGroupItemsState(props, CommandGroupContainerContext.get());
}
function useCommandInput(props) {
  return new CommandInputState(props, CommandRootContext.get());
}
function useCommandList(props) {
  return CommandListContext.set(new CommandListState(props, CommandRootContext.get()));
}
function useCommandLabel(props) {
  return new CommandLabelState(props, CommandRootContext.get());
}
function _command_label($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const labelState = useCommandLabel({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, labelState.props);
  $$payload.out += `<label${spread_attributes({ ...mergedProps })}>`;
  children?.($$payload);
  $$payload.out += `<!----></label>`;
  bind_props($$props, { ref });
  pop();
}
function Command$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    value = "",
    onValueChange = noop,
    onStateChange = noop,
    loop = false,
    shouldFilter = true,
    filter = computeCommandScore,
    label = "",
    vimBindings = true,
    disablePointerSelection = false,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useCommandRoot({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    filter: box.with(() => filter),
    shouldFilter: box.with(() => shouldFilter),
    loop: box.with(() => loop),
    value: box.with(() => value, (v) => {
      value = v;
      onValueChange(v);
    }),
    vimBindings: box.with(() => vimBindings),
    disablePointerSelection: box.with(() => disablePointerSelection),
    onStateChange: box.with(() => onStateChange)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  function Label($$payload2) {
    _command_label($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->${escape_html(label)}`;
      },
      $$slots: { default: true }
    });
  }
  if (child) {
    $$payload.out += "<!--[-->";
    Label($$payload);
    $$payload.out += `<!----> `;
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    Label($$payload);
    $$payload.out += `<!----> `;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, value });
  pop();
}
function Command_group$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    value = "",
    forceMount = false,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const groupState = useCommandGroupContainer({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    forceMount: box.with(() => forceMount),
    value: box.with(() => value)
  });
  const mergedProps = mergeProps(restProps, groupState.props);
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
function Command_group_heading($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const headingState = useCommandGroupHeading({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, headingState.props);
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
function Command_group_items($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const groupItemsState = useCommandGroupItems({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, groupItemsState.props);
  $$payload.out += `<div style="display: contents;">`;
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
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { ref });
  pop();
}
function Command_input$1($$payload, $$props) {
  push();
  let {
    value = "",
    autofocus = false,
    id = useId(),
    ref = null,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const inputState = useCommandInput({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    value: box.with(() => value, (v) => {
      value = v;
    }),
    autofocus: box.with(() => autofocus ?? false)
  });
  const mergedProps = mergeProps(restProps, inputState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<input${spread_attributes({ ...mergedProps, value })}>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { value, ref });
  pop();
}
function Command_item$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    value = "",
    disabled = false,
    children,
    child,
    onSelect = noop,
    forceMount = false,
    keywords = [],
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const itemState = useCommandItem({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    value: box.with(() => value),
    disabled: box.with(() => disabled),
    onSelect: box.with(() => onSelect),
    forceMount: box.with(() => forceMount),
    keywords: box.with(() => keywords)
  });
  const mergedProps = mergeProps(restProps, itemState.props);
  $$payload.out += `<!---->`;
  {
    $$payload.out += `<div style="display: contents;" data-item-wrapper=""${attr("data-value", value)}>`;
    if (itemState.shouldRender) {
      $$payload.out += "<!--[-->";
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
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
function Command_list$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    "aria-label": ariaLabel,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const listState = useCommandList({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    ariaLabel: box.with(() => ariaLabel ?? "Suggestions...")
  });
  const mergedProps = mergeProps(restProps, listState.props);
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
const SCORE_CONTINUE_MATCH = 1;
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
const SCORE_CHARACTER_JUMP = 0.17;
const SCORE_TRANSPOSITION = 0.1;
const PENALTY_SKIPPED = 0.999;
const PENALTY_CASE_MISMATCH = 0.9999;
const PENALTY_NOT_COMPLETE = 0.99;
const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;
function computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length)
      return SCORE_CONTINUE_MATCH;
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== void 0)
    return memoizedResults[memoizeKey];
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score, transposedScore, wordBreaks, spaceBreaks;
  while (index >= 0) {
    score = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** wordBreaks.length;
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** spaceBreaks.length;
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= PENALTY_SKIPPED ** (index - stringIndex);
        }
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }
    if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
      transposedScore = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }
    if (score > highScore) {
      highScore = score;
    }
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}
function formatInput(string) {
  return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
function computeCommandScore(command, search, commandKeywords) {
  command = commandKeywords && commandKeywords.length > 0 ? `${`${command} ${commandKeywords?.join(" ")}`}` : command;
  return computeCommandScoreInner(command, search, formatInput(command), formatInput(search), 0, 0, {});
}
class PopoverRootState {
  opts;
  contentNode = null;
  triggerNode = null;
  constructor(opts) {
    this.opts = opts;
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  handleClose() {
    if (!this.opts.open.current) return;
    this.opts.open.current = false;
  }
}
class PopoverTriggerState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.triggerNode = node;
      }
    });
    this.onclick = this.onclick.bind(this);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
  }
  onclick(e) {
    if (this.opts.disabled.current) return;
    if (e.button !== 0) return;
    this.root.toggleOpen();
  }
  onpointerdown(e) {
    if (this.opts.disabled.current) return;
    if (e.button !== 0) return;
    e.preventDefault();
  }
  onkeydown(e) {
    if (this.opts.disabled.current) return;
    if (!(e.key === ENTER || e.key === SPACE)) return;
    e.preventDefault();
    this.root.toggleOpen();
  }
  #getAriaControls() {
    if (this.root.opts.open.current && this.root.contentNode?.id) {
      return this.root.contentNode?.id;
    }
    return void 0;
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "aria-haspopup": "dialog",
    "aria-expanded": getAriaExpanded(this.root.opts.open.current),
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "aria-controls": this.#getAriaControls(),
    "data-popover-trigger": "",
    disabled: this.opts.disabled.current,
    //
    onpointerdown: this.onpointerdown,
    onkeydown: this.onkeydown,
    onclick: this.onclick
  }));
  get props() {
    return this.#props();
  }
}
class PopoverContentState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      deps: () => this.root.opts.open.current,
      onRefChange: (node) => {
        this.root.contentNode = node;
      }
    });
    this.handleInteractOutside = this.handleInteractOutside.bind(this);
    this.handleEscapeKeydown = this.handleEscapeKeydown.bind(this);
    this.handleCloseAutoFocus = this.handleCloseAutoFocus.bind(this);
  }
  handleInteractOutside(e) {
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    if (!isElement(e.target)) return;
    const closestTrigger = e.target.closest(`[data-popover-trigger]`);
    if (closestTrigger === this.root.triggerNode) return;
    this.root.handleClose();
  }
  handleEscapeKeydown(e) {
    this.opts.onEscapeKeydown.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  }
  handleCloseAutoFocus(e) {
    this.opts.onCloseAutoFocus.current(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    this.root.triggerNode?.focus();
  }
  #snippetProps = once(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "data-popover-content": "",
    style: { pointerEvents: "auto" }
  }));
  get props() {
    return this.#props();
  }
}
const PopoverRootContext = new Context("Popover.Root");
function usePopoverRoot(props) {
  return PopoverRootContext.set(new PopoverRootState(props));
}
function usePopoverTrigger(props) {
  return new PopoverTriggerState(props, PopoverRootContext.get());
}
function usePopoverContent(props) {
  return new PopoverContentState(props, PopoverRootContext.get());
}
function Popover_content$1($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    forceMount = false,
    onCloseAutoFocus = noop,
    onEscapeKeydown = noop,
    onInteractOutside = noop,
    trapFocus = true,
    preventScroll = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = usePopoverContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    onInteractOutside: box.with(() => onInteractOutside),
    onEscapeKeydown: box.with(() => onEscapeKeydown),
    onCloseAutoFocus: box.with(() => onCloseAutoFocus)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
  if (forceMount) {
    $$payload.out += "<!--[-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const finalProps = mergeProps(props, {
          style: getFloatingContentCSSVars("popover")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: finalProps,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...finalProps })}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer_force_mount($$payload, spread_props([
        mergedProps,
        {
          enabled: contentState.root.opts.open.current,
          id,
          onInteractOutside: contentState.handleInteractOutside,
          onEscapeKeydown: contentState.handleEscapeKeydown,
          onCloseAutoFocus: contentState.handleCloseAutoFocus,
          trapFocus,
          preventScroll,
          loop: true,
          forceMount: true,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else {
    $$payload.out += "<!--[!-->";
    if (!forceMount) {
      $$payload.out += "<!--[-->";
      {
        let popper = function($$payload2, { props, wrapperProps }) {
          const finalProps = mergeProps(props, {
            style: getFloatingContentCSSVars("popover")
          });
          if (child) {
            $$payload2.out += "<!--[-->";
            child($$payload2, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$payload2.out += `<!---->`;
          } else {
            $$payload2.out += "<!--[!-->";
            $$payload2.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...finalProps })}>`;
            children?.($$payload2);
            $$payload2.out += `<!----></div></div>`;
          }
          $$payload2.out += `<!--]-->`;
        };
        Popper_layer($$payload, spread_props([
          mergedProps,
          {
            present: contentState.root.opts.open.current,
            id,
            onInteractOutside: contentState.handleInteractOutside,
            onEscapeKeydown: contentState.handleEscapeKeydown,
            onCloseAutoFocus: contentState.handleCloseAutoFocus,
            trapFocus,
            preventScroll,
            loop: true,
            forceMount: false,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Popover_trigger($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    type = "button",
    disabled = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = usePopoverTrigger({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    disabled: box.with(() => Boolean(disabled))
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<button${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></button>`;
      }
      $$payload2.out += `<!--]-->`;
    }
  });
  bind_props($$props, { ref });
  pop();
}
function Popover($$payload, $$props) {
  push();
  let { open = false, onOpenChange = noop, children } = $$props;
  usePopoverRoot({
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    })
  });
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    }
  });
  bind_props($$props, { open });
  pop();
}
function Command($$payload, $$props) {
  push();
  let {
    ref = null,
    value = "",
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Command$1($$payload2, spread_props([
      {
        class: cn("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
      },
      restProps,
      {
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        },
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
  bind_props($$props, { ref, value });
  pop();
}
function Command_group($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    heading,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Command_group$1($$payload2, spread_props([
      {
        class: cn("text-foreground overflow-hidden p-1", className)
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
        children: ($$payload3) => {
          if (heading) {
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<!---->`;
            Command_group_heading($$payload3, {
              class: "text-muted-foreground px-2 py-1.5 text-xs font-medium",
              children: ($$payload4) => {
                $$payload4.out += `<!---->${escape_html(heading)}`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--> <!---->`;
          Command_group_items($$payload3, { children });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
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
function Command_item($$payload, $$props) {
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
    Command_item$1($$payload2, spread_props([
      {
        class: cn("aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className)
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
function Command_input($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    value = "",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="flex items-center border-b px-2" data-command-input-wrapper="">`;
    Search($$payload2, { class: "mr-2 size-4 shrink-0 opacity-50" });
    $$payload2.out += `<!----> <!---->`;
    Command_input$1($$payload2, spread_props([
      {
        class: cn("placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50", className)
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
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!----></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref, value });
  pop();
}
function Command_list($$payload, $$props) {
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
    Command_list$1($$payload2, spread_props([
      {
        class: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)
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
function Popover_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    sideOffset = 4,
    align = "center",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Portal($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Popover_content$1($$payload3, spread_props([
          {
            sideOffset,
            align,
            class: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none", className)
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
        $$payload3.out += `<!---->`;
      }
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
const Root = Popover;
const Trigger = Popover_trigger;

export { Command as C, Popover_content as P, Root as R, Trigger as T, Chevrons_up_down as a, Command_input as b, Command_list as c, Command_group as d, Command_item as e, useCommandEmpty as u };
//# sourceMappingURL=index6-Bhn8PMYX.js.map
