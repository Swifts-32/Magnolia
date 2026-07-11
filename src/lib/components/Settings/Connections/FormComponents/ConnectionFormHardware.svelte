<script lang="ts">
  import { createConnection } from "../../../../client/Connections/connections.remote";
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
