# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a SvelteKit project with TypeScript, Tailwind CSS, and Storybook integration.

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Run TypeScript and Svelte checks
- `pnpm check:watch` - Run checks in watch mode
- `pnpm lint` - Run Prettier and ESLint checks
- `pnpm format` - Format code with Prettier

### Storybook Commands
- `pnpm storybook` - Start Storybook dev server on port 6006
- `pnpm build-storybook` - Build Storybook for production

## Project Architecture

### Tech Stack
- **Framework**: SvelteKit with Svelte 5
- **TypeScript**: Full TypeScript support with strict mode
- **Styling**: Tailwind CSS v4 with forms and typography plugins
- **Markdown**: MDSvex for Markdown in Svelte
- **Static Generation**: Uses `@sveltejs/adapter-static` with 404 fallback
- **Component Documentation**: Storybook with Svelte CSF addon

### Directory Structure
- `src/lib/` - Shared library code and components
- `src/lib/components/` - Reusable Svelte components with co-located stories
- `src/routes/` - SvelteKit routes and pages
- `static/` - Static assets

### Key Patterns
- Components use Svelte 5 syntax with `$props()` and snippets
- Component exports follow barrel pattern via `index.ts` files
- Storybook stories are co-located with components (`.stories.svelte`)
- Uses `$lib` alias for importing from `src/lib/`
- CSS uses Tailwind utility classes with prose plugin for content

### Build Configuration
- Vite with SvelteKit and Tailwind CSS plugins
- Static adapter configured for deployment with 404 fallback
- BASE_PATH environment variable support for deployment paths
- MDSvex preprocessing for Markdown content

### Current State
This appears to be a blog template project with placeholder content. The main page displays a personal introduction and sample blog post cards using the BlogCard component.