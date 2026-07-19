<script lang="ts">
  import { page } from "$app/state";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  import HouseIcon from "@lucide/svelte/icons/house";
  import GaugeIcon from "@lucide/svelte/icons/gauge";
  import LinkIcon from "@lucide/svelte/icons/link";
  import TrainFrontIcon from "@lucide/svelte/icons/train-front";
  import LayoutGridIcon from "@lucide/svelte/icons/layout-grid";
  import SettingsIcon from "@lucide/svelte/icons/settings";
    import { ChevronLeft } from "@lucide/svelte";

  // Define icon map for the provided navBar items
  const iconMap: Record<string, any> = {
    Home: HouseIcon,
    Throttle: GaugeIcon,
    Connections: LinkIcon,
    Trains: TrainFrontIcon,
    Panel: LayoutGridIcon,
    Settings: SettingsIcon,
  };

  interface Props {
    layoutName: string,

  }

  let {layoutName}: Props = $props();

  // Build the dynamic navigation array matching your link layout
  const links = $derived([
    // {
    //   linkText: "Home",
    //   url: `/layouts/${page.params.id}`,
    // },
    {
      linkText: "Throttle",
      url: `/layouts/${page.params.id}/throttle`,
    },
    {
      linkText: "Connections",
      url: `/layouts/${page.params.id}/connections`,
    },
    {
      linkText: "Trains",
      url: `/layouts/${page.params.id}/trains`,
    },
    {
      linkText: "Panel",
      url: `/layouts/${page.params.id}/panel`,
    },
    {
      linkText: "Settings",
      url: `/layouts/${page.params.id}/settings`,
    },
  ]);
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Header class="flex items-center px-4 pt-4">
    <a href="/">
      <span class="flex  gap-1 font-semibold truncate ">
        <ChevronLeft/>
        <p class="group-data-[collapsible=icon]:hidden">Home</p>
      </span>
    </a>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>{layoutName}</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each links as item (item.linkText)}
            {const Icon = iconMap[item.linkText] || TrainFrontIcon}
            {const isActive = page.url.pathname === item.url}

            <Sidebar.MenuItem>
              <Sidebar.MenuButton {isActive} title={item.linkText}>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <Icon class="size-4" />
                    <span>{item.linkText}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer />
  <Sidebar.Rail />
</Sidebar.Root>
