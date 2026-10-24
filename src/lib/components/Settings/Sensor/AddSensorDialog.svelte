<!-- <script lang="ts">
  import type { LayoutUUID } from "#lib/client/LayoutClient.svelte";
  import { SensorClient } from "#lib/client/Sensors/SensorClient.svelte";
  import Button from "#lib/components/ui/button/button.svelte";
  import * as Dialog from "#lib/components/ui/dialog/index.js";
  import { toast } from "svelte-sonner";
  import SensorEditor from "./SensorEditor.svelte";

  interface Props {
    open: boolean;
    layoutUuid: LayoutUUID;
  }

  let { open = $bindable(false), layoutUuid }: Props = $props();

  let sensor: SensorClient | undefined = $state(undefined);

  $effect(() => {
    if (open && sensor == undefined) {
      createNewSensor();
    }
  });

  function createNewSensor() {
    sensor = new SensorClient(layoutUuid);
    sensor.name = "New Sensor";
  }

  function closeDialog() {
    open = false;
    sensor = undefined;
  }

  function saveDialog() {
    if (sensor == undefined) {
      closeDialog();
      return;
    }

    fetch(`/api/layout/${layoutUuid}/sensors/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sensor.toJsonWeb()),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          toast.success(json.message);
        } else {
          toast.error(json.message);
        }
      })
      .catch((error) => {
        toast.error("Error creating sensor: " + error);
      });

    closeDialog();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content
    escapeKeydownBehavior="ignore"
    interactOutsideBehavior="ignore"
    onclose={closeDialog}
  >
    <Dialog.Header>
      <Dialog.Title>Create new sensor</Dialog.Title>
    </Dialog.Header>

    {#if sensor}
      <SensorEditor bind:sensor />
    {/if}

    <Dialog.Footer>
      <Button class="w-28" onclick={closeDialog}>Close</Button>
      <Button class="w-28" onclick={saveDialog}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root> -->
