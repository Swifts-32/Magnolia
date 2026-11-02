<script lang="ts">
  import type { createConnection } from "#lib/client/Connections.remote.js";
  import Label from "#lib/components/ui/label/label.svelte";
  import {  connectionTypeList, getConnectionHardwareName } from "#lib/types/hardwareConstants.ts";
  import {  protocolSupportedHardware } from "#lib/types/protocolConstants.ts";
  import * as Select from "#lib/components/ui/select/index.js";

  interface Props {
    protocol: typeof createConnection.fields.protocol;
    hardware: typeof createConnection.fields.hardware;
  }

  const { protocol, hardware }: Props = $props();

  const allowedHardwareTypes = $derived.by(() => {
    const currentProtocol = protocol.value();
    if (!currentProtocol) return [];
    
    return connectionTypeList.filter((type) => 
      protocolSupportedHardware(currentProtocol, type)
    );
  });
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="hardware" class="text-right">Hardware</Label>

  <Select.Root
    type="single"
    allowDeselect={true}
    {...hardware.type.as("text")}
    bind:value={
      () => hardware.type.value(), (value) => hardware.type.set(value)}
  >
    <Select.Trigger class="col-span-3">
      {#snippet children()}
      {const connType = $derived(hardware.type.value())}
        {#if connType}
        {const name = $derived(getConnectionHardwareName(connType))}
            {name}
            {:else}
            No Hardware Selected
       {/if}
      {/snippet}
    </Select.Trigger>
    <Select.Content>
      {#each allowedHardwareTypes as type}
        <Select.Item value={type} label={getConnectionHardwareName(type)}>
          {getConnectionHardwareName(type)}
        </Select.Item>
      {/each}
      </Select.Content>
  </Select.Root>
</div>
