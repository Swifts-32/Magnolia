<script lang="ts">
  import { goto } from "$app/navigation";
  import { Plus } from "lucide-svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { tick } from "svelte";
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { cn } from "$lib/utils.js";

  let editMode = $state(true);

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<div>
  <div class="flex flex-wrap">
    {#each [0, 10, 1, 10, 2, 8] as layout}
      <button
        class="border-primary border-2 p-2 rounded-md size-52 m-5 select-none"
        onclick={() => (editMode = true)}
      >
        <p class="text-3xl text-center">{layout}</p>
      </button>
    {/each}

    <button
      class="border-primary border-2 p-2 rounded-md size-52 m-5 select-none flex-col justify-center place-items-center"
      onclick={() => (editMode = true)}
    >
      <Plus size={50} />
      <p>Add new layout</p>
    </button>
  </div>

  <Dialog.Root open={editMode}>
    <Dialog.Content
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <Dialog.Header>
        <Dialog.Title>Edit Layout</Dialog.Title>
      </Dialog.Header>

      <div class="w-full">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="layoutName" class="text-right">Name</Label>
          <Input id="layoutName" value={10} class="col-span-3" />
        </div>

        <li>
          <h2 class="text-2xl pt-5">Connections</h2>

          <!-- Connections -->
          <Accordion.Root type="single" class="pb-4">
            <Accordion.Item value="item-1">
              <Accordion.Trigger>Connection 1</Accordion.Trigger>
              <Accordion.Content>
                <div class="grid grid-cols-4 items-center gap-4 m-2">
                  <Label for="layoutName" class="text-right"
                    >Connection Name</Label
                  >
                  <Input id="layoutName" value={10} class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4 m-2">
                  <Label for="layoutEndpoint" class="text-right">Endpoint</Label
                  >
                  <Input id="trainAddress" value={10} class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4 m-2">
                  <Label for="layoutEndpoint" class="text-right">Endpoint</Label
                  >
                  <Input id="trainAddress" value={10} class="col-span-3" />
                </div>

                <Popover.Root bind:open>
                  <Popover.Trigger bind:ref={triggerRef}>
                    {#snippet child({ props })}
                      <Button
                        variant="outline"
                        class="w-[200px] justify-between"
                        {...props}
                        role="combobox"
                        aria-expanded={open}
                      >
                        <!-- {selectedValue || "Select a framework..."} -->
                        <ChevronsUpDown
                          class="ml-2 size-4 shrink-0 opacity-50"
                        />
                      </Button>
                    {/snippet}
                  </Popover.Trigger>
                  <Popover.Content class="w-[200px] p-0">
                    <Command.Root>
                      <Command.Input placeholder="Search framework..." />
                      <Command.List>
                        <Command.Empty>No framework found.</Command.Empty>
                        <Command.Group>
                          {#each ["DCC E", 2, 3] as framework}
                            <!-- value={framework} -->
                            <Command.Item
                              onSelect={() => {
                                closeAndFocusTrigger();
                              }}
                            >
                              <!--  value = framework; -->
                              <!-- <Check
                            class={cn(
                              "mr-2 size-4",
                              value !== framework && "text-transparent",
                            )}
                          /> -->
                              {framework}
                            </Command.Item>
                          {/each}
                        </Command.Group>
                      </Command.List>
                    </Command.Root>
                  </Popover.Content>
                </Popover.Root>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="item-2">
              <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
              <Accordion.Content>
                Yes. It adheres to the WAI-ARIA design pattern.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>

          <!-- Adds a new connection the the layout -->
          <button
            class="border-primary border-2 p-2 rounded-md w-full h-14 select-none flex justify-center items-center"
          >
            <Plus size={30} />
            <p>Add new connection</p>
          </button>
        </li>
      </div>

      <Dialog.Footer>
        <Button
          type="reset"
          class="w-28"
          variant="outline"
          onclick={() => (editMode = false)}>Cancel</Button
        >
        <Button type="submit" class="w-28">Save</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>
