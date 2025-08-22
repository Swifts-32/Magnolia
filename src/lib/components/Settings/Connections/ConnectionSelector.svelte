<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    getConnection,
    getConnections,
  } from "../../../../routes/(app)/layouts/[id]/settings/connections/connections.remote";

  interface Props {
    layoutId: string;
    selConnectionId?: string | null;
  }

  let { layoutId, selConnectionId = $bindable(null) }: Props = $props();
</script>

<Select.Root
  type="single"
  name="connectionId"
  bind:value={
    () => (selConnectionId ? selConnectionId : ""),
    (v) => {
      if (v) selConnectionId = v;
      else selConnectionId = null;
    }
  }
  allowDeselect={true}
>
  <Select.Trigger class="col-span-3">
    {selConnectionId
      ? (await getConnection(selConnectionId)).name
      : "Select Connection"}
  </Select.Trigger>
  <Select.Content>
    {#each await getConnections(layoutId) as connection}
      <Select.Item
        value={connection.uuid}
        label={connection.name}
        class={selConnectionId === connection.uuid
          ? "cursor-default"
          : "cursor-pointer"}>{connection.name}</Select.Item
      >
    {/each}
  </Select.Content>
</Select.Root>
