<script lang="ts">
  import type { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import { Plus } from "lucide-svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import {
    ConnectionProtocols,
    getProtocolName,
    getConnectionTypeName,
    ConnectionTypes,
  } from "$lib/client/Protocols/protocols";
  import { toast } from "svelte-sonner";
  import SerialConnection from "../Connections/Serial/SerialConnection.svelte";

  interface Props {
    layout: LayoutClient;
  }

  let { layout }: Props = $props();

  let editMode: boolean = $state(false);

  let connName: string | undefined = $state();
  let connProtocol: string = $state(ConnectionProtocols.DCCEX.toString());
  let connType: string = $state(ConnectionTypes.Serial.toString());

  let serialPath: string | undefined = $state();
  let serialBaudRate: number | undefined = $state();

  async function saveChanges() {
    if (connName === undefined) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if the connection type is serial and if the serial path and baud rate are filled in
    if (
      connType === ConnectionTypes.Serial.toString() &&
      (serialPath === undefined || serialBaudRate === undefined)
    ) {
      toast.error("Please fill in all serial connection fields");
      return;
    }

    const data: any = {
      connName: connName,

      protocol: Number(connProtocol),
      connType: Number(connType),
      serialPath: serialPath,
      serialBaudRate: serialBaudRate,
    };

    fetch(`/api/layout/${layout.uuid}/connections/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    <Dialog.Title>Add Connection</Dialog.Title>

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
          {#each Object.keys(ConnectionProtocols).filter( (key) => isNaN(Number(key)), ) as protocolName, i}
            <Select.Item
              value={ConnectionProtocols[
                protocolName as keyof typeof ConnectionProtocols
              ].toString()}
            >
              {getProtocolName(
                ConnectionProtocols[
                  protocolName as keyof typeof ConnectionProtocols
                ],
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
        <Select.Trigger class="col-span-3">
          {getConnectionTypeName(Number(connType) as ConnectionTypes)}
        </Select.Trigger>
        <Select.Content>
          {#each Object.keys(ConnectionTypes).filter( (key) => isNaN(Number(key)), ) as connType, i}
            <Select.Item
              value={ConnectionTypes[
                connType as keyof typeof ConnectionTypes
              ].toString()}
            >
              {getConnectionTypeName(
                ConnectionTypes[connType as keyof typeof ConnectionTypes],
              )}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    {#if connType === ConnectionTypes.Serial.toString()}
      <SerialConnection bind:serialPath bind:serialBaudRate />
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
