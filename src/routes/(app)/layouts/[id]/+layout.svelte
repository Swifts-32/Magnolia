<script lang="ts">
  import { page } from "$app/state";
  import { Toaster } from "svelte-sonner";
  import type { LayoutProps } from "./$types";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar, {
    type AppSidebarItem,
  } from "$lib/components/Sidebar/AppSidebar.svelte";
  import { getLayout } from "$lib/client/layouts.remote";
  import {
    GaugeIcon,
    House,
    LayoutGridIcon,
    LinkIcon,
    SettingsIcon,
    TrainFrontIcon,
  } from "@lucide/svelte";
  import { getlayoutConnections } from "$lib/client/Connections.remote";

  let { children }: LayoutProps = $props();

  const curLink = page.url.pathname;

  const items: Promise<AppSidebarItem[]> = $derived.by(async () => {
    let i: AppSidebarItem[] = [
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
        linkText: "Trains",
        url: `/layouts/${page.params.id}/trains`,
        icon: TrainFrontIcon,
        selectable: true,
      },
      {
        linkText: "Panel",
        url: `/layouts/${page.params.id}/panel`,
        icon: LayoutGridIcon,
        selectable: true,
      },
      {
        linkText: "Settings",
        url: `/layouts/${page.params.id}/settings`,
        icon: SettingsIcon,
        selectable: true,
      },
    ];

    const connectionItem: AppSidebarItem = {
      linkText: "Connections",
      url: undefined,
      icon: LinkIcon,
      selectable: true,
      children: [],
    };

    (await getlayoutConnections(page.params.id)).forEach((conn) => {
      connectionItem.children?.push({
        icon: undefined,
        linkText: conn.name,
        selectable: true,
        status: conn.isConnected ? "success" : "error",
        url: `/layouts/${page.params.id}/connections/${conn.uuid}/`,
      });
    });

    i.splice(2, 0, connectionItem);

    return i;
  });
</script>

<svelte:boundary>
  <Sidebar.Provider>
    <AppSidebar
      layoutName={(await getLayout(page.params.id)).name}
      items={await items}
    />

    <main class="flex-1 overflow-y-auto border-l border-foreground">
      {@render children?.()}
    </main>
  </Sidebar.Provider>

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
