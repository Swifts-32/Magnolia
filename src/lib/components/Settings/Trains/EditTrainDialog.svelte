<script lang="ts">
  import FunctionTable from "./Functions/FunctionTable.svelte";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import {
    deleteTrain,
    editTrain,
  } from "../../../../routes/(app)/layouts/[id]/settings/trains/trains.remote";
  import type { Train } from "$lib/server/db/schema/trains";
  import { GripVertical, Plus, Trash2 } from "lucide-svelte";
  import type { Snippet } from "svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import { getConnections } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";
  import {
    createDefaultTrainFunction,
    getTrainFunctions,
  } from "../../../../routes/(app)/layouts/[id]/settings/trains/trainFunctions.remote";
  import { dragHandle, dragHandleZone, type DndEvent } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import FunctionViewer from "./Functions/FunctionViewer.svelte";

  interface Props {
    train: Train;
    children: Snippet;
  }

  let { train, children }: Props = $props();

  let open = $state(false);
  const editTrainForm = editTrain.for(train.uuid);
  const { address, comment, connectionId, layoutId, name, uuid } =
    editTrainForm.fields;

  // Reset the form values
  function onOpenChange() {
    address.set(train.address);
    comment.set(train.comment);
    connectionId.set(train.connectionUuid as string);
    name.set(train.name);
  }
</script>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Edit Train</Dialog.Title>

    <form
      id="edit-train-form"
      {...editTrain.enhance(async ({ submit, form }) => {
        try {
          await submit();
          form.reset();

          // open = false;
          toast.success("Edited train");
        } catch (error) {
          toast.error("Error editing train: " + error);
        }
      })}
      class="flex-col flex gap-2"
    >
      <input {...layoutId.as("hidden", train.layoutUuid)} />
      <input {...uuid.as("hidden", train.uuid)} />

      <!-- Train Name -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <div class="col-span-3">
          <Input id="name" {...name.as("text")} />
          {#each name.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      <!-- Train Description -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="comment" class="text-right">Description</Label>
        <div class="col-span-3">
          <Input id="comment" {...comment.as("text")} />
          {#each comment.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      <!-- Train Address -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="address" class="text-right">Address</Label>
        <div class="col-span-3">
          <Input id="address" {...address.as("text")} />
          {#each address.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      <!-- Train Connections -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="connectionId" class="text-right">Connections</Label>
        <div class="col-span-3">
          <select
            id="connectionId"
            {...connectionId.as("select")}
            class="flex h-10 w-full items-center justify-between rounded-md border border-input
                       bg-background px-3 py-2 text-sm ring-offset-background
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#each await getConnections(train.layoutUuid) as connection}
              <option
                value={connection.uuid}
                class="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {connection.name}
              </option>
            {/each}
          </select>
          {#each connectionId.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      <!-- Add Function Button -->
      <Button
        class="w-full mt-2"
        variant="outline"
        onclick={async () =>
          train && (await createDefaultTrainFunction(train.uuid))}
      >
        <Plus />Add Function
      </Button>

      <!-- TODO Add ability to reorder functions and then update their position -->
      <div
        class="w-full h-fit max-h-100 overflow-y-auto"
      >
        <FunctionTable trainId={train.uuid} />
      </div>
    </form>

    <!-- Delete Train Dialog -->
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button class="w-full mb-3" variant="destructive">
          <Trash2 />Delete Train
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. Are you sure you want to delete this
            train?
          </AlertDialog.Description>
        </AlertDialog.Header>

        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <Dialog.Close>
            <AlertDialog.Action
              onclick={() => {
                if (train) {
                  deleteTrain(train.uuid);
                }
              }}>Delete train</AlertDialog.Action
            >
          </Dialog.Close>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>

    <Dialog.Footer>
      <Dialog.Close>
        <Button type="reset" class="w-28" variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button type="submit" form="edit-train-form" class="w-28">Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
