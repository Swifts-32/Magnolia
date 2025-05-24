<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    type ConnectionUUID,
    type LayoutUUID,
  } from "$lib/client/LayoutClient.svelte";
  import type { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";

  interface Props {
    layoutId: LayoutUUID;
    selConnectionId: ConnectionUUID | undefined;
  }

  let { layoutId, selConnectionId = $bindable() }: Props = $props();

  const selectedConnection: ClientConnection | undefined = $derived.by(() => {
    if (selConnectionId) {
      return connections.get(selConnectionId);
    }
  });
</script>

<!-- TODO Convert to a dynamic width -->
<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
  <Label for="trainConnection" class="text-right">Connection</Label>
  <Select.Root
    type="single"
    name="trainConnection"
    bind:value={selConnectionId}
  >
    <Select.Trigger class="col-span-3">
      {selectedConnection?.name ?? "Select Connection"}
    </Select.Trigger>
    <Select.Content>
      <!-- {#each connections as [connUUID, connection]}
        <Select.Item
          value={connUUID}
          class={selectedConnection?.uuid === connUUID
            ? "cursor-default"
            : "cursor-pointer"}
        >
          <p class="text-md">{connection.name}</p>
        </Select.Item>
      {/each} -->
    </Select.Content>
  </Select.Root>
</div>
