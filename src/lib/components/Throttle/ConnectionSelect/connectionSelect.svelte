<script lang="ts">
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import type { ConnectionUUID, LayoutClient } from "$lib/client/LayoutClient.svelte";

    interface Props {
        curConnectionUUID: ConnectionUUID | null;
        curLayout: LayoutClient;
        disabled?: boolean;
    }

    let { curConnectionUUID = $bindable(),  curLayout, disabled }: Props = $props();

    let open = $state(false);
    let curConnectionName: string | undefined = $derived.by(() => {
        if (curConnectionUUID) {
            return curLayout.connections.get(curConnectionUUID)?.connName;
        }
    });
    let triggerRef = $state<HTMLButtonElement>(null!);

    /* We want to refocus the trigger button when the user selects
    an item from the list so users can continue navigating the
    rest of the form with the keyboard. */
    function closeAndFocusTrigger() {
        open = false;

        tick().then(() => {
            triggerRef.focus();
        });
    }
</script>

<Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef} {disabled}>
        {#snippet child({ props })}
            <Button
                variant="outline"
                class="w-full justify-between"
                {...props}
                role="combobox"
                aria-expanded={open}
                {disabled}
            >
                {curConnectionUUID ? (curConnectionName ? curConnectionName : "Undefined") : "Select a Connection..."}
                <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-[275px] p-0">
        <Command.Root>
            <Command.Input placeholder="Search trains..." {disabled} />
            <Command.List>
                <Command.Empty>No trains found. :(</Command.Empty>
                <Command.Group>
                    {#each curLayout.connections as [connUUID, connection]}
                        <Command.Item
                            {disabled}
                            value={connection.connName}
                            onSelect={() => {
                                curConnectionUUID = connUUID;
                                closeAndFocusTrigger();
                            }}
                            class="flex justify-between {connUUID == curConnectionUUID
                                ? 'cursor-default'
                                : 'cursor-pointer'}"
                        >
                            <div class="flex flex-col">
                                <p class="text-md">{connection.connName}</p>
                                <p class="text-[0.5rem] leading-[0.5rem]">
                                    UUID: {connUUID}
                                </p>
                            </div>
                            <Check
                                class={cn(
                                    "mr-2 size-4",
                                   connUUID != curConnectionUUID &&
                                        "text-transparent",
                                )}
                            />
                        </Command.Item>
                    {/each}
                </Command.Group>
            </Command.List>
        </Command.Root>
    </Popover.Content>
</Popover.Root>
