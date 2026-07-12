<script lang="ts">
  import {
    deleteConnection,
    editConnection,
  } from "../../../client/Connections/connections.remote";
  import { toast } from "svelte-sonner";
  import { Trash2 } from "lucide-svelte";
  import type { Snippet } from "svelte";
  import type { Connection } from "$lib/server/db/schema/connection";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import ConnectionFormProtocol from "./FormComponents/ConnectionFormProtocol.svelte";
  import ConnectionFormType from "./FormComponents/ConnectionFormType.svelte";
  import ConnectionFormName from "./FormComponents/ConnectionFormName.svelte";
  import ConnectionFormHardware from "./FormComponents/ConnectionFormHardware.svelte";

  interface Props {
    connection: Connection;
    children: Snippet;
  }

  let { connection, children }: Props = $props();

  const editConnForm = $derived(editConnection.for(connection.uuid));
  const { name, hardware, protocol, layoutId, uuid } = $derived(
    editConnForm.fields,
  );

  let open = $state(false);

  // Set the form values
  function onOpenChange() {
    editConnForm.fields.set({
      name: connection.name,
      layoutId: connection.layoutUuid,
      uuid: connection.uuid,
      protocol: connection.protocol,
      hardware: connection.hardware,
    });
  }
</script>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Edit Connection</Dialog.Title>

    <form
      {...editConnForm.enhance(async (form) => {
        try {
          if (await form.submit()) {
            form.element.reset();

            toast.success("Edited connection");
            open = false;
          }
        } catch (error) {
          toast.error("Error editing connection: " + error);
        }
      })}
      oninput={() => editConnForm.validate()}
      id="edit-connection-form"
      class="flex-col flex gap-2"
    >
      <input {...layoutId.as("hidden", connection.layoutUuid)} />
      <input {...uuid.as("hidden", connection.uuid)} />

      <ConnectionFormName {name} />

      <ConnectionFormProtocol {protocol} />

      <ConnectionFormType {hardware} />

      <ConnectionFormHardware {hardware} />
    </form>

    <!-- Delete Connection Dialog -->
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button class="w-full mb-3" variant="destructive">
          <Trash2 />Delete Connection
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. Are you sure you want to delete this
            connection?
          </AlertDialog.Description>
        </AlertDialog.Header>

        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action
            onclick={() => {
              if (connection) {
                deleteConnection(connection.uuid);
                open = false;
              }
            }}>Delete Connection</AlertDialog.Action
          >
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>

    <Dialog.Footer>
      <Dialog.Close>
        <Button type="reset" class="w-28" variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button type="submit" form="edit-connection-form" class="w-28"
        >Save</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
