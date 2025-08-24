<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import { createTrain } from "../../../../routes/(app)/layouts/[id]/settings/trains/trains.remote";
  import TrainFormContent from "./TrainFormContent.svelte";

  interface Props {
    open: boolean;
    layoutId: string;
  }

  let { open = $bindable(), layoutId }: Props = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Title>Add Train</Dialog.Title>

    <form
      id="add-train-form"
      {...createTrain.enhance(async ({ submit, form, data: sd }) => {
        sd.set("layoutUuid", layoutId);

        open = false;

        try {
          await submit();
          form.reset();
          toast.success("Created train");
        } catch (error) {
          toast.error("Error creating train: " + error);
        }
      })}
    >
      <TrainFormContent {layoutId} />
    </form>

    <Dialog.Footer>
      <Button
        type="reset"
        class="w-28"
        variant="outline"
        onclick={() => (open = false)}>Cancel</Button
      >
      <Button type="submit" form="add-train-form" class="w-28">Create</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
