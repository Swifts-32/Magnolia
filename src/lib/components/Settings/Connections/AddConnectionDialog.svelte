<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { toast } from "svelte-sonner";
  import type { Snippet } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    connectionProtocolList,
    connectionTypeList,
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

<Dialog.Root
  bind:open
  onOpenChange={(v) => {
    if (!v) {
      createConnection.element?.reset();
    }
  }}
>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create Connection</Dialog.Title>
    </Dialog.Header>
    <form
      {...createConnection.enhance(async (form) => {
        try {
          if (await form.submit()) {
            form.element.reset();

            toast.success("Created connection");
            open = false;
          }
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
            <Input id="name" {...name.as("text")} />
            {#each name.issues() as issue}
              <p class="text-xs text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>

        <!-- Connection Protocol e.g. DCC Ex, LCC, etc. -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="protocol" class="text-right">Protocol</Label>
          <div class="col-span-3">
            <select
              {...protocol.as("select", "DccEx")}
              class="border-input bg-background ring-offset-background data-placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              {#each connectionProtocolList as protocolName}
                <option
                  class="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50"
                  >{protocolName}</option
                >
              {/each}
            </select>

            {#each protocol.issues() as issue}
              <p class="text-s text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>

        <!-- Connection Type e.g. Serial, Bluetooth, etc. -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="hardware" class="text-right">Hardware</Label>
          <div class="col-span-3">
            <select
              {...hardware.type.as("select", "Emulator")}
              class="border-input bg-background ring-offset-background data-placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              {#each connectionTypeList.filter((type) => type !== "Undefined") as connType}
                <option
                  class="data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50"
                  >{connType}</option
                >
              {/each}
            </select>

            {#each hardware.type.issues() as issue}
              <p class="text-s text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>

        <!--  Nothing for Emulator or Wifi yet. -->
        {#if hardware.type.value() === "Serial"}
          <Separator />
          <SerialConnection path={hardware.path} baudRate={hardware.baudRate} />
        {/if}
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
