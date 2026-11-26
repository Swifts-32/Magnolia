<script lang="ts">
  import * as Card from "#lib/components/ui/card/index.js";
  import * as Table from "#lib/components/ui/table/index.js";
  import * as Select from "#lib/components/ui/select/index.js";
  import { getTracksStatus } from "../DccEx.remote";
  import Button from "#lib/components/ui/button/button.svelte";
  import {
    Power,
    PowerOff,
    RefreshCcw,
    SquareExclamationPoint,
  } from "@lucide/svelte";
  import { writeStringToConnection } from "#lib/components/Connections/Connections.remote.ts";
  import Input from "#lib/components/ui/input/input.svelte";
  import type { LogType } from "#lib/components/Terminal/Terminal.svelte";
  import { onMount } from "svelte";
  import { DccExTrackStatesList } from "../DccExTypes";
  import { toast } from "svelte-sonner";

  interface Props {
    connectionId: string;
    addLog: (log: string, type: LogType) => void;
  }

  let { connectionId, addLog }: Props = $props();

  const statusQuery = $derived(getTracksStatus(connectionId));

  // Local state to track pending mode changes and cab numbers per track letter
  let trackEdits = $state<
    Record<string, { mode: string; cab: string; isDirty: boolean }>
  >({});

  onMount(() => {
    statusQuery.reconnect();
  });

  function getEditState(
    trackletter: string,
    currentTrackState: string,
    currentCab?: number | null,
  ) {
    const serverCabStr = currentCab?.toString() ?? "";

    if (!trackEdits[trackletter]) {
      trackEdits[trackletter] = {
        mode: currentTrackState,
        cab: serverCabStr,
        isDirty: false,
      };
    } else if (!trackEdits[trackletter].isDirty) {
      // Two-way sync: Update local state if the server changed it and user isn't actively editing
      trackEdits[trackletter].mode = currentTrackState;
      trackEdits[trackletter].cab = serverCabStr;
    }

    return trackEdits[trackletter];
  }

  async function handleUpdateTrack(trackletter: string) {
    const edit = trackEdits[trackletter];
    if (!edit || !edit.mode) return;

    const mode = edit.mode;
    const cab = edit.cab != null ? String(edit.cab).trim() : "";
    const isDcMode = mode === "DC" || mode === "DC_INV" || mode === "DCX";

    let command = "";

    if (isDcMode) {
      if (!cab) {
        addLog(
          `Error: Track ${trackletter} mode "${mode}" requires a cab/loco number.`,
          "info",
        );
        return;
      }
      command = `<= ${trackletter} ${mode} ${cab}>`;
    } else {
      command = `<= ${trackletter} ${mode}>`;
    }

    addLog(`Sending track config: ${command}`, "out");
    await writeStringToConnection({
      command,
      id: connectionId,
    });

    // Reset dirty flag once successfully sent/triggered
    edit.isDirty = false;
  }
</script>

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
            <Table.Head class="w-10">
              {#if status.some((t) => t.power === "ON")}
                <Button
                  variant="destructive"
                  size="icon"
                  onclick={() => {
                    status.forEach((t) => {
                      writeStringToConnection({
                        command: `<0 ${t.trackletter}>`,
                        id: connectionId,
                      });
                    });
                  }}
                >
                  <PowerOff />
                </Button>
              {:else}
                <Button
                  size="icon"
                  onclick={() => {
                    status.forEach((t) => {
                      writeStringToConnection({
                        command: `<1 ${t.trackletter}>`,
                        id: connectionId,
                      });
                    });
                  }}
                >
                  <Power />
                </Button>
              {/if}</Table.Head
            >
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
                {#if track.state === "NONE"}
                  <Button
                    disabled
                    size="icon"
                    onclick={() => {
                      toast.error("This track is set to NONE.");
                    }}
                  >
                    <SquareExclamationPoint />
                  </Button>
                {:else if track.power === "ON"}
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
                        edit.isDirty = true;

                        if (
                          (val === "DC" || val === "DC_INV" || val === "DCX") &&
                          !edit.cab
                        ) {
                          edit.cab = "3";
                        }

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
                      oninput={() => {
                        edit.isDirty = true;
                      }}
                      onchange={() => {
                        handleUpdateTrack(track.trackletter);
                      }}
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
