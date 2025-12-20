<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { toast } from "svelte-sonner";
  import type { Snippet } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    connectionProtocolList,
    connectionTypeList,
    getConnectionHardwareName,
  } from "$lib/client/Connections/Protocols/protocols";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { createConnection } from "../../../client/Connections/connections.remote";
  import SerialConnection from "./Serial/SerialConnection.svelte";

  interface Props {
    layoutId: string;
    children: Snippet;
  }

  let { layoutId, children }: Props = $props();

  const { name, hardware, protocol } = createConnection.fields;
  let open = $state(false);
</script>

<Dialog.Root bind:open>
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

          open = false;
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
