<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import TopBar from '$lib/components/TopBar';
    import Lander from '$lib/components/Lander';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Lander/>

<TopBar />

<div class="p-4">
    {@render children?.()}
</div>
