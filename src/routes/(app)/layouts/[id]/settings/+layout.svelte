<script lang="ts">
  import type { Snippet } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  let { children }: { children: Snippet } = $props();
</script>

{#snippet layoutButton(name: string, onclick: () => void)}
  <button
    class="border-secondary border-2 p-4 rounded-md w-52 h-12 select-none flex items-center justify-start"
    {onclick}
  >
    <p class="text-2xl">{name}</p>
  </button>
{/snippet}

<div class="flex size-full p-4">
  <div class="w-max p-4 h-full border-primary border-2 rounded-md">
    <h1 class="text-4xl my-10">Settings</h1>

    <div class="flex flex-col gap-3">
      <!-- Layout -->
      {@render layoutButton("Layout", () =>
        goto(`/layouts/${page.params.id}/settings/layout`),
      )}

      <!-- Trains -->
      {@render layoutButton("Trains", () =>
        goto(`/layouts/${page.params.id}/settings/trains`),
      )}

      <!-- Accessories -->
      {@render layoutButton("Accessories", () => {})}

      <!-- Connections -->
      {@render layoutButton("Connections", () =>
        goto(`/layouts/${page.params.id}/settings/connections`),
      )}

      <!-- Sensors -->
      {@render layoutButton("Sensors", () =>
        goto(`/layouts/${page.params.id}/settings/sensors`),
      )}

      <!-- Automations -->
      {@render layoutButton("Automations", () => {})}
    </div>
  </div>
  {@render children()}
</div>
