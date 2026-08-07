<script lang="ts" module>
    import TDP from "$lib/assets/TDP.svg"
	import ProjectView from "$lib/components/ProjectView";
    export const slug = "type_driven_parsing"
    export { title, synopsis, icon }
</script>

{#snippet title()}
    Type driven parsing
{/snippet}

{#snippet synopsis()}
    A quick project done before uni was a LL(k) parser implemented as Ruest generics.
{/snippet}

{#snippet icon()}
    <img src={TDP} alt="A turbofish ::<> with a parse tree in it">
{/snippet}

<ProjectView {title} {synopsis} {icon}>
    And another placeholder
</ProjectView>

