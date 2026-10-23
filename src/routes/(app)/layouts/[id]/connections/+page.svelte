<script lang="ts">
  import { page } from "$app/state";
  import AddConnectionDialog from "$lib/components/Connections/AddConnectionDialog.svelte";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { EllipsisIcon, Plus, SquareArrowOutUpRight } from "@lucide/svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { connectConnection, deleteConnection, disconnectConnection, duplicateConnection, getlayoutConnections } from "$lib/client/Connections.remote";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { goto } from "$app/navigation";

  let selectedUuid = $state<string | null>(null);
  let activeEditUuid = $state<string | null>(null);
  let activeAlertUuid = $state<string | null>(null);

  async function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
      return;
    }

    if (!selectedUuid) return;

    if (event.key === "e") {
      event.preventDefault();
      activeEditUuid = selectedUuid;
    } else if (event.key === "d") {
      event.preventDefault();
      await duplicateConnection(selectedUuid);
    } else if (event.key === "Delete" && event.ctrlKey) {
      event.preventDefault();
      await deleteConnection(selectedUuid);
      activeAlertUuid = null;
    } else if (event.key === "Delete") {
      event.preventDefault();
      activeAlertUuid = selectedUuid;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex">

      <Table.Root>
    <Table.Caption>A list of your connections.</Table.Caption>
    <Table.Header class="select-none">
      <Table.Row>
        <Table.Head class="w-5"></Table.Head>
        <Table.Head class="w-25">Name</Table.Head>
        <Table.Head class="w-30">Connected</Table.Head>
        <Table.Head class="w-20">Protocol</Table.Head>
        <Table.Head class="w-20">Hardware</Table.Head>
        <Table.Head class="text-end">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each await getlayoutConnections(page.params.id) as conn}
        {let dropdownOpen = $state(false)}

        <Table.Row 
          class="cursor-pointer outline-none focus-visible:bg-muted/50 {selectedUuid === conn.uuid ? 'bg-muted/30' : ''}"
          tabindex={0}
          onmouseenter={() => selectedUuid = conn.uuid}
          onmouseleave={() => selectedUuid = null}
          onfocus={() => selectedUuid = conn.uuid}
        >
          <Table.Cell>
            <SquareArrowOutUpRight  onclick={() => goto(`${page.url.pathname}/${conn.uuid}`)} /></Table.Cell>
          <Table.Cell class="font-medium">{conn.name}</Table.Cell>
          <Table.Cell>
            {#if conn.isConnected}
              <Button class="w-25" onclick={async () =>
                await disconnectConnection(conn.uuid)
              }>
              Disconnect
              </Button>
            {:else}
              <Button class="w-25" onclick={async () => 
                await connectConnection(conn.uuid)
              }>
              Connect
              </Button>
            {/if}
          </Table.Cell>
          <Table.Cell>{conn.protocol}</Table.Cell>
          <Table.Cell>{conn.hardware.type}</Table.Cell>
          <Table.Cell class="text-right">
            <DropdownMenu.Root bind:open={dropdownOpen}>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Button {...props} variant="ghost" size="icon" class="size-8">
                    <EllipsisIcon />
                    <span class="sr-only">Open menu</span>
                  </Button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item onclick={() => {
                  dropdownOpen = false;
                  activeEditUuid = conn.uuid;
                }}>
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onclick={async () => {
                    await duplicateConnection(conn.uuid);
                    dropdownOpen = false;
                  }}
                >
                    Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Separator />

                <DropdownMenu.Item 
                  class="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onclick={() => {
                    dropdownOpen = false;
                    activeAlertUuid = conn.uuid;
                  }}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Drawer.Root open={activeEditUuid === conn.uuid} 
              onOpenChange={(open) => { 
                if (!open && activeEditUuid === conn.uuid) activeEditUuid = null; 
              }} direction="right" dismissible={false}>
              <Drawer.Content class="bg-background w-screen!
                  max-w-none! fixed inset-0 h-full  border-none rounded-none sm:inset-y-0 sm:right-0 sm:left-auto sm:w-md!
                  sm:max-w-md! sm:rounded-none flex flex-col *:w-full">
                  <Drawer.Header>
                    <Drawer.Title>Edit Connection</Drawer.Title>
                  </Drawer.Header>

                  <Drawer.Footer>
                    <Button form="edit-connection-form"  type="submit"  onclick={() => activeEditUuid=null}>Save</Button>
                    <Drawer.Close form="edit-train-form" type="reset" onclick={() => activeEditUuid=null}>Cancel</Drawer.Close>
                  </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Root>

            <AlertDialog.Root open={activeAlertUuid === conn.uuid} 
              onOpenChange={(open) => { if (!open) activeAlertUuid = null; }}
              >

                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <AlertDialog.Title
                        >Are you absolutely sure?</AlertDialog.Title
                      >
                      <AlertDialog.Description>
                        This action cannot be undone. This will permanently
                        delete the connection.
                      </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                      <AlertDialog.Cancel onclick={() => activeAlertUuid = null}>Cancel</AlertDialog.Cancel>                   
                      <AlertDialog.Action
                        onclick={async () => {
                          await deleteConnection(conn.uuid);
                          activeAlertUuid = null;
                          dropdownOpen = false;
                        }}
                      >
                        Continue
                      </AlertDialog.Action>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>

  <!-- Add Connection Button -->
  <AddConnectionDialog layoutId={page.params.id}>
    <Fab label="Add Connection">
      <Plus class="size-8" />
    </Fab>
  </AddConnectionDialog>
</div>
