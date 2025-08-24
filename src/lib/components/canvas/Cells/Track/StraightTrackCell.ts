import { RotationValues, type Cell, type Rotation, } from "../../canvasTypes.svelte";


export class StraightTrackCell implements Cell {
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

    let half = cellSize * 0.5

    switch (this.rotation) {
      case "0":
      case "180":
        path = `M${x + half} ${y} L${x + half} ${y + cellSize}`;
        break;
      case "45":
      case "225":
        path = `M${x + cellSize} ${y} L${x} ${y + cellSize}`;
        break;
      case "90":
      case "270":
        path = `M${x} ${y + half} L${x + cellSize} ${y + half}`;
        break;
      case "135":
      case "315":
        path = `M${x} ${y} L${x + cellSize} ${y + cellSize}`;
        break;
    }

    let path2D = new Path2D(path);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    ctx.stroke(path2D);
  }
}