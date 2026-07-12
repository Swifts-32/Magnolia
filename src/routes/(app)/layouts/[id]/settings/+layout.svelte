<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import type { navbarItemData } from "$lib/components/NavBar/linkUtils.svelte";

  let { children }: { children: Snippet } = $props();

  const navItems: navbarItemData[] = [
    {
      linkText: "Layout",
      url: `/layouts/${page.params.id}/settings/layout`,
    },
    // {
    //   linkText: "Sensors",
    //   url: `/layouts/${page.params.id}/settings/sensors`,
    // },
  ];
</script>

<div class="flex h-screen border-t border-gray-700">
  <!-- Sidebar -->
  <aside
    class="w-fit bg-card border-r border-gray-700 shadow-sm flex flex-col"
  >
    <nav class="flex-1 p-4 space-y-2">
      {#each navItems as navItem}
        {#if navItem.url == page.url.pathname}
          <div
            class="block px-4 py-2 rounded-md text-primary-disabled text-lg font-medium"
          >
            {navItem.linkText}
          </div>
        {:else}
          <a
            href={navItem.url}
            class="block px-4 py-2 rounded-md text-card-foreground text-lg font-medium hover:text-primary transition-colors"
          >
            {navItem.linkText}
          </a>
        {/if}
      {/each}
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 py-8 px-6 overflow-y-auto">
    {@render children()}
  </main>
</div>
