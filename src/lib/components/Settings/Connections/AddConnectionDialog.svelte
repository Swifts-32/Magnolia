<script lang="ts">
  import type { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import { Plus } from "lucide-svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";
  import ConnectionEditor from "./ConnectionEditor.svelte";
  import {
    ConnectionProtocols,
    ConnectionTypes,
  } from "$lib/client/Protocols/protocols";
  import { toast } from "svelte-sonner";

  interface Props {
    layout: LayoutClient;
  }

  let { layout }: Props = $props();
  let editMode: boolean = $state(false);
  let connection: ClientConnection | undefined = $state();

  $effect(() => {
    if (editMode && !connection) {
      connection = new ClientConnection(
        ConnectionProtocols.DCCEX,
        ConnectionTypes.Serial,
        "New Connection",
        crypto.randomUUID(),
        layout.uuid,
      );
    }
  });

  function createConnection() {
    if (!connection) return;

    fetch(`/api/layout/${connection.layoutUuid}/connections/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: connection.toJsonWeb(),
    })
      .then(async (response) => {
        if (response.ok) {
          editMode = false; // Close the dialog on success
          toast.success("Connection added successfully");
        } else {
          toast.error("Failed to add connection");
        }
      })
      .catch((error) => {
        toast.error("Error adding connection");
      });

    closeDialog();
  }

  function closeDialog() {
    editMode = false;
    connection = undefined;
  }
</script>

<button
  class="border-primary border-2 flex p-3 rounded-md w-96 h-16 justify-center items-center select-none"
  onclick={() => (editMode = true)}
>
  <Plus size={30} />
  <p class="text-xl">Add Connection</p>
</button>

<Dialog.Root open={editMode}>
  <Dialog.Content>
    <Dialog.Title>Create Connection</Dialog.Title>

    {#if connection}
      <ConnectionEditor bind:connection />
    {/if}

    <Dialog.Footer>
      <Button type="reset" class="w-28" variant="outline" onclick={closeDialog}
        >Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={createConnection}>Save</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
