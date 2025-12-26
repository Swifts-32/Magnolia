<script lang="ts">
  import { Button } from "../ui/button";
  import { Separator } from "../ui/separator";
  import { getTracksStatus } from "$lib/client/Connections/Protocols/DccEx.remote";
  import { onMount } from "svelte";
  import { writeToConnection } from "$lib/client/Connections/connections.remote";
  import { Input } from "../ui/input";
  import * as Card from "$lib/components/ui/card/index.js";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();

  let value: string = $state("<>");

  onMount(() => {
    const es = new EventSource("/api/protocol-events");

    es.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.connectionId !== connectionId) return;

      if (
        data.type === "tracks" ||
        data.type === "power" ||
        data.type === "currents"
      ) {
        getTracksStatus(connectionId).refresh();
      }

      if (data.type === "locos") {
        console.warn("Update Dcc Ex Locos");
      }
    };

    writeToConnection({
      command: "<=>",
      id: connectionId,
    });

    return () => es.close();
  });
</script>

<svelte:boundary>
  {#snippet pending()}
    <p>loading...</p>
  {/snippet}
  {#snippet failed(error, reset)}
    <button onclick={reset}>oops! try again {error}</button>
  {/snippet}

  <div>
    <div class="flex gap-2 items-center">
      <Input bind:value class="h-9" />
      <Button
        onclick={() => writeToConnection({ id: connectionId, command: value })}
        >Write</Button
      >
    </div>

    <Separator class="my-4" />
    <h2>Protocol DCC EX</h2>
    <p>Tracks Status</p>

    <div class="flex flex-wrap gap-2">
      {#each await getTracksStatus(connectionId) as track}
        <Card.Root>
          <Card.Header>
            <Card.Title>Track: {track.trackletter}</Card.Title>
            <Card.Description>Mode: {track.state}</Card.Description>
          </Card.Header>
          <Card.Content>
            <p>Current: {track.current}</p>
            <p>Max Current: {track.maxCurrent}</p>
            <p>Is Powered? {track.power}</p>
            <p>Cab: {track.cab}</p>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  </div>
</svelte:boundary>
