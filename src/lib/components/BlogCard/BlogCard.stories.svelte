<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BlogCard from './BlogCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/BlogCard',
		component: BlogCard,
		tags: ['autodocs'],
		argTypes: {
			date: { control: 'text' },
			href: { control: 'text' }
		}
	});
</script>

<Story name="Default" args={{ date: 'March 15, 2024' }}>
	{#snippet title()}
		How to Build a Personal Blog with SvelteKit
	{/snippet}
	{#snippet description()}
		A comprehensive guide to creating your own blog using SvelteKit, Tailwind CSS, and modern web development practices. Learn how to set up routing, create reusable components, and deploy your site.
	{/snippet}
</Story>

<Story name="With Link" args={{ date: 'March 8, 2024', href: '/blog/sveltekit-tips' }}>
	{#snippet title()}
		5 Essential SvelteKit Tips for Beginners
	{/snippet}
	{#snippet description()}
		Discover the most important concepts and patterns that will help you become productive with SvelteKit quickly. From routing to state management, these tips will save you hours of debugging.
	{/snippet}
</Story>

<Story name="Recent Post" args={{ date: 'March 22, 2024', href: '/blog/tailwind-components' }}>
	{#snippet title()}
		Building Reusable Components with Tailwind CSS
	{/snippet}
	{#snippet description()}
		Learn how to create a component library that's both flexible and consistent using Tailwind's utility classes and component patterns.
	{/snippet}
</Story>
