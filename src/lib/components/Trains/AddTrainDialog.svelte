<script lang="ts">
  import type { RemoteFormIssue } from "$app/server";
  import { toast } from "svelte-sonner";
  import { Label } from "#lib/components/ui/label/index.js";
  import { Input } from "#lib/components/ui/input/index.js";
  import { Button } from "#lib/components/ui/button/index.js";
  import type { Snippet } from "svelte";
  import * as Dialog from "#lib/components/ui/dialog/index.js";
  import * as Select from "#lib/components/ui/select/index.js";
  import { createTrain } from "#lib/client/Trains.remote.js";
  import {
    getConnection,
    getlayoutConnections,
  } from "#lib/client/Connections.remote.js";
  import { protocolSupportedCapabilities } from "#lib/types/protocolConstants.ts";

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
  } = createTrain.fields;

  const connectionIdValue: string = $derived(
    connectionId.as("select").value as string,
  );

  let open = $state(false);
</script>

{#snippet issues(i: RemoteFormIssue[] | undefined)}
  {#each i as issue}
    <p class="text-sm text-red-600">{issue.message}</p>
  {/each}
{/snippet}

<Dialog.Root
  bind:open
  onOpenChange={() => {
    createTrain.element?.reset();
  }}
>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Create Train</Dialog.Title>

    <form
      id="add-train-form"
      {...createTrain.enhance(async (form) => {
        try {
          if (await form.submit()) {
            form.element.reset();

            toast.success("Created train");
            open = false;
          }
        } catch (error) {
          toast.error("Error creating train: " + error);
        }
      })}
      class="flex-col flex gap-2 items-center"
    >
      <input {...layoutIdForm.as("hidden", layoutId)} />

      <!-- Train Name -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="name">Name</Label>
        <Input id="name" {...name.as("text")} />
        {@render issues(name.issues())}
      </div>

      <!-- Train Description -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="comment">Description</Label>
        <Input id="comment" {...comment.as("text")} />
        {@render issues(comment.issues())}
      </div>

      <!-- Train Address -->
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="address">Address</Label>
        <Input id="address" {...address.as("text")} />
        {@render issues(address.issues())}
      </div>

      <!-- Train Connections -->
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
              {#snippet children()}
                {#if connectionIdValue}
                  {#await getConnection(connectionIdValue)}
                    Loading connection...
                  {:then conn}
                    {conn.name}
                  {:catch}
                    Select a connection
                  {/await}
                {:else}
                  Select a connection
                {/if}
              {/snippet}
            </Select.Trigger>
            <Select.Content>
              {#await getlayoutConnections(layoutId)}
                <Select.Item value="" disabled
                  >Loading connections...</Select.Item
                >
              {:then connections}
                {@const supportedConnections = connections.filter((c) =>
                  protocolSupportedCapabilities(c.protocol, "trains"),
                )}
                {#if supportedConnections.length === 0}
                  <Select.Item value="" disabled
                    >No train-supported connections found</Select.Item
                  >
                {:else}
                  {#each supportedConnections as connection}
                    <Select.Item
                      value={connection.uuid}
                      label={connection.name}
                    >
                      {connection.name}
                    </Select.Item>
                  {/each}
                {/if}
              {:catch}
                <Select.Item value="" disabled
                  >Failed to load connections</Select.Item
                >
              {/await}
            </Select.Content>
          </Select.Root>
          {@render issues(connectionId.issues())}
        </div>
      </div>
    </form>

    <Dialog.Footer>
      <Dialog.Close>
        <Button
          form="add-train-form"
          type="reset"
          class="w-28"
          variant="outline">Cancel</Button
        >
      </Dialog.Close>
      <Button type="submit" form="add-train-form" class="w-28">Create</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
