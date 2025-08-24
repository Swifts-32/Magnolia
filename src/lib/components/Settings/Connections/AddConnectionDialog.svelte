<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { createConnection } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";
  import ConnectionFormContent from "./ConnectionFormContent.svelte";
  import { toast } from "svelte-sonner";

  interface Props {
    open: boolean;
    layoutId: string;
  }

  let { open = $bindable(), layoutId }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Title>Add Connection</Dialog.Title>

    <form
      id="add-connection-form"
      {...createConnection.enhance(async ({ submit, form, data: sd }) => {
        sd.set("layoutUuid", layoutId);

        open = false;

        try {
          await submit();
          form.reset();
          toast.success("Created connection");
        } catch (error) {
          toast.error("Error creating connection: " + error);
        }
      })}
    >
      <ConnectionFormContent />
    </form>

    <Dialog.Footer>
      <Button
        type="reset"
        class="w-28"
        variant="outline"
        onclick={() => (open = false)}>Cancel</Button
      >
      <Button type="submit" form="add-connection-form" class="w-28"
        >Create</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
