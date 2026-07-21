<script lang="ts" module>
    import Coinductive from "$lib/assets/Coinductive.svg"
	import A from "$lib/components/A";
	import ProjectView from "$lib/components/ProjectView";
    export const slug = "coinductives"
    export { title, synopsis, icon }
</script>

{#snippet title()}
    Fast and easy-to-use coinductive datatypes for Lean4
{/snippet}

{#snippet synopsis()}
    Coinductive datatypes are structures I have taken a great deal of interest in in the past years.
    I wrote my dissertation on how to make them performant,
    and I had an internship under <A href="https://github.com/alexkeizer">Alex Keizer</A> working on them!
{/snippet}

{#snippet icon()}
    <img src={Coinductive} alt="An infinite sequence">
{/snippet}

<ProjectView {icon} {synopsis} {title}>
    Still working here! Might put more resources up over time :)
</ProjectView>


