<script lang="ts">
    import { page } from "$app/stores";
</script>

<p class="text-8xl flex justify-center mt-40">We are sorry...</p>
<p class="flex justify-center m-10 text-lg">
    Error: {$page.status} - {$page.error?.message}
</p>
