<script lang="ts">
  import { page } from "$app/state";
  import { Toaster } from "svelte-sonner";
  import type { LayoutProps } from "./$types";
  import Button from "#lib/components/ui/button/button.svelte";
  import { getLayout } from "#lib/client/layouts.remote.js";
  import {
    GaugeIcon,
    House,
    LayoutGridIcon,
    LinkIcon,
    SettingsIcon,
    TrainFrontIcon,
  } from "@lucide/svelte";
  import AppSidebar, {
    type AppSidebarItem,
  } from "#lib/components/Navigation/AppSidebar.svelte";
  import AppBottomBar from "#lib/components/Navigation/AppBottomBar.svelte";
  import { IsMobile } from "#lib/hooks/is-mobile.svelte.ts";

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

  const isMobile = new IsMobile();
</script>

<svelte:boundary>
  {#if isMobile.current}
    <main class="flex-1 overflow-y-auto w-full">
      {@render children?.()}
    </main>
    <AppBottomBar {items} />
  {:else if page.params.id}
    <AppSidebar layoutName={(await getLayout(page.params.id)).name} {items}>
      <main class="flex-1 overflow-y-auto w-full">
        {@render children?.()}
      </main>
    </AppSidebar>
  {/if}

  <Toaster richColors theme="dark" position="bottom-left" />

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
</svelte:boundary>
