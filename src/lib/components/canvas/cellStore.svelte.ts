import { writable } from 'svelte/store';
import { CellTypes, convertCoordinatesToString, EditMode, OperateMode, type Cell, type Grid, type Rotation } from './canvasTypes.svelte';


const initialState: Grid = {
  cells: new Map(),
  cellSize: 40,
  columns: 50,
  rows: 30,
  selectedCell: null,
  mode: new EditMode(
    null,
    90,
  ),
};

type Modes = EditMode | OperateMode;

export class GridState {
  cells: Map<string, Cell> = new Map();
  selectedCell: { x: number, y: number } | null = $state(null);
  #mode: Modes = $state(new EditMode(null, 0));

  get mode() {
    return this.#mode;
  }

  set mode(value) {
    this.#mode = value;
  }

  isEdit: boolean = $derived(this.mode instanceof EditMode);
  isOperate: boolean = $derived(this.mode instanceof OperateMode);

  curTool: CellTypes | null = $derived.by(() => {
    if (this.mode instanceof EditMode) return this.mode.selectedTool;
    return null;
  });


  cellSize: number = $state() as number;
  rows: number = $state() as number;
  columns: number = $state() as number;

  constructor(rows: number, cols: number, cellSize: number) {
    this.rows = rows;
    this.columns = cols;
    this.cellSize = cellSize;
  }

  isCell(x: number, y: number): boolean {
    return this.cells.has(convertCoordinatesToString(x, y));
  }

  getCell(x: number, y: number): Cell | undefined {
    return this.cells.get(convertCoordinatesToString(x, y));
  }
  getSelectedCell(): Cell | undefined {
    if (this.selectedCell != null) {
      return this.cells.get(convertCoordinatesToString(this.selectedCell.x, this.selectedCell.y));
    }
    return undefined;
  }

  addCell(x: number, y: number, cell: Cell) {
    this.cells.set(convertCoordinatesToString(x, y), cell);
  }

  selectCell(x: number, y: number) {
    this.selectedCell = { x, y }
  }

  expandGrid(cols: number, rows: number) {
    this.columns = cols;
    this.rows = rows;
  }

  setTool(tool: CellTypes | null) {
    if (this.mode instanceof EditMode) this.mode.selectedTool = tool;
  }

  getTool(tool: CellTypes | null): boolean {
    return this.getCurTool() == tool;
  }
  getCurTool(): CellTypes | null {
    if (this.mode instanceof EditMode) return this.mode.selectedTool;
    return null;
  }

  // We need a type guard function
  isEditMode(): this is { mode: EditMode } {
    return this.mode instanceof EditMode
  }
  isOperateMode(): this is { mode: OperateMode } {
    return this.mode instanceof OperateMode
  }

  rotateCellRight(cell: Cell | undefined) {
    if (cell != undefined && cell.type != null) {
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

  rotateCellLeft(cell: Cell | undefined) {
    if (cell != undefined && cell.type != null) {
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

  setRotation(rotation: Rotation) {
    if (this.mode instanceof EditMode) {
      this.mode.selRotation = rotation;
    }
  }
}


export const gStore: GridState = new GridState(30, 50, 40);

// function createGridStore(grid: Grid) {

//   const { subscribe, update, set } = writable(initialState);

//   function isCell(x: number, y: number): boolean {
//     return initialState.cells.has(convertCoordinatesToString(x, y));
//   }
//   function getCell(x: number, y: number): Cell | undefined {
//     return initialState.cells.get(convertCoordinatesToString(x, y));
//   }

//   function addCell(x: number, y: number, cell: Cell) {
//     update(grid => {
//       grid.cells.set(convertCoordinatesToString(x, y), cell);
//       return grid;
//     });
//   }

//   function selectCell(x: number, y: number) {
//     update(grid => {
//       grid.selectedCell = { x, y }
//       return grid;
//     });
//   }

//   function expandGrid(cols: number, rows: number) {
//     update(grid => {
//       grid.columns = cols;
//       grid.rows = rows;
//       return grid;
//     });
//   }

//   function changeMode(mode: EditMode | OperateMode) {
//     update(grid => {
//       grid.mode = mode;
//       return grid;
//     });
//   }


//   function setTool(tool: CellTypes | null) {
//     update(grid => {
//       if (grid.mode instanceof EditMode) grid.mode.selectedTool = tool;
//       return grid;
//     });
//   }

//   function getTool(tool: CellTypes | null): boolean {
//     let selected = false;
//     update(grid => {
//       if (grid.mode instanceof EditMode) selected = grid.mode.selectedTool == tool;
//       return grid;
//     });

//     return selected;
//   }

//   function rotateCellRight(x: number, y: number) {
//     update(grid => {
//       let cell = getCell(x, y);

//       if (cell != undefined && cell.type != null) {
//         switch (cell.type.rotation) {
//           case 0:
//             cell.type.rotation = 45;
//             break;
//           case 45:
//             cell.type.rotation = 90;
//             break;
//           case 90:
//             cell.type.rotation = 135;
//             break;
//           case 135:
//             cell.type.rotation = 180;
//             break;
//           case 180:
//             cell.type.rotation = 225;
//             break;
//           case 225:
//             cell.type.rotation = 270;
//             break;
//           case 270:
//             cell.type.rotation = 315;
//             break;
//           case 315:
//             cell.type.rotation = 0;
//             break;
//         }

//         if (grid.mode instanceof EditMode) {
//           grid.mode.selRotation = cell.type.rotation
//         }
//       }
//       return grid;
//     });
//   }

//   function rotateCellLeft(x: number, y: number) {
//     update(grid => {
//       let cell = getCell(x, y);

//       if (cell != undefined && cell.type != null) {
//         switch (cell.type.rotation) {
//           case 0:
//             cell.type.rotation = 315;
//             break;
//           case 45:
//             cell.type.rotation = 0;
//             break;
//           case 90:
//             cell.type.rotation = 45;
//             break;
//           case 135:
//             cell.type.rotation = 90;
//             break;
//           case 180:
//             cell.type.rotation = 135;
//             break;
//           case 225:
//             cell.type.rotation = 180;
//             break;
//           case 270:
//             cell.type.rotation = 225;
//             break;
//           case 315:
//             cell.type.rotation = 270;
//             break;
//         }

//         if (grid.mode instanceof EditMode) {
//           grid.mode.selRotation = cell.type.rotation
//         }
//       }

//       return grid;
//     });
//   }

//   return {
//     subscribe,
//     getCell,
//     isCell,
//     addCell,
//     selectCell,
//     expandGrid,
//     changeMode,
//     setTool,
//     getTool,
//     rotateCellLeft,
//     rotateCellRight,
//     resetGrid: () => set(initialState),
//   };
// }

// export const gridStore = createGridStore(initialState);
