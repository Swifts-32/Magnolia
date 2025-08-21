<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { data }: LayoutProps = $props();
</script>

<svelte:head>
  <title>{data.layoutName} Home</title>
</svelte:head>

<p>Mixed View will go here</p>
