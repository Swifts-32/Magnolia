<script lang="ts">
  import { page } from "$app/state";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import HouseIcon from "@lucide/svelte/icons/house";
  import GaugeIcon from "@lucide/svelte/icons/gauge";
  import LinkIcon from "@lucide/svelte/icons/link";
  import TrainFrontIcon from "@lucide/svelte/icons/train-front";
  import LayoutGridIcon from "@lucide/svelte/icons/layout-grid";
  import SettingsIcon from "@lucide/svelte/icons/settings";
    import { ChevronDown, ChevronLeft, House, Settings } from "@lucide/svelte";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";

  // Define icon map for the provided navBar items
  const iconMap: Record<string, any> = {
    // Home: HouseIcon,
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

    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
         <Sidebar.MenuButton>
        {#snippet child({ props })}
        <a href="/" {...props}>
        <House />
        <span>Home</span>
        </a>
        {/snippet}
        </Sidebar.MenuButton>
        </Sidebar.MenuItem>

      <Sidebar.MenuItem>
        <Sidebar.MenuButton>
          {#snippet child({ props })}
            <Sidebar.Trigger />
      
  {/snippet}
</Sidebar.MenuButton>
      
      </Sidebar.MenuItem>

    </Sidebar.Menu>
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


            <Collapsible.Root open class="group/collapsible">
    <Sidebar.MenuItem>
      <Collapsible.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton {...props}>
            <Settings class="size-4" />
            <!-- <span>{item.linkText}</span> -->
            Groups of Items
              <!-- {#snippet child({ props })}
                {/snippet} -->
          </Sidebar.MenuButton>
        {/snippet}
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Sidebar.MenuSub>
          <Sidebar.MenuSubItem>
                <Sidebar.MenuSubButton>
                <TrainFrontIcon/>
                Item 1
              </Sidebar.MenuSubButton>
            </Sidebar.MenuSubItem>
            
            
            <Sidebar.MenuSubItem>
              <Sidebar.MenuSubButton>
                <TrainFrontIcon/>
                  Item 2
                </Sidebar.MenuSubButton>
          </Sidebar.MenuSubItem>
         
        </Sidebar.MenuSub>
      </Collapsible.Content>
    </Sidebar.MenuItem>
  </Collapsible.Root>

        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer />
  <Sidebar.Rail />
</Sidebar.Root>
