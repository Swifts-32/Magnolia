<script lang="ts">
  import Card from "$lib/components/ui/card/card.svelte";
  import { trainHandler } from "../../../../services/deprecated/trainHandler.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Train } from "../../../../services/train.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  let curAddr: number | null = $state(null);
  let curTrain: Train | null = $derived(trainHandler.getTrain(curAddr));
  let editMode = $derived(curAddr != null);

  function saveChanges() {
    curAddr = null;
    trainHandler.saveTrains();
  }
</script>

<div class="m-10 flex flex-col gap-5 select-none cursor-pointer">
  {#each trainHandler.trains.values() as train}
    <Card class="p-5 flex" onclick={() => (curAddr = train.addr)}>
      <div>
        <p class="text-2xl">{train.name}</p>
        <p class="text-sm">Addr: {train.addr}</p>
      </div>
    </Card>
  {/each}
</div>


<!-- TODO Use a HTML Form here -->
<Dialog.Root open={editMode}>
  <Dialog.Content interactOutsideBehavior="ignore" escapeKeydownBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>Edit Train</Dialog.Title>
    </Dialog.Header>

    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="trainName" class="text-right">Name</Label>
      <Input id="trainName" value={curTrain?.name} class="col-span-3" />
    </div>

    <div class="grid grid-cols-4 items-center gap-4">
      <Label for="trainAddress" class="text-right">DCC Address</Label>
      <Input id="trainAddress" value={curTrain?.addr} class="col-span-3" />
    </div>

    <Dialog.Footer>
      <Button type="reset" class="w-28" variant="outline" onclick={() => (curAddr = null)}>Cancel</Button
      >
      <Button type="submit" class="w-28" onclick={saveChanges}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
