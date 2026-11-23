<script lang="ts">
  import { getConnection } from "#lib/client/Connections.remote.js";
  import { onMount } from "svelte";
  import * as Card from "#lib/components/ui/card/index.js";
  import Button, {
    buttonVariants,
  } from "#lib/components/ui/button/button.svelte";
  import Switch from "#lib/components/ui/switch/switch.svelte";
  import Label from "#lib/components/ui/label/label.svelte";
  import {
    createSensorCommand,
    deleteSensor,
    getLayoutSensors,
  } from "#lib/client/Sensors.remote.ts";
  import BlockViewer from "./BlockViewer.svelte";
  import * as AlertDialog from "#lib/components/ui/alert-dialog/index.js";
  import { toast } from "svelte-sonner";
  import type {
    SunbeamBlock,
    SunbeamBlockStatus,
  } from "#lib/components/Protocols/Sunbeam/SunbeamTypes.ts";
  import { page } from "$app/state";
  import Checkbox from "#lib/components/ui/checkbox/checkbox.svelte";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  const connection = $derived(await getConnection(connectionId));

  let blocks = $state<SunbeamBlock[]>([]);

  let loading = $state(false);
  let errorMessage = $state<string | null>(null);
  let isEditing = $state(false);

  let activeBlockAddress = $state<string | null>(null);
  let activeAlertAddress = $state<string | null>(null);
  let sensorIdsToDelete = $state<string[]>([]);

  async function fetchBlocks(url: string) {
    loading = true;
    errorMessage = null;

    try {
      const res = await fetch(`${url}/blocks`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      blocks = data.blocks || [];
    } catch (e: any) {
      errorMessage = e.message || "Failed to fetch blocks";
    } finally {
      loading = false;
    }
  }

  async function calibrateAll(url: string) {
    try {
      const res = await fetch(`${url}/calibrate`, { method: "POST" });
      if (!res.ok) throw new Error("Calibration failed");
      await fetchBlocks(url);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    }
  }

  async function calibrateBlock(url: string, uuid: string) {
    try {
      const res = await fetch(`${url}/calibrate/${uuid}`, { method: "POST" });
      if (!res.ok) throw new Error(`Failed to calibrate block ${uuid}`);
      await fetchBlocks(url);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    }
  }

  async function deleteBlock(url: string, uuid: string) {
    try {
      const res = await fetch(`${url}/blocks/${uuid}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete block");
      await fetchBlocks(url);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    }
  }

  onMount(() => {
    if (connection.hardware.type === "WebServer") {
      const url = connection.hardware.baseUrl;

      // Initial fetch to populate blocks right away
      fetchBlocks(url);

      const eventSource = new EventSource(`${url}/events`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data && data.address && data.state) {
            const targetAddress = String(data.address);
            const state = data.state as SunbeamBlockStatus;

            blocks = blocks.map((b) =>
              b.uuid === targetAddress ? { ...b, status: state } : b,
            );
          }
          // Alternatively, if a full block list payload is sent
          else if (data.type === "block_update" || data.blocks) {
            blocks = data.blocks || blocks;
          }
        } catch (e) {
          console.error("Failed to parse SSE event data", e);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
      };

      return () => {
        eventSource.close();
      };
    }
  });
</script>

<svelte:boundary>
  {#snippet pending()}
    <p class="text-neutral-500 animate-pulse">Loading Sunbeam widget...</p>
  {/snippet}

  {#snippet failed(error, reset)}
    <button
      onclick={reset}
      class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      Failed to load Sunbeam widget: {error}. Click to retry.
    </button>
  {/snippet}

  <div class="space-y-6 mx-auto">
    {#await connection}
      <p class="text-neutral-400">Loading connection parameters...</p>
    {:then connection}
      {#if connection && connection.hardware.type === "WebServer"}
        {const url = connection.hardware.baseUrl}

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Video Feed Card -->
          <Card.Root class="border-neutral-800 bg-neutral-900/40 shadow-sm">
            <Card.Header class="pb-2 flex justify-between flex-row">
              <div>
                <Card.Title class="text-lg">Live Detection Stream</Card.Title>
                <Card.Description class="font-mono text-xs text-neutral-400">
                  {#if isEditing}
                    Editing Blocks
                  {:else}
                    MJPEG Video Feed
                  {/if}
                </Card.Description>
              </div>

              <div class="items-center flex gap-2">
                <Label for="switch_feed">Edit Blocks</Label>
                <Switch id="switch_feed" bind:checked={isEditing} />
              </div>
            </Card.Header>
            <Card.Content>
              <div
                class="aspect-video bg-black rounded-lg overflow-hidden border border-neutral-800 flex items-center justify-center"
              >
                <BlockViewer
                  baseUrl={url}
                  {blocks}
                  bind:hoveredBlockAddress={activeBlockAddress}
                  {isEditing}
                  onBlocksUpdated={() => fetchBlocks(url)}
                />
              </div>
            </Card.Content>
          </Card.Root>

          <!-- Block Status Table Card -->
          <Card.Root
            class="border-neutral-800 bg-neutral-900/40 shadow-sm flex flex-col"
          >
            <Card.Header class="pb-2 flex flex-row justify-between">
              <div>
                <Card.Title class="text-lg">Server Blocks</Card.Title>
                <Card.Description>URL: {url}</Card.Description>
              </div>

              <div class="flex items-center gap-3">
                <Button onclick={() => fetchBlocks(url)}>Refresh Blocks</Button>
                <Button onclick={() => calibrateAll(url)}
                  >Calibrate All Blocks</Button
                >
              </div>
            </Card.Header>

            <Card.Content class="flex-1 overflow-auto">
              {#if errorMessage}
                <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
              {/if}

              {#if loading && blocks.length === 0}
                <p class="text-sm text-neutral-400 animate-pulse">
                  Fetching block data...
                </p>
              {:else if blocks.length === 0}
                <p class="text-sm text-neutral-400">
                  No blocks configured on server.
                </p>
              {:else}
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead>
                      <tr
                        class="border-b border-neutral-800 text-neutral-400 text-xs uppercase font-mono"
                      >
                        <th class="pb-2 font-medium">UUID</th>
                        <th class="pb-2 font-medium">Status</th>
                        <th class="pb-2 font-medium">Coords (x,y,w,h)</th>
                        <th class="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      class="divide-y divide-neutral-800/60 font-mono text-xs"
                    >
                      {#each blocks as block}
                        <tr
                          onmouseenter={() => (activeBlockAddress = block.uuid)}
                          onmouseleave={() => (activeBlockAddress = null)}
                          class={activeBlockAddress === block.uuid
                            ? "bg-muted"
                            : ""}
                        >
                          <td class="py-3 max-w-100" title={block.uuid}>
                            {block.uuid}
                          </td>
                          <td class="py-3">
                            <span
                              class="px-1.5 py-0.5 rounded-md font-semibold uppercase text-[10px]"
                              class:bg-emerald-500={block.status === "active"}
                              class:text-neutral-900={block.status === "active"}
                              class:bg-neutral-800={block.status !== "active"}
                              class:text-neutral-300={block.status !== "active"}
                            >
                              {block.status || "unknown"}
                            </span>
                          </td>
                          <td class="py-3 text-neutral-400">
                            {block.x}, {block.y} ({block.width}×{block.height})
                          </td>
                          <td class="py-3 text-right">
                            {#if !(await getLayoutSensors(connection.layoutUuid)).some((a) => a.address === block.uuid)}
                              <Button
                                size="sm"
                                variant="outline"
                                onclick={() => {
                                  createSensorCommand({
                                    address: block.uuid,
                                    layoutId: connection.layoutUuid,
                                    connectionId: connection.uuid,
                                    name: `Sunbeam Sensor (${block.uuid})`,
                                  });
                                }}
                              >
                                Add
                              </Button>
                            {/if}

                            <Button
                              size="sm"
                              variant="outline"
                              onclick={() => calibrateBlock(url, block.uuid)}
                            >
                              Calibrate
                            </Button>

                            <AlertDialog.Root
                              open={activeAlertAddress === block.uuid}
                              onOpenChange={async (open) => {
                                if (open) {
                                  activeAlertAddress = block.uuid;
                                  // Fetch layout sensors and pre-select all matching sensors by default
                                  const layoutSensors = await getLayoutSensors(
                                    page.params.id ?? "",
                                  );
                                  const matching = layoutSensors.filter(
                                    (s) =>
                                      s.connectionId === connectionId &&
                                      s.address === block.uuid,
                                  );
                                  sensorIdsToDelete = matching.map((s) => s.id);
                                } else {
                                  activeAlertAddress = null;
                                  activeBlockAddress = null;
                                  sensorIdsToDelete = [];
                                }
                              }}
                            >
                              <AlertDialog.Trigger
                                class={buttonVariants({
                                  variant: "outline",
                                  size: "sm",
                                })}
                              >
                                Delete
                              </AlertDialog.Trigger>

                              <AlertDialog.Content>
                                <AlertDialog.Header>
                                  <AlertDialog.Title
                                    >Are you absolutely sure?</AlertDialog.Title
                                  >
                                  <AlertDialog.Description>
                                    This action cannot be undone. This will
                                    permanently delete the sensor.
                                  </AlertDialog.Description>
                                </AlertDialog.Header>

                                {#await getLayoutSensors(page.params.id ?? "") then layoutSensors}
                                  {const sensors = layoutSensors.filter(
                                    (s) =>
                                      s.connectionId === connectionId &&
                                      s.address === block.uuid,
                                  )}
                                  {#if sensors.length > 0}
                                    {#if sensors.length > 1}
                                      <p>
                                        These sensors are attached to this
                                        block. Choose which sensors to delete
                                      </p>
                                    {:else}
                                      <p>
                                        This sensor is attached to this block.
                                        Choose whether to delete it.
                                      </p>
                                    {/if}

                                    {#each sensors as sensor}
                                      <div
                                        class="flex justify-between gap-2 items-center"
                                      >
                                        <Checkbox
                                          bind:checked={
                                            () =>
                                              sensorIdsToDelete.includes(
                                                sensor.id,
                                              ),
                                            (v) =>
                                              v
                                                ? sensorIdsToDelete.push(
                                                    sensor.id,
                                                  )
                                                : (sensorIdsToDelete =
                                                    sensorIdsToDelete.filter(
                                                      (id) => id !== sensor.id,
                                                    ))
                                          }
                                        />

                                        <div>
                                          <p>{sensor.name}</p>
                                          <p class="text-sm">
                                            {sensor.address}
                                          </p>
                                        </div>
                                      </div>
                                    {/each}
                                  {/if}
                                {/await}

                                <AlertDialog.Footer>
                                  <AlertDialog.Cancel
                                    onclick={() => {
                                      activeBlockAddress = null;
                                      activeAlertAddress = null;
                                      sensorIdsToDelete = [];
                                    }}>Cancel</AlertDialog.Cancel
                                  >

                                  <AlertDialog.Action
                                    onclick={async () => {
                                      deleteBlock(url, block.uuid);

                                      sensorIdsToDelete.forEach((id) => {
                                        deleteSensor(id);
                                      });

                                      activeBlockAddress = null;
                                      activeAlertAddress = null;
                                      sensorIdsToDelete = [];
                                    }}
                                  >
                                    Delete
                                  </AlertDialog.Action>
                                </AlertDialog.Footer>
                              </AlertDialog.Content>
                            </AlertDialog.Root>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </Card.Content>
          </Card.Root>
        </div>
      {:else}
        <p class="text-amber-500 text-sm">
          Selected connection is not a WebServer hardware type.
        </p>
      {/if}
    {/await}
  </div>
</svelte:boundary>
