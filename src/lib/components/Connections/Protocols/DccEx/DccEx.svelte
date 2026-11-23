<script lang="ts">
  import { onMount } from "svelte";

  import {
    streamConnectionLogs,
    writeStringToConnection,
  } from "#lib/components/Connections/Connections.remote.js";
  import TrackManager from "./TrackManager.svelte";
  import Terminal from "#lib/components/Terminal/Terminal.svelte";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  const connectionLogs = $derived(streamConnectionLogs(connectionId));

  const statusText = $derived(
    connectionLogs.connected ? "Connected" : "Disconnected",
  );
  let terminal: Terminal | null = $state(null);

  onMount(() => {
    let active = true;
    connectionLogs.reconnect();

    terminal?.addLog(
      "System initialized. Listening for DCC-EX events...",
      "info",
    );

    async function startStreaming() {
      while (active) {
        try {
          for await (const data of connectionLogs) {
            if (!active) break;

            if (data && data.text && terminal) {
              terminal.addLog(data.text, "in");
            }
          }
        } catch (err: any) {
          if (active) {
            terminal?.addLog(
              `Stream disconnected: ${err.message || "Network error"}. Retrying...`,
              "info",
            );
          }
        }

        if (active) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    startStreaming();

    return () => {
      active = false;
    };
  });
</script>

<svelte:boundary>
  {#snippet pending()}
    <p class="text-neutral-500 animate-pulse">loading...</p>
  {/snippet}
  {#snippet failed(error, reset)}
    <button
      onclick={reset}
      class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      oops! try again {error}
    </button>
  {/snippet}

  <div class="space-y-6 mx-auto">
    <Terminal
      bind:this={terminal}
      name="DCC-EX Serial Log - {statusText}"
      minimized={true}
      placeholder="Send command (e.g. <1> or <t 1 3 128 1>)"
      write={(data) =>
        writeStringToConnection({ command: data, id: connectionId })}
    />

    <TrackManager
      {connectionId}
      addLog={(log, type) => terminal?.addLog(log, type)}
    />
  </div>
</svelte:boundary>
