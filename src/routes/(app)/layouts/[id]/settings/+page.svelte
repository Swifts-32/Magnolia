<script lang="ts">
  import { goto } from "$app/navigation";
  import type { LayoutData } from "../$types";

  let { data }: { data: LayoutData } = $props();
</script>

{#snippet layoutButton(name: string, onclick: () => void)}
  <button
    class="border-primary border-2 p-2 rounded-md w-96 h-20 select-none"
    {onclick}
  >
    <p class="text-2xl text-center">{name}</p>
  </button>
{/snippet}

<div class="m-4">
  <h1 class="text-4xl my-10">Settings</h1>

  <div class="flex flex-col gap-3">
    {@render layoutButton("Trains", () =>
      goto(`/layouts/${data.layout.uuid}/settings/trains`)
    )}
    {@render layoutButton("Accessories", () => {})}

    {@render layoutButton("Connections", () => {})}
  </div>
</div>

