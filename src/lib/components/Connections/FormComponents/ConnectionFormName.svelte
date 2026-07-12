<script lang="ts">
  import type { createConnection } from "$lib/client/Connections.remote";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  interface Props {
    name: typeof createConnection.fields.name;
  }

  const { name }: Props = $props();
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label for="name" class="text-right">Name</Label>
  <div class="col-span-3">
    <Input id="name" {...name.as("text")} />
    {#each name.issues() as issue}
      <p class="text-xs text-red-600">{issue.message}</p>
    {/each}
  </div>
</div>
