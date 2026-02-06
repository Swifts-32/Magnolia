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
  import InputField from "$lib/components/Form/InputField.svelte";
  import { any } from "zod/v4";

  interface Props {
    trainId: string;
    children: Snippet;
  }

  let { trainId, children }: Props = $props();

  const train = $derived(await getTrain(trainId));
  const editTrainForm = $derived(editTrain.for(train.uuid));

  const { address, comment, connectionId, name, layoutId, uuid } = $derived(
    editTrainForm.fields,
  );

  connectionId.set(train.connectionUuid ?? "undefined");

  const connectionIdValue = $derived(connectionId.as("select").value);

  let open = $state(false);
  let functionTable: FunctionTable | undefined;
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content class="sm:min-w-5/6 max-h-11/12 overflow-auto">
    <Dialog.Title>Edit Train</Dialog.Title>

    <form
      id="edit-train-form"
      {...editTrain.enhance(async ({ submit }) => {
        try {
          await submit();
          // form.reset();

          await functionTable?.save();
          open = false;
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
      <InputField id="name" label="Name" value={train.name} field={name} />

      <!-- Train Description -->
      <InputField
        id="comment"
        label="Description"
        value={train.comment}
        field={comment}
      />

      <!-- Train Address -->
      <InputField
        id="address"
        label="Address"
        value={train.address}
        field={address}
      />

      <!-- Train Connections -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="connectionId" class="text-right">Connections</Label>
        <div class="col-span-3">
          <Select.Root
            type="single"
            {...connectionId.as("text")}
            bind:value={
              () =>
                typeof connectionIdValue === "number"
                  ? undefined
                  : connectionIdValue,
              (value) => value && connectionId.set(value)
            }
          >
            <Select.Trigger class="col-span-3">
              {(await getConnection(connectionId.value())).name ??
                "Select a connection"}
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

      <div class="w-full h-fit max-h-70 overflow-y-auto">
        <FunctionTable trainId={train.uuid} bind:this={functionTable} />
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
