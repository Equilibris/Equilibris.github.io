<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		date: string;
		title: string;
		description: string;
	}

	let { date, title, description }: Props = $props();
</script>

<article class="pb-8">
	<h3 class="mb-2 text-xl">
		{title}
	</h3>
	<p class="mb-3 text-sm text-gray-400">{date}</p>
	<div class="text-gray-600">
		{description}
	</div>
</article>
