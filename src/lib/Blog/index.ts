import type { LegacyComponentType } from "svelte/legacy";

export interface Post {
    title: string;

    description: string;

    component: Promise<LegacyComponentType>;
}

export const posts: Post[] = [
    {
        title: "Hello World",
        description: "My first post",
        component: import("./Posts/HelloWorld.svelte").then((mod) => mod.default)
    },
];

