import 'clsx';
import { p as push, c as pop, x as copy_payload, y as assign_payload, w as bind_props, l as spread_props, q as spread_attributes, t as clsx, o as once, e as escape_html, k as sanitize_props, m as slot, h as attr, j as stringify, f as ensure_array_like } from './index3-mfzAvakF.js';
import { c as cn, u as useId, n as noop, b as box, m as mergeProps, a as useRefById, z as getDataRequired, A as getDataChecked, i as getDataDisabled, B as getAriaRequired, C as getAriaChecked, f as getDisabled, s as styleToString, k as getAriaHidden, p as srOnlyStyles, w as watch, l as getAriaOrientation, y as getAriaDisabled, j as getDataOrientation } from './utils2-BrUvaHVG.js';
import { T as run } from './utils-DYrZMOqC.js';
import { C as Context, c as ENTER, b as SPACE, v as isElementOrSVGElement, w as ARROW_LEFT, x as ARROW_RIGHT, A as ARROW_UP, e as ARROW_DOWN, H as HOME, i as END, t as tick } from './scroll-lock-Dm1gjRYu.js';
import { c as Chevron_up, i as isValidIndex, C as Check } from './stores2-CM1iPXui.js';
import { I as Icon } from './Icon-C3dCdepI.js';
import { T as TrainDirection } from './Train.svelte-B8RiRVnW.js';
import { L as Label, C as Chevron_down } from './label-Dcp_yKNn.js';
import { R as Root, T as Trigger, P as Popover_content, C as Command, b as Command_input, c as Command_list, a as Chevrons_up_down, d as Command_group, e as Command_item, u as useCommandEmpty } from './index6-Bhn8PMYX.js';
import { B as Button } from './button-CuLYtK6I.js';
import './index5-BE4_qQtv.js';
import './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import 'tailwind-merge';
import './events-G3NK2fJC.js';
import './index2-DmlwT2z5.js';
import 'tailwind-variants';

function Circle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12.01",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "circle-alert" },
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
function Menu($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "menu" },
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
function Power_off($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M18.36 6.64A9 9 0 0 1 20.77 15" }
    ],
    [
      "path",
      { "d": "M6.16 6.16a9 9 0 1 0 12.68 12.68" }
    ],
    ["path", { "d": "M12 2v4" }],
    ["path", { "d": "m2 2 20 20" }]
  ];
  Icon($$payload, spread_props([
    { name: "power-off" },
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
function Power($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 2v10" }],
    [
      "path",
      { "d": "M18.4 6.6a9 9 0 1 1-12.77.04" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "power" },
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
function Command_empty$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    children,
    child,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const emptyState = useCommandEmpty({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    forceMount: box.with(() => forceMount)
  });
  const mergedProps = mergeProps(emptyState.props, restProps);
  if (emptyState.shouldRender) {
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
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function getRangeStyles(direction, min, max) {
  const styles = {
    position: "absolute"
  };
  if (direction === "lr") {
    styles.left = `${min}%`;
    styles.right = `${max}%`;
  } else if (direction === "rl") {
    styles.right = `${min}%`;
    styles.left = `${max}%`;
  } else if (direction === "bt") {
    styles.bottom = `${min}%`;
    styles.top = `${max}%`;
  } else {
    styles.top = `${min}%`;
    styles.bottom = `${max}%`;
  }
  return styles;
}
function getThumbStyles(direction, thumbPos) {
  const styles = {
    position: "absolute"
  };
  if (direction === "lr") {
    styles.left = `${thumbPos}%`;
    styles.translate = "-50% 0";
  } else if (direction === "rl") {
    styles.right = `${thumbPos}%`;
    styles.translate = "50% 0";
  } else if (direction === "bt") {
    styles.bottom = `${thumbPos}%`;
    styles.translate = "0 50%";
  } else {
    styles.top = `${thumbPos}%`;
    styles.translate = "0 -50%";
  }
  return styles;
}
function getTickStyles(direction, tickPosition, offsetPercentage) {
  const style = {
    position: "absolute"
  };
  if (direction === "lr") {
    style.left = `${tickPosition}%`;
    style.translate = `${offsetPercentage}% 0`;
  } else if (direction === "rl") {
    style.right = `${tickPosition}%`;
    style.translate = `${-offsetPercentage}% 0`;
  } else if (direction === "bt") {
    style.bottom = `${tickPosition}%`;
    style.translate = `0 ${-offsetPercentage}%`;
  } else {
    style.top = `${tickPosition}%`;
    style.translate = `0 ${offsetPercentage}%`;
  }
  return style;
}
function snapValueToStep(value, min, max, step) {
  const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
  let snappedValue = Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder;
  if (!Number.isNaN(min)) {
    if (snappedValue < min) {
      snappedValue = min;
    } else if (!Number.isNaN(max) && snappedValue > max) {
      snappedValue = min + Math.floor((max - min) / step) * step;
    }
  } else if (!Number.isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(max / step) * step;
  }
  const string = step.toString();
  const index = string.indexOf(".");
  const precision = index >= 0 ? string.length - index : 0;
  if (precision > 0) {
    const pow = 10 ** precision;
    snappedValue = Math.round(snappedValue * pow) / pow;
  }
  return snappedValue;
}
const SLIDER_ROOT_ATTR = "data-slider-root";
const SLIDER_THUMB_ATTR = "data-slider-thumb";
const SLIDER_RANGE_ATTR = "data-slider-range";
const SLIDER_TICK_ATTR = "data-slider-tick";
class SliderBaseRootState {
  opts;
  isActive = false;
  #direction = once(() => {
    if (this.opts.orientation.current === "horizontal") {
      return this.opts.dir.current === "rtl" ? "rl" : "lr";
    } else {
      return this.opts.dir.current === "rtl" ? "tb" : "bt";
    }
  });
  get direction() {
    return this.#direction();
  }
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
  }
  #touchAction = once(() => {
    if (this.opts.disabled.current) return void 0;
    return this.opts.orientation.current === "horizontal" ? "pan-y" : "pan-x";
  });
  getAllThumbs = () => {
    const node = this.opts.ref.current;
    if (!node) return [];
    return Array.from(node.querySelectorAll(`[${SLIDER_THUMB_ATTR}]`));
  };
  #props = once(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    style: { touchAction: this.#touchAction() },
    [SLIDER_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class SliderSingleRootState extends SliderBaseRootState {
  opts;
  isMulti = false;
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch(
      [
        () => this.opts.step.current,
        () => this.opts.min.current,
        () => this.opts.max.current,
        () => this.opts.value.current
      ],
      ([step, min, max, value]) => {
        const isValidValue = (v) => {
          const snappedValue = snapValueToStep(v, min, max, step);
          return snappedValue === v;
        };
        const gcv = (v) => {
          return snapValueToStep(v, min, max, step);
        };
        if (!isValidValue(value)) {
          this.opts.value.current = gcv(value);
        }
      }
    );
  }
  applyPosition({ clientXY, start, end }) {
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    const percent = (clientXY - start) / (end - start);
    const val = percent * (max - min) + min;
    if (val < min) {
      this.updateValue(min);
    } else if (val > max) {
      this.updateValue(max);
    } else {
      const step = this.opts.step.current;
      const currStep = Math.floor((val - min) / step);
      const midpointOfCurrStep = min + currStep * step + step / 2;
      const midpointOfNextStep = min + (currStep + 1) * step + step / 2;
      const newValue = val >= midpointOfCurrStep && val < midpointOfNextStep ? (currStep + 1) * step + min : currStep * step + min;
      if (newValue <= max) {
        this.updateValue(newValue);
      }
    }
  }
  updateValue = (newValue) => {
    this.opts.value.current = snapValueToStep(newValue, this.opts.min.current, this.opts.max.current, this.opts.step.current);
  };
  handlePointerMove = (e) => {
    if (!this.isActive || this.opts.disabled.current) return;
    e.preventDefault();
    e.stopPropagation();
    const sliderNode = this.opts.ref.current;
    const activeThumb = this.getAllThumbs()[0];
    if (!sliderNode || !activeThumb) return;
    activeThumb.focus();
    const { left, right, top, bottom } = sliderNode.getBoundingClientRect();
    if (this.direction === "lr") {
      this.applyPosition({ clientXY: e.clientX, start: left, end: right });
    } else if (this.direction === "rl") {
      this.applyPosition({ clientXY: e.clientX, start: right, end: left });
    } else if (this.direction === "bt") {
      this.applyPosition({ clientXY: e.clientY, start: bottom, end: top });
    } else if (this.direction === "tb") {
      this.applyPosition({ clientXY: e.clientY, start: top, end: bottom });
    }
  };
  handlePointerDown = (e) => {
    if (e.button !== 0 || this.opts.disabled.current) return;
    const sliderNode = this.opts.ref.current;
    const closestThumb = this.getAllThumbs()[0];
    if (!closestThumb || !sliderNode) return;
    const target = e.target;
    if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
    e.preventDefault();
    closestThumb.focus();
    this.isActive = true;
    this.handlePointerMove(e);
  };
  handlePointerUp = () => {
    if (this.opts.disabled.current) return;
    if (this.isActive) {
      this.opts.onValueCommit.current(run(() => this.opts.value.current));
    }
    this.isActive = false;
  };
  getPositionFromValue = (thumbValue) => {
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    return (thumbValue - min) / (max - min) * 100;
  };
  #thumbsPropsArr = once(() => {
    const currValue = this.opts.value.current;
    return Array.from({ length: 1 }, () => {
      const thumbValue = currValue;
      const thumbPosition = this.getPositionFromValue(thumbValue ?? 0);
      const style = getThumbStyles(this.direction, thumbPosition);
      return {
        role: "slider",
        "aria-valuemin": this.opts.min.current,
        "aria-valuemax": this.opts.max.current,
        "aria-valuenow": thumbValue,
        "aria-disabled": getAriaDisabled(this.opts.disabled.current),
        "aria-orientation": getAriaOrientation(this.opts.orientation.current),
        "data-value": thumbValue,
        tabindex: this.opts.disabled.current ? -1 : 0,
        style,
        [SLIDER_THUMB_ATTR]: ""
      };
    });
  });
  get thumbsPropsArr() {
    return this.#thumbsPropsArr();
  }
  #thumbsRenderArr = once(() => {
    return this.thumbsPropsArr.map((_, i) => i);
  });
  get thumbsRenderArr() {
    return this.#thumbsRenderArr();
  }
  #ticksPropsArr = once(() => {
    const max = this.opts.max.current;
    const min = this.opts.min.current;
    const step = this.opts.step.current;
    const difference = max - min;
    let count = Math.ceil(difference / step);
    if (difference % step == 0) {
      count++;
    }
    const currValue = this.opts.value.current;
    return Array.from({ length: count }, (_, i) => {
      const tickPosition = i * (step / difference) * 100;
      const isFirst = i === 0;
      const isLast = i === count - 1;
      const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;
      const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
      const tickValue = min + i * step;
      const bounded = tickValue <= currValue;
      return {
        "data-disabled": getDataDisabled(this.opts.disabled.current),
        "data-orientation": getDataOrientation(this.opts.orientation.current),
        "data-bounded": bounded ? "" : void 0,
        "data-value": tickValue,
        style,
        [SLIDER_TICK_ATTR]: ""
      };
    });
  });
  get ticksPropsArr() {
    return this.#ticksPropsArr();
  }
  #ticksRenderArr = once(() => {
    return this.ticksPropsArr.map((_, i) => i);
  });
  get ticksRenderArr() {
    return this.#ticksRenderArr();
  }
  #snippetProps = once(() => ({
    ticks: this.ticksRenderArr,
    thumbs: this.thumbsRenderArr
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
}
class SliderMultiRootState extends SliderBaseRootState {
  opts;
  isMulti = true;
  activeThumb = null;
  currentThumbIdx = 0;
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch(
      [
        () => this.opts.step.current,
        () => this.opts.min.current,
        () => this.opts.max.current,
        () => this.opts.value.current
      ],
      ([step, min, max, value]) => {
        const isValidValue = (v) => {
          const snappedValue = snapValueToStep(v, min, max, step);
          return snappedValue === v;
        };
        const gcv = (v) => {
          return snapValueToStep(v, min, max, step);
        };
        if (value.some((v) => !isValidValue(v))) {
          this.opts.value.current = value.map(gcv);
        }
      }
    );
  }
  applyPosition({ clientXY, activeThumbIdx, start, end }) {
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    const percent = (clientXY - start) / (end - start);
    const val = percent * (max - min) + min;
    if (val < min) {
      this.updateValue(min, activeThumbIdx);
    } else if (val > max) {
      this.updateValue(max, activeThumbIdx);
    } else {
      const step = this.opts.step.current;
      const currStep = Math.floor((val - min) / step);
      const midpointOfCurrStep = min + currStep * step + step / 2;
      const midpointOfNextStep = min + (currStep + 1) * step + step / 2;
      const newValue = val >= midpointOfCurrStep && val < midpointOfNextStep ? (currStep + 1) * step + min : currStep * step + min;
      if (newValue <= max) {
        this.updateValue(newValue, activeThumbIdx);
      }
    }
  }
  #getClosestThumb = (e) => {
    const thumbs = this.getAllThumbs();
    if (!thumbs.length) return;
    for (const thumb of thumbs) {
      thumb.blur();
    }
    const distances = thumbs.map((thumb) => {
      if (this.opts.orientation.current === "horizontal") {
        const { left, right } = thumb.getBoundingClientRect();
        return Math.abs(e.clientX - (left + right) / 2);
      } else {
        const { top, bottom } = thumb.getBoundingClientRect();
        return Math.abs(e.clientY - (top + bottom) / 2);
      }
    });
    const node = thumbs[distances.indexOf(Math.min(...distances))];
    const idx = thumbs.indexOf(node);
    return { node, idx };
  };
  handlePointerMove = (e) => {
    if (!this.isActive || this.opts.disabled.current) return;
    e.preventDefault();
    e.stopPropagation();
    const sliderNode = this.opts.ref.current;
    const activeThumb = this.activeThumb;
    if (!sliderNode || !activeThumb) return;
    activeThumb.node.focus();
    const { left, right, top, bottom } = sliderNode.getBoundingClientRect();
    const direction = this.direction;
    if (direction === "lr") {
      this.applyPosition({
        clientXY: e.clientX,
        activeThumbIdx: activeThumb.idx,
        start: left,
        end: right
      });
    } else if (direction === "rl") {
      this.applyPosition({
        clientXY: e.clientX,
        activeThumbIdx: activeThumb.idx,
        start: right,
        end: left
      });
    } else if (direction === "bt") {
      this.applyPosition({
        clientXY: e.clientY,
        activeThumbIdx: activeThumb.idx,
        start: bottom,
        end: top
      });
    } else if (direction === "tb") {
      this.applyPosition({
        clientXY: e.clientY,
        activeThumbIdx: activeThumb.idx,
        start: top,
        end: bottom
      });
    }
  };
  handlePointerDown = (e) => {
    if (e.button !== 0 || this.opts.disabled.current) return;
    const sliderNode = this.opts.ref.current;
    const closestThumb = this.#getClosestThumb(e);
    if (!closestThumb || !sliderNode) return;
    const target = e.target;
    if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
    e.preventDefault();
    this.activeThumb = closestThumb;
    closestThumb.node.focus();
    this.isActive = true;
    this.handlePointerMove(e);
  };
  handlePointerUp = () => {
    if (this.opts.disabled.current) return;
    if (this.isActive) {
      this.opts.onValueCommit.current(run(() => this.opts.value.current));
    }
    this.isActive = false;
  };
  getPositionFromValue = (thumbValue) => {
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    return (thumbValue - min) / (max - min) * 100;
  };
  getAllThumbs = () => {
    const node = this.opts.ref.current;
    if (!node) return [];
    const thumbs = Array.from(node.querySelectorAll(`[${SLIDER_THUMB_ATTR}]`));
    return thumbs;
  };
  updateValue = (thumbValue, idx) => {
    const currValue = this.opts.value.current;
    if (!currValue.length) {
      this.opts.value.current.push(thumbValue);
      return;
    }
    const valueAtIndex = currValue[idx];
    if (valueAtIndex === thumbValue) return;
    const newValue = [...currValue];
    if (!isValidIndex(idx, newValue)) return;
    const direction = newValue[idx] > thumbValue ? -1 : 1;
    const swap = () => {
      const diffIndex = idx + direction;
      newValue[idx] = newValue[diffIndex];
      newValue[diffIndex] = thumbValue;
      const thumbs = this.getAllThumbs();
      if (!thumbs.length) return;
      thumbs[diffIndex]?.focus();
      this.activeThumb = { node: thumbs[diffIndex], idx: diffIndex };
    };
    if (this.opts.autoSort.current && (direction === -1 && thumbValue < newValue[idx - 1] || direction === 1 && thumbValue > newValue[idx + 1])) {
      swap();
      this.opts.value.current = newValue;
      return;
    }
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    const step = this.opts.step.current;
    newValue[idx] = snapValueToStep(thumbValue, min, max, step);
    this.opts.value.current = newValue;
  };
  #thumbsPropsArr = once(() => {
    const currValue = this.opts.value.current;
    return Array.from({ length: currValue.length || 1 }, (_, i) => {
      const currThumb = run(() => this.currentThumbIdx);
      if (currThumb < currValue.length) {
        run(() => {
          this.currentThumbIdx = currThumb + 1;
        });
      }
      const thumbValue = currValue[i];
      const thumbPosition = this.getPositionFromValue(thumbValue ?? 0);
      const style = getThumbStyles(this.direction, thumbPosition);
      return {
        role: "slider",
        "aria-valuemin": this.opts.min.current,
        "aria-valuemax": this.opts.max.current,
        "aria-valuenow": thumbValue,
        "aria-disabled": getAriaDisabled(this.opts.disabled.current),
        "aria-orientation": getAriaOrientation(this.opts.orientation.current),
        "data-value": thumbValue,
        tabindex: this.opts.disabled.current ? -1 : 0,
        style,
        [SLIDER_THUMB_ATTR]: ""
      };
    });
  });
  get thumbsPropsArr() {
    return this.#thumbsPropsArr();
  }
  #thumbsRenderArr = once(() => {
    return this.thumbsPropsArr.map((_, i) => i);
  });
  get thumbsRenderArr() {
    return this.#thumbsRenderArr();
  }
  #ticksPropsArr = once(() => {
    const max = this.opts.max.current;
    const min = this.opts.min.current;
    const step = this.opts.step.current;
    const difference = max - min;
    let count = Math.ceil(difference / step);
    if (difference % step == 0) {
      count++;
    }
    const currValue = this.opts.value.current;
    return Array.from({ length: count }, (_, i) => {
      const tickPosition = i * (step / difference) * 100;
      const isFirst = i === 0;
      const isLast = i === count - 1;
      const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;
      const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
      const tickValue = min + i * step;
      const bounded = currValue.length === 1 ? tickValue <= currValue[0] : currValue[0] <= tickValue && tickValue <= currValue[currValue.length - 1];
      return {
        "data-disabled": getDataDisabled(this.opts.disabled.current),
        "data-orientation": getDataOrientation(this.opts.orientation.current),
        "data-bounded": bounded ? "" : void 0,
        "data-value": tickValue,
        style,
        [SLIDER_TICK_ATTR]: ""
      };
    });
  });
  get ticksPropsArr() {
    return this.#ticksPropsArr();
  }
  #ticksRenderArr = once(() => {
    return this.ticksPropsArr.map((_, i) => i);
  });
  get ticksRenderArr() {
    return this.#ticksRenderArr();
  }
  #snippetProps = once(() => ({
    ticks: this.ticksRenderArr,
    thumbs: this.thumbsRenderArr
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
}
const VALID_SLIDER_KEYS = [
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  ARROW_DOWN,
  HOME,
  END
];
class SliderRangeState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #rangeStyles = once(() => {
    const min = Array.isArray(this.root.opts.value.current) ? this.root.opts.value.current.length > 1 ? this.root.getPositionFromValue(Math.min(...this.root.opts.value.current) ?? 0) : 0 : 0;
    const max = Array.isArray(this.root.opts.value.current) ? 100 - this.root.getPositionFromValue(Math.max(...this.root.opts.value.current) ?? 0) : 100 - this.root.getPositionFromValue(this.root.opts.value.current);
    return {
      position: "absolute",
      ...getRangeStyles(this.root.direction, min, max)
    };
  });
  get rangeStyles() {
    return this.#rangeStyles();
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.root.opts.orientation.current),
    "data-disabled": getDataDisabled(this.root.opts.disabled.current),
    style: this.rangeStyles,
    [SLIDER_RANGE_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class SliderThumbState {
  opts;
  root;
  #isDisabled = once(() => this.root.opts.disabled.current || this.opts.disabled.current);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
    this.onkeydown = this.onkeydown.bind(this);
  }
  #updateValue(newValue) {
    if (this.root.isMulti) {
      this.root.updateValue(newValue, this.opts.index.current);
    } else {
      this.root.updateValue(newValue);
    }
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    const currNode = this.opts.ref.current;
    if (!currNode) return;
    const thumbs = this.root.getAllThumbs();
    if (!thumbs.length) return;
    const idx = thumbs.indexOf(currNode);
    if (this.root.isMulti) {
      this.root.currentThumbIdx = idx;
    }
    if (!VALID_SLIDER_KEYS.includes(e.key)) return;
    e.preventDefault();
    const min = this.root.opts.min.current;
    const max = this.root.opts.max.current;
    const value = this.root.opts.value.current;
    const thumbValue = Array.isArray(value) ? value[idx] : value;
    const orientation = this.root.opts.orientation.current;
    const direction = this.root.direction;
    const step = this.root.opts.step.current;
    switch (e.key) {
      case HOME:
        this.#updateValue(min);
        break;
      case END:
        this.#updateValue(max);
        break;
      case ARROW_LEFT:
        if (orientation !== "horizontal") break;
        if (e.metaKey) {
          const newValue = direction === "rl" ? max : min;
          this.#updateValue(newValue);
        } else if (direction === "rl" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        } else if (direction === "lr" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        }
        break;
      case ARROW_RIGHT:
        if (orientation !== "horizontal") break;
        if (e.metaKey) {
          const newValue = direction === "rl" ? min : max;
          this.#updateValue(newValue);
        } else if (direction === "rl" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        } else if (direction === "lr" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        }
        break;
      case ARROW_UP:
        if (e.metaKey) {
          const newValue = direction === "tb" ? min : max;
          this.#updateValue(newValue);
        } else if (direction === "tb" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        } else if (direction !== "tb" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        }
        break;
      case ARROW_DOWN:
        if (e.metaKey) {
          const newValue = direction === "tb" ? max : min;
          this.#updateValue(newValue);
        } else if (direction === "tb" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        } else if (direction !== "tb" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        }
        break;
    }
    this.root.opts.onValueCommit.current(this.root.opts.value.current);
  }
  #props = once(() => ({
    ...this.root.thumbsPropsArr[this.opts.index.current],
    id: this.opts.id.current,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
const SliderRootContext = new Context("Slider.Root");
function useSliderRoot(props) {
  const { type, ...rest } = props;
  const rootState = type === "single" ? new SliderSingleRootState(rest) : new SliderMultiRootState(rest);
  return SliderRootContext.set(rootState);
}
function useSliderRange(props) {
  return new SliderRangeState(props, SliderRootContext.get());
}
function useSliderThumb(props) {
  return new SliderThumbState(props, SliderRootContext.get());
}
function Slider($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    value = void 0,
    type,
    onValueChange = noop,
    onValueCommit = noop,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    dir = "ltr",
    autoSort = true,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (value === void 0) {
    value = type === "single" ? 0 : [];
  }
  const rootState = useSliderRoot({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    value: box.with(() => value, (v) => {
      value = v;
      onValueChange(v);
    }),
    // @ts-expect-error - we know
    onValueCommit: box.with(() => onValueCommit),
    disabled: box.with(() => disabled),
    min: box.with(() => min),
    max: box.with(() => max),
    step: box.with(() => step),
    dir: box.with(() => dir),
    autoSort: box.with(() => autoSort),
    orientation: box.with(() => orientation),
    type
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps, ...rootState.snippetProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload, rootState.snippetProps);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, value });
  pop();
}
function Slider_range($$payload, $$props) {
  push();
  let {
    children,
    child,
    ref = null,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rangeState = useSliderRange({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rangeState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Slider_thumb($$payload, $$props) {
  push();
  let {
    children,
    child,
    ref = null,
    id = useId(),
    index,
    disabled = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const thumbState = useSliderThumb({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    index: box.with(() => index),
    disabled: box.with(() => disabled)
  });
  const mergedProps = mergeProps(restProps, thumbState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
const SWITCH_ROOT_ATTR = "data-switch-root";
const SWITCH_THUMB_ATTR = "data-switch-thumb";
class SwitchRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
    this.onkeydown = this.onkeydown.bind(this);
    this.onclick = this.onclick.bind(this);
  }
  #toggle() {
    this.opts.checked.current = !this.opts.checked.current;
  }
  onkeydown(e) {
    if (!(e.key === ENTER || e.key === SPACE) || this.opts.disabled.current) return;
    e.preventDefault();
    this.#toggle();
  }
  onclick(_) {
    if (this.opts.disabled.current) return;
    this.#toggle();
  }
  #sharedProps = once(() => ({
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "data-state": getDataChecked(this.opts.checked.current),
    "data-required": getDataRequired(this.opts.required.current)
  }));
  get sharedProps() {
    return this.#sharedProps();
  }
  #snippetProps = once(() => ({ checked: this.opts.checked.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    ...this.sharedProps,
    id: this.opts.id.current,
    role: "switch",
    disabled: getDisabled(this.opts.disabled.current),
    "aria-checked": getAriaChecked(this.opts.checked.current),
    "aria-required": getAriaRequired(this.opts.required.current),
    [SWITCH_ROOT_ATTR]: "",
    //
    onclick: this.onclick,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
class SwitchInputState {
  root;
  #shouldRender = once(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return this.#shouldRender();
  }
  constructor(root) {
    this.root = root;
  }
  #props = once(() => ({
    type: "checkbox",
    name: this.root.opts.name.current,
    value: this.root.opts.value.current,
    checked: this.root.opts.checked.current,
    disabled: this.root.opts.disabled.current,
    required: this.root.opts.required.current,
    "aria-hidden": getAriaHidden(true),
    style: styleToString(srOnlyStyles)
  }));
  get props() {
    return this.#props();
  }
}
class SwitchThumbState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #snippetProps = once(() => ({ checked: this.root.opts.checked.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    ...this.root.sharedProps,
    id: this.opts.id.current,
    [SWITCH_THUMB_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
const SwitchRootContext = new Context("Switch.Root");
function useSwitchRoot(props) {
  return SwitchRootContext.set(new SwitchRootState(props));
}
function useSwitchInput() {
  return new SwitchInputState(SwitchRootContext.get());
}
function useSwitchThumb(props) {
  return new SwitchThumbState(props, SwitchRootContext.get());
}
function Switch_input($$payload, $$props) {
  push();
  const inputState = useSwitchInput();
  if (inputState.shouldRender) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<input${spread_attributes({ ...inputState.props })}>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Switch$1($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    disabled = false,
    required = false,
    checked = false,
    value = "on",
    name = void 0,
    type = "button",
    onCheckedChange = noop,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useSwitchRoot({
    checked: box.with(() => checked, (v) => {
      checked = v;
      onCheckedChange?.(v);
    }),
    disabled: box.with(() => disabled ?? false),
    required: box.with(() => required),
    value: box.with(() => value),
    name: box.with(() => name),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props, { type });
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps, ...rootState.snippetProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload, rootState.snippetProps);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]--> `;
  Switch_input($$payload);
  $$payload.out += `<!---->`;
  bind_props($$props, { ref, checked });
  pop();
}
function Switch_thumb($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const thumbState = useSwitchThumb({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, thumbState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, {
      props: mergedProps,
      ...thumbState.snippetProps
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload, thumbState.snippetProps);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Command_empty($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<!---->`;
  Command_empty$1($$payload, spread_props([
    {
      class: cn("py-6 text-center text-sm", className)
    },
    restProps
  ]));
  $$payload.out += `<!---->`;
  bind_props($$props, { ref });
  pop();
}
function Slider_1($$payload, $$props) {
  push();
  let {
    value = void 0,
    class: className,
    disabled = false,
    type = "single",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    {
      let children = function($$payload3, { thumbs }) {
        const each_array = ensure_array_like(thumbs);
        $$payload3.out += `<span${attr("class", `${stringify(disabled ? " bg-secondary-disabled" : "bg-secondary")} disabled:bg-secondary-disabled relative h-full w-4 overflow-hidden rounded-full`)}><!---->`;
        Slider_range($$payload3, {
          class: `${stringify(disabled ? " bg-primary-disabled" : "bg-primary")} absolute size-full`
        });
        $$payload3.out += `<!----></span> <!--[-->`;
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let thumb = each_array[$$index];
          $$payload3.out += `<!---->`;
          Slider_thumb($$payload3, {
            index: thumb,
            disabled,
            class: "bg-background flex w-7 h-12 items-center justify-center border-primary disabled:border-primary-disabled ring-offset-background focus-visible:ring-ring size-8 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            children: ($$payload4) => {
              Menu($$payload4, {
                class: disabled ? "text-primary-disabled" : "text-primary"
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        }
        $$payload3.out += `<!--]-->`;
      };
      Slider($$payload2, spread_props([
        {
          class: cn("relative flex w-full touch-none select-none items-center justify-center h-full", className),
          disabled,
          type
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
          children,
          $$slots: { default: true }
        }
      ]));
    }
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { value });
  pop();
}
function Card($$payload, $$props) {
  push();
  let {
    class: className = void 0,
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    class: clsx(cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)),
    ...rest
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  pop();
}
function DirectionSelector($$payload, $$props) {
  push();
  let {
    direction = TrainDirection.Forward,
    onchanged,
    disabled = false,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    class: clsx(cn("p-[6px] rounded-md flex h-full flex-col gap-1 max-w-min", disabled ? "bg-primary-disabled" : "bg-primary", className)),
    ...restProps
  })}><button${attr("disabled", disabled, true)} type="button"${attr("class", `w-10 grow rounded-sm flex justify-center items-center ${stringify(direction == TrainDirection.Forward ? "text-white bg-secondary cursor-default disabled:bg-secondary-disabled" : "text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled")} `)}>`;
  Chevron_up($$payload, { size: "35px" });
  $$payload.out += `<!----></button> <button${attr("disabled", disabled, true)} type="button"${attr("class", `w-10 grow rounded-sm flex justify-center items-center ${stringify(direction == TrainDirection.Reverse ? "text-white bg-secondary cursor-default disabled:bg-secondary-disabled" : "text-black bg-primary cursor-pointer disabled:cursor-default disabled:bg-primary-disabled")} `)}>`;
  Chevron_down($$payload, { size: "35px" });
  $$payload.out += `<!----></button></div>`;
  bind_props($$props, { direction });
  pop();
}
function LocoSelect($$payload, $$props) {
  push();
  let {
    curTrain = void 0,
    disabled = false,
    layout
  } = $$props;
  let open = false;
  let triggerRef = null;
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Root($$payload2, {
      get open() {
        return open;
      },
      set open($$value) {
        open = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        {
          let child = function($$payload4, { props }) {
            Button($$payload4, spread_props([
              {
                variant: "outline",
                class: "w-full justify-between"
              },
              props,
              {
                role: "combobox",
                "aria-expanded": open,
                disabled,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(curTrain?.name || "Select a train...")} `;
                  Chevrons_up_down($$payload5, { class: "ml-2 size-4 shrink-0 opacity-50" });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              }
            ]));
          };
          Trigger($$payload3, {
            disabled,
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
          class: "w-[275px] p-0",
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Command($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Command_input($$payload5, { placeholder: "Search trains...", disabled });
                $$payload5.out += `<!----> <!---->`;
                Command_list($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->`;
                    Command_empty($$payload6, {
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->No trains found. :(`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!----> <!---->`;
                    Command_group($$payload6, {
                      children: ($$payload7) => {
                        const each_array = ensure_array_like(layout.getTrains().values());
                        $$payload7.out += `<!--[-->`;
                        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                          let train = each_array[$$index];
                          $$payload7.out += `<!---->`;
                          Command_item($$payload7, {
                            disabled,
                            value: train.name,
                            onSelect: () => {
                              curTrain = train;
                              closeAndFocusTrigger();
                            },
                            class: `flex justify-between ${stringify(train.uuid == curTrain?.uuid ? "cursor-default" : "cursor-pointer")}`,
                            children: ($$payload8) => {
                              $$payload8.out += `<div class="flex flex-col"><p class="text-md">${escape_html(train.name)}</p> <p class="text-xs text-gray-500 leading-[0.5rem]">ID: ${escape_html(train.address)}</p> <p class="text-xs text-gray-500 leading-[0.5rem]">Connection: ${escape_html(layout.connections.get(train.connUUID)?.name ?? "Undefined")}</p></div> `;
                              Check($$payload8, {
                                class: cn("mr-2 size-4", curTrain?.uuid !== train.uuid && "text-transparent")
                              });
                              $$payload8.out += `<!---->`;
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out += `<!---->`;
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
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { curTrain });
  pop();
}
function Throttle($$payload, $$props) {
  push();
  let { layout, disabled: disabledProp = false } = $$props;
  let curConnection = (() => {
    if (curTrain) {
      return layout.connections.get(curTrain.connUUID);
    }
  })();
  let curTrain = void 0;
  let disabled = disabledProp || curTrain == void 0;
  function handleDirectionChange(newDirection) {
    if (!curTrain || !curConnection) return;
    curConnection.setTrainDirection(curTrain.uuid, newDirection);
  }
  function handleSpeedChange(newSpeed) {
    if (!curTrain || !curConnection) return;
    curConnection.setTrainSpeed(curTrain.uuid, newSpeed);
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Card($$payload2, {
      class: "p-5 max-w-fit h-[450px] flex flex-col select-none gap-4",
      children: ($$payload3) => {
        LocoSelect($$payload3, {
          layout,
          disabled: disabledProp,
          get curTrain() {
            return curTrain;
          },
          set curTrain($$value) {
            curTrain = $$value;
            $$settled = false;
          }
        });
        $$payload3.out += `<!----> <div class="flex gap-4 justify-between items-center flex-1 grow"><div class="w-16 h-full pb-8 pt-4">`;
        if (curTrain) {
          $$payload3.out += "<!--[-->";
          Slider_1($$payload3, {
            type: "single",
            max: 128,
            orientation: "vertical",
            step: 1,
            disabled,
            onValueChange: handleSpeedChange,
            get value() {
              return curTrain.speed;
            },
            set value($$value) {
              curTrain.speed = $$value;
              $$settled = false;
            }
          });
        } else {
          $$payload3.out += "<!--[!-->";
          Slider_1($$payload3, {
            type: "single",
            orientation: "vertical",
            value: 8,
            disabled: true
          });
        }
        $$payload3.out += `<!--]--> <h1 class="text-xl text-center mt-2">${escape_html(Math.round(curTrain != void 0 ? curTrain.speed / 128 * 100 : 0))}%</h1></div> <div class="flex flex-col gap-2 h-full">`;
        Button($$payload3, {
          disabled,
          class: "size-[54px] m-0",
          onclick: () => curConnection?.emergencyStop(),
          variant: "destructive",
          size: "icon",
          children: ($$payload4) => {
            Circle_alert($$payload4, {});
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> `;
        if (curTrain) {
          $$payload3.out += "<!--[-->";
          DirectionSelector($$payload3, {
            onchanged: handleDirectionChange,
            disabled,
            get direction() {
              return curTrain.direction;
            },
            set direction($$value) {
              curTrain.direction = $$value;
              $$settled = false;
            }
          });
        } else {
          $$payload3.out += "<!--[!-->";
          DirectionSelector($$payload3, { direction: 1, disabled: true });
        }
        $$payload3.out += `<!--]--></div></div>`;
      },
      $$slots: { default: true }
    });
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function Switch($$payload, $$props) {
  push();
  let {
    class: className = void 0,
    checked = false,
    disabled = false,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Switch$1($$payload2, spread_props([
      {
        disabled,
        class: cn("focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-50", className)
      },
      rest,
      {
        get checked() {
          return checked;
        },
        set checked($$value) {
          checked = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Switch_thumb($$payload3, {
            class: cn("bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
          });
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
  bind_props($$props, { checked });
  pop();
}
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  async function disconnect() {
    for (const connection of data.layout.connections.values()) {
      if (connection.isConnected) {
        await data.layout.disconnect(connection.uuid);
      }
    }
  }
  async function connect() {
    for (const connection of data.layout.connections.values()) {
      if (!connection.isConnected) {
        await data.layout.connect(connection.uuid);
      }
    }
  }
  if (data.layout) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<main class="m-5"><div class="flex gap-2 content-center mb-5">`;
    Button($$payload, {
      class: "w-40",
      onclick: async () => await connect(),
      children: ($$payload2) => {
        Power($$payload2, {});
        $$payload2.out += `<!----> Connect`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----> `;
    Button($$payload, {
      class: "w-40",
      onclick: async () => await disconnect(),
      children: ($$payload2) => {
        Power_off($$payload2, {});
        $$payload2.out += `<!----> Disconnect`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----> <div class="flex items-center space-x-2">`;
    Switch($$payload, { id: "track-power", checked: false });
    $$payload.out += `<!----> `;
    Label($$payload, {
      for: "track-power",
      children: ($$payload2) => {
        $$payload2.out += `<!---->Track Power`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----></div></div> <div class="flex flex-row justify-center gap-4">`;
    Throttle($$payload, { layout: data.layout });
    $$payload.out += `<!----> `;
    Throttle($$payload, { layout: data.layout });
    $$payload.out += `<!----></div></main>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p>Not valid layout</p>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BpkFgXTC.js.map
