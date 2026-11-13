<script lang="ts">
  import { connectionProtocolList, getProtocolName } from "#lib/types/protocolConstants.js";
  import Label from "#lib/components/ui/label/label.svelte";
  import type { createConnection } from "#lib/client/Connections.remote.js";
  import * as Select from "#lib/components/ui/select/index.js";

  interface Props {
    protocol: typeof createConnection.fields.protocol;
  }

  const { protocol }: Props = $props();
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="protocol" class="text-right">Protocol</Label>

  <div class="col-span-3 space-y-1">
    <Select.Root
      type="single"
      allowDeselect={true}
      {...protocol.as("text")}
      bind:value={
        () => protocol.value(), (value) => protocol.set(value)}
    >
      <Select.Trigger class="w-full">
        {#snippet children()}
          {const proto = $derived(protocol.value())}
          {#if proto}
            {getProtocolName(proto)}
          {:else}
            No Protocol Selected
          {/if}
        {/snippet}
      </Select.Trigger>
      <Select.Content>
        {#each connectionProtocolList as protocolName}
          <Select.Item value={protocolName} label={getProtocolName(protocolName)}>
            {getProtocolName(protocolName)}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>

    {#each protocol.issues() as issue}
      <p class="text-xs text-red-600">{issue.message}</p>
    {/each}
  </div>
</div>
