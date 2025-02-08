<script lang="ts">
  import type { Connections } from "$lib/client/LayoutClient.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    ConnectionProtocols,
    getProtocolName,
    getConnectionTypeName,
    ConnectionTypes,
  } from "$lib/client/Protocols/protocols";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { toast } from "svelte-sonner";
  import { layoutClientHandler } from "../../../../services/Layouts/LayoutClientHandler.svelte";

  interface Props {
    connection: Connections;
  }

  let { connection }: Props = $props();

  let editMode = $state(false);

  let connName: string = $state(connection.connName);
  let connProtocol: string = $state(connection.protocol.toString());
  let connType: string = $state(ConnectionTypes.Serial.toString());

  // Connection specific data
  // Serial Connection
  let serialPath: string = $state("COM4");
  let baudRate: number = $state(12);

  function saveChanges() {
    const data: any = {
      connName: connName,
      protocol: Number(connProtocol),
      connType: Number(connType),
    };

    // Add connection type specific data
    if (connType === ConnectionTypes.Serial.toString()) {
      data.path = serialPath;
      data.baudRate = baudRate;
    }

    fetch(`/api/layout/${connection.layoutUUID}/${connection.connUUID}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          editMode = false; // Close the dialog on success
          toast.success("Connection updated successfully");
          layoutClientHandler.refreshLayouts();
        } else {
          toast.error("Failed to update connection");
        }
      })

      .catch((error) => {
        toast.error("Error updating connection");
      });

  }
</script>

<button
  class="border-primary border-2 px-3 flex rounded-md gap-3 w-full my-2 h-14 items-center select-none"
  onclick={() => (editMode = true)}
>
  <p class="text-xl">{connection.connName}</p>
  <div class="flex-col flex items-start">
    <p class="text-sm text-gray-400">
      Protocol: {getProtocolName(Number(connProtocol) as ConnectionProtocols)}
    </p>
    <p class="text-sm text-gray-400">
      Type: {getConnectionTypeName(Number(connType) as ConnectionTypes)}
    </p>
  </div>
</button>

<Dialog.Root open={editMode}>
  <Dialog.Content>
    <Dialog.Title>Edit Connection</Dialog.Title>

    <!-- Connection Name -->
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="connName" class="text-right">Name</Label>
      <Input id="connName" bind:value={connName} class="col-span-3" />
    </div>

    <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="connProtocol" class="text-right">Protocol</Label>
      <Select.Root type="single" name="connProtocol" bind:value={connProtocol}>
        <Select.Trigger class="w-80">
          {getProtocolName(Number(connProtocol) as ConnectionProtocols)}
        </Select.Trigger>
        <Select.Content>
          {#each Object.keys(ConnectionProtocols).filter( (key) => isNaN(Number(key)) ) as protocolName, i}
            <Select.Item
              value={ConnectionProtocols[
                protocolName as keyof typeof ConnectionProtocols
              ].toString()}
            >
              {getProtocolName(
                ConnectionProtocols[
                  protocolName as keyof typeof ConnectionProtocols
                ]
              )}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <Separator />

    <!-- Connection Type e.g. Serial, Bluetooth, etc. -->
    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="connType" class="text-right">Hardware</Label>
      <Select.Root type="single" name="connType" bind:value={connType}>
        <Select.Trigger class="w-80">
          {getConnectionTypeName(Number(connType) as ConnectionTypes)}
        </Select.Trigger>
        <Select.Content>
          {#each Object.keys(ConnectionTypes).filter( (key) => isNaN(Number(key)) ) as connType, i}
            <Select.Item
              value={ConnectionTypes[
                connType as keyof typeof ConnectionTypes
              ].toString()}
            >
              {getConnectionTypeName(
                ConnectionTypes[connType as keyof typeof ConnectionTypes]
              )}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <!-- Alternitve info depending on the connection type -->
    {#if connType === ConnectionTypes.Serial.toString()}
      <!-- Serial Connection -->
      <!-- Serial Port -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="serialPort" class="text-right">Port</Label>
        <Input id="serialPort" value={connection.path} class="col-span-3" />
      </div>

      <!-- Baud Rate -->
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="baudRate" class="text-right">Baud Rate</Label>
        <Input id="baudRate" value={connection.baudRate} class="col-span-3" />
      </div>
    {:else if connType === ConnectionTypes.Emulator.toString()}
      <!-- Emulator Connection -->
      <!-- Nothing Needed. Just here for parity -->
    {/if}

    <Separator />

    <Dialog.Footer>
      <Button
        type="reset"
        class="w-28"
        variant="outline"
        onclick={() => (editMode = false)}>Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={saveChanges}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
