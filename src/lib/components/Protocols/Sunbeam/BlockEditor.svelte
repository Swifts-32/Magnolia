<script lang="ts">
  interface Block {
    uuid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    status: string;
  }

  interface Props {
    baseUrl: string;
    blocks: Block[];
    onBlocksUpdated?: () => void;
  }

  let { baseUrl, blocks, onBlocksUpdated }: Props = $props();

  // State
  let imageElement = $state<HTMLImageElement | null>(null);
  let canvasElement = $state<HTMLCanvasElement | null>(null);

  // Interaction states
  let activeAction = $state<"none" | "create" | "move" | "resize">("none");
  let activeBlockUuid = $state<string | null>(null);

  // Dragging coordinates
  let startX = $state(0);
  let startY = $state(0);
  let currentX = $state(0);
  let currentY = $state(0);

  // Temporary holding for the block being modified
  let initialBlockBox = $state({ x: 0, y: 0, width: 0, height: 0 });

  const streamUrl = $derived(`${baseUrl}/raw-video`);

  // Sync canvas internal resolution with the image's actual natural resolution
  function syncCanvasSize() {
    if (!canvasElement || !imageElement) return;
    if (imageElement.naturalWidth && imageElement.naturalHeight) {
      canvasElement.width = imageElement.naturalWidth;
      canvasElement.height = imageElement.naturalHeight;
      drawCanvas();
    }
  }

  // Redraw canvas whenever blocks or interaction state changes
  $effect(() => {
    blocks;
    activeBlockUuid;
    currentX;
    currentY;
    drawCanvas();
  });

  function getScaledCoordinates(event: MouseEvent) {
    if (!canvasElement || !imageElement) return { x: 0, y: 0 };
    const rect = canvasElement.getBoundingClientRect();
    const scaleX = imageElement.naturalWidth / rect.width || 1;
    const scaleY = imageElement.naturalHeight / rect.height || 1;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function handleMouseDown(event: MouseEvent) {
    const coords = getScaledCoordinates(event);
    startX = coords.x;
    startY = coords.y;
    currentX = coords.x;
    currentY = coords.y;

    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      const handleSize = 10;

      const hx = b.x + b.width;
      const hy = b.y + b.height;
      if (
        Math.abs(coords.x - hx) <= handleSize &&
        Math.abs(coords.y - hy) <= handleSize
      ) {
        activeAction = "resize";
        activeBlockUuid = b.uuid;
        initialBlockBox = { x: b.x, y: b.y, width: b.width, height: b.height };
        return;
      }

      if (
        coords.x >= b.x &&
        coords.x <= b.x + b.width &&
        coords.y >= b.y &&
        coords.y <= b.y + b.height
      ) {
        activeAction = "move";
        activeBlockUuid = b.uuid;
        initialBlockBox = { x: b.x, y: b.y, width: b.width, height: b.height };
        return;
      }
    }

    activeAction = "create";
    activeBlockUuid = null;
  }

  function handleMouseMove(event: MouseEvent) {
    if (activeAction === "none") return;
    const coords = getScaledCoordinates(event);
    currentX = coords.x;
    currentY = coords.y;
  }

  async function handleMouseUp() {
    if (activeAction === "none") return;

    const dx = currentX - startX;
    const dy = currentY - startY;

    if (activeAction === "create") {
      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      if (width > 10 && height > 10) {
        await createBlock(x, y, width, height);
      }
    } else if (activeAction === "move" && activeBlockUuid) {
      const newX = initialBlockBox.x + dx;
      const newY = initialBlockBox.y + dy;

      blocks = blocks.map((b) =>
        b.uuid === activeBlockUuid ? { ...b, x: newX, y: newY } : b,
      );

      await updateBlock(
        activeBlockUuid,
        newX,
        newY,
        initialBlockBox.width,
        initialBlockBox.height,
      );
    } else if (activeAction === "resize" && activeBlockUuid) {
      const newWidth = Math.max(20, initialBlockBox.width + dx);
      const newHeight = Math.max(20, initialBlockBox.height + dy);

      blocks = blocks.map((b) =>
        b.uuid === activeBlockUuid
          ? { ...b, width: newWidth, height: newHeight }
          : b,
      );

      await updateBlock(
        activeBlockUuid,
        initialBlockBox.x,
        initialBlockBox.y,
        newWidth,
        newHeight,
      );
    }

    activeAction = "none";
    activeBlockUuid = null;
    onBlocksUpdated?.();
  }

  async function createBlock(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    try {
      await fetch(`${baseUrl}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: Math.round(x),
          y: Math.round(y),
          width: Math.round(width),
          height: Math.round(height),
        }),
      });
    } catch (err) {
      console.error("Failed to create block", err);
    }
  }

  async function updateBlock(
    uuid: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    try {
      const res = await fetch(`${baseUrl}/blocks/${uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: Math.round(x),
          y: Math.round(y),
          width: Math.round(width),
          height: Math.round(height),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }
    } catch (err) {
      console.error("Failed to update block", err);
      onBlocksUpdated?.();
    }
  }

  function drawCanvas() {
    if (!canvasElement || !imageElement) return;
    const ctx = canvasElement.getContext("2d");
    if (!ctx) return;

    // Ensure internal resolution matches image natural dimensions before drawing
    if (
      imageElement.naturalWidth &&
      imageElement.naturalHeight &&
      (canvasElement.width !== imageElement.naturalWidth ||
        canvasElement.height !== imageElement.naturalHeight)
    ) {
      canvasElement.width = imageElement.naturalWidth;
      canvasElement.height = imageElement.naturalHeight;
    }

    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    blocks.forEach((b) => {
      const isSelected = b.uuid === activeBlockUuid;

      let rx = b.x;
      let ry = b.y;
      let rw = b.width;
      let rh = b.height;

      if (isSelected) {
        const dx = currentX - startX;
        const dy = currentY - startY;
        if (activeAction === "move") {
          rx = initialBlockBox.x + dx;
          ry = initialBlockBox.y + dy;
        } else if (activeAction === "resize") {
          rw = Math.max(20, initialBlockBox.width + dx);
          rh = Math.max(20, initialBlockBox.height + dy);
        }
      }

      ctx.strokeStyle = isSelected ? "#3b82f6" : "#00FF00";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.fillStyle = isSelected
        ? "rgba(59, 130, 246, 0.2)"
        : "rgba(0, 255, 0, 0.1)";
      ctx.fillRect(rx, ry, rw, rh);

      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(rx + rw - 5, ry + rh - 5, 10, 10);
    });

    if (activeAction === "create") {
      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "rgba(234, 179, 8, 0.15)";
      ctx.fillRect(x, y, width, height);
    }
  }
</script>

<div class="video-editor-container">
  <img
    bind:this={imageElement}
    src={streamUrl}
    alt="Sunbeam Raw Stream"
    class="stream-img"
    onloadeddata={syncCanvasSize}
    onloadedmetadata={syncCanvasSize}
  />
  <canvas
    bind:this={canvasElement}
    class="overlay-canvas"
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
  ></canvas>
</div>

<style>
  .video-editor-container {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 640px;
    user-select: none;
  }
  .stream-img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .overlay-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
  }
</style>
