import { untrack } from "svelte"

export const osc = (dur: number) => {
    let s = $state(true)
    $effect(() => {
        const i = setInterval(() => {
            s = !untrack(() => s)
        }, dur)
        return () => clearInterval(i)
    })

    return () => s
}

