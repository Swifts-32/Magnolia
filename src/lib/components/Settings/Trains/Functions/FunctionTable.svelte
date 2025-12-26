<script lang="ts">
  import { GripVertical } from "lucide-svelte";
  import {
    getTrainFunctions,
    setTrainFunctionPosition,
  } from "../../../../client/Trains/Functions/trainFunctions.remote";
  import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import FunctionViewer from "./FunctionViewer.svelte";

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
</script>

<table class="w-full text-left table-auto min-w-max">
  <thead>
    <tr>
      <th class="p-4 border-b w-8">
        <p
          class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
        ></p>
      </th>
      <th class="p-4 border-b">
        <p
          class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
        >
          Value
        </p>
      </th>
      <th class="p-4 border-b">
        <p
          class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
        >
          Name
        </p>
      </th>
      <th class="p-4 border-b">
        <p
          class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
        ></p>
      </th>
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
            {funct.name}
          </p>
        </td>
        <td class="p-4 border-b border-blue-gray-50">
          <FunctionViewer {funct} {trainId}>
            <p
              class="block cursor-pointer font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900"
            >
              Edit
            </p>
          </FunctionViewer>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
