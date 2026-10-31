<script lang="ts">
  import { GripVertical, Plus } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
  import { Button } from "#lib/components/ui/button/index.js";
  import * as Drawer from "#lib/components/ui/drawer/index.js";
  import {
    addTrainFunction,
    deleteTrainFunction,
    editTrainFunction,
    getTrainFunctions,
    setTrainFunctionPosition,
  } from "#lib/client/TrainFunctions.remote.js";
  import type { TrainFunction } from "#lib/server/db/schema/trains.js";
  import FunctionIcons from "./FunctionIcons.svelte";
  import FunctionForm from "./FunctionForm.svelte";

  interface Props {
    trainId: string;
  }

  let { trainId }: Props = $props();

  export async function save() {
    // Deleted Functions
    const deletedIds = originalFunctIds.filter(
      (o) => !trainFunctions.some((n) => n.id === o),
    );

    for (const id of deletedIds) {
      await deleteTrainFunction(id);
    }

    // Added Functions
    const addedIds = trainFunctions.filter(
      (n) => !originalFunctIds.some((o) => o === n.id),
    );

    for (const id of addedIds) {
      await addTrainFunction(id);
    }

    // Update train functions
    trainFunctions.forEach(async (f) => {
      await editTrainFunction(f);
    });
  }

  let trainFunctions: (TrainFunction & { id: string })[] = $state([]);
  let originalFunctIds: string[] = $state([]);
  let activeFunctId = $state<string | null>(null);
  const flipDurationMs = 100;

  onMount(async () => {
    const functs = await getTrainFunctions(trainId);
    trainFunctions = functs.toSorted((a, b) => a.position - b.position);

    originalFunctIds = functs.map((f) => f.id);
  });

  function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
    trainFunctions = e.detail.items;
  }

  async function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
    trainFunctions = e.detail.items.map((item, index) => ({
      ...item,
      position: index,
    }));

    for (const [index, item] of trainFunctions.entries()) {
      await setTrainFunctionPosition({
        id: item.id,
        position: index,
      });
    }
  }

  async function createFunction() {
    let i = 0;
    while (trainFunctions.some((fn) => fn.value === `F${i}`)) {
      i++;
    }

    const newValue = `F${i}`;

    trainFunctions = [
      ...trainFunctions,
      {
        id: crypto.randomUUID(),
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
    {#each trainFunctions as funct (funct.id)}
      <tr
        class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
        onclick={() => (activeFunctId = funct.id)}
      >
        <!-- Drag Handle Cell -->
        <td
          class="p-4 align-middle cursor-grab active:cursor-grabbing"
          use:dragHandle
          aria-label="drag-handle for {funct.id}"
          onclick={(e) => e.stopPropagation()}
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

      <!-- Edit Function Drawer -->
      <Drawer.Root
        open={activeFunctId === funct.id}
        onOpenChange={(open) => {
          if (!open && activeFunctId === funct.id) activeFunctId = null;
        }}
        direction="right"
        dismissible={false}
      >
        <Drawer.Content
          class="bg-background w-screen! max-w-none! fixed inset-0 h-full border-none rounded-none sm:inset-y-0 sm:right-0 sm:left-auto sm:w-md! sm:max-w-md! sm:rounded-none flex flex-col *:w-full"
        >
          <Drawer.Header>
            <Drawer.Title>Edit Function ({funct.value})</Drawer.Title>
          </Drawer.Header>

          <div
            class="overflow-y-auto px-4 flex-1 w-full flex flex-col gap-4 py-4"
          >
            <FunctionForm
              {funct}
              ondelete={() => {
                trainFunctions = trainFunctions.filter(
                  (f) => f.id !== funct.id,
                );
                activeFunctId = null;
              }}
            />
          </div>

          <Drawer.Footer>
            <Button onclick={() => (activeFunctId = null)}>Done</Button>
            <Drawer.Close onclick={() => (activeFunctId = null)}
              >Close</Drawer.Close
            >
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    {/each}
  </tbody>
</table>
