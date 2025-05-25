<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ClientConnection } from "$lib/client/Connections/ClientConnection.svelte";
  import ConnectionEditor from "./ConnectionEditor.svelte";
  import { toast } from "svelte-sonner";

  interface Props {
    connection: ClientConnection;
    open: boolean;
  }

  let { open = $bindable(false), connection: oldConnection }: Props = $props();
  let connection: ClientConnection | undefined = $state();

  $effect(() => {
    if (open && !connection) {
      connection = oldConnection.clone();
    }
  });

  function updateConnection() {
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
    open = false;
    connection = undefined;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Title>Edit Connection</Dialog.Title>

    {#if connection}
      <ConnectionEditor bind:connection />
    {/if}

    <Dialog.Footer>
      <Button type="reset" class="w-28" variant="outline" onclick={closeDialog}
        >Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={updateConnection}>Save</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
