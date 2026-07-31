import _ from "lodash";
import { untrack } from "svelte";

// https://stackoverflow.com/questions/78906849/is-there-a-way-to-debounce-a-svelte-5-derived-value
export const debounce = <T>(getter: () => T, wait: number): () => T => {
    let current = $state<T>(untrack(() => getter()));
    const update = _.debounce(v => current = v, wait);
    $effect(() => update(getter()));

    return () => current;
}

