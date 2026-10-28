<script lang="ts">
  import { page } from "$app/state";
  import * as Sidebar from "#lib/components/ui/sidebar/index.js";
  import {
    ChevronDown,
    ChevronLeft,
    House,
    PanelLeft,
    type LucideProps,
  } from "@lucide/svelte";
  import * as Collapsible from "#lib/components/ui/collapsible/index.js";
  import type { Component } from "svelte";

  export type AppSidebarItem = {
    linkText: string;
    url: string | undefined;
    icon: Component<LucideProps, {}, ""> | undefined;
    selectable: boolean;
    status?: "success" | "warning" | "error";
    children?: AppSidebarItem[];
  };

  interface Props {
    layoutName: string;
    items: AppSidebarItem[];
  }

  let { layoutName, items = $bindable([]) }: Props = $props();

  const sidebar = Sidebar.useSidebar();

  const getAllUrls = (list: AppSidebarItem[]): string[] => {
    let urls: string[] = [];
    for (const i of list) {
      if (i.url) urls.push(i.url);
      if (i.children) urls.push(...getAllUrls(i.children));
    }
    return urls;
  };

  const allUrls = $derived(getAllUrls(items));

  const isItemActive = (itemUrl: string | undefined): boolean => {
    if (!itemUrl) return false;
    const pathname = page.url.pathname;
    if (pathname === itemUrl) return true;
    if (itemUrl !== "/" && pathname.startsWith(itemUrl + "/")) {
      const hasLongerMatch = allUrls.some(
        (u) =>
          u !== itemUrl &&
          u.startsWith(itemUrl) &&
          (pathname === u || pathname.startsWith(u + "/")),
      );
      return !hasLongerMatch;
    }
    return false;
  };
</script>

{#snippet renderTree(i: AppSidebarItem[])}
  {#each i as item (item.linkText)}
    {@const Icon = item.icon}
    {@const isActive = isItemActive(item.url)}

    {#if item.children && item.children.length > 0}
      <!-- Collapsible Parent Node -->
      <Collapsible.Root class="group/collapsible">
        <Sidebar.MenuItem>
          <Collapsible.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton {...props}>
                {#if Icon}
                  <Icon class="size-4" />
                {/if}
                <span>{item.linkText}</span>
                <ChevronDown
                  class="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
                />
              </Sidebar.MenuButton>
            {/snippet}
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Sidebar.MenuSub>
              {@render renderTree(item.children)}
            </Sidebar.MenuSub>
          </Collapsible.Content>
        </Sidebar.MenuItem>
      </Collapsible.Root>
    {:else}
      <!-- Leaf Node -->
      <Sidebar.MenuItem>
        {#if item.selectable}
          <Sidebar.MenuButton {isActive} title={item.linkText}>
            {#snippet child({ props })}
              <a href={item.url ?? "#"} {...props}>
                <Icon
                  class=" size-4 {isActive
                    ? 'text-secondary'
                    : 'text-card-foreground'}"
                />
                {#if item.status == "error"}
                  <span class="text-red-600">{item.linkText}</span>
                {:else if item.status == "warning"}
                  <span class="text-amber-600">{item.linkText}</span>
                {:else if item.status == "success"}
                  <span class="text-green-600">{item.linkText}</span>
                {:else}
                  <span
                    class={isActive ? "text-secondary" : "text-card-foreground"}
                    >{item.linkText}</span
                  >
                {/if}
              </a>
            {/snippet}
          </Sidebar.MenuButton>
        {:else}
          <!-- Non-selectable leaf node (label only) -->
          <Sidebar.MenuButton
            class="opacity-70 cursor-default"
            title={item.linkText}
          >
            <Icon class="size-4" />
            <span>{item.linkText}</span>
          </Sidebar.MenuButton>
        {/if}
      </Sidebar.MenuItem>
    {/if}
  {/each}
{/snippet}

<Sidebar.Root collapsible="icon">
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton onclick={sidebar.toggle}>
          <PanelLeft />
          <span>Collapse</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>

      <Sidebar.MenuItem>
        <Sidebar.MenuButton>
          {#snippet child({ props })}
            <a href="/" {...props}>
              <ChevronLeft />
              <span>Layouts</span>
            </a>
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
          <!-- Render the full recursive tree -->
          {@render renderTree(items)}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer />
  <Sidebar.Rail />
</Sidebar.Root>
