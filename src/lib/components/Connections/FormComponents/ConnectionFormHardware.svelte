<script lang="ts">
  import type { createConnection } from "$lib/client/Connections.remote";
  import { Separator } from "$lib/components/ui/separator";
  import SerialConnection from "./Hardware/Serial/SerialConnection.svelte";

  interface Props {
    hardware: typeof createConnection.fields.hardware;
  }

  const { hardware }: Props = $props();
</script>

{#if hardware.type.value() === "Serial"}
  <Separator />
  <SerialConnection path={hardware.path} baudRate={hardware.baudRate} />
{/if}
