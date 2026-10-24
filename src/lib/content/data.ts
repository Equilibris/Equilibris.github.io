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

export interface BlogPost {
    title: Snippet
    synopsis: Snippet
    banner: Snippet<[boolean]>
    publishDate: Date
    updateDate: Date
    content: Snippet
    slug: string
}

