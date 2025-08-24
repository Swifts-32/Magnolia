<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    trigger: Snippet;
    secondaryButton?: Snippet;
    primaryButton: Snippet;
    children?: Snippet;
  }

  let { title, trigger, secondaryButton, primaryButton, children }: Props =
    $props();
</script>

<Dialog.Root>
  <Dialog.Trigger class="w-full">
    {@render trigger()}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
    </Dialog.Header>
    {@render children?.()}
    <div class="flex justify-end gap-2 mt-4">
      <Dialog.Close>
        {@render secondaryButton?.()}
      </Dialog.Close>
      <Dialog.Close>
        {@render primaryButton()}
      </Dialog.Close>
    </div>
  </Dialog.Content>
</Dialog.Root>
