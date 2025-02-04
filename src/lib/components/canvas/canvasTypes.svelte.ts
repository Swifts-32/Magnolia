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

export type Rotation = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

export interface Track {
  rotation: Rotation
  DrawPath(x: number, y: number, cellSize: number, ctx: CanvasRenderingContext2D): void;
}

export interface Turnout extends Track {
  validStates: number; // e.g. Point = 2, Three way = 3, Wye = 2
  state: number | null;
  name: string;
  id: number;
}

export class Straight implements Track {
  rotation: Rotation;

  constructor(rotation: Rotation) {
    this.rotation = rotation;
  }

  DrawPath(x: number, y: number, cellSize: number, ctx: CanvasRenderingContext2D): void {
    let path: string = "";

    x = x * cellSize;
    y = y * cellSize;

    let half = cellSize * 0.5

    switch (this.rotation) {
      case 0:
      case 180:
        path = `M${x + half} ${y} L${x + half} ${y + cellSize}`;
        break;
      case 45:
      case 225:
        path = `M${x + cellSize} ${y} L${x} ${y + cellSize}`;
        break;
      case 90:
      case 270:
        path = `M${x} ${y + half} L${x + cellSize} ${y + half}`;
        break;
      case 135:
      case 315:
        path = `M${x} ${y} L${x + cellSize} ${y + cellSize}`;
        break;
    }

    let path2D = new Path2D(path);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    ctx.stroke(path2D);
  }
}

export class Curve implements Track {
  rotation: Rotation;

  constructor(rotation: Rotation) {
    this.rotation = rotation;
  }

  DrawPath(x: number, y: number, cellSize: number, ctx: CanvasRenderingContext2D): void {
    let path: string = "";

    x = x * cellSize;
    y = y * cellSize;

    const half = cellSize / 2;
    let center = ` L${x + half} ${y + half}`;

    switch (this.rotation) {
      case 0:
        path = `M${x + half} ${y} ${center} l${half} ${half}`;
        break;
      case 45:
        path = `M${x + cellSize} ${y} ${center} l0 ${half}`;
        break;
      case 90:
        path = `M${x + cellSize} ${y + half}  ${center} l${-half} ${half}`;
        break;
      case 135:
        path = `M${x + cellSize} ${y + cellSize}  ${center} l${-half} 0`;
        break;
      case 180:
        path = `M${x + half} ${y + cellSize}  ${center} l${-half} ${-half}`;
        break;
      case 225:
        path = `M${x} ${y + cellSize}  ${center} l0 ${-half}`;
        break;
      case 270:
        path = `M${x} ${y + half}  ${center} l${half} ${-half}`;
        break;
      case 315:
        path = `M${x} ${y} ${center} l${half} 0`;
        break;
    }

    let path2D = new Path2D(path);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    ctx.stroke(path2D);
  }
}

export class Buffer implements Track {
  rotation: Rotation;

  constructor(rotation: Rotation) {
    this.rotation = rotation;
  }

  DrawPath(x: number, y: number, cellSize: number, ctx: CanvasRenderingContext2D): void {
    let path: string = "";

    x = x * cellSize;
    y = y * cellSize;

    const quarter = cellSize / 4;
    const half = cellSize / 2;
    const third = cellSize / 3;
    const third2 = third * 2;

    // Buffer Track
    switch (this.rotation) {
      case 0:
        path = `M${x + half} ${y} v${third2}`;
        break;
      case 45:
        path = `M${x + half} ${y + half} l${half} ${-half}`;
        break;
      case 90:
        path = `M${x + third} ${y + half} h${third2}`;
        break;
      case 135:
        path = `M${x + half} ${y + half} l${half} ${half}`;
        break;
      case 180:
        path = `M${x + half} ${y + third} v${third2}`;
        break;
      case 225:
        path = `M${x + half} ${y + half} l${-half} ${half}`;
        break;
      case 270:
        path = `M${x} ${y + half} h${third2}`;
        break;
      case 315:
        path = `M${x} ${y} l${half} ${half}`;
        break;

    }

    let path2D = new Path2D(path);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    ctx.stroke(path2D);

    // Buffer Beam
    switch (this.rotation) {

      case 0:
        path = `M${x + quarter} ${y + third2} h${half}`;
        break;
      case 45:
      case 225:
        path = `M${x + third} ${y + third} l${third} ${third}`;
        break;
      case 90: // 90
        path = `M${x + third} ${y + quarter} v${half}`;
        break;
      case 135:
      case 315:
        path = `M${x + third2} ${y + third} l${-third} ${third}`;
        break;
      case 180:
        path = `M${x + quarter} ${y + third} h${half}`;
        break;
      case 270:
        path = `M${x + third2} ${y + quarter} v${half}`;
        break;
    }

    path2D = new Path2D(path);
    ctx.strokeStyle = "#bf0000";
    ctx.lineWidth = 4;

    ctx.stroke(path2D);
  }
}


export class Turnout implements Turnout {
  thrown: boolean | null;
  name: string;
  id: number;

  constructor(thrown: boolean | null, name: string, id: number) {
    this.id = id;
    this.thrown = thrown,
      this.name = name;
  }

  DrawPath(x: number, y: number, cellSize: number): string {
    return "";
  }
}

export type Edit = {
  name: string;
}

export class EditMode {
  selectedTool: CellTypes | null = $state(null);
  selRotation: Rotation = $state(90);

  constructor(selectedTool: CellTypes | null, rotation: Rotation) {
    this.selectedTool = selectedTool;
    this.selRotation = rotation;
  }
}

export class OperateMode {
  constructor() { }
}

export interface Cell {
  type: Straight | Curve | Buffer | Turnout | null;
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