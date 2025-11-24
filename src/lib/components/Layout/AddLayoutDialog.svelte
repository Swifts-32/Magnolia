<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { LayoutClient } from "$lib/client/LayoutClient.svelte";
  import type { Snippet } from "svelte";
  import { createLayout } from "../../../routes/(app)/layouts/layouts.remote";
  import { Button } from "../ui/button";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<Dialog.Root>
  <Dialog.Trigger>
    {@render children()}
  </Dialog.Trigger>
  <Dialog.Content
    class="sm:max-w-5/6 w-fit min-w-lg max-h-9/10"
    interactOutsideBehavior={"ignore"}
  >
    <Dialog.Header>
      <Dialog.Title>Create Scene</Dialog.Title>
    </Dialog.Header>

    <form {...createLayout}>
      <!-- Layout Name -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Layout Name</p>
        <input
          class="border border-gray-300 col-span-3 rounded-md p-2 w-full"
          type="text"
          name="name"
          id="name"
          placeholder="New Layout"
          required
        />
      </label>

      <Dialog.Footer>
        <Dialog.Close>
          <Button type="" variant="outline" class="w-32">Cancel</Button>
        </Dialog.Close>
        <Button type="submit" class="w-32">Create</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
