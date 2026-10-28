<script lang="ts">
  import { page } from "$app/state";
  import type { navbarItemData } from "#lib/components/NavBar/linkUtils.svelte.js";
  import * as Item from "#lib/components/ui/item/index.js";
  import { ChevronRight } from "@lucide/svelte";

  const navItems: navbarItemData[] = [
    {
      linkText: "Layout",
      url: `/layouts/${page.params.id}/settings/layout`,
    },
    {
      linkText: "Sensors",
      url: `/layouts/${page.params.id}/settings/sensors`,
    },
  ];
</script>

<div class="flex flex-col gap-4 m-4 h-full items-center">
  {#each navItems as navItem}
    <Item.Root variant="outline" class="w-full lg:w-1/2 md:w-2/3">
      {#snippet child({ props })}
        <a href={navItem.url} {...props}>
          <Item.Content>
            <Item.Title>{navItem.linkText}</Item.Title>
            <Item.Description>Edit the {navItem.linkText}</Item.Description>
          </Item.Content>
          <Item.Actions>
            <ChevronRight class="size-6" />
          </Item.Actions>
        </a>
      {/snippet}
    </Item.Root>
  {/each}
</div>
