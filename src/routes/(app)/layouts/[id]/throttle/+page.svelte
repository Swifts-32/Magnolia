<script lang="ts">
  import { Power, PowerOff } from "lucide-svelte";
  import Throttle from "$lib/components/Throttle/throttle.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import type { LayoutData } from "../$types";
  import { Toaster } from "$lib/components/ui/sonner";

  let { data }: { data: LayoutData } = $props();

  function disconnect() {
    for (const connection of data.layout.connections.values()) {
      connection.disconnect();
    }
  }

  function connect() {
    for (const connection of data.layout.connections.values()) {
      connection.connect();
    }
  }
</script>

{#if data.layout}
  <main class="m-5">
    <div class="flex gap-2 content-center mb-5">
      <Button class="w-40" onclick={() => connect()}>
        <Power />
        Connect
      </Button>
      <Button class="w-40" onclick={() => disconnect()}>
        <PowerOff />
        Disconnect
      </Button>

      <div class="flex items-center space-x-2">
        <!-- TODO: Add power status to page-->
        <Switch id="track-power" checked={false} />
        <Label for="track-power">Track Power</Label>
      </div>
    </div>

    <div class="flex flex-row justify-center gap-4">
      <Throttle layout={data.layout} />
      <Throttle layout={data.layout} />
    </div>
  </main>
{:else}
  <p>Not valid layout</p>
{/if}

<Toaster />
