<script lang="ts">
  import { GripVertical, Plus } from "@lucide/svelte";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
  import { Button } from "#lib/components/ui/button/index.js";
  import {
    addTrainFunction,
    deleteTrainFunction,
    editTrainFunction,
    getTrainFunctions,
    setTrainFunctionPosition,
  } from "#lib/client/TrainFunctions.remote.js";
  import type { TrainFunction } from "#lib/server/db/schema/trains.js";
  import FunctionIcons from "./FunctionIcons.svelte";

  interface Props {
    trainId: string;
  }

  let { trainId }: Props = $props();

  export async function save() {
    // Deleted Functions
    const deleted = originalFunctions.filter(
      (o) => !trainFunctions.some((n) => n.value === o.value),
    );

    for (const f of deleted) {
      await deleteTrainFunction({ trainId: f.trainId, value: f.value });
    }

    // Added Functions
    const added = trainFunctions.filter(
      (n) => !originalFunctions.some((o) => o.value === n.value),
    );

    for (const f of added) {
      await addTrainFunction(f);
    }

    // Update train functions
    trainFunctions.forEach(async (f) => {
      await editTrainFunction(f);
    });
  }

  let trainFunctions: (TrainFunction & { id: string })[] = $state([]);
  let originalFunctions: { value: string; trainId: string }[] = $state([]);
  const flipDurationMs = 100;

  onMount(async () => {
    const functs = await getTrainFunctions(trainId);
    trainFunctions = functs
      .map((f) => ({
        ...f,
        id: f.id ?? `${f.trainId}_${f.value}`, // Fallback ID generation if missing
      }))
      .toSorted((a, b) => a.position - b.position);

    originalFunctions = functs.map((f) => ({
      value: f.value,
      trainId: f.trainId,
    }));
  });

  function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
    trainFunctions = e.detail.items;
  }

  async function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
    trainFunctions = e.detail.items;

    for (const [index, item] of e.detail.items.entries()) {
      const newPos = index; // new position is its place in the array
      if (item.position !== newPos) {
        await setTrainFunctionPosition({
          trainId,
          value: item.value,
          position: newPos,
        });
      }
    }
  }

  async function createFunction() {
    // Select a function value (numerical) that is not already in use
    let i = 0;
    while (trainFunctions.some((fn) => fn.value === `F${i}`)) {
      i++;
    }

    const newValue = `F${i}`;

    trainFunctions = [
      ...trainFunctions,
      {
        id: `${trainId}_${newValue}`,
        icon: "Text",
        mode: "Toggle",
        name: `New Function ${i}`,
        position: trainFunctions.length + 1,
        state: false,
        trainId: trainId,
        value: newValue,
        visible: true,
      },
    ];
  }
</script>

<Button class="w-full my-2" variant="outline" onclick={createFunction}>
  <Plus />Add Function
</Button>

<!-- Styled with Shadcn table classes for a seamless design match -->
<table class="w-full caption-bottom text-sm">
  <caption class="mt-4 text-sm text-muted-foreground"
    >A list of your train functions.</caption
  >
  <thead class="[&_tr]:border-b">
    <tr
      class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <th
        class="h-12 w-12 px-4 text-left align-middle font-medium text-muted-foreground"
      ></th>
      <th
        class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
        >Value</th
      >
      <th
        class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
        >Name</th
      >
      <th
        class="h-12 px-4 text-right align-middle font-medium text-muted-foreground"
        >Icon</th
      >
    </tr>
  </thead>
  <tbody
    class="[&_tr:last-child]:border-0"
    use:dragHandleZone={{
      items: trainFunctions,
      flipDurationMs: flipDurationMs,
    }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    {#each trainFunctions as funct (funct.value)}
      <tr
        animate:flip={{ duration: 200 }}
        class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      >
        <!-- Drag Handle Cell -->
        <td
          class="p-4 align-middle cursor-grab active:cursor-grabbing"
          use:dragHandle
          aria-label="drag-handle for {funct.value}"
        >
          <GripVertical class="w-5 h-5 text-muted-foreground" />
        </td>

        <!-- Value Cell -->
        <td class="p-4 align-middle font-medium">
          {funct.value}
        </td>

        <!-- Name Cell -->
        <td class="p-4 align-middle">
          {funct.name}
        </td>

        <!-- Icon Cell -->
        <td class="p-4 align-middle text-right">
          <div class="flex justify-end">
            <FunctionIcons selectedIcon={funct.icon} size={20} text={false} />
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
