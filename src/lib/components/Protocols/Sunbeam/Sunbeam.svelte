<script lang="ts">
  import { getConnection } from "#lib/client/Connections.remote.js";
  import { onMount } from "svelte";
  import * as Card from "#lib/components/ui/card/index.js";
  import Button from "#lib/components/ui/button/button.svelte";
  import Toggle from "#lib/components/ui/toggle/toggle.svelte";
  import Switch from "#lib/components/ui/switch/switch.svelte";
  import Label from "#lib/components/ui/label/label.svelte";
  import { createSensor, createSensorCommand, deleteSensor, getLayoutSensors } from "#lib/client/Sensors.remote.ts";
  import BlockEditor from "./BlockEditor.svelte";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  const connection =  $derived(await getConnection(connectionId));

  let blocks = $state<
    Array<{
      uuid: string;
      x: number;
      y: number;
      width: number;
      height: number;
      status: string;
    }>
  >([]);

  let loading = $state(false);
  let errorMessage = $state<string | null>(null);
  let isRawFeed = $state(true);

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
      alert(`Error: ${e.message}`);
    }
  }

  async function calibrateBlock(url: string, uuid: string) {
    try {
      const res = await fetch(`${url}/calibrate/${uuid}`, { method: "POST" });
      if (!res.ok) throw new Error(`Failed to calibrate block ${uuid}`);
      await fetchBlocks(url);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }

  async function deleteBlock(url: string, uuid: string) {
    /* TODO ADD a delete from sunbeam server
    Possibly show dialog that finds all sensors with the correct connection id and address
    and give teh option to select them to delete as well.
    */
    if (!confirm("Are you sure you want to delete this block?")) return;
    try {
      const res = await fetch(`${url}/blocks/${uuid}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete block");
      await fetchBlocks(url);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }

  onMount(() => {
    if (connection.hardware.type === "WebServer") {
      fetchBlocks(connection.hardware.baseUrl);
    }
  })
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


        <!-- Action Toolbar -->
        <div class="flex items-center gap-3">
          <Button onclick={() => fetchBlocks(url)}>Refresh Blocks</Button>
          <Button variant="secondary" onclick={() => calibrateAll(url)}
            >Calibrate All Blocks</Button
          >
          <span class="text-xs font-mono text-neutral-400 ml-auto"
            >Target: {url}</span
          >
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Video Feed Card -->
          <Card.Root class="border-neutral-800 bg-neutral-900/40 shadow-sm">
            <Card.Header class="pb-2 flex justify-between flex-row">
             
              <div>
                <Card.Title class="text-lg">Live Detection Stream</Card.Title>
                <Card.Description class="font-mono text-xs text-neutral-400">
                  {#if isRawFeed}
                    MJPEG Raw Video Feed
                  {:else}
                    MJPEG Video Feed
                  {/if}
                </Card.Description>
              </div>

              <div class="items-center flex gap-2">
                <Label for="switch_feed">Raw Feed</Label>
                <Switch id="switch_feed" bind:checked={isRawFeed}/>
              </div>
            </Card.Header>
            <Card.Content>
              <div
                class="aspect-video bg-black rounded-lg overflow-hidden border border-neutral-800 flex items-center justify-center"
              >
              {#if isRawFeed}
              <BlockEditor baseUrl={url} {blocks} 
    onBlocksUpdated={() => fetchBlocks(url)}/>
              {:else}
                <img
                  src="{url}/video"
                  alt="Sunbeam Video Feed"
                  class="w-full h-full object-contain"
                />
                {/if}
              </div>
            </Card.Content>
          </Card.Root>

          <!-- Block Status Table Card -->
          <Card.Root
            class="border-neutral-800 bg-neutral-900/40 shadow-sm flex flex-col"
          >
            <Card.Header class="pb-2">
              <Card.Title class="text-lg">Server Blocks</Card.Title>
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
                        <tr>
                          <td
                            class="py-3 max-w-100"
                            title={block.uuid}
                          >
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

                            {#if !(await getLayoutSensors(connection.layoutUuid)).some(a => a.address === block.uuid)}
                              <Button
                                size="sm"
                                variant="outline"
                                onclick={() => {
                                  createSensorCommand({
                                    address: block.uuid,
                                    layoutId: connection.layoutUuid,
                                    connectionId: connection.uuid,
                                    name: `Sunbeam Sensor (${block.uuid})`
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
                            <Button
                              size="sm"
                              variant="outline"
                             onclick={() => deleteBlock(url, block.uuid)}
                            >
                              Delete
                          </Button>
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
