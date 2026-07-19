<script lang="ts">
  import { Input } from "../ui/input";
  import { Label } from "../ui/label";
  import type { RemoteFormField } from "@sveltejs/kit";

  interface Props {
    id: string;
    label: string;
    value: string;
    field: RemoteFormField<string>;
  }

  let { id, label, value = $bindable(), field }: Props = $props();
</script>
<!-- TODO ensure it uses real value -->
<div class="grid grid-cols-4 items-center gap-4">
  <Label for={id} class="text-right">{label}</Label>
  <div class="col-span-3">
    <Input {id} {...field.as("text", value)} bind:value />
    {#each field.issues() as issue}
      <p class="text-s text-red-600">{issue.message}</p>
    {/each}
  </div>
</div>
