<script lang="ts">
  import { onMount, tick } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";

  import {
    getLccLog,
    getLccNodes,
    sendLccCommand,
  } from "$lib/client/Connections/Protocols/Lcc.remote";

  import { writeStringToConnection } from "$lib/client/Connections/connections.remote";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import { toast } from "svelte-sonner";

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

        if (!div) return;
        div.scroll({ top: div.scrollHeight, behavior: "smooth" });
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

  function requestCdi(nodeId: string) {
    sendLccCommand({
      id: connectionId,
      command: { action: "requestCdi", nodeId },
    });
  }

  async function submit() {
    if (!rawValue.trim()) return;

    writeStringToConnection({ id: connectionId, command: rawValue });

    rawValue = "";
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }
</script>

<svelte:boundary>
  {#snippet pending()}
    <p>Loading LCC…</p>
  {/snippet}

  {#snippet failed(error, reset)}
    <button onclick={reset}>Oops! Try again. {error}</button>
  {/snippet}

  <div class="flex flex-col">
    <!-- Terminal -->
    <div
      class="flex flex-col bg-black text-green-400 font-mono text-sm rounded-lg h-40"
    >
      <!-- SCROLLING LOG AREA -->
      <div
        bind:this={div}
        class="flex-1 overflow-y-auto p-3 whitespace-pre-wrap"
      >
        {#each await getLccLog(connectionId) as log}
          <div class="leading-tight">{log}</div>
        {/each}
      </div>

      <!-- INPUT BAR -->
      <Separator class="h-px" />

      <div class="p-2 flex items-center gap-2">
        <span class="text-primary">$</span>
        <input
          bind:value={rawValue}
          onkeydown={handleKey}
          class="flex-1 bg-black text-green-400 outline-none border-none font-mono"
          placeholder="Type command and press Enter…"
        />
        <Button
          onclick={submit}
          class="px-3 py-1 bg-green-700 text-black font-bold rounded hover:bg-green-600"
        >
          Send
        </Button>
      </div>
    </div>

    <Separator class="mb-4" />

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

              {#if node.cdiLoaded}
                <details class="mt-2">
                  <summary class="cursor-pointer text-blue-400"
                    >Show CDI</summary
                  >
                  <pre
                    class="bg-gray-900 text-green-400 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                      {node.cdi}
                  </pre>
                </details>
              {/if}
            </Card.Content>

            <Card.Footer class="flex gap-2">
              <Button size="sm" onclick={() => sendSnip(node.id)}>
                Refresh SNIP
              </Button>

              <Button onclick={() => requestCdi(node.id)}>Request CDI</Button>
            </Card.Footer>
          </Card.Root>
        {:else}
          <p>No LCC nodes discovered yet.</p>
        {/each}
      </div>
    {/await}
  </div>
</svelte:boundary>
