<script lang="ts">
	import BlogCard from '$lib/components/BlogCard';
	import type { Post } from '$lib/Blog';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	let isOpen = $state(false);

	function togglePost() {
		isOpen = !isOpen;
	}
</script>

<div>
	<button onclick={togglePost} class="w-full text-left">
		<BlogCard date="March 15, 2024" title={post.title} description={post.description}></BlogCard>
	</button>
	{#if isOpen}
		<div class="prose prose-lg mt-4 max-w-none">
			{#await post.component}
				<div class="animate-pulse">Loading...</div>
			{:then Component}
				<svelte:component this={Component} />
			{:catch error}
				<div class="text-red-600">Error loading post: {error.message}</div>
			{/await}
		</div>
	{/if}
</div>

