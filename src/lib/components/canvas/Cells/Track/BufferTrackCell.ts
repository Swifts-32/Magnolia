import { RotationValues, type Cell, type Rotation, } from "../../canvasTypes.svelte";


export class BufferTrackCell implements Cell {
  public rotation: Rotation = "0";

  constructor(rotation: Rotation) {
    this.rotation = rotation;
  }

  // Rotate left (counterclockwise)
  rotateLeft(): void {
    const currentIndex = RotationValues.indexOf(this.rotation);
    const newIndex = (currentIndex - 1 + RotationValues.length) % RotationValues.length;
    this.rotation = RotationValues[newIndex];
  }

  // Rotate right (clockwise)
  rotateRight(): void {
    const currentIndex = RotationValues.indexOf(this.rotation);
    const newIndex = (currentIndex + 1) % RotationValues.length;
    this.rotation = RotationValues[newIndex];
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
      case "0":
        path = `M${x + half} ${y} v${third2}`;
        break;
      case "45":
        path = `M${x + half} ${y + half} l${half} ${-half}`;
        break;
      case "90":
        path = `M${x + third} ${y + half} h${third2}`;
        break;
      case "135":
        path = `M${x + half} ${y + half} l${half} ${half}`;
        break;
      case "180":
        path = `M${x + half} ${y + third} v${third2}`;
        break;
      case "225":
        path = `M${x + half} ${y + half} l${-half} ${half}`;
        break;
      case "270":
        path = `M${x} ${y + half} h${third2}`;
        break;
      case "315":
        path = `M${x} ${y} l${half} ${half}`;
        break;

    }

    let path2D = new Path2D(path);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    ctx.stroke(path2D);

    // Buffer Beam
    switch (this.rotation) {

      case "0":
        path = `M${x + quarter} ${y + third2} h${half}`;
        break;
      case "45":
      case "225":
        path = `M${x + third} ${y + third} l${third} ${third}`;
        break;
      case "90": // 90
        path = `M${x + third} ${y + quarter} v${half}`;
        break;
      case "135":
      case "315":
        path = `M${x + third2} ${y + third} l${-third} ${third}`;
        break;
      case "180":
        path = `M${x + quarter} ${y + third} h${half}`;
        break;
      case "270":
        path = `M${x + third2} ${y + quarter} v${half}`;
        break;
    }

    path2D = new Path2D(path);
    ctx.strokeStyle = "#bf0000";
    ctx.lineWidth = 4;

    ctx.stroke(path2D);
  }
}