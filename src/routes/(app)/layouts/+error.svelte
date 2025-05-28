<script lang="ts">
  import { page } from "$app/state";
</script>

<h1>HELLO{page.status}: {page.error?.message}</h1>
