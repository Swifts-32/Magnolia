<script lang="ts">
  import { Button } from "../../ui/button";
  import { getTracksStatus } from "#lib/components/Protocols/DccEx/DccEx.remote.js";
  import { onMount } from "svelte";
  import * as Card from "#lib/components/ui/card/index.js";
  import * as Table from "#lib/components/ui/table/index.js";
  import * as Select from "#lib/components/ui/select/index.js";
  import { Input } from "../../ui/input"; // Assuming you have an Input component, or use standard input
  import {
    streamConnectionLogs,
    writeStringToConnection,
  } from "#lib/client/Connections.remote.js";
  import Terminal from "../../Terminal/Terminal.svelte";
  import {
    Power,
    PowerOff,
    RefreshCcw,
    SquareExclamationPoint,
  } from "@lucide/svelte";
  import { DccExTrackStatesList } from "#lib/types/protocols/DccExTypes.ts";

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

  // Local state to track pending mode changes and cab numbers per track letter
  let trackEdits = $state<Record<string, { mode: string; cab: string }>>({});

  function getEditState(
    trackletter: string,
    currentTrackState: string,
    currentCab?: number | null,
  ) {
    if (!trackEdits[trackletter]) {
      trackEdits[trackletter] = {
        mode: currentTrackState,
        cab: currentCab?.toString() ?? "",
      };
    }
    return trackEdits[trackletter];
  }

  async function handleUpdateTrack(trackletter: string) {
    const edit = trackEdits[trackletter];

    const mode = edit.mode;
    const cab = edit.cab ? edit.cab.trim() : "";

    // Check if the selected mode requires a DC loco/cab number based on the spec
    const isDcMode = mode === "DC" || mode === "DC_INV" || mode === "DCX";

    if (!edit || !edit.mode) return;

    let command = "";

    if (isDcMode) {
      if (!cab) {
        terminal?.addLog(
          `Error: Track ${trackletter} mode "${mode}" requires a cab/loco number.`,
          "info",
        );
        return;
      }
      // Format: <= track MODE loco> (e.g. <= B DC 3>)
      command = `<= ${trackletter} ${mode} ${cab}>`;
    } else {
      // Format: <= track MODE> (e.g. <= B MAIN>)
      command = `<= ${trackletter} ${mode}>`;
    }

    terminal?.addLog(`Sending track config: ${command}`, "out");
    await writeStringToConnection({
      command,
      id: connectionId,
    });
  }

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

    {#await statusQuery}
      <Card.Root>
        <Card.Header>
          <Card.Title>Track Manager</Card.Title>
        </Card.Header>
        <Card.Content>
          <p class="text-neutral-500 py-4 animate-pulse">
            Loading tracks status...
          </p>
        </Card.Content>
      </Card.Root>
    {:then status}
      <Card.Root>
        <Card.Header class="flex flex-row justify-between">
          <Card.Title>Track Manager</Card.Title>

          <Button
            size="icon"
            onclick={() => {
              statusQuery.reconnect();
            }}
            ><RefreshCcw />
          </Button>
        </Card.Header>
        <Card.Content>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head class="w-10"></Table.Head>
                <Table.Head class="w-20">Track</Table.Head>
                <Table.Head>Power</Table.Head>
                <Table.Head>Current</Table.Head>
                <Table.Head>Max Current</Table.Head>
                <Table.Head>Mode</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each status as track (track.trackletter)}
                {const edit = getEditState(
                  track.trackletter,
                  track.state,
                  track.cab,
                )}
                <Table.Row>
                  <Table.Cell>
                    {#if track.power === "ON"}
                      <Button
                        variant="destructive"
                        size="icon"
                        onclick={() => {
                          writeStringToConnection({
                            command: `<0 ${track.trackletter}>`,
                            id: connectionId,
                          });
                        }}
                      >
                        <PowerOff />
                      </Button>
                    {:else if track.power === "OFF"}
                      <Button
                        size="icon"
                        onclick={() => {
                          writeStringToConnection({
                            command: `<1 ${track.trackletter}>`,
                            id: connectionId,
                          });
                        }}
                      >
                        <Power />
                      </Button>
                    {:else}
                      <Button
                        variant="destructive"
                        class="bg-amber-400"
                        size="icon"
                        onclick={() => {
                          writeStringToConnection({
                            command: `<0 ${track.trackletter}>`,
                            id: connectionId,
                          });
                        }}
                      >
                        <SquareExclamationPoint />
                      </Button>
                    {/if}
                  </Table.Cell>
                  <Table.Cell class="font-bold">{track.trackletter}</Table.Cell>
                  <Table.Cell>
                    <span
                      class={track.power === "ON"
                        ? "text-green-600 font-semibold"
                        : "text-muted-foreground"}
                    >
                      {track.power}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{track.current ?? 0} mA</Table.Cell>
                  <Table.Cell>{track.maxCurrent ?? 0} mA</Table.Cell>
                  <Table.Cell>
                    <div class="flex items-center gap-2">
                      <Select.Root
                        type="single"
                        value={edit.mode}
                        onValueChange={(val) => {
                          if (val) {
                            edit.mode = val;
                            handleUpdateTrack(track.trackletter);
                          }
                        }}
                      >
                        <Select.Trigger class="w-32">
                          <Select.Value placeholder="Select mode" />
                        </Select.Trigger>
                        <Select.Content>
                          {#each DccExTrackStatesList as stateOption}
                            <Select.Item value={stateOption}
                              >{stateOption}</Select.Item
                            >
                          {/each}
                        </Select.Content>
                      </Select.Root>

                      {#if edit.mode.startsWith("DC")}
                        <Input
                          type="number"
                          placeholder="3"
                          class="w-20"
                          bind:value={edit.cab}
                        />
                      {/if}
                    </div>
                  </Table.Cell>
                </Table.Row>
              {:else}
                <Table.Row>
                  <Table.Cell
                    colspan={8}
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
  </div>
</svelte:boundary>
