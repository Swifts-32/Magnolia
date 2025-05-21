<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<main>
  <p>{data.message}</p>
</main>
