<script lang="ts">
  import {
    Bell,
    GripVertical,
    Lightbulb,
    Sun,
    Text,
    Trash,
    Volume2,
  } from "lucide-svelte";
  import {
    deleteTrainFunction,
    editTrainFunction,
    getTrainFunctions,
    setTrainFunctionPosition,
    type TrainFunction,
  } from "../../../../client/Trains/Functions/trainFunctions.remote";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

  interface Props {
    trainId: string;
  }

  let { trainId }: Props = $props();

  export async function save() {
    const deleted = originalFunctions.filter(
      (o) => !trainFunctions.some((n) => n.value === o.value),
    );

    deleted.forEach(async (f) => {
      await deleteTrainFunction({ trainId: f.trainId, value: f.value });
    });

    trainFunctions.forEach(async (f) => {
      await editTrainFunction(f);
    });
  }

  let trainFunctions: TrainFunction[] = $state([]);
  let originalFunctions: { value: string; trainId: string }[] = $state([]);
  const flipDurationMs = 100;

  onMount(async () => {
    const functs = await getTrainFunctions(trainId);
    trainFunctions = functs.toSorted((a, b) => a.position - b.position);

    originalFunctions = functs.map((f) => ({
      value: f.value,
      trainId: f.trainId,
    }));
  });

  function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
    trainFunctions = e.detail.items;
  }

  async function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
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
</script>

{#snippet tableHeader(width: number | undefined, text: string)}
  <th class="p-4 border-b text-center {width ? `w-${width}` : 'w-min'}">
    <p
      class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
    >
      {text}
    </p>
  </th>
{/snippet}

<table class="w-full text-left table-auto min-w-max">
  <thead>
    <tr>
      {@render tableHeader(2, "")}
      {@render tableHeader(undefined, "Value")}
      {@render tableHeader(undefined, "Name")}
      {@render tableHeader(undefined, "Icon")}
      {@render tableHeader(undefined, "Is Toggle")}
      {@render tableHeader(undefined, "Visible")}
      {@render tableHeader(undefined, "")}
    </tr>
  </thead>

  <tbody
    use:dragHandleZone={{
      items: trainFunctions,
      flipDurationMs: flipDurationMs,
    }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    {#each trainFunctions as funct (funct.id)}
      <tr
        animate:flip={{ duration: 200 }}
        class="hover:bg-secondary hover:text-secondary-foreground"
      >
        <td
          class="p-4 border-b border-blue-gray-50 cursor-grab"
          use:dragHandle
          aria-label="drag-handle for {funct.id}"
        >
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            <GripVertical class="w-5 h-5" />
          </p>
        </td>
        <td class="p-2 border-b border-blue-gray-50 text-center">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            {funct.value}
          </p>
        </td>

        <td class="p-4 border-b border-blue-gray-50 text-center">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            <input type="text" bind:value={funct.name} />
          </p>
        </td>

        <td class="p-4 border-b border-blue-gray-50 text-center">
          <div class="flex justify-center">
            <ToggleGroup.Root
              type="single"
              variant="outline"
              bind:value={funct.icon}
            >
              <ToggleGroup.Item value="Bell"><Bell /></ToggleGroup.Item>
              <ToggleGroup.Item value="Speaker"><Volume2 /></ToggleGroup.Item>
              <ToggleGroup.Item value="Light1"><Lightbulb /></ToggleGroup.Item>
              <ToggleGroup.Item value="Light2"><Sun /></ToggleGroup.Item>
              <ToggleGroup.Item value="Text"><Text /></ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </td>
        <td class="p-4 border-b border-blue-gray-50">
          <div class="flex justify-center">
            <Checkbox
              bind:checked={
                () => funct.mode === "Toggle",
                (v) => (v ? (funct.mode = "Toggle") : (funct.mode = "Select"))
              }
            />
          </div>
        </td>
        <td class="p-4 border-b border-blue-gray-50 text-center">
          <div class="flex justify-center">
            <Checkbox bind:checked={funct.visible} class="text-red-600" />
          </div>
        </td>
        <td class="p-4 border-b border-blue-gray-50 text-center">
          <div class="flex justify-center">
            <button
              type="button"
              onclick={() => {
                trainFunctions = trainFunctions.filter(
                  (f) => f.value !== funct.value,
                );
              }}
              class="cursor-pointer"
            >
              <Trash class="text-red-800" />
            </button>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
