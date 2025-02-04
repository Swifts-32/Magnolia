<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
</script>

<div class="flex gap-4 h-[40rem] m-10">
    <Button onclick={() => goto("/settings/layouts")}>Edit Layouts</Button>
</div>
