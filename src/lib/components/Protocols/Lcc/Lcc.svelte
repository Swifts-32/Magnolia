<script lang="ts">
  import { onMount, tick } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";

  import {
    getLccLog,
    getLccNodes,
    sendLccCommand,
  } from "$lib/client/Connections/Protocols/Lcc.remote";

  import { writeStringToConnection } from "$lib/client/Connections/connections.remote";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  // Manual raw write
  let rawValue: string = $state("");
  let div: HTMLDivElement;

  onMount(() => {
    const es = new EventSource("/api/protocol-events");

    // scrollToBottom(div);

    es.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.connectionId !== connectionId) return;

      if (data.type === "lcc_nodes") {
        getLccNodes(connectionId).refresh();
      } else if (data.type === "lcc_log") {
        getLccLog(connectionId).refresh();
      }
    };

    return () => es.close();
  });

  // -----------------------------
  // LCC COMMANDS
  // -----------------------------
  function sendInfo() {
    sendLccCommand({
      id: connectionId,
      command: { action: "requestInfo" },
    });
  }

  function sendSnipAll() {
    sendLccCommand({
      id: connectionId,
      command: { action: "requestSnipAll" },
    });
  }

  function sendSnip(nodeId: string) {
    sendLccCommand({
      id: connectionId,
      command: { action: "requestSnip", nodeId },
    });
  }

  function discoverNodes() {
    sendLccCommand({
      id: connectionId,
      command: { action: "discoverNodes" },
    });
  }

  $effect(() => {
    if (!div) return;

    div.scroll({ top: div.scrollHeight, behavior: "smooth" });
  });
</script>

<svelte:boundary>
  {#snippet pending()}
    <p>Loading LCC…</p>
  {/snippet}

  {#snippet failed(error, reset)}
    <button onclick={reset}>Oops! Try again. {error}</button>
  {/snippet}

  <div class="flex flex-col">
    <!-- RAW WRITE -->
    <div class="flex gap-2 items-center">
      <Input bind:value={rawValue} class="h-9" placeholder="Raw write…" />
      <Button
        onclick={() =>
          writeStringToConnection({ id: connectionId, command: rawValue })}
      >
        Write
      </Button>
    </div>

    <div
      bind:this={div}
      class="bg-black text-green-400 font-mono text-sm p-3 rounded-lg h-32 overflow-y-auto whitespace-pre-wrap"
    >
      {#each await getLccLog(connectionId) as log}
        <div class="leading-tight">{log}</div>
      {/each}
    </div>

    <Separator class="my-4" />

    <h2 class="text-xl font-semibold">Protocol: LCC</h2>

    <!-- LCC COMMAND BUTTONS -->
    <p class="text-muted-foreground">Commands</p>
    <div class="flex gap-2 flex-wrap">
      <Button onclick={sendInfo}>Request Info (Broadcast)</Button>
      <Button onclick={sendSnipAll}>Request SNIP (All Nodes)</Button>
      <Button onclick={discoverNodes}>Discover Nodes</Button>
    </div>

    <Separator class="my-4" />

    <!-- NODE LIST -->
    {#await getLccNodes(connectionId)}
      <p>Loading nodes…</p>
    {:then nodes}
      <div class="flex flex-wrap">
        {#each nodes as node}
          <Card.Root>
            <Card.Header>
              <Card.Title>{node.userName || node.id}</Card.Title>
              <Card.Description>ID: {node.id}</Card.Description>
            </Card.Header>

            <Card.Content class="space-y-1 text-sm">
              {#if node.manufacturer}
                <div><strong>Manufacturer:</strong> {node.manufacturer}</div>
              {/if}
              {#if node.model}
                <div><strong>Model:</strong> {node.model}</div>
              {/if}
              {#if node.hwVersion}
                <div><strong>HW:</strong> {node.hwVersion}</div>
              {/if}
              {#if node.swVersion}
                <div><strong>SW:</strong> {node.swVersion}</div>
              {/if}
              {#if node.description}
                <div><strong>Description:</strong> {node.description}</div>
              {/if}

              <div class="text-xs text-muted-foreground">
                Last seen: {new Date(node.lastSeen).toLocaleString()}
              </div>
            </Card.Content>

            <Card.Footer class="flex gap-2">
              <Button size="sm" onclick={() => sendSnip(node.id)}>
                Refresh SNIP
              </Button>
            </Card.Footer>
          </Card.Root>
        {:else}
          <p>No LCC nodes discovered yet.</p>
        {/each}
      </div>
    {/await}
  </div>
</svelte:boundary>
