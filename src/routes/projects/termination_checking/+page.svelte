<script lang="ts" module>
    import TC from "$lib/assets/TermCheck.svg"
	import ProjectView from "$lib/components/ProjectView";

    export const slug = "termination_checking"
    export { title, synopsis, icon }
</script>

{#snippet title()}
    Termination checking
{/snippet}

{#snippet synopsis()}
    During first year of Cambridge, I became quite interested in termination checking of ML like programs.
    I then implemented a super simple term checker in OCaml.
{/snippet}

{#snippet icon()}
    <img src={TC} alt="A graph of function calls to check the termination of">
{/snippet}

<ProjectView {title} {synopsis} {icon}>
    Likewise here
</ProjectView>
