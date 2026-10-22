<script lang="ts">
  import { page } from "$app/state";
  import Fab from "$lib/components/FAB/Fab.svelte";
  import { EllipsisIcon, Plus, TrainFront } from "@lucide/svelte";
  import { goto } from "$app/navigation";
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
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  let { children, params } = $props();
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
        <Table.Head>Connection</Table.Head>
        <Table.Head>Description</Table.Head>
        <Table.Head class="text-end">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each await getLayoutTrains(params.id) as train}
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Button {...props} variant="ghost" size="icon" class="size-8">
                    <EllipsisIcon />
                    <span class="sr-only">Open menu</span>
                  </Button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item
                  onclick={async () => duplicateTrain(train.uuid)}
                  >Duplicate</DropdownMenu.Item
                >
                <DropdownMenu.Separator />

                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    {#snippet child({ props })}
                      <!-- <DropdownMenu.Item {...props} variant="destructive"
                        >Duplicate</DropdownMenu.Item
                      > -->
                      <Button {...props} variant="destructive">Delete</Button>
                    {/snippet}
                  </AlertDialog.Trigger>
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
                        onclick={async () => deleteTrain(train.uuid)}
                        >Continue</AlertDialog.Action
                      >
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>

  <!-- Main content -->
  <!-- <main class="flex-1 py-8 px-6">
    {@render children()}
  </main> -->
</div>

<!-- Add Train Button -->
<AddTrainDialog layoutId={params.id}>
  <Fab label="Add Train">
    <Plus class="size-8" />
  </Fab>
</AddTrainDialog>
