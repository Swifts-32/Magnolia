<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Connection } from "$lib/server/db/schema/connection";
  import {
    deleteConnection,
    editConnection,
  } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";
  import { toast } from "svelte-sonner";
  import { Trash2 } from "lucide-svelte";
  import type { Snippet } from "svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import {
    connectionProtocolList,
    ConnectionType,
    connectionTypeList,
    getConnectionHardwareName,
  } from "$lib/client/Protocols/protocols";
  import { Separator } from "$lib/components/ui/separator";
  import SerialConnection from "./Serial/SerialConnection.svelte";

  interface Props {
    connection: Connection;
    children: Snippet;
  }

  let { connection, children }: Props = $props();

  const editConnForm = editConnection.for(connection.uuid);
  const { name, uuid, hardware, layoutId, protocol } = editConnForm.fields;
  let open = $state(false);

  let serialPath: string | undefined = $state();
  let baudRate: number | undefined = $state();

  // Reset the form values
  function onOpenChange() {
    name.set(connection.name);
    hardware.set(connection.hardware);
    protocol.set(connection.protocol);

    serialPath = hardware.path.value();
    baudRate = hardware.baudRate.value();
  }
</script>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Edit Connection</Dialog.Title>

    <form
      {...editConnForm.enhance(async ({ form, data, submit }) => {
        try {
          await submit();
          form.reset();

          toast.success("Edited connection");

          open = false;
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

      <!-- Connection Name -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <div class="col-span-3">
          <Input id="name" {...name.as("text")} />
          {#each name.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="protocol" class="text-right">Protocol</Label>
        <div class="col-span-3">
          <select
            id="protocol"
            {...protocol.as("select")}
            class="flex h-10 w-full items-center justify-between rounded-md border border-input
                       bg-background px-3 py-2 text-sm ring-offset-background
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#each connectionProtocolList as protocolName}
              <option
                value={protocolName}
                class="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {protocolName}
              </option>
            {/each}
          </select>
          {#each protocol.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      <Separator />

      <!-- Connection Type e.g. Serial, Bluetooth, etc. -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="hardware" class="text-right">Hardware</Label>
        <div class="col-span-3">
          <select
            id="hardware"
            {...hardware.type.as("select")}
            class="flex h-10 w-full items-center justify-between rounded-md border border-input
                       bg-background px-3 py-2 text-sm ring-offset-background
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#each connectionTypeList as connType}
              <option
                value={connType}
                class="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {getConnectionHardwareName(connType)}
              </option>
            {/each}
          </select>
          {#each hardware.issues() as issue}
            <p class="text-s text-red-600">{issue.message}</p>
          {/each}
        </div>
      </div>

      {#if hardware.type.value() === "Serial"}
        <SerialConnection path={hardware.path} baudRate={hardware.baudRate} />
      {:else if hardware.type.value() === "Wifi"}
        <p>Wifi editor goes here</p>
      {:else if hardware.type.value() === "Emulator"}
        <p>Emulator</p>
      {/if}
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
