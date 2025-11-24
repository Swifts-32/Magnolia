<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
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
      <Dialog.Title>Create Layout</Dialog.Title>
    </Dialog.Header>

    <form {...createLayout} oninput={() => createLayout.validate()}>
      <!-- Layout Name -->
      <label class="grid grid-cols-4 mt-2 mb-3 items-center gap-4">
        <p>Layout Name</p>
        <div class="col-span-3">
          <input
            class="border rounded-md p-2 w-full {createLayout.fields.issues()
              ? 'border-red-600 focus:border-red-600'
              : 'border-gray-300'}"
            type="text"
            id="name"
            {...createLayout.fields.name.as("text")}
          />
          {#each createLayout.fields.name.issues() as issue}
            <p class="text-xs text-red-600">{issue.message}</p>
          {/each}
        </div>
      </label>

      <Dialog.Footer>
        <Dialog.Close>
          <Button type="reset" variant="outline" class="w-32">Cancel</Button>
        </Dialog.Close>
        <Button type="submit" class="w-32">Create</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
