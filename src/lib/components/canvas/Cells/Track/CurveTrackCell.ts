import { RotationValues, type Cell, type Rotation, } from "../../canvasTypes.svelte";


export class CurveTrackCell implements Cell {
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

    const half = cellSize / 2;
    let center = ` L${x + half} ${y + half}`;

    switch (this.rotation) {
      case "0":
        path = `M${x + half} ${y} ${center} l${half} ${half}`;
        break;
      case "45":
        path = `M${x + cellSize} ${y} ${center} l0 ${half}`;
        break;
      case "90":
        path = `M${x + cellSize} ${y + half}  ${center} l${-half} ${half}`;
        break;
      case "135":
        path = `M${x + cellSize} ${y + cellSize}  ${center} l${-half} 0`;
        break;
      case "180":
        path = `M${x + half} ${y + cellSize}  ${center} l${-half} ${-half}`;
        break;
      case "225":
        path = `M${x} ${y + cellSize}  ${center} l0 ${-half}`;
        break;
      case "270":
        path = `M${x} ${y + half}  ${center} l${half} ${-half}`;
        break;
      case "315":
        path = `M${x} ${y} ${center} l${half} 0`;
        break;
    }

    let path2D = new Path2D(path);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    ctx.stroke(path2D);
  }
}