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
    getTrainFunctions,
    setTrainFunctionPosition,
  } from "../../../../client/Trains/Functions/trainFunctions.remote";
  import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import FunctionViewer from "./FunctionViewer.svelte";
  import { ZodNumber } from "zod/v4";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { onDestroy } from "svelte";
    import { toast } from "svelte-sonner";

  interface Props {
    trainId: string;
  }

  let { trainId }: Props = $props();

  let trainFunctions2 = $derived.by(async () => {
    let functs = await getTrainFunctions(trainId);
    return [...functs].sort((a, b) => a.position - b.position);
  });

  let trainFunctions = $derived(await trainFunctions2);

  const flipDurationMs = 100;

  function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
    trainFunctions = e.detail.items;
  }

  async function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
    for (const [index, item] of e.detail.items.entries()) {
      const newPos = index; // new position is its place in the array
      if (item.position !== newPos) {
        await setTrainFunctionPosition({
          trainId,
          value: item.functValue,
          position: newPos,
        });
      }
    }
  }

  // Save all functions
  onDestroy(() => {
    toast.info("Closed");
  })
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
      {@render tableHeader(8, "")}
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
        <td class="p-2 border-b border-blue-gray-50">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            {funct.functValue}
          </p>
        </td>

        <td class="p-4 border-b border-blue-gray-50">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            <input type="text" value={funct.name} />
          </p>
        </td>

        <td class="p-4 border-b border-blue-gray-50">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            <ToggleGroup.Root
              type="single"
              variant="outline"
              value={funct.icon}
            >
              <ToggleGroup.Item value="Bell"><Bell /></ToggleGroup.Item>
              <ToggleGroup.Item value="Speaker"><Volume2 /></ToggleGroup.Item>
              <ToggleGroup.Item value="Light1"><Lightbulb /></ToggleGroup.Item>
              <ToggleGroup.Item value="Light2"><Sun /></ToggleGroup.Item>
              <ToggleGroup.Item value="Text"><Text /></ToggleGroup.Item>
            </ToggleGroup.Root>
          </p>
        </td>
        <td class="p-4 border-b border-blue-gray-50">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            <Checkbox checked={funct.mode === "Toggle"} />
          </p>
        </td>
        <td class="p-4 border-b border-blue-gray-50">
          <p
            class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
          >
            <Checkbox checked={funct.visible} class="text-red-600" />
          </p>
        </td>
        <td class="p-4 border-b border-blue-gray-50">
          <button>
            <Trash />
          </button>
          <!-- <FunctionViewer {funct} {trainId}>
            <p
              class="block cursor-pointer font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900"
            >
              <Edit>
            </p>
          </FunctionViewer> -->
        </td>
      </tr>
    {/each}
  </tbody>
</table>
