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
      class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />

    {#each baseUrl.issues() as issue}
      <p class="text-s text-red-600 mt-1">{issue.message}</p>
    {/each}
  </div>
</div>
