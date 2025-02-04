<script lang="ts">
  import { onMount } from "svelte";
  import {
    MouseMoving,
    Straight,
    type Cell,
    CellTypes,
    Buffer,
    Turnout,
    Curve,
    convertCoordinatesToNumber,
    EditMode,
  } from "./canvasTypes.svelte";
  import { gStore } from "./cellStore.svelte";
  import * as Dialog from "$lib/components/ui/dialog";

  let canvas: HTMLCanvasElement | null = $state(null);
  let ctx: CanvasRenderingContext2D | null = null;

  // Zoom
  const scaleIncrement: number = 0.05; // 5% Increments
  const minScale: number = 0.75; // 75% of orginal size
  const maxScale: number = 1.5; // 300% of original size
  let curScale: number = $state(1);

  let offsetX: number = 0;
  let offsetY: number = 0;

  let mouseX: number = $state(0);
  let mouseY: number = $state(0);
  let lastMouseX: number = 0;
  let lastMouseY: number = 0;

  let dragging: MouseMoving = MouseMoving.None; // Mouse not moving

  let dialogOpen = $state(false);

  $effect(() => {
    if (gStore.isEdit) {
      updateGrid();
    }
    else {
      updateGrid();
    }
  });
  $effect(() => {
    if ((gStore.isEditMode() && gStore.mode.selRotation)) {
      updateGrid();
    }
    else {
      updateGrid();
    }
  });

  function updateGrid() {
    updateCanvasSize();

    if (ctx != null && canvas != null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(curScale, curScale);
      ctx.translate(offsetX, offsetY);

      // Draw Grid
      gStore.isEditMode() && drawGrid();

      // Highlight selected cell
      if (gStore.selectedCell != null && gStore.isEditMode()) {
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

      // Draw Track
      gStore.cells.forEach((cell, coordinates) => {
        const { x, y } = convertCoordinatesToNumber(coordinates);

        if (cell.type && ctx) {
          cell.type.DrawPath(x, y, gStore.cellSize, ctx);
        }
      });

      ctx.restore();
    }
  }

  function drawGrid() {
    if (ctx != null) {
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 1.1;

      for (let i = 0; i <= gStore.columns; i++) {
        for (let j = 0; j <= gStore.rows; j++) {
          const x = i * gStore.cellSize + 0.5; // Snap to nearest pixel
          const y = j * gStore.cellSize + 0.5; // Snap to nearest pixel

          ctx.strokeRect(x, y, gStore.cellSize, gStore.cellSize);
        }
      }
    }
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

    offsetX += mouseX * (newScale - curScale);
    offsetY += mouseY * (newScale - curScale);
    curScale = newScale;

    updateCanvasSize();
    clampCanvasOffset();
    updateGrid();
  }

  function handleClick(event: MouseEvent) {
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();

      // Transform the mouse coordinates into the grid's coordinate system
      const x = snapToGrid((event.clientX - rect.left) / curScale - offsetX);
      const y = snapToGrid((event.clientY - rect.top) / curScale - offsetY);

      // Select the cell
      gStore.selectCell(x, y);

      const isOperateMode = gStore.isOperateMode();

      if (isOperateMode) {
        // Operating Mode
        // TODO Edit Cell Properties e.g. Switch Point
      } else if (gStore.isEditMode()) {
        // Edit Mode
        console.log("Edit Mode CLick");
        // Assign Clicked cell the current tool
        if (gStore.mode.selectedTool != null) {
          const cell: Cell = {
            type: null,
          };

          const rotation = gStore.mode.selRotation;

          switch (gStore.mode.selectedTool) {
            case CellTypes.delete:
              cell.type = null;
              break;

            case CellTypes.straight:
              cell.type = new Straight(rotation);
              break;
            case CellTypes.curve:
              cell.type = new Curve(rotation);
              break;
            case CellTypes.buffer:
              cell.type = new Buffer(rotation);
              break;

            case CellTypes.turnout:
              cell.type = new Turnout(false, "Unnamed Turnout", 0);
              break;
          }

          gStore.addCell(x, y, cell);
        }
      }

      updateGrid();
    }
  }

  function calculateMousePositions(event: MouseEvent) {
    if (canvas) {
      const rect = canvas.getBoundingClientRect();

      mouseX = snapToGrid((event.clientX - rect.left) / curScale - offsetX);
      mouseY = snapToGrid((event.clientY - rect.left) / curScale - offsetY);
    }
  }

  function handleMouseDown(event: MouseEvent) {
    calculateMousePositions(event);

    if (event.shiftKey) {
      // Pan or Zoom
      dragging = MouseMoving.Viewing;

      lastMouseX = mouseX * gStore.cellSize;
      lastMouseY = mouseY * gStore.cellSize;
    } else if (gStore.isEditMode()) {
      // Edit mode
      dragging = MouseMoving.Dragging;
      handleClick(event);
    }
  }

  function handleMouseMove(event: MouseEvent) {
    calculateMousePositions(event);

    if (dragging == MouseMoving.Viewing) {
      // Clamp Offsets

      const canvasMouseX = mouseX * gStore.cellSize;
      const canvasMouseY = mouseY * gStore.cellSize;

      offsetX += canvasMouseX - lastMouseX;
      offsetY -= canvasMouseY - lastMouseY;

      clampCanvasOffset();

      lastMouseX = canvasMouseX;
      lastMouseY = canvasMouseY;

      updateGrid();
    } else if (gStore.isEditMode() && dragging == MouseMoving.Dragging) {
      // Drag some track
      console.log("Handling Click");
      handleClick(event);
    }
  }

  // Return top left of cell
  function snapToGrid(value: number): number {
    // TODO Fix rounding so that cells are accurate
    return Math.round(value / gStore.cellSize);
  }

  function handleMouseUp() {
    dragging = MouseMoving.None;
  }

  function updateCanvasSize() {
    if (canvas) {
      canvas.width = gStore.columns * gStore.cellSize * curScale;
      canvas.height = gStore.rows * gStore.cellSize * curScale;
    }
  }

  function clampCanvasOffset() {
    if (canvas) {
      const parentElement = canvas.parentElement;

      if (parentElement) {
        const maxOffsetX = canvas.width - parentElement.clientWidth;
        const maxOffsetY = canvas.height - parentElement.clientHeight;

        offsetX = Math.min(0, Math.max(offsetX, -maxOffsetX));
        offsetY = Math.min(0, Math.max(offsetY, maxOffsetY));
      }
    }
  }

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext("2d");
      updateGrid();
    }
  });


  // Only open dialog on editable cells
  function handleDoubleClick(event: MouseEvent) {
    event.preventDefault();

    if (gStore.isEditMode() && gStore.selectedCell) {
      const {x, y} = gStore.selectedCell;
      const cell = gStore.getCell(x,y);
      if (cell) {
        if (cell.type instanceof Turnout) {
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
    <p class="text-sm">X: {mouseX}</p>
    <p class="text-sm">Y: {mouseY}</p>
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
