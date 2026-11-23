<script lang="ts">
  import Fab from "#lib/components/FAB/Fab.svelte";
  import { EllipsisIcon, Plus, AlertTriangle } from "@lucide/svelte";
  import {
    deleteSensor,
    duplicateSensor,
    getLayoutSensors,
  } from "#lib/client/Sensors.remote.js";
  import { getConnection } from "#lib/components/Connections/Connections.remote.js";
  import * as Table from "#lib/components/ui/table/index.js";
  import * as DropdownMenu from "#lib/components/ui/dropdown-menu/index.js";
  import Button from "#lib/components/ui/button/button.svelte";
  import * as AlertDialog from "#lib/components/ui/alert-dialog/index.js";
  import * as Drawer from "#lib/components/ui/drawer/index.js";
  import AddSensorDialog from "#lib/components/Sensor/AddSensorDialog.svelte";
  import EditSensorForm from "#lib/components/Sensor/EditSensorForm.svelte";

  let { params } = $props();

  let selectedId = $state<string | null>(null);
  let activeEditId = $state<string | null>(null);
  let activeAlertId = $state<string | null>(null);
  let dropdownStates = $state<Record<string, boolean>>({});

  // Fetch sensors into a reactive state variable instead of using {#each await ...} in markup
  let sensors = $state<any[]>([]);
  let connectionsCache = $state<Record<string, any>>({});

  // Load sensors when params.id changes or after mutations
  async function loadSensors() {
    try {
      sensors = await getLayoutSensors(params.id);
      // Pre-fetch connection details for sensors to avoid async blocks inside each loops
      for (const sensor of sensors) {
        if (sensor.connectionId && !connectionsCache[sensor.connectionId]) {
          getConnection(sensor.connectionId)
            .then((conn) => {
              connectionsCache[sensor.connectionId] = conn;
            })
            .catch(() => {
              connectionsCache[sensor.connectionId] = null;
            });
        }
      }
    } catch (e) {
      sensors = [];
    }
  }

  $effect(() => {
    loadSensors();
  });

  async function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
      return;
    }

    if (!selectedId) return;

    if (event.key === "e") {
      event.preventDefault();
      activeEditId = selectedId;
    } else if (event.key === "d") {
      event.preventDefault();
      await duplicateSensor(selectedId);
      await loadSensors();
    } else if (event.key === "Delete" && event.ctrlKey) {
      event.preventDefault();
      await deleteSensor(selectedId);
      activeAlertId = null;
      await loadSensors();
    } else if (event.key === "Delete") {
      event.preventDefault();
      activeAlertId = selectedId;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="w-full overflow-x-none">
  <Table.Root class="w-full table-fixed">
    <Table.Caption>A list of your layout sensors.</Table.Caption>
    <Table.Header class="select-none">
      <Table.Row>
        <Table.Head class="w-[25%] md:w-28">Name</Table.Head>
        <Table.Head class="w-[15%] md:w-20">Address</Table.Head>
        <Table.Head class="w-[25%] md:w-32 truncate">Connection</Table.Head>
        <Table.Head class="w-[15%] md:w-20">State</Table.Head>
        <Table.Head class="hidden md:table-cell md:w-auto">Comment</Table.Head>
        <Table.Head class="w-[20%] truncate text-end">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each sensors as sensor (sensor.id)}
        <Table.Row
          class="cursor-pointer outline-none focus-visible:bg-muted/50 {selectedId ===
          sensor.id
            ? 'bg-muted/30'
            : ''}"
          tabindex={0}
          onmouseenter={() => (selectedId = sensor.id)}
          onmouseleave={() => (selectedId = null)}
          onfocus={() => (selectedId = sensor.id)}
        >
          <Table.Cell class="font-medium truncate">{sensor.name}</Table.Cell>
          <Table.Cell class="truncate font-mono text-xs"
            >{sensor.address ?? "-"}</Table.Cell
          >
          <Table.Cell class="truncate">
            {#if sensor.connectionId}
              {@const connection = connectionsCache[sensor.connectionId]}
              {#if connection === undefined}
                <p class="text-xs text-neutral-400">Loading...</p>
              {:else if connection === null}
                <p class="text-red-400 text-xs">Error loading connection</p>
              {:else}
                <div class="flex items-center gap-1.5 truncate">
                  <span class="truncate">{connection.name}</span>
                  {#if !connection.isConnected}
                    <span
                      class="inline-flex items-center gap-1 text-amber-500 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded font-medium"
                      title="Warning: Assigned connection is currently disconnected"
                    >
                      <AlertTriangle class="size-3" />
                      Offline
                    </span>
                  {/if}
                </div>
              {/if}
            {:else}
              <p class="text-amber-500 text-xs italic">Unassigned</p>
            {/if}
          </Table.Cell>
          <Table.Cell class="truncate">
            <span
              class="px-1.5 py-0.5 rounded-md font-semibold uppercase text-[10px]"
              class:bg-emerald-500={sensor.state === "active"}
              class:text-neutral-900={sensor.state === "active"}
              class:bg-neutral-800={sensor.state !== "active"}
              class:text-neutral-300={sensor.state !== "active"}
            >
              {sensor.state}
            </span>
          </Table.Cell>
          <Table.Cell class="hidden md:table-cell truncate text-neutral-400"
            >{sensor.comment ?? ""}</Table.Cell
          >
          <Table.Cell class="text-right">
            <DropdownMenu.Root
              open={dropdownStates[sensor.id] ?? false}
              onOpenChange={(open) => (dropdownStates[sensor.id] = open)}
            >
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Button {...props} variant="ghost" size="icon" class="size-8">
                    <EllipsisIcon />
                    <span class="sr-only">Open menu</span>
                  </Button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item
                  onclick={() => {
                    activeEditId = sensor.id;
                    dropdownStates[sensor.id] = false;
                  }}
                >
                  Edit
                  <DropdownMenu.Shortcut>E</DropdownMenu.Shortcut>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onclick={async () => {
                    await duplicateSensor(sensor.id);
                    dropdownStates[sensor.id] = false;
                    await loadSensors();
                  }}
                >
                  Duplicate
                  <DropdownMenu.Shortcut>D</DropdownMenu.Shortcut>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                  variant="destructive"
                  onclick={() => {
                    activeAlertId = sensor.id;
                    dropdownStates[sensor.id] = false;
                  }}
                >
                  Delete
                  <DropdownMenu.Shortcut>Del</DropdownMenu.Shortcut>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Drawer.Root
              open={activeEditId === sensor.id}
              onOpenChange={(open) => {
                if (!open && activeEditId === sensor.id) {
                  activeEditId = null;
                  loadSensors();
                }
              }}
              direction="right"
              dismissible={true}
            >
              <Drawer.Content
                class="bg-background w-screen! max-w-none! fixed inset-0 h-full border-none rounded-none sm:inset-y-0 sm:right-0 sm:left-auto sm:w-md! sm:max-w-md! sm:rounded-none flex flex-col *:w-full"
              >
                <Drawer.Header>
                  <Drawer.Title>Edit Sensor</Drawer.Title>
                </Drawer.Header>

                <div class="overflow-y-auto px-4 flex-1 w-full">
                  <EditSensorForm {sensor} />
                </div>

                <Drawer.Footer>
                  <Button
                    form="edit-sensor-form"
                    type="submit"
                    onclick={() => {
                      activeEditId = null;
                      loadSensors();
                    }}>Save</Button
                  >
                  <Drawer.Close
                    form="edit-sensor-form"
                    type="reset"
                    onclick={() => (activeEditId = null)}>Cancel</Drawer.Close
                  >
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Root>

            <AlertDialog.Root
              open={activeAlertId === sensor.id}
              onOpenChange={(open) => {
                if (!open) activeAlertId = null;
              }}
            >
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title
                  >
                  <AlertDialog.Description>
                    This action cannot be undone. This will permanently delete
                    the sensor.
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel onclick={() => (activeAlertId = null)}
                    >Cancel</AlertDialog.Cancel
                  >
                  <AlertDialog.Action
                    onclick={async () => {
                      await deleteSensor(sensor.id);
                      activeAlertId = null;
                      dropdownStates[sensor.id] = false;
                      await loadSensors();
                    }}
                  >
                    Continue
                  </AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

<!-- Add Sensor Dialog (make sure to call loadSensors on creation/close if needed) -->
<AddSensorDialog layoutId={params.id}>
  <Fab label="Add Sensor">
    <Plus class="size-8" />
  </Fab>
</AddSensorDialog>
