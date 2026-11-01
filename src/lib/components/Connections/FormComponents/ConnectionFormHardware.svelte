<script lang="ts">
  import type { createConnection } from "#lib/client/Connections.remote.js";
  import { Separator } from "#lib/components/ui/separator/index.js";
  import SerialConnection from "./Hardware/Serial/SerialConnection.svelte";
  import WebServerConnection from "./Hardware/WebServer/WebServerConnection.svelte";

  interface Props {
    hardware: typeof createConnection.fields.hardware;
  }

  const { hardware }: Props = $props();
</script>

{#if hardware.type.value() === "Serial"}
  <Separator />
  <SerialConnection path={hardware.path} baudRate={hardware.baudRate} />
{:else if hardware.type.value() === "WebServer"}
  <Separator />
  <WebServerConnection baseUrl={hardware.baseUrl} />
{/if}
