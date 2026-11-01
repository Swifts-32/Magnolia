<script lang="ts">
  import type { RemoteFormIssue } from "$app/server";
  import { toast } from "svelte-sonner";
  import { Label } from "#lib/components/ui/label/index.js";
  import { Input } from "#lib/components/ui/input/index.js";
  import { Button } from "#lib/components/ui/button/index.js";
  import type { Snippet } from "svelte";
  import * as Dialog from "#lib/components/ui/dialog/index.js";
  import * as Select from "#lib/components/ui/select/index.js";
  import { createSensor } from "#lib/client/Sensors.remote.js";
  import {
    getConnection,
    getlayoutConnections,
  } from "#lib/client/Connections.remote.js";
  import Checkbox from "../ui/checkbox/checkbox.svelte";

  interface Props {
    layoutId: string;
    children: Snippet;
  }

  let { layoutId, children }: Props = $props();

  const {
    address,
    comment,
    connectionId,
    layoutId: layoutIdForm,
    name,
    inverted,
    activationDelay,
    deactivationDelay,
  } = createSensor.fields;

  const connectionIdValue: string = $derived(
    connectionId.as("text").value as string,
  );

  let open = $state(false);
</script>

{#snippet issues(i: RemoteFormIssue[] | undefined)}
  {#each i ?? [] as issue}
    <p class="text-sm text-red-600">{issue.message}</p>
  {/each}
{/snippet}

<Dialog.Root
  bind:open
  onOpenChange={() => {
    createSensor.element?.reset();
  }}
>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Create Sensor</Dialog.Title>

    <form
      id="add-sensor-form"
      {...createSensor.enhance(async (form) => {
        try {
          if (await form.submit()) {
            form.element.reset();

            toast.success("Created sensor");
            open = false;
          }
        } catch (error) {
          toast.error("Error creating sensor: " + error);
        }
      })}
      class="flex-col flex gap-2 items-center"
    >
      <input {...layoutIdForm.as("hidden", layoutId)} />

      <!-- Sensor Name -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="name">Name</Label>
        <Input id="name" {...name.as("text")} />
        {@render issues(name.issues())}
      </div>

      <!-- Sensor Address -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="address">Address</Label>
        <Input id="address" {...address.as("text")} />
        {@render issues(address.issues())}
      </div>

      <!-- Sensor Description / Comment -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="comment">Description</Label>
        <Input id="comment" {...comment.as("text")} />
        {@render issues(comment.issues())}
      </div>

      <!-- Inverted Checkbox -->
      <div class="flex w-full max-w-sm items-center space-x-2 py-1">
        <input
          id="inverted"
          {...inverted.as("checkbox")}
          class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />

        <Label for="inverted">Inverted</Label>
        {@render issues(inverted.issues())}
      </div>

      <!-- Activation Delay -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="activationDelay">Activation Delay</Label>
        <Input id="activationDelay" {...activationDelay.as("number", 0)} />
        {@render issues(activationDelay.issues())}
      </div>

      <!-- Deactivation Delay -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="deactivationDelay">Deactivation Delay</Label>
        <Input id="deactivationDelay" {...deactivationDelay.as("number", 0)} />
        {@render issues(deactivationDelay.issues())}
      </div>

      <!-- Sensor Connections -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="connectionId">Connections</Label>
        <div>
          <Select.Root
            type="single"
            {...connectionId.as("text")}
            bind:value={
              () => (connectionIdValue ? String(connectionIdValue) : undefined),
              (value) => connectionId.set(value ?? "undefined")
            }
          >
            <Select.Trigger class="col-span-3">
              {connectionIdValue
                ? (await getConnection(connectionIdValue)).name
                : "Select a connection"}
            </Select.Trigger>
            <Select.Content>
              {#each await getlayoutConnections(layoutId) as connection}
                <Select.Item value={connection.uuid}
                  >{connection.name}</Select.Item
                >
              {/each}
            </Select.Content>
          </Select.Root>
          {@render issues(connectionId.issues())}
        </div>
      </div>
    </form>

    <Dialog.Footer>
      <Dialog.Close>
        <Button
          form="add-sensor-form"
          type="reset"
          class="w-28"
          variant="outline">Cancel</Button
        >
      </Dialog.Close>
      <Button type="submit" form="add-sensor-form" class="w-28">Create</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
