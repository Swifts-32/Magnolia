<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { toast } from "svelte-sonner";
  import type { Snippet } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    ConnectionProtocol,
    connectionProtocolList,
    ConnectionType,
    connectionTypeList,
    getConnectionHardwareName,
  } from "$lib/client/Connections/Protocols/protocols";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { createConnection } from "../../../client/Connections/connections.remote";
  import SerialConnection from "./Serial/SerialConnection.svelte";

  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    layoutId: string;
    children: Snippet;
  }

  let { layoutId, children }: Props = $props();

  const { name, hardware, protocol } = createConnection.fields;
  const hardwareTypeValue: ConnectionType = $derived(
    hardware.type.as("select").value as ConnectionType,
  );
  const protocolValue: ConnectionProtocol = $derived(
    protocol.as("select").value as ConnectionProtocol,
  );
  // let open = $state(false);
</script>

<Dialog.Root>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Connection</Dialog.Title>
    </Dialog.Header>

    <form
      {...createConnection.enhance(async ({ form, data, submit }) => {
        try {
          await submit();
          form.reset();

          toast.success("Created connection");

          // open = false;
        } catch (error) {
          toast.error("Error creating connection: " + error);
        }
      })}
      oninput={() => createConnection.validate()}
      id="add-connection-form"
    >
      <div class="flex-col flex gap-2">
        <input {...createConnection.fields.layoutId.as("hidden", layoutId)} />

        <!-- Connection Name -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <div class="col-span-3">
            <Input
              id="name"
              placeholder="Enter connection name"
              {...name.as("text")}
            />
            {#each name.issues() as issue}
              <p class="text-s text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>

        <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="protocol" class="text-right">Protocol</Label>
          <div class="col-span-3">
            <Select.Root
              type="single"
              {...protocol.as("text")}
              bind:value={() => protocolValue, (value) => protocol.set(value)}
            >
              <Select.Trigger class="col-span-3">
                {protocolValue ? protocolValue : "Select your protocol"}
              </Select.Trigger>
              <Select.Content>
                {#each connectionProtocolList as protocolName}
                  <Select.Item value={protocolName}>
                    {protocolName}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>

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
            <Select.Root
              type="single"
              {...hardware.type.as("text")}
              bind:value={
                () => hardwareTypeValue, (value) => hardware.type.set(value)
              }
            >
              <Select.Trigger class="col-span-3">
                {hardwareTypeValue
                  ? getConnectionHardwareName(hardwareTypeValue)
                  : "Select your hardware"}
              </Select.Trigger>
              <Select.Content>
                {#each connectionTypeList.filter((type) => type !== "Undefined") as connType}
                  <Select.Item value={connType}>
                    {getConnectionHardwareName(connType)}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>

            {#each hardware.type.issues() as issue}
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
        <Separator />
      </div>
    </form>

    <Dialog.Footer>
      <Dialog.Close>
        <Button type="reset" class="w-28" variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button type="submit" form="add-connection-form" class="w-28"
        >Create</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
