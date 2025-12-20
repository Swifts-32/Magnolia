<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toast } from "svelte-sonner";
  import { createTrain } from "../../../client/Trains/trains.remote";
  import TrainFormContent from "./TrainFormContent.svelte";
  import type { Snippet } from "svelte";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import FunctionSelector from "./Functions/FunctionSelector.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { getConnections } from "../../../client/Connections/connections.remote";

  interface Props {
    layoutId: string;
    children: Snippet;
  }

  let { layoutId, children }: Props = $props();

  const {
    address,
    comment,
    connectionId,
    layoutId: layoutIdForm,
    name,
  } = createTrain.fields;
  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Create Train</Dialog.Title>

    <form
      id="add-train-form"
      {...createTrain.enhance(async ({ submit, form }) => {
        try {
          await submit();
          form.reset();
          open = false;
          toast.success("Created train");
        } catch (error) {
          toast.error("Error creating train: " + error);
        }
      })}
    >
      <input {...layoutIdForm.as("hidden", layoutId)} />

      <div class="flex-col flex gap-2">
        <!-- Train Name -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" class="col-span-3" {...name.as("text")} />
        </div>

        <!-- Train Description -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="comment" class="text-right">Description</Label>
          <Input id="comment" {...comment.as("text")} class="col-span-3" />
        </div>

        <!-- Train Address -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="address" class="text-right">Address</Label>
          <Input id="address" {...address.as("text")} class="col-span-3" />
        </div>

        <!-- Train Connections -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="connectionId" class="text-right">Connections</Label>
          <div class="col-span-3">
            <select
              id="connectionId"
              {...connectionId.as("select")}
              class="flex h-10 w-full items-center justify-between rounded-md border border-input
                       bg-background px-3 py-2 text-sm ring-offset-background
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50"
            >
              {#each await getConnections(layoutId) as connection}
                <option
                  value={connection.uuid}
                  class="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {connection.name}
                </option>
              {/each}
            </select>
            {#each connectionId.issues() as issue}
              <p class="text-s text-red-600">{issue.message}</p>
            {/each}
          </div>
        </div>
      </div>
    </form>

    <Dialog.Footer>
      <Dialog.Close>
        <Button form="add-train-form" class="w-28" variant="outline"
          >Cancel</Button
        >
      </Dialog.Close>
      <Button type="submit" form="add-train-form" class="w-28">Create</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
