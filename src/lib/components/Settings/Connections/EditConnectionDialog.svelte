<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Connection } from "$lib/server/db/schema/connection";
  import ConnectionFormContent from "./ConnectionFormContent.svelte";
  import {
    deleteConnection,
    editConnection,
  } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";
  import { toast } from "svelte-sonner";
    import ConformationDialog from "../Common/ConformationDialog/ConformationDialog.svelte";
    import { Trash2 } from "lucide-svelte";

  interface Props {
    connection: Connection | undefined;
  }

  let { connection = $bindable() }: Props = $props();

  function closeDialog() {
    connection = undefined;
  }
</script>

<Dialog.Root
  bind:open={
    () => connection !== undefined, (v) => v || (connection = undefined)
  }
>
  <Dialog.Content>
    <Dialog.Title>Edit Connection</Dialog.Title>

    <form
      id="edit-connection-form"
      {...editConnection.enhance(async ({ submit, form, data: sd }) => {
        if (connection) {
          sd.set("layoutUuid", connection.layoutUuid);
          sd.set("uuid", connection.uuid);
        }

        closeDialog();

        try {
          await submit();
          form.reset();
          toast.success("Edited connection");
        } catch (error) {
          toast.error("Error editing connection: " + error);
        }
      })}
    >
      <ConnectionFormContent bind:connection />
    </form>

    <!-- Delete Connection -->
    <ConformationDialog title="Delete Connection">
      {#snippet trigger()}
        <Button class="w-full mb-3" variant="destructive">
          <Trash2 />Delete Connection
        </Button>
      {/snippet}
      {#snippet primaryButton()}
        <Button
          variant="destructive"
          class="w-32"
          onclick={() => {
            if (connection) {
              deleteConnection(connection.uuid);
              closeDialog();
            }
          }}
        >
          Delete Connection</Button
        >
      {/snippet}
      {#snippet secondaryButton()}
        <Button variant="outline" class="w-32">Cancel</Button>
      {/snippet}
      <p>Are you sure you want to delete this connection?</p>
    </ConformationDialog>

    <Dialog.Footer>
      <Button type="reset" class="w-28" variant="outline" onclick={closeDialog}
        >Cancel</Button
      >
      <Button type="submit" form="edit-connection-form" class="w-28"
        >Save</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
