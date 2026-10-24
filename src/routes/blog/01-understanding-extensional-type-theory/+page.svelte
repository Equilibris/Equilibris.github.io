<script lang="ts" module>
	import BlogPostView from "$lib/components/BlogPostView";
	import Container from "$lib/components/Container";
	import classNames from "classnames";
    import tt_img from "$lib/assets/TT.svg"
	import BlogPostCell from "$lib/components/BlogPostCell";
	import P from "$lib/components/P";
	import { R } from "$lib/components/R";
	import A from "$lib/components/A";
	import { Jon } from "$lib/components/Jon";

    export const updateDate = new Date("2026-10-24")
    export const publishDate = new Date("2026-10-24")

    export const slug = "01-understanding-extensional-type-theory"

    export {
        title,
        synopsis,
        banner,
        content,
    }
</script>

{#snippet title()}
    DRAFT: A (basic) understanding of extensional type theory
{/snippet}

{#snippet synopsis()}
    Walking through Chapter 2 from Principles of Dependent Type Theory by Angiuli and Gratzer.
{/snippet}
{#snippet banner(big : boolean)}
    <div class="flex justify-center items-center flex-col">
        <div class={
            classNames(
                "flex justify-center flex-col gap-2",
                big && "max-w-300",
                !big && "max-h-20",
            )
        }>
            <Container no-pad={!big} class="overflow-hidden">
                <img src={tt_img} alt="" >
            </Container>
        </div>
    </div>
{/snippet}
{#snippet content()}
    <BlogPostCell>
        <Container>
            <P>
                This is first and foremost a pre-meeting log for chatting with <A href = "https://www.jonmsterling.com/index/">Jon Sterling</A>.
                Questions for the meeting are marked <Jon>like this</Jon>.
            </P>
        </Container>
        <Container>
            <P>
                Chapter 2 of Principles of Dependent Type Theory (from here on known as The Book) concerns itself with defining the rules of type theory.
                It begins with the classical formulation of STLC,
                but quickly moves on to define the concept of the "substitution calculus".
            </P>
            <P>
                The substitution calculus is a category where objects are contexts,
                and morphisms are (backwards) parallel substitutions.
                The empty context is terminal.
                Thinking back to formalizing different calculi I would also expect that parallel substitution is the right notion here.
                On this we have a set (presheaf) of types <R>Ty(Γ)</R>,
                along with another set of terms <R>Tm(Γ, A)</R> where <R>A ∈ Ty(Γ)</R>.
                There is a natural way to apply substitutions on types and terms.
                Given a context <R>Γ</R> and a type <R>Ty(Γ)</R>,
                we can construct a context <R>Γ.A</R>.
                Terms <R>Tm(Γ, A)</R> induce a map from <R>Γ ⟶ Γ.A</R>.
                We have a special substitution <R> Γ.A ⊢ p : Γ</R>,
                this is weakening.
                We also have a special term <R>Γ ⊢ A type => Γ.A ⊢ q : A[p]</R>,
                the reason there is a <R>p</R> on the <R>A</R> is so the precondition holds.
                For a reason I am slightly confused about they also introduce the notation <R>γ* ≔ λ ξ ↦ ξ ∘ γ</R> which they "the restriction map".
                <Jon>Would be great to chat about what this is / where it comes from</Jon>.
            </P>
        </Container>
        <Container>
            <P>
                In the descriptions of type theory I was used to,
                I would expect the next step would be,
                for each connective:
            </P>
            <ul class="list-disc pl-6">
                <li>Formation rules: <R>Σ (c : X), Y c</R></li>
                <li>Introduction rules: <R>⟨u, v⟩</R></li>
                <li>Elimination rules: <R>let ⟨u, v⟩ := x in body </R></li>
                <li>β rules: <R>let ⟨u, v⟩ := ⟨a, b⟩ in body ⇝ body[id.u ↦ a.v ↦ b]</R></li>
                <li>η rules: <R>let ⟨u, v⟩ := x in ⟨u, v⟩ = x</R></li>
            </ul>
            <P>
                Instead The Book goes on to talk about how each of these can be <em>derived</em> from a (natural) isomorphism.
                This was quite surprising as to me,
                connectives in a theory correspond to different universal properties of the source category.
                For example the CCC structure induces exactly the 3 connectives one would expect in STLC.
                Through conversations with <A href="https://eutro.dev/">Beatrice</A>,
                she told me a fact that natural isomorphisms on presheafs correspond to universal properties in the source category.
                <Jon>Would be nice to chat about this a bit to make sure I understand it</Jon>.
                Nonetheless the key idea can bee sen in Slogan 2.5.5:
            </P>
        </Container>
        <Container>
            <b>Slogan 2.5.5:</b> A connective in type theory is given by (1) a natural type-forming operation
            Υ and (2) one of the following:
            <ol class="list-decimal pl-10">
            <li> a natural isomorphism relating Tm(Γ, Υ) to judgmentally-determined structure, or </li>
            <li> a collection of natural term constructors for Υ which, for all Γ.Υ ⊢ 𝐴 type, determine
            a natural isomorphism relating Tm(Γ.Υ, 𝐴) to judgmentally-determined structure. </li>
            </ol>
        </Container>
        <Container>
            <P>
                I find the exact constructions quite involved and will try to work with them a bit to actually get a feel for how they operate.
                <Jon>If you have some more resources on this construction I would happily read them</Jon>.
            </P>
        </Container>
    </BlogPostCell>
{/snippet}


<BlogPostView rightS={1} leftS={1} {slug} {title} {synopsis} {banner} {publishDate} {updateDate} {content}>
</BlogPostView>

