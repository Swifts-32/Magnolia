<script lang="ts">
  import { page } from "$app/state";
  import type { AppSidebarItem } from "./AppSidebar.svelte";

  interface Props {
    items: AppSidebarItem[];
  }

  let { items = $bindable([]) }: Props = $props();

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

<nav
  class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-center justify-around h-16 px-2 shadow-lg"
>
  {#each items as item}
    {@const Icon = item.icon}
    {@const isActive = isItemActive(item.url)}
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
