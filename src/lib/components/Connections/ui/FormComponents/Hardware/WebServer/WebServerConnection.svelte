<script lang="ts">
  import type { RemoteFormField } from "$app/server";
  import { Label } from "#lib/components/ui/label/index.js";
  import { Input } from "#lib/components/ui/input/index.js";

  interface Props {
    baseUrl: RemoteFormField<string>;
  }

  let { baseUrl }: Props = $props();
</script>

<!-- WebServer Base URL -->
<div class="grid grid-cols-4 items-center gap-4 w-full">
  <Label for="baseUrl" class="text-right">Base URL</Label>
  <div class="col-span-3">
    <Input
      id="baseUrl"
      type="url"
      placeholder="http://127.0.0.1:5000"
      {...baseUrl.as("text")}
    />

    {#each baseUrl.issues() as issue}
      <p class="text-s text-red-600 mt-1">{issue.message}</p>
    {/each}
  </div>
</div>
