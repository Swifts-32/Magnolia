export enum Modes {
  Edit,
  Operate,
}
export enum MouseMoving {
  Dragging, // Drawing some track
  Viewing, // Moving Grid e.g. Shift Down
  None, // not moving
}

export enum CellTypes {
  straight = 1,
  curve = 2,
  buffer = 3,
  delete = 0,
  block = 10,
  turnout = 11,
}

export type Rotation = "0" | "45" | "90" | "135" | "180" | "225" | "270" | "315";
export const RotationValues = ["0", "45", "90", "135", "180", "225", "270", "315"] as const;

export type Edit = {
  name: string;
}

export class EditMode {
  selectedTool: CellTypes | null = $state(null);
  selRotation: Rotation = $state("90");

  constructor(selectedTool: CellTypes | null, rotation: Rotation) {
    this.selectedTool = selectedTool;
    this.selRotation = rotation;
  }
}

export class OperateMode {
  constructor() { }
}

export interface Cell {
  rotation: Rotation;
  rotateLeft(): void;
  rotateRight(): void;
  DrawPath(x: number, y: number, cellSize: number, ctx: CanvasRenderingContext2D): void;
}

export interface Grid {
  cells: Map<string, Cell>;
  cellSize: number;
  columns: number;
  rows: number;
  selectedCell: { x: number, y: number } | null,
  mode: EditMode | OperateMode;
}

export class Drawing {
  startX: number;
  startY: number;
  curX: number;
  curY: number;

  constructor(startX: number, startY: number) {
    this.startX = startX;
    this.startY = startY;
    this.curX = startX,
      this.curY = startY;
  }
}

export function convertCoordinatesToString(x: number, y: number): string {
  return `${x},${y}`;
}
export function convertCoordinatesToNumber(coordinate: string): { x: number, y: number } {
  const [xStr, yStr] = coordinate.split(',').map(Number);
  return { x: xStr, y: yStr };
}