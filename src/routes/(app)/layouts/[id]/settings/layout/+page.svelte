<script lang="ts">
  import { Trash2 } from "@lucide/svelte";
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import * as AlertDialog from "#lib/components/ui/alert-dialog/index.js";
  import { Button } from "#lib/components/ui/button/index.js";
  import { Label } from "#lib/components/ui/label/index.js";
  import { Input } from "#lib/components/ui/input/index.js";
  import { deleteLayout } from "#lib/client/layouts.remote.js";

  let { data }: PageProps = $props();
</script>

<div class="m-4">
  <h1 class="text-4xl mb-8">Layout</h1>

  <!-- Layout Name -->
  <div class="grid grid-cols-4 items-center gap-4 my-4 max-w-lg">
    <Label for="layoutName" class="text-right">Name</Label>
    <Input id="layoutName" value={data.name} class="col-span-3" />
  </div>

  <!-- Delete Layout Dialog -->
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <Button class="w-lg" variant="destructive">
        <Trash2 />Delete Layout
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. Are you sure you want to delete this
          layout?
        </AlertDialog.Description>
      </AlertDialog.Header>

      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action
          onclick={async () => {
            await deleteLayout(data.id);
            goto("/");
          }}>Delete Layout</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
