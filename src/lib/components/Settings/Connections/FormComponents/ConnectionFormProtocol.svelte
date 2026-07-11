<script lang="ts">
  import { connectionProtocolList } from "$lib/client/Connections/Protocols/protocols";
  import Label from "$lib/components/ui/label/label.svelte";
  import { createConnection } from "../../../../client/Connections/connections.remote";

  interface Props {
    protocol: typeof createConnection.fields.protocol;
  }

  const { protocol }: Props = $props();
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="protocol" class="text-right">Protocol</Label>
  <div class="col-span-3">
    <select
      {...protocol.as("select", "DccEx")}
      class="border-input bg-background ring-offset-background data-placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
    >
      {#each connectionProtocolList as protocolName}
        <option
          class="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50"
          >{protocolName}</option
        >
      {/each}
    </select>

    {#each protocol.issues() as issue}
      <p class="text-s text-red-600">{issue.message}</p>
    {/each}
  </div>
</div>
