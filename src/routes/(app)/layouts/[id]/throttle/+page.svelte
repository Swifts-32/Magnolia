<script lang="ts">
  import { CircleAlert, Power, PowerOff } from "lucide-svelte";
  import Throttle from "$lib/components/Throttle/throttle.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import type { LayoutData } from "../$types";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { CryptoUUID } from "$lib/LayoutClient.svelte";

  let { data }: { data: LayoutData } = $props();
  let debugValue = $state("");
  let debugTrainValue: number = $state(23);

  let uuid: CryptoUUID | undefined = data.Layout.connections.keys().next()
    .value as CryptoUUID;
</script>

{#if data.Layout}
  <main class="m-5">
    <!-- Debug controls for DCC EX -->
    <div class="my-4 border-2 p-3 flex flex-col gap-2">
      <p>Debug</p>

      <div class="flex gap-2">
        <Button onclick={() => (debugValue = "<t 3 10 0>")}>Speed</Button>
        <Button onclick={() => (debugValue = "<0>")}>Power</Button>
        <Button onclick={() => (debugValue = "<F 3 1 1>")}>Function</Button>
      </div>

      <div class="flex gap-2">
        <Input class="w-30" bind:value={debugValue} />
        <Button class="w-40" onclick={async () => await data.Layout.write(uuid, debugValue)}
          >Send</Button
        >
        <Input class="w-16" bind:value={debugTrainValue} />
        <Button class="w-40" onclick={() => data.Layout.connections
            .get(uuid)
            ?.addTrain(debugTrainValue, `New Train ${debugTrainValue}`)}
          >Add New Train</Button
  
        >
      </div>
    </div>


    <div class="flex gap-2 content-center mb-5">
      <!-- Connection button for theDCC CS
       Shows the connection status of the DCC CS -->
      {#if data.Layout.connections.get(uuid)?.isConnected}
        <Button
          class="w-40"
          onclick={async () => await data.Layout.disconnect(uuid)}
        >
          <PowerOff />
          Disconnect DCC
        </Button>
      {:else}
        <Button
          class="w-40"
          onclick={async () => await data.Layout.connect(uuid)}
        >
          <Power />
          Connect DCC
        </Button>
      {/if}

      <!-- Emergency Stop -->
      <Button
        disabled={!data.Layout.connections.get(uuid)?.isConnected}
        onclick={async () => await data.Layout.write(uuid, "<!>")}
        variant="destructive"
        size="icon"
      >
        <CircleAlert />
      </Button>

      <div class="flex items-center space-x-2">
        <!-- TODO: Add power status to page-->
        <Switch
          disabled={!data.Layout.connections.get(uuid)?.isConnected}
          id="track-power"
          checked={false}
        />
        <Label for="track-power">Track Power</Label>
      </div>
    </div>

    <div class="flex flex-row justify-center gap-4">
      <Throttle curLayout={data.Layout} />
      <Throttle curLayout={data.Layout} />
    </div>
  </main>
{:else}
  <p>Not valid layout</p>
{/if}

<Toaster />
