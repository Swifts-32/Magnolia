<script lang="ts">
  import { onMount } from "svelte";
  import {
    MouseMoving,
    type Cell,
    CellTypes,
    convertCoordinatesToNumber,
    EditMode,
  } from "./canvasTypes.svelte";
  import { gStore } from "./cellStore.svelte";
  import * as Dialog from "#lib/components/ui/dialog/index.js";
    import { StraightTrackCell } from "./Cells/Track/StraightTrackCell";
    import { CurveTrackCell } from "./Cells/Track/CurveTrackCell";
    import { BufferTrackCell } from "./Cells/Track/BufferTrackCell";

  let canvas: HTMLCanvasElement | null = $state(null);
  let ctx: CanvasRenderingContext2D | null = null;

  // Zoom
  const scaleIncrement: number = 0.05; // 5% Increments
  const minScale: number = 0.75; // 75% of orginal size
  const maxScale: number = 1.5; // 300% of original size
  let curScale: number = $state(1);

  let offsetCanvasX: number = 0;
  let offsetCanvasY: number = 0;

  let lastMouseCanvasX: number = 0;
  let lastMouseCanvasY: number = 0;

  let mouseGridX: number = $state(0);
  let mouseGridY: number = $state(0);

  let dragging: MouseMoving = MouseMoving.None; // Mouse not moving

  let dialogOpen = $state(false);

  let animationFrameId: number | null = null;

  function requestCanvasUpdate() {
    if (animationFrameId !== null) return;

    animationFrameId = requestAnimationFrame(() => {
      updateCanvas();
      animationFrameId = null;
    });
  }

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext("2d");
      updateCanvas();
    }
  });

  $effect(() => {
    // Need to update on rotation
    // And mode change
    if (gStore.mode instanceof EditMode && gStore.mode.selRotation) {
      updateCanvas();
    } else {
      updateCanvas();
    }
  });

  function updateCanvas() {
    if (!ctx || !canvas) return;

    const desiredWidth = gStore.columns * gStore.cellSize * curScale;
    const desiredHeight = gStore.rows * gStore.cellSize * curScale;

    if (canvas.width !== desiredWidth) canvas.width = desiredWidth;
    if (canvas.height !== desiredHeight) canvas.height = desiredHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(curScale, curScale);
    ctx.translate(offsetCanvasX, offsetCanvasY);

    if (gStore.mode instanceof EditMode) {
      drawGrid();

      // Draw selected cell
      if (gStore.selectedCell != null) {
        const path = new Path2D();
        path.rect(
          gStore.selectedCell.x * gStore.cellSize,
          gStore.selectedCell.y * gStore.cellSize,
          gStore.cellSize,
          gStore.cellSize,
        );

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke(path);
      }
    }

    // Draw Track
    gStore.cells.forEach((cell, coordinates) => {
      const { x, y } = convertCoordinatesToNumber(coordinates);

      if (cell && ctx) {
        cell.DrawPath(x, y, gStore.cellSize, ctx);
      }
    });

    ctx.restore();
  }

  function drawGrid() {
    if (!ctx) return;
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 0.12;

    const path = new Path2D();

    for (let i = 0; i <= gStore.columns; i++) {
      for (let j = 0; j <= gStore.rows; j++) {
        const x = i * gStore.cellSize + 0.5; // Snap to nearest pixel
        const y = j * gStore.cellSize + 0.5; // Snap to nearest pixel

        path.rect(x, y, gStore.cellSize, gStore.cellSize);
      }
    }

    ctx.stroke(path);
  }

  function handleZoom(event: WheelEvent) {
    if (!event.shiftKey) return;
    event.preventDefault();

    const { offsetX: mouseX, offsetY: mouseY } = event;

    let newScale = curScale;

    if (event.deltaY > 0) {
      newScale -= scaleIncrement;
    } else {
      newScale += scaleIncrement;
    }

    // Constrain the scale to the defined limits
    newScale = Math.min(Math.max(newScale, minScale), maxScale);
    newScale = Number(newScale.toFixed(2));

    offsetCanvasX += mouseX * (newScale - curScale);
    offsetCanvasY += mouseY * (newScale - curScale);
    curScale = newScale;

    clampCanvasOffset();
    requestCanvasUpdate();
  }

  function handleClick(event: MouseEvent) {
    if (!canvas || !ctx) return;

    const [x, y] = calculateMouseGridPositions(event);
    if (x === undefined || y === undefined) return;

    // Select the cell
    gStore.selectCell(x, y);

    if (gStore.mode instanceof EditMode) {
      // Assign Clicked cell the current tool
      if (gStore.mode.selectedTool != null) {
        let cell: Cell | null = null;

        const rotation = gStore.mode.selRotation;

        switch (gStore.mode.selectedTool) {
          case CellTypes.delete:
            cell = null;
            break;

          case CellTypes.straight:
            cell = new StraightTrackCell(rotation);
            break;
          case CellTypes.curve:
            cell = new CurveTrackCell(rotation);
            break;
          case CellTypes.buffer:
            cell = new BufferTrackCell(rotation);
            break;
          default:
            console.log("Unknown cell type");
            break;
        }

        if (cell) {
          gStore.addCell(x, y, cell);
        }
        else {
          gStore.removeCell(x, y);
        }

      }
    }

    updateCanvas();
  }

  function calculateMouseGridPositions(
    event: MouseEvent,
  ): [number, number] | [undefined, undefined] {
    if (!canvas) return [undefined, undefined];

    const rect = canvas.getBoundingClientRect();

    const x = snapToGrid(
      (event.clientX - rect.left) / curScale - offsetCanvasX,
    );
    const y = snapToGrid((event.clientY - rect.top) / curScale - offsetCanvasY);

    return [x, y];
  }

  function handleMouseDown(event: MouseEvent) {
    const [x, y] = calculateMouseGridPositions(event);
    if (x === undefined || y === undefined) return;

    mouseGridX = x;
    mouseGridY = y;

    if (event.shiftKey) {
      // Canvas movement
      dragging = MouseMoving.Viewing;

      lastMouseCanvasX = mouseGridX * gStore.cellSize;
      lastMouseCanvasY = mouseGridY * gStore.cellSize;
    } else if (gStore.mode instanceof EditMode) {
      // Edit mode
      dragging = MouseMoving.Dragging;
      handleClick(event);
    }
  }

  function handleMouseMove(event: MouseEvent) {
    const [x, y] = calculateMouseGridPositions(event);
    if (x === undefined || y === undefined) return;
    mouseGridX = x;
    mouseGridY = y;

    if (dragging == MouseMoving.Viewing) {
      // Clamp Offsets

      const mouseCanvasX = mouseGridX * gStore.cellSize;
      const mouseCanvasY = mouseGridY * gStore.cellSize;

      offsetCanvasX += mouseCanvasX - lastMouseCanvasX;
      offsetCanvasY += mouseCanvasY - lastMouseCanvasY;

      clampCanvasOffset();

      lastMouseCanvasX = mouseCanvasX;
      lastMouseCanvasY = mouseCanvasY;

      requestCanvasUpdate();
      // updateCanvas();
    } else if (
      gStore.mode instanceof EditMode &&
      dragging == MouseMoving.Dragging
    ) {
      handleClick(event);
    }
  }

  // Return top left of cell
  function snapToGrid(value: number): number {
    return Math.floor(value / gStore.cellSize);
  }

  function handleMouseUp() {
    dragging = MouseMoving.None;
  }

  function clampCanvasOffset() {
    if (!canvas) return;

    const parentElement = canvas.parentElement;
    if (!parentElement) return;

    const maxOffsetX = canvas.width - parentElement.clientWidth;
    const maxOffsetY = canvas.height - parentElement.clientHeight;

    offsetCanvasX = Math.min(0, Math.max(offsetCanvasX, -maxOffsetX));
    offsetCanvasY = Math.max(0, Math.min(offsetCanvasY, maxOffsetY));
  }

  // Only open dialog on editable cells
  function handleDoubleClick(event: MouseEvent) {
    event.preventDefault();

    if (gStore.mode instanceof EditMode && gStore.selectedCell) {
      const { x, y } = gStore.selectedCell;
      const cell = gStore.getCell(x, y);
      if (cell) {
        if (cell instanceof StraightTrackCell) {
          dialogOpen = true;
        }
      }
    }
  }

  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
</script>

<main>
  <canvas
    bind:this={canvas}
    class="bg-gray-300"
    onwheel={handleZoom}
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseUp}
    ondblclick={handleDoubleClick}
    oncontextmenu={handleContextMenu}
  >
  </canvas>

  <div
    class="absolute flex gap-2 bottom-0 right-0 py-1 px-3 bg-gray-700 rounded-tl-md text-white"
  >
    <p class="text-sm">X: {mouseGridX}</p>
    <p class="text-sm">Y: {mouseGridY}</p>
    <p class="text-sm">Scale: {curScale}</p>
  </div>

  <Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content class="select-none">
      <Dialog.Header>
        <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
        <Dialog.Description>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>
</main>
