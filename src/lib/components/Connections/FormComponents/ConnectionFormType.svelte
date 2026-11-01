<script lang="ts">
  import type { createConnection } from "#lib/client/Connections.remote.js";
  import Label from "#lib/components/ui/label/label.svelte";
  import type { ConnectionHardwareList } from "#lib/types/hardwareConstants.ts";
  import { protocolAllowedHardware } from "#lib/types/protocolConstants.ts";

  interface Props {
    protocol: typeof createConnection.fields.protocol;
    hardware: typeof createConnection.fields.hardware;
  }

  const { protocol, hardware }: Props = $props();

  const selectedProtocolName = $derived(
    protocol?.value
      ? (protocol.value() as keyof typeof protocolAllowedHardware)
      : undefined,
  );

  const allowedHardwareTypes = $derived(
    selectedProtocolName && protocolAllowedHardware[selectedProtocolName]
      ? protocolAllowedHardware[selectedProtocolName]
      : [],
  );

  // Automatically update hardware selection when protocol or allowed types change
  $effect(() => {
    if (allowedHardwareTypes.length === 0) return;

    const currentHardware = hardware?.type?.value
      ? hardware.type.value()
      : undefined;

    // Helper to safely update the form field value
    const setHardwareValue = (val?: ConnectionHardwareList) => {
      if (!val) {
        hardware.type.set(undefined);
      }

      hardware.type.set(val);
    };

    if (
      !currentHardware ||
      !allowedHardwareTypes.includes(currentHardware as any)
    ) {
      const defaultHardware = allowedHardwareTypes[0];

      // Only update if it's different to prevent redundant state writes
      if (currentHardware !== defaultHardware) {
        hardware.type.set(defaultHardware);
      }
    }
  });
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="hardware" class="text-right">Hardware</Label>
  <div class="col-span-3">
    <select
      disabled={allowedHardwareTypes.length === 0}
      {...hardware.type.as("select")}
      class="border-input bg-background ring-offset-background data-placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
    >
      {#each allowedHardwareTypes as connType}
        <option
          value={connType}
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
