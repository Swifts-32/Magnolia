<script lang="ts">
  import {
    Bell,
    Lightbulb,
    Sun,
    TextAlignStart,
    Trash,
    Volume2,
  } from "@lucide/svelte";
  import { Checkbox } from "#lib/components/ui/checkbox/index.js";
  import * as ToggleGroup from "#lib/components/ui/toggle-group/index.js";
  import type { TrainFunction } from "#lib/types/TrainFunctions.ts";
  import Label from "#lib/components/ui/label/label.svelte";
  import Input from "#lib/components/ui/input/input.svelte";
  import Button from "#lib/components/ui/button/button.svelte";

  interface Props {
    funct: TrainFunction;
    ondelete?: () => void;
  }

  let { funct = $bindable(), ondelete }: Props = $props();
</script>

<div class="flex-col flex gap-4 w-full max-w-none">
  <div class="grid grid-cols-4 items-center gap-4">
    <Label id="funct-name" class="text-right">Name</Label>
    <div class="col-span-3">
      <Input id="funct-name" bind:value={funct.name} />
    </div>
  </div>

  <div class="grid grid-cols-4 items-center gap-4">
    <Label id="funct-value" class="text-right">Value</Label>
    <div class="col-span-3">
      <Input id="funct-value" bind:value={funct.value} />
    </div>
  </div>

  <div class="grid grid-cols-4 items-center gap-4">
    <Label id="funct-icon" class="text-right">Icon</Label>
    <div class="col-span-3">
      <ToggleGroup.Root
        id="funct-icon"
        type="single"
        variant="outline"
        bind:value={funct.icon}
      >
        <ToggleGroup.Item value="Bell"><Bell /></ToggleGroup.Item>
        <ToggleGroup.Item value="Speaker"><Volume2 /></ToggleGroup.Item>
        <ToggleGroup.Item value="Light1"><Lightbulb /></ToggleGroup.Item>
        <ToggleGroup.Item value="Light2"><Sun /></ToggleGroup.Item>
        <ToggleGroup.Item value="Text"><TextAlignStart /></ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  </div>

  <div class="flex gap-4 justify-center w-full">
    <div class="flex gap-2">
      <Label id="funct-mode" class="text-right">Mode</Label>
      <Checkbox
        id="funct-mode"
        bind:checked={
          () => funct.mode === "Toggle",
          (v) => (v ? (funct.mode = "Toggle") : (funct.mode = "Select"))
        }
      />
    </div>

    <div class="flex gap-2">
      <Label id="funct-visible" class="text-right">Visible</Label>
      <Checkbox
        id="funct-visible"
        bind:checked={funct.visible}
        class="text-red-600"
      />
    </div>
  </div>

  <div class="flex justify-center py-4">
    <Button variant="destructive" size="lg" class="w-full" onclick={ondelete}>
      Delete Function
      <Trash class="text-red-800" />
    </Button>
  </div>
</div>
