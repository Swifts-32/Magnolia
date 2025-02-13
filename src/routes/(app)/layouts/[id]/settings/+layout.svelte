<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import { goto } from "$app/navigation";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

{#snippet layoutButton(name: string, onclick: () => void)}
  <button
    class="border-secondary border-2 p-4 rounded-md w-52 h-12 select-none flex items-center justify-start"
    {onclick}
  >
    <p class="text-2xl">{name}</p>
  </button>
{/snippet}

<div class="flex">
  <div class="w-max m-4 p-4 h-full border-primary border-2 rounded-md">
    <h1 class="text-4xl my-10">Settings</h1>

    <div class="flex flex-col gap-3">
      {@render layoutButton("Layout", () =>
        goto(`/layouts/${data.layout.uuid}/settings/layout`)
      )}
      {@render layoutButton("Trains", () =>
        goto(`/layouts/${data.layout.uuid}/settings/trains`)
      )}
      {@render layoutButton("Accessories", () => {})}

      {@render layoutButton("Connections", () =>
        goto(`/layouts/${data.layout.uuid}/settings/connections`)
      )}
    </div>
  </div>
  {@render children()}

</div>
