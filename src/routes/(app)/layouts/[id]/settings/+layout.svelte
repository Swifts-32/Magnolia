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
    },
  ];
</script>

<div class="flex h-screen">
  <!-- Sidebar -->
  <aside
    class="w-64 bg-card border-r border-card-foreground shadow-sm flex flex-col"
  >
    <div class="p-6 border-b border-card-foreground">
      <h1 class="text-2xl font-bold text-card-foreground">Settings</h1>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      {#each pages as page1}
        {#if page1.link == page.url.pathname}
          <div
            class="block px-4 py-2 rounded-md text-primary-disabled text-lg font-medium"
          >
            {page1.name}
          </div>
        {:else}
          <a
            href={page1.link} 
            class="block px-4 py-2 rounded-md text-card-foreground text-lg font-medium hover:text-primary transition-colors"
          >
            {page1.name}
          </a>
        {/if}
      {/each}
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-6 overflow-y-auto">
    {@render children()}
  </main>
</div>
