import type { Component, Snippet } from "svelte"

export interface BaseProject {
    title: Snippet
    synopsis: Snippet
    icon: Snippet
}

export interface Project extends BaseProject {
    slug: string
    default: Component
}
