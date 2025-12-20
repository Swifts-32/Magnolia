<script lang="ts">
  import { Button } from "../ui/button";
  import { Separator } from "../ui/separator";
  import { RefreshCcw } from "lucide-svelte";
  import { getTracksStatus } from "$lib/client/Connections/Protocols/DccEx.remote";
  import * as Card from "$lib/components/ui/card/index.js";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();
</script>

<svelte:boundary>
  {#snippet pending()}
    <p>loading...</p>
  {/snippet}
  {#snippet failed(error, reset)}
    <button onclick={reset}>oops! try again</button>
  {/snippet}

  <div>
    <Separator class="my-4" />
    <p>Protocol DCC EX</p>

    <div class="flex gap-4 items-center justify-between my-2">
      <p>Tracks Status</p>
      <Button
        size="icon"
        onclick={() => getTracksStatus(connectionId).refresh()}
        ><RefreshCcw /></Button
      >
    </div>

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
