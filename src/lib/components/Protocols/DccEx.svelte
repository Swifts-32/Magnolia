<script lang="ts">
  import { getTracksStatus } from "$lib/client/Protocols/DccEx.remote";

  interface Props {
    connectionId: string;
  }

  let { connectionId }: Props = $props();
</script>

<p>Dcc E {connectionId}</p>

{#each await getTracksStatus(connectionId) as track}
  <p>{track.trackletter}</p>
{/each}
