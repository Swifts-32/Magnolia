<script lang="ts">
  import FunctionTable from "./Functions/FunctionTable.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import {
    deleteTrain,
    editTrain,
    getTrain,
  } from "../../../client/Trains/trains.remote";
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
    trainId: string;
    children: Snippet;
  }

  let { trainId, children }: Props = $props();

  const editTrainForm = $derived(editTrain.for(trainId));
  const connectionIdValue: string = $derived(
    editTrainForm.fields.connectionId.as("select").value as string,
  );
</script>

<Dialog.Root>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content class="sm:min-w-5/6 max-h-11/12 overflow-auto">
    <Dialog.Title>Edit Train</Dialog.Title>

    {#await getTrain(trainId)}
      <p>Loading</p>
    {:then train}
      <form
        id="edit-train-form"
        {...editTrain.enhance(async ({ submit }) => {
          try {
            await submit();
            // form.reset();

            // open = false;
            toast.success("Edited train");
          } catch (error) {
            toast.error("Error editing train: " + error);
          }
        })}
        class="flex-col flex gap-2"
      >
        <input
          {...editTrainForm.fields.layoutId.as("hidden", train.layoutUuid)}
        />
        <input {...editTrainForm.fields.uuid.as("hidden", train.uuid)} />

        <!-- Train Name -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <div class="col-span-3">
            <Input
              id="name"
              {...editTrainForm.fields.name.as("text")}
              value={train.name}
            />
            {#each editTrainForm.fields.name.issues() as issue}
              <p class="text-s text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>

        <!-- Train Description -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="comment" class="text-right">Description</Label>
          <div class="col-span-3">
            <Input
              id="comment"
              {...editTrainForm.fields.comment.as("text")}
              value={train.comment}
            />
            {#each editTrainForm.fields.comment.issues() as issue}
              <p class="text-s text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>

        <!-- Train Address -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="address" class="text-right">Address</Label>
          <div class="col-span-3">
            <Input
              id="address"
              {...editTrainForm.fields.address.as("text")}
              value={train.address}
            />
            {#each editTrainForm.fields.address.issues() as issue}
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
                () =>
                  connectionIdValue
                    ? String(connectionIdValue)
                    : (train.connectionUuid ?? ""),
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

            {#each editTrainForm.fields.connectionId.issues() as issue}
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

        <!-- <div class="w-full h-fit max-h-70 overflow-y-auto">
          <FunctionTable trainId={train.uuid} />
        </div> -->
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
    {:catch e}
      <p>{e}</p>
    {/await}

    <Dialog.Footer>
      <Dialog.Close>
        <Button
          type="reset"
          form="edit-train-form"
          class="w-28"
          variant="outline">Cancel</Button
        >
      </Dialog.Close>
      <Button type="submit" form="edit-train-form" class="w-28">Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
