import type { Component, Snippet } from "svelte"

export interface Project {
    slug: string

    default: Component
    title: Snippet
    synopsis: Snippet
}
