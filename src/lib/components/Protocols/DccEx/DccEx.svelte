<script lang="ts">
  import { Button } from "../../ui/button";
  import { getTracksStatus } from "#lib/components/Protocols/DccEx/DccEx.remote.js";
  import { onMount } from "svelte";
  import * as Card from "#lib/components/ui/card/index.js";
  import * as Table from "#lib/components/ui/table/index.js";
  import {
    streamConnectionLogs,
    writeStringToConnection,
  } from "#lib/client/Connections.remote.js";
  import Terminal from "../../Terminal/Terminal.svelte";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  const statusQuery = $derived(getTracksStatus(connectionId));
  const connectionLogs = $derived(streamConnectionLogs(connectionId));

  let terminal: Terminal | null = $state(null);
  const statusText = $derived(
    connectionLogs.connected ? "Connected" : "Disconnected",
  );

  onMount(() => {
    let active = true;
    statusQuery.reconnect();
    connectionLogs.reconnect();

    terminal?.addLog(
      "System initialized. Listening for DCC-EX events...",
      "info",
    );

    async function startStreaming() {
      while (active) {
        try {
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

    <!-- Use the persistent tracksStream reference here -->
    {statusQuery.connected}
    {#await statusQuery then status}
      <Card.Root>
        <Card.Header>
          <Card.Title>Track Manager</Card.Title>
        </Card.Header>
        <Card.Content>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head class="w-[80px]">Track</Table.Head>
                <Table.Head>State</Table.Head>
                <Table.Head>Power</Table.Head>
                <Table.Head>Cab</Table.Head>
                <Table.Head>Current</Table.Head>
                <Table.Head>Max Current</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each status as track (track.trackletter)}
                <Table.Row>
                  <Table.Cell class="font-bold">{track.trackletter}</Table.Cell>
                  <Table.Cell>{track.state}</Table.Cell>
                  <Table.Cell>
                    <span
                      class={track.power === "ON"
                        ? "text-green-600 font-semibold"
                        : "text-muted-foreground"}
                    >
                      {track.power}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{track.cab ?? "—"}</Table.Cell>
                  <Table.Cell>{track.current ?? 0} mA</Table.Cell>
                  <Table.Cell>{track.maxCurrent ?? 0} mA</Table.Cell>
                </Table.Row>
              {:else}
                <Table.Row>
                  <Table.Cell
                    colspan={6}
                    class="text-center text-muted-foreground py-4"
                  >
                    No track configurations found.
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </Card.Content>
      </Card.Root>
    {/await}

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
        onclick={async () => {
          await writeStringToConnection({
            command: "<= B MAIN>",
            id: connectionId,
          });
        }}>Set DCC</Button
      >

      <Button
        onclick={() => {
          writeStringToConnection({
            command: "<1 A>",
            id: connectionId,
          });
        }}>Power ON (A)</Button
      >
      <Button
        onclick={() => {
          writeStringToConnection({
            command: "<0 A>",
            id: connectionId,
          });
        }}>Power OFF (A)</Button
      >
      <Button
        onclick={() => {
          statusQuery.reconnect();
        }}>Reconnecting / Refresh</Button
      >
    </div>
  </div>
</svelte:boundary>
