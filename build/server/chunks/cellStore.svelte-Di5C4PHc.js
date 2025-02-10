import { o as once } from './index3-mfzAvakF.js';
import 'clsx';

var Modes = /* @__PURE__ */ ((Modes2) => {
  Modes2[Modes2["Edit"] = 0] = "Edit";
  Modes2[Modes2["Operate"] = 1] = "Operate";
  return Modes2;
})(Modes || {});
var MouseMoving = /* @__PURE__ */ ((MouseMoving2) => {
  MouseMoving2[MouseMoving2["Dragging"] = 0] = "Dragging";
  MouseMoving2[MouseMoving2["Viewing"] = 1] = "Viewing";
  MouseMoving2[MouseMoving2["None"] = 2] = "None";
  return MouseMoving2;
})(MouseMoving || {});
var CellTypes = /* @__PURE__ */ ((CellTypes2) => {
  CellTypes2[CellTypes2["straight"] = 1] = "straight";
  CellTypes2[CellTypes2["curve"] = 2] = "curve";
  CellTypes2[CellTypes2["buffer"] = 3] = "buffer";
  CellTypes2[CellTypes2["delete"] = 0] = "delete";
  CellTypes2[CellTypes2["block"] = 10] = "block";
  CellTypes2[CellTypes2["turnout"] = 11] = "turnout";
  return CellTypes2;
})(CellTypes || {});
class EditMode {
  selectedTool = null;
  selRotation = 90;
  constructor(selectedTool, rotation) {
    this.selectedTool = selectedTool;
    this.selRotation = rotation;
  }
}
class OperateMode {
  constructor() {
  }
}
function convertCoordinatesToString(x, y) {
  return `${x},${y}`;
}
class GridState {
  cells = /* @__PURE__ */ new Map();
  selectedCell = null;
  #mode = new EditMode(null, 0);
  get mode() {
    return this.#mode;
  }
  set mode(value) {
    this.#mode = value;
  }
  #isEdit = once(() => this.mode instanceof EditMode);
  get isEdit() {
    return this.#isEdit();
  }
  #isOperate = once(() => this.mode instanceof OperateMode);
  get isOperate() {
    return this.#isOperate();
  }
  #curTool = once(() => {
    if (this.mode instanceof EditMode) return this.mode.selectedTool;
    return null;
  });
  get curTool() {
    return this.#curTool();
  }
  cellSize;
  rows;
  columns;
  constructor(rows, cols, cellSize) {
    this.rows = rows;
    this.columns = cols;
    this.cellSize = cellSize;
  }
  isCell(x, y) {
    return this.cells.has(convertCoordinatesToString(x, y));
  }
  getCell(x, y) {
    return this.cells.get(convertCoordinatesToString(x, y));
  }
  getSelectedCell() {
    if (this.selectedCell != null) {
      return this.cells.get(convertCoordinatesToString(this.selectedCell.x, this.selectedCell.y));
    }
    return void 0;
  }
  addCell(x, y, cell) {
    this.cells.set(convertCoordinatesToString(x, y), cell);
  }
  selectCell(x, y) {
    this.selectedCell = { x, y };
  }
  expandGrid(cols, rows) {
    this.columns = cols;
    this.rows = rows;
  }
  setTool(tool) {
    if (this.mode instanceof EditMode) this.mode.selectedTool = tool;
  }
  getTool(tool) {
    return this.getCurTool() == tool;
  }
  getCurTool() {
    if (this.mode instanceof EditMode) return this.mode.selectedTool;
    return null;
  }
  // We need a type guard function
  isEditMode() {
    return this.mode instanceof EditMode;
  }
  isOperateMode() {
    return this.mode instanceof OperateMode;
  }
  rotateCellRight(cell) {
    if (cell != void 0 && cell.type != null) {
      switch (cell.type.rotation) {
        case 0:
          cell.type.rotation = 45;
          break;
        case 45:
          cell.type.rotation = 90;
          break;
        case 90:
          cell.type.rotation = 135;
          break;
        case 135:
          cell.type.rotation = 180;
          break;
        case 180:
          cell.type.rotation = 225;
          break;
        case 225:
          cell.type.rotation = 270;
          break;
        case 270:
          cell.type.rotation = 315;
          break;
        case 315:
          cell.type.rotation = 0;
          break;
      }
      this.setRotation(cell.type.rotation);
    }
  }
  rotateCellLeft(cell) {
    if (cell != void 0 && cell.type != null) {
      switch (cell.type.rotation) {
        case 0:
          cell.type.rotation = 315;
          break;
        case 45:
          cell.type.rotation = 0;
          break;
        case 90:
          cell.type.rotation = 45;
          break;
        case 135:
          cell.type.rotation = 90;
          break;
        case 180:
          cell.type.rotation = 135;
          break;
        case 225:
          cell.type.rotation = 180;
          break;
        case 270:
          cell.type.rotation = 225;
          break;
        case 315:
          cell.type.rotation = 270;
          break;
      }
      this.setRotation(cell.type.rotation);
    }
  }
  setRotation(rotation) {
    if (this.mode instanceof EditMode) {
      this.mode.selRotation = rotation;
    }
  }
}
const gStore = new GridState(30, 50, 40);

export { CellTypes as C, EditMode as E, Modes as M, OperateMode as O, MouseMoving as a, gStore as g };
//# sourceMappingURL=cellStore.svelte-Di5C4PHc.js.map
