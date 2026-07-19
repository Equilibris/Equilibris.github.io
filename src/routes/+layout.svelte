<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import TopBar from '$lib/components/TopBar';
    import Lander from '$lib/components/Lander';
	import A from '$lib/components/A';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Lander>
    <TopBar />

    <div class="p-4 min-h-screen">
        {@render children?.()}
    </div>

    <div class="flex justify-center">
        <div class="w-[90vw] h-20 border-t border-l border-r border-gray-300 backdrop-blur-sm p-4 rounded-t-sm flex items-center justify-center">
            <div>
                Source code for this site on <A href="https://github.com/Equilibris/Equilibris.github.io/">Github</A>
            </div>
        </div>
    </div>
</Lander>



