<script lang="ts">
  import { connectionTypeList } from "$lib/client/Connections/Protocols/protocols";
  import Label from "$lib/components/ui/label/label.svelte";
  import { createConnection } from "../../../../client/Connections/connections.remote";

  interface Props {
    hardware: typeof createConnection.fields.hardware;
  }

  const { hardware }: Props = $props();
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="hardware" class="text-right">Hardware</Label>
  <div class="col-span-3">
    <select
      {...hardware.type.as("select", "Emulator")}
      class="border-input bg-background ring-offset-background data-placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
    >
      {#each connectionTypeList.filter((type) => type !== "Undefined") as connType}
        <option
          class="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50"
          >{connType}</option
        >
      {/each}
    </select>

    {#each hardware.type.issues() as issue}
      <p class="text-s text-red-600">{issue.message}</p>
    {/each}
  </div>
</div>
