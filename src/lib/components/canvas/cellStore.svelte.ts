import { CellTypes, convertCoordinatesToString, EditMode, OperateMode, type Cell, type Grid, type Rotation } from './canvasTypes.svelte';

type Modes = EditMode | OperateMode;

export class GridState {
  public cells: Map<string, Cell> = new Map();
  public selectedCell: { x: number, y: number } | null = $state(null);

  private _mode: Modes = $state(new EditMode(null, "90"));
  public get mode(): Modes {
    return this._mode;
  }
  public set mode(value: Modes) {
    this._mode = value;
  }

  curTool: CellTypes | null = $derived.by(() => {
    if (this.mode instanceof EditMode) return this.mode.selectedTool;
    return null;
  });


  public cellSize: number = $state() as number;
  public rows: number = $state() as number;
  public columns: number = $state() as number;

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

  removeCell(x: number, y: number) {
    this.cells.delete(convertCoordinatesToString(x, y));
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
}


export const gStore: GridState = new GridState(30, 50, 40);