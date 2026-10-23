<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select/index.js";
  import type { RemoteFormField } from "@sveltejs/kit";

  interface Props {
    formElement:  RemoteFormField<T>;
    values: {
      name: string;
      uuid: string;
    }[]; 
  }

  let { formElement, values}: Props = $props();
</script>
   
   <div class="grid grid-cols-4 items-center gap-4">
      <Label for="connectionId" class="text-right">Connections</Label>

      <div class="col-span-3">
        <Select.Root
          type="single"
          allowDeselect={true}
          {...formElement.as("text")}
          bind:value={
            () => formElement.value(),
            (value) => value && formElement.set(value)
          }
        >
          <Select.Trigger class="col-span-3">
            {const triggerValue = $derived.by(async () => {
              const connValue = formElement.value();
              if (!connValue) return "Select a Connection";

              return values.find(x => x.uuid === connValue)?.name ?? "Select a Connection";
            })}
            {await triggerValue}
          </Select.Trigger>
          <Select.Content>
            {#each values as item}
              <Select.Item value={item.uuid}
                >{item.name}</Select.Item
              >
            {/each}
          </Select.Content>
        </Select.Root>

        {#each formElement.issues() as issue}
          <p class="text-s text-red-600">{issue.message}</p>
        {/each}
      </div>
    </div>