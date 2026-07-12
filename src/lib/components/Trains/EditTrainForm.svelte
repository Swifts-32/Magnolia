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
  import { Trash2 } from "lucide-svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

  import InputField from "$lib/components/Form/InputField.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    getConnection,
    getlayoutConnections,
  } from "$lib/client/Connections/connections.remote";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

  interface Props {
    trainId: string;
  }

  let { trainId }: Props = $props();

  const train = $derived(await getTrain(trainId));
  const editTrainForm = $derived(editTrain.for(train.uuid));

  const { address, comment, connectionId, name, layoutId, uuid } = $derived(
    editTrainForm.fields,
  );


  const connectionIdValue = $derived(connectionId.as("select").value);

  let functionTable: FunctionTable | undefined;
</script>

<!-- Delete Train Dialog -->
{#snippet deleteTrainDialog()}
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
            onclick={async () => {
                await deleteTrain(train.uuid);
                goto(`/layouts/${page.params.id}/trains`)
            }}>Delete train</AlertDialog.Action
          >
        </Dialog.Close>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/snippet}

<div class="w-full flex flex-col items-center">
  <form
    id="edit-train-form"
    {...editTrain.enhance(async (form) => {
      try {
        if (await form.submit()) {
          form.element.reset();

          await functionTable?.save();

          toast.success("Edited train");
        }
      } catch (error) {
        toast.error("Error editing train: " + error);
      }
    })}
    class="flex-col flex gap-2 w-200 grow"
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
          {const triggerValue = $derived.by(async () => {
            const connValue = connectionId.value()
            if (!connValue) return "Select a Connection"

            return (await getConnection(connValue)).name
          })}
          {await triggerValue}
          </Select.Trigger>
          <Select.Content>
            {#each await getlayoutConnections(train.layoutUuid) as connection}
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

    <div class="w-full overflow-y-auto">
      <FunctionTable trainId={train.uuid} bind:this={functionTable} />
    </div>
  </form>

  <div class="flex gap-4 my-4">
    {@render deleteTrainDialog()}

    <Button type="reset" form="edit-train-form" class="w-28" variant="outline"
      >Cancel</Button
    >
    <Button type="submit" form="edit-train-form" class="w-28">Save</Button>
  </div>
</div>
