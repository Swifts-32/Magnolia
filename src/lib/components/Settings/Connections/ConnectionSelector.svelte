<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    type Connections,
    type ConnectionUUID,
  } from "$lib/client/LayoutClient.svelte";

  interface Props {
    connections: Map<ConnectionUUID, Connections>;
    selectedConnectionUUID: ConnectionUUID | undefined;
  }


  let { connections, selectedConnectionUUID = $bindable() }: Props = $props();

  const selectedConnection: Connections | undefined = $derived.by(() => {
    if (selectedConnectionUUID) {
      return connections.get(selectedConnectionUUID);
    }
  });
</script>


<!-- TODO Convert to a dynamic width -->
<div class="grid grid-cols-4 my-2 items-center gap-4 w-full">
  <Label for="trainConnection" class="text-right">Connection</Label>
  <Select.Root
    type="single"
    name="trainConnection"
    bind:value={selectedConnectionUUID}
  >
    <Select.Trigger class="col-span-3">
      {selectedConnection?.connName ?? "Select Connection"}
    </Select.Trigger>
    <Select.Content>

      {#each connections as [connUUID, connection]}
        <Select.Item value={connUUID}>
          <div class="flex flex-col">
            <p>{connection.connName}</p>
            <p class="text-sm">UID: {connUUID}</p>
          </div>
        </Select.Item>

      {/each}
    </Select.Content>
  </Select.Root>
</div>
