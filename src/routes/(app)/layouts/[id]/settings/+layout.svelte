<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";

  let { children }: { children: Snippet } = $props();

  const pages: {
    name: string;
    link: string;
  }[] = [
    {
      name: "Layout",
      link: `/layouts/${page.params.id}/settings/layout`,
    },
    {
      name: "Connections",
      link: `/layouts/${page.params.id}/settings/connections`,
    },
    {
      name: "Trains",
      link: `/layouts/${page.params.id}/settings/trains`,
    }
  ];
</script>

<div class="flex size-full p-4">
  <div class="w-max p-4 h-full border-primary border-2 rounded-md">
    <h1 class="text-4xl my-10">Settings</h1>

    <div class="flex flex-col gap-3">
      {#each pages as page}
        <a
          class="border-secondary border-2 p-4 rounded-md w-52 h-12 select-none flex items-center justify-start"
          href={page.link}
        >
          <p class="text-2xl">{page.name}</p>
        </a>
      {/each}
    </div>
  </div>
  {@render children()}
</div>
