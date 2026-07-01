<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		width: 'wide' | 'narrow' | 'mid';
		children: Snippet;
		left?: Snippet;
		right?: Snippet;
	}

	let { width, children, left, right }: Props = $props();
</script>

<div class="flex justify-between lg:flex-row">
	<div class="flex-1 border-b border-gray-700 lg:px-8">
		{#if left}
			{@render left()}
		{/if}
	</div>
	<div class="flex max-w-[100ch]">
		<div class="w-8 border-b border-gray-700"></div>
		<div class="border-r border-b border-l border-gray-700 bg-main-paper p-8">
			{@render children()}
		</div>
		<div class="w-8 border-b border-gray-700"></div>
	</div>
	<div class="flex-1 border-b border-gray-700 lg:px-8">
		{#if right}
			{@render right()}
		{/if}
	</div>
</div>
