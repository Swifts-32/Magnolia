<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.name} Home</title>
</svelte:head>

<p>Mixed View will go here</p>
<p>{data.sessionId}</p>
