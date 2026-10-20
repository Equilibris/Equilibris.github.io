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

export interface BaseBlogPost {
    title: Snippet
    synopsis: Snippet
    banner: Snippet<[boolean]>
    publishDate: Date
    updateDate: Date
}

export interface BlogPost extends BaseBlogPost {
    slug: string
    content: Snippet
    default: Component
}

