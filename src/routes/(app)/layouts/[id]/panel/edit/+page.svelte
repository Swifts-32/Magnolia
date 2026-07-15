<script lang="ts">
    import {
        CellTypes,
        EditMode,
    } from "$lib/components/canvas/canvasTypes.svelte";
    import { gStore } from "$lib/components/canvas/cellStore.svelte";
    import ToolbarTools from "$lib/components/canvas/Toolbar/ToolbarTools.svelte";
    import ToolbarButton from "$lib/components/canvas/ToolbarButton.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import {
        ClipboardPaste,
        Copy,
        Redo2,
        RotateCcw,
        RotateCw,
        Scissors,
        Trash2,
        Undo2,
    } from "@lucide/svelte";

    function handleRotateLeft() {
        const cell = gStore.getSelectedCell();
        if (!cell) return;

        cell.rotateLeft();

        if (gStore.mode instanceof EditMode) {
            gStore.mode.selRotation = cell.rotation;
        }
    }

    function handleRotateRight() {
        const cell = gStore.getSelectedCell();
        if (!cell) return;

        cell.rotateRight();

        if (gStore.mode instanceof EditMode) {
            gStore.mode.selRotation = cell.rotation;
        }
    }
</script>

<Separator orientation="vertical" />

<!-- Clipboard -->
<ToolbarTools name="" rows={3}>
    <Button class="size-8" size="icon"><Scissors size={20} /></Button>
    <Button class="size-8" size="icon"><Copy size={20} /></Button>
    <Button class="size-8" size="icon"><ClipboardPaste size={20} /></Button>
</ToolbarTools>

<Separator orientation="vertical" />

<!-- Edit -->
<ToolbarTools name="Edit">
    <div class="flex gap-2">
        <Button size="icon">
            <Undo2 />
        </Button>
        <Button size="icon">
            <Redo2 />
        </Button>

        <Button size="icon" onclick={handleRotateLeft}>
            <RotateCcw />
        </Button>
        <Button size="icon" onclick={handleRotateRight}>
            <RotateCw />
        </Button>
    </div>
    <ToolbarButton
        cellType={CellTypes.delete}
        size="icon"
        class="bg-destructive hover:bg-destructive/90"
    >
        <Trash2 />
    </ToolbarButton>
</ToolbarTools>

<Separator orientation="vertical" />

<!-- Track -->
<ToolbarTools name="Track">
    <!-- Straight -->
    <ToolbarButton name="Straight" cellType={CellTypes.straight}>
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                y2="30"
                x2="30"
                y1="10"
                x1="10"
                stroke-width="4"
                stroke="#005fbf"
                fill="none"
            />
        </svg>
    </ToolbarButton>

    <!-- Curve -->
    <ToolbarButton name="Curve" cellType={CellTypes.curve}>
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                id="svg_1"
                d="m5,27.5l18,0l10,-15"
                stroke-width="4"
                stroke="#005fbf"
                fill="none"
            />
        </svg>
    </ToolbarButton>

    <!-- Buffer -->
    <ToolbarButton name="Buffer" cellType={CellTypes.buffer}>
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                y2="20"
                x2="30"
                y1="20"
                x1="5"
                stroke-width="4"
                stroke="#005fbf"
                fill="none"
            />
            <line
                y2="30"
                x2="30"
                y1="10"
                x1="30"
                stroke-width="6"
                stroke="#bf0000"
                fill="none"
            />
        </svg>
    </ToolbarButton>
</ToolbarTools>

<Separator orientation="vertical" />

<!-- Turnouts -->
<ToolbarTools name="Turnouts">
    <!-- Left turnout -->
    <Button size="sm" class="w-48 pl-1 flex justify-start">
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="5"
                y1="25"
                x2="35"
                y2="25"
            />
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="15"
                y1="25"
                x2="35"
                y2="15"
            />
        </svg>
        Left-Hand Turnout
    </Button>

    <!-- Right turnout -->
    <Button size="sm" class="w-48 pl-1 flex justify-start">
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="5"
                y1="15"
                x2="35"
                y2="15"
            />
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="15"
                y1="15"
                x2="35"
                y2="25"
            />
        </svg>
        Right-Hand Turnout
    </Button>

    <!-- Three way turnout -->
    <Button size="sm" class="w-48 pl-1 flex justify-start">
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="5"
                y1="20"
                x2="35"
                y2="20"
            />
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="15"
                y1="20"
                x2="35"
                y2="30"
            />
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="15"
                y1="20"
                x2="35"
                y2="10"
            />
        </svg>
        Three-Way Turnout
    </Button>

    <!-- Wye turnout -->
    <Button size="sm" class="w-48 pl-1 flex justify-start">
        <svg
            width="40"
            height="40"
            class="mr-2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                stroke="#005fbf"
                fill="none"
                stroke-width="4"
                x1="5"
                y1="20"
                x2="20"
                y2="20"
            />
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="20"
                y1="20"
                x2="35"
                y2="30"
            />
            <line
                fill="none"
                stroke="#005fbf"
                stroke-width="4"
                x1="20"
                y1="20"
                x2="35"
                y2="10"
            />
        </svg>
        Wye Turnout
    </Button>
</ToolbarTools>

<Separator orientation="vertical" />
