<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    type ConnectionUUID,
    type LayoutUUID,
  } from "$lib/client/LayoutClient.svelte";
  import { z } from "zod/v4";

  interface Props {
    layoutId: LayoutUUID;
    selConnectionId: ConnectionUUID | undefined;
  }

  let { layoutId, selConnectionId = $bindable() }: Props = $props();

  let selConnectionName: string | undefined = $state();

  // Refresh the list of trains when the combobox is opened
  async function loadConnections() {
    const response = await fetch(
      `/api/layout/${layoutId}/connections/connection-select`,
    );
    const json = await response.json();

    const Connection = z.object({
      id: z.uuidv4(),
      name: z.string(),
    });

    return z.array(Connection).parse(json.connections);
  }
</script>

<!-- TODO Convert to a dynamic width -->

<Select.Root
  type="single"
  name="trainConnection"
  bind:value={
    () => `${selConnectionId}:${selConnectionName}`,
    (v) => {
      if (!v) {
        selConnectionId = undefined;
        selConnectionName = undefined;
        return;
      }
      [selConnectionId, selConnectionName] = v.split(":") as [
        LayoutUUID,
        string,
      ];
    }
  }
  allowDeselect={true}
>
  <Select.Trigger class="col-span-3">
    {selConnectionName ?? "Select Connection"}
  </Select.Trigger>
  <Select.Content>
    {#await loadConnections() then connections}
      {#each connections as connection}
        <Select.Item
          value={`${connection.id}:${connection.name}`}
          class={selConnectionId === connection.id
            ? "cursor-default"
            : "cursor-pointer"}
        >
          <p class="text-md">{connection.name}</p>
        </Select.Item>
      {/each}
    {/await}
  </Select.Content>
</Select.Root>
