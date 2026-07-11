<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button";
  import { createConnection } from "../../../client/Connections/connections.remote";
  import type { Snippet } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import ConnectionFormName from "./FormComponents/ConnectionFormName.svelte";
  import ConnectionFormType from "./FormComponents/ConnectionFormType.svelte";
  import ConnectionFormProtocol from "./FormComponents/ConnectionFormProtocol.svelte";
  import ConnectionFormHardware from "./FormComponents/ConnectionFormHardware.svelte";

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

        <ConnectionFormName {name} />

        <ConnectionFormProtocol {protocol} />

        <ConnectionFormType {hardware} />

        <ConnectionFormHardware {hardware} />
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
