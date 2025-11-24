<script>
    import "../app.css"

    let {children} = $props();

</script>
<svelte:head>
	<title>Magnolia</title>
</svelte:head>

{@render children()}

