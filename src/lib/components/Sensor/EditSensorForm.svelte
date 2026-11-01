<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Input } from "#lib/components/ui/input/index.js";
  import Label from "#lib/components/ui/label/label.svelte";
  import * as Select from "#lib/components/ui/select/index.js";
  import { editSensor } from "#lib/client/Sensors.remote.js";
  import {
    getConnection,
    getlayoutConnections,
  } from "#lib/client/Connections.remote.js";
  import { onMount } from "svelte";
  import type { Sensor } from "#lib/server/db/schema/sensors.js";
  import Checkbox from "../ui/checkbox/checkbox.svelte";
  import { protocolSupports } from "#lib/types/protocolConstants.ts";

  interface Props {
    sensor: Sensor;
  }

  let { sensor }: Props = $props();

  const editSensorForm = $derived(editSensor.for(sensor.id));

  const {
    address,
    comment,
    connectionId,
    name,
    layoutId,
    id,
    inverted,
    activationDelay,
    deactivationDelay,
  } = $derived(editSensorForm.fields);

  onMount(() => {
    if (sensor.connectionId) {
      connectionId.set(sensor.connectionId);
    }
    if (sensor.inverted !== undefined) {
      inverted.set(sensor.inverted);
    }
    if (sensor.activationDelay !== undefined) {
      activationDelay.set(sensor.activationDelay);
    }
    if (sensor.deactivationDelay !== undefined) {
      deactivationDelay.set(sensor.deactivationDelay);
    }
  });

  const connectionIdValue: string = $derived(
    connectionId.as("text").value as string,
  );
</script>

<form
  id="edit-sensor-form"
  {...editSensor.enhance(async (form) => {
    try {
      if (await form.submit()) {
        toast.success("Edited sensor");
      }
    } catch (error) {
      toast.error("Error editing sensor: " + error);
    }
  })}
  class="flex-col flex gap-4 w-full max-w-none"
>
  <input {...layoutId.as("hidden", sensor.layoutId)} />
  <input {...id.as("hidden", sensor.id)} />

  <!-- Sensor Name -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="name" class="text-right">Name</Label>
    <div class="col-span-3 flex flex-col gap-1">
      <Input id="name" {...name.as("text", sensor.name)} />
      {#each name.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>

  <!-- Sensor Description / Comment -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="comment" class="text-right">Description</Label>
    <div class="col-span-3 flex flex-col gap-1">
      <Input id="comment" {...comment.as("text", sensor.comment ?? "")} />
      {#each comment.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>

  <!-- Sensor Address -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="address" class="text-right">Address</Label>
    <div class="col-span-3 flex flex-col gap-1">
      <Input id="address" {...address.as("text", sensor.address)} />
      {#each address.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>

  <!-- Inverted Checkbox -->
  <div class="grid grid-cols-4 items-center gap-4">
    <div class="text-right">
      <Label for="inverted">Inverted</Label>
    </div>

    <div class="col-span-3 flex items-center space-x-2">
      <input
        id="inverted"
        {...inverted.as("checkbox", sensor.inverted)}
        class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />

      {#each inverted.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>

  <!-- Activation Delay -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="activationDelay" class="text-right">Activation Delay</Label>
    <div class="col-span-3 flex flex-col gap-1">
      <Input
        id="activationDelay"
        {...activationDelay.as("number", sensor.activationDelay)}
      />
      {#each activationDelay.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>

  <!-- Deactivation Delay -->
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="deactivationDelay" class="text-right">Deactivation Delay</Label>
    <div class="col-span-3 flex flex-col gap-1">
      <Input
        id="deactivationDelay"
        {...deactivationDelay.as("number", sensor.deactivationDelay)}
      />
      {#each deactivationDelay.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>

  <!-- Sensor Connections -->
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
          {#each (await getlayoutConnections(sensor.layoutId)).filter( (c) => protocolSupports(c.protocol, "sensors"), ) as connection}
            <Select.Item value={connection.uuid} label={connection.name}>
              {connection.name}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>

      {#each connectionId.issues() as issue}
        <p class="text-xs text-red-600">{issue.message}</p>
      {/each}
    </div>
  </div>
</form>
