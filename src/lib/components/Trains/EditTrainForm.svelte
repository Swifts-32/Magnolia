<script lang="ts">
  import FunctionTable from "./Functions/FunctionTable.svelte";
  import { toast } from "svelte-sonner";
  import InputField from "#lib/components/Form/InputField.svelte";
  import Label from "#lib/components/ui/label/label.svelte";
  import * as Select from "#lib/components/ui/select/index.js";
  import { editTrain } from "#lib/client/Trains.remote.js";
  import {
    getConnection,
    getlayoutConnections,
  } from "#lib/client/Connections.remote.js";
  import { onMount } from "svelte";
  import type { Train } from "#lib/server/db/schema/trains.js";
  import { protocolSupports } from "#lib/types/protocolConstants.ts";

  interface Props {
    train: Train;
  }

  let { train }: Props = $props();

  const editTrainForm = $derived(editTrain.for(train.uuid));

  const { address, comment, connectionId, name, layoutId, uuid } = $derived(
    editTrainForm.fields,
  );

  onMount(() => {
    if (train.connectionUuid) {
      connectionId.set(train.connectionUuid);
    }
  });

  const connectionIdValue: string = $derived(
    connectionId.as("text").value as string,
  );

  let functionTable: FunctionTable | undefined;
</script>

<form
  id="edit-train-form"
  {...editTrain.enhance(async (form) => {
    try {
      if (await form.submit()) {
        await functionTable?.save();

        toast.success("Edited train");
      }
    } catch (error) {
      toast.error("Error editing train: " + error);
    }
  })}
  class="flex-col flex gap-2 w-full max-w-none"
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
        allowDeselect={true}
        {...connectionId.as("text")}
        bind:value={
          () => connectionId.value(),
          (value) => value && connectionId.set(value)
        }
      >
        <Select.Trigger class="col-span-3">
          {#snippet children()}
            {#if connectionIdValue}
              {#await getConnection(connectionIdValue)}
                Loading connection...
              {:then conn}
                {conn.name}
              {:catch}
                Select a Connection
              {/await}
            {:else}
              Select a Connection
            {/if}
          {/snippet}
        </Select.Trigger>
        <Select.Content>
          {#each (await getlayoutConnections(train.layoutUuid)).filter( (c) => protocolSupports(c.protocol, "trains"), ) as connection}
            <Select.Item value={connection.uuid} label={connection.name}
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

  <div class="w-full">
    <FunctionTable trainId={train.uuid} bind:this={functionTable} />
  </div>
</form>
