<script lang="ts">
  import { Button } from "../ui/button";
  import { getTracksStatus } from "#lib/client/Protocols/DccEx.remote.js";
  import { onMount } from "svelte";
  import * as Card from "#lib/components/ui/card/index.js";
  import {
    streamConnectionLogs,
    writeStringToConnection,
  } from "#lib/client/Connections.remote.js";
  import Terminal from "../Terminal/Terminal.svelte";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  let terminal: Terminal | null = $state(null);
  const connectionLogs = $derived(streamConnectionLogs(connectionId));
  const statusText = $derived(
    connectionLogs.connected ? "Connected" : "Disconnected",
  );

  onMount(() => {
    let active = true;

    terminal?.addLog(
      "System initialized. Listening for DCC-EX events...",
      "info",
    );

    async function startStreaming() {
      try {
        await connectionLogs.reconnect();
      } catch (e) {
        console.error("Initial reconnect failed", e);
      }

      while (active) {
        try {
          // Check the state outside Svelte's transient effect compiler loop
          if (!connectionLogs.connected) {
            terminal?.addLog("Attempting to connect to stream...", "info");
            await connectionLogs.reconnect();
          }

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

  //   es.onmessage = async (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.connectionId !== connectionId) return;

  //     if (
  //       data.type === "tracks" ||
  //       data.type === "power" ||
  //       data.type === "currents"
  //     ) {
  //       getTracksStatus(connectionId).refresh();
  //     } //else if (data.type === "locos") {
  //     //   console.warn("Update Dcc Ex Locos");
  //     // }
  //   };
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

    <!-- Pre-configured buttons -->
    <div>
      <Button
        onclick={async () => {
          await writeStringToConnection({
            command: "<= B DC 3>",
            id: connectionId,
          });
        }}>Set Dc Mode</Button
      >

      <Button
        onclick={() => {
          writeStringToConnection({
            command: "<1 B>",
            id: connectionId,
          });
        }}>Power ON (A)</Button
      >
      <Button
        onclick={() => {
          writeStringToConnection({
            command: "<0 B>",
            id: connectionId,
          });
        }}>Power OFF (A)</Button
      >
    </div>

    <!-- Active Tracks -->
     <Button onclick={() => getTracksStatus(connectionId).refresh()}>Refresh</Button>
    <div class="space-y-3">
      <h2 class="text-lg font-semibold tracking-tight">Active Tracks Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#await getTracksStatus(connectionId)}
          <p>Loading track status...</p>
        {:then tracks}
          {#each await getTracksStatus(connectionId) as track}
            <Card.Root
              class="border-neutral-800 bg-neutral-900/40 shadow-sm hover:shadow-md transition"
            >
              <Card.Header class="pb-2">
                <Card.Title class="text-lg"
                  >Track {track.trackletter}</Card.Title
                >
                <Card.Description class="font-mono text-xs text-neutral-400">
                  Mode: <span
                    class="px-1.5 py-0.5 rounded-md bg-neutral-800 text-neutral-200"
                    >{track.state}</span
                  >
                </Card.Description>
              </Card.Header>
              <Card.Content class="text-sm space-y-1.5 text-neutral-300">
                <div
                  class="flex justify-between border-b border-neutral-800/60 pb-1"
                >
                  <span>Current Draw</span>
                  <span class="font-mono font-medium">{track.current} mA</span>
                </div>
                <div
                  class="flex justify-between border-b border-neutral-800/60 pb-1"
                >
                  <span>Max Capacity</span>
                  <span class="font-mono font-medium"
                    >{track.maxCurrent} mA</span
                  >
                </div>
                <div
                  class="flex justify-between border-b border-neutral-800/60 pb-1"
                >
                  <span>Power State</span>
                  <span
                    class="font-semibold"
                    class:text-emerald-500={track.power}
                    class:text-red-500={!track.power}
                  >
                    {track.power ? "ACTIVE" : "OFF"}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Active Cab ID</span>
                  <span class="font-mono font-medium">{track.cab}</span>
                </div>
              </Card.Content>
            </Card.Root>
          {/each}
        {:catch error}
          <p>Failed to load tracks: {error}</p>
        {/await}
      </div>
    </div>
  </div>
</svelte:boundary>
