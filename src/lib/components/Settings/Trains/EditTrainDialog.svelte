<script lang="ts">
  import FunctionTable from "./Functions/FunctionTable.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import { deleteTrain, editTrain } from "../../../client/Trains/trains.remote";
  import type { Train } from "$lib/server/db/schema/trains";
  import { Plus, Trash2 } from "lucide-svelte";
  import type { Snippet } from "svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import {
    getConnection,
    getConnections,
  } from "../../../client/Connections/connections.remote";
  import { createDefaultTrainFunction } from "../../../client/Trains/Functions/trainFunctions.remote";
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    train: Train;
    children: Snippet;
  }

  let { train, children }: Props = $props();

  // let open = $state(false);

  const editTrainForm = editTrain.for(train.uuid);
  const { address, comment, connectionId, layoutId, name, uuid } =
    editTrainForm.fields;

  const connectionIdValue: string = $derived(
    connectionId.as("select").value as string,
  );

  // Reset the form values
  function onOpenChange() {
    address.set(train.address);
    comment.set(train.comment);
    connectionId.set(train.connectionUuid as string);
    name.set(train.name);
  }
</script>

<Dialog.Root {onOpenChange}>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content class="sm:min-w-5/6 max-h-11/12 overflow-auto">
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
          <Select.Root
            type="single"
            {...editTrainForm.fields.connectionId.as("text")}
            bind:value={
              () => (connectionIdValue ? String(connectionIdValue) : undefined),
              (value) =>
                editTrainForm.fields.connectionId.set(value ?? "undefined")
            }
          >
            <Select.Trigger class="col-span-3">
              {connectionIdValue
                ? (await getConnection(connectionIdValue)).name
                : "Select a connection"}
            </Select.Trigger>
            <Select.Content>
              {#each await getConnections(train.layoutUuid) as connection}
                <Select.Item value={connection.uuid}
                  >{connection.name}</Select.Item
                >
              {/each}
            </Select.Content>
          </Select.Root>

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

      <div class="w-full h-fit max-h-70 overflow-y-auto">
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
