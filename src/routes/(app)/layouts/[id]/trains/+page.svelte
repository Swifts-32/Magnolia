<script lang="ts">
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { EllipsisIcon, Plus } from "@lucide/svelte";
  import {
    deleteTrain,
    duplicateTrain,
    getLayoutTrains,
  } from "$lib/client/Trains.remote";
  import { getConnection } from "$lib/client/Connections.remote";
  import AddTrainDialog from "$lib/components/Trains/AddTrainDialog.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import EditTrainForm from "$lib/components/Trains/EditTrainForm.svelte";

  let { params } = $props();
</script>

{#snippet trainConnectionName(connectionId: string)}
  {#await getConnection(connectionId)}
    <p>Loading Connection Info</p>
  {:then connection}
    <p class="text-sm text-gray-400">
      {connection.name}
    </p>
  {:catch}
    <p class="text-sm text-red-400">No Connection</p>
  {/await}
{/snippet}

<div class="flex w-full">
  <Table.Root>
    <Table.Caption>A list of your trains.</Table.Caption>
    <Table.Header class="select-none">
      <Table.Row>
        <Table.Head class="w-25">Name</Table.Head>
        <Table.Head class="w-25">Address</Table.Head>
        <Table.Head class="w-30">Connection</Table.Head>
        <Table.Head>Description</Table.Head>
        <Table.Head class="text-end">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each await getLayoutTrains(params.id) as train}
      {let dropdownOpen = $state(false)}
        {let alertOpen = $state(false)}
        {let drawerOpen = $state(false)}

        <Table.Row>
          <Table.Cell class="font-medium">{train.name}</Table.Cell>
          <Table.Cell>{train.address}</Table.Cell>
          <Table.Cell>
            {#if train.connectionUuid}
              {@render trainConnectionName(train.connectionUuid)}
            {:else}
              No Connection
            {/if}
          </Table.Cell>
          <Table.Cell>{train.comment}</Table.Cell>
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
          drawerOpen = true;
        }} >
                  Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                  onclick={async () => {
                    await duplicateTrain(train.uuid);
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
          alertOpen = true;
        }}
      >
        Delete
      </DropdownMenu.Item>


              </DropdownMenu.Content>
            </DropdownMenu.Root>


            <Drawer.Root bind:open={drawerOpen} direction="right" dismissible={false}>
 <Drawer.Content class="bg-background w-screen!
    max-w-none! fixed inset-0 h-full  border-none rounded-none sm:inset-y-0 sm:right-0 sm:left-auto sm:w-md!
    sm:max-w-md! sm:rounded-none flex flex-col *:w-full">
    
  <Drawer.Header>
      <Drawer.Title>Edit Train</Drawer.Title>
    </Drawer.Header>

<div class="overflow-y-auto px-4 flex-1 w-full">
        <EditTrainForm {train}/>
    </div>
                <Drawer.Footer>
                <Button form="edit-train-form"  type="submit"  onclick={() => drawerOpen=false}>Save</Button>
                <Drawer.Close form="edit-train-form" type="reset" onclick={() => drawerOpen=false}>Cancel</Drawer.Close>
                </Drawer.Footer>
            </Drawer.Content>
            </Drawer.Root>

                            <AlertDialog.Root bind:open={alertOpen}>

                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <AlertDialog.Title
                        >Are you absolutely sure?</AlertDialog.Title
                      >
                      <AlertDialog.Description>
                        This action cannot be undone. This will permanently
                        delete the train.
                      </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                   
                      <AlertDialog.Action
                        onclick={async () => {
                          await deleteTrain(train.uuid);
                          alertOpen = false;
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
</div>

<!-- Add Train Button -->
<AddTrainDialog layoutId={params.id}>
  <Fab label="Add Train">
    <Plus class="size-8" />
  </Fab>
</AddTrainDialog>
