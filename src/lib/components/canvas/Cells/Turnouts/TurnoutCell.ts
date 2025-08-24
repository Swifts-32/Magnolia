import { RotationValues, type Cell, type Rotation, } from "../../canvasTypes.svelte";


export class StraightTrackCell implements Cell {
  public rotation: Rotation = "0";

  public validStates: number = 2;
  public state: number | null = null;
  // Add the turnout UUID Reference

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

  }
}