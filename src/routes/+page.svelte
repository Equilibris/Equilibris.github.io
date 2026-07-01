<script lang="ts">
	import HSpacer from '$lib/components/HSpacer';
	import PostRenderer from '$lib/components/PostRenderer';
	import { posts } from '$lib/Blog';
</script>

<div class="bg-main-container">
	<HSpacer width="mid">
		<section class="flex flex-col justify-center">
			<div class="space-y-6">
				<h1 class="text-4xl font-bold sm:text-5xl">ws</h1>
				<div class="prose prose-lg text-gray-700">
					<p>A simple blog about a random collection of things.</p>
				</div>
			</div>
		</section>
	</HSpacer>

	<section class="space-y-8">
		{#each posts as post}
			<HSpacer width="wide">
				<PostRenderer {post} />
			</HSpacer>
		{/each}
	</section>
</div>
