<script lang="ts">
  import { page } from "$app/state";
  import { Toaster } from "svelte-sonner";
  import type { LayoutProps } from "./$types";
  import Button from "#lib/components/ui/button/button.svelte";
  import * as Sidebar from "#lib/components/ui/sidebar/index.js";
  import AppSidebar, {
    type AppSidebarItem,
  } from "#lib/components/Sidebar/AppSidebar.svelte";
  import { getLayout } from "#lib/client/layouts.remote.js";
  import {
    GaugeIcon,
    House,
    LayoutGridIcon,
    LinkIcon,
    SettingsIcon,
    TrainFrontIcon,
  } from "@lucide/svelte";

  let { children }: LayoutProps = $props();

  const items: AppSidebarItem[] = [
    {
      linkText: "Home",
      url: `/layouts/${page.params.id}`,
      icon: House,
      selectable: true,
    },
    {
      linkText: "Throttle",
      url: `/layouts/${page.params.id}/throttle`,
      icon: GaugeIcon,
      selectable: true,
    },
    {
      linkText: "Panel",
      url: `/layouts/${page.params.id}/panel`,
      icon: LayoutGridIcon,
      selectable: true,
    },
    {
      linkText: "Connections",
      url: `/layouts/${page.params.id}/connections`,
      icon: LinkIcon,
      selectable: true,
    },
    {
      linkText: "Trains",
      url: `/layouts/${page.params.id}/trains`,
      icon: TrainFrontIcon,
      selectable: true,
    },
    {
      linkText: "Settings",
      url: `/layouts/${page.params.id}/settings`,
      icon: SettingsIcon,
      selectable: true,
    },
  ];
</script>

<svelte:boundary>
  <Sidebar.Provider>
    <!-- Desktop Sidebar (Hidden on mobile) -->
    <div class="hidden md:block">
      {#if page.params.id}
        <AppSidebar
          layoutName={(await getLayout(page.params.id)).name}
          {items}
        />
      {/if}
    </div>

    <!-- Main Content (Added bottom padding so content isn't hidden behind the mobile bar) -->
    <main class="flex-1 overflow-y-auto pb-20 md:pb-0 w-full">
      {@render children?.()}
    </main>
  </Sidebar.Provider>

  <!-- Mobile Bottom Navigation Bar (Rendered at root level outside Sidebar.Provider to escape containing blocks) -->
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-center justify-around h-16 px-2 shadow-lg"
  >
    {#each items as item}
      {@const Icon = item.icon}
      {@const isActive = item.url ? page.url.pathname === item.url : false}
      <a
        href={item.url ?? "#"}
        class="flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors {isActive
          ? 'text-secondary font-medium'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        {#if Icon}
          <Icon class="size-5" />
        {/if}
        <span class="truncate max-w-15">{item.linkText}</span>
      </a>
    {/each}
  </nav>

  {#snippet pending()}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div
        class="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  {/snippet}

  {#snippet failed(error, reset)}
    <p>Error: {error}</p>
    <Button onclick={reset}>Try again</Button>
  {/snippet}
  <Toaster richColors theme="dark" position="bottom-left" />
</svelte:boundary>
