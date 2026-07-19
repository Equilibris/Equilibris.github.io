<script lang="ts">
	import A from '$lib/components/A';
    import { showTopText } from '$lib/state/showTopText';

    showTopText.set(true)
</script>

<div id="about-me" class="flex justify-center -mt-25 pt-25">
    <div class="grid grid-cols-2 max-w-6xl gap-10" style="grid-template-columns: 1.5fr 1fr;">
        <div class="flex justify-center flex-col gap-2">
            <!-- <h1 class="text-xl font-bold text-right">About me</h1> -->
            <div class="w-full border border-gray-300 rounded-sm overflow-hidden">
                <img src="harstad.jpg" alt="home" />
            </div>
            <div class="text-xs text-gray-500 text-right">
                Photo by <A href="https://unsplash.com/@gskjalmar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Geir Skjalmar</A> on <A href="https://unsplash.com/photos/a-large-body-of-water-with-snow-covered-mountains-in-the-background-jvPrC3n60u0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</A>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <div class="border border-gray-300 rounded-sm p-4 backdrop-blur-sm flex flex-col gap-2">
                <p class="indent-4">
                    Hi great to meet you, I'm <span title="/ˈvɪljɑm s.ɔːɹɛnsən/">William Sørensen</span>!
                    I am a computer scientist specializing in programming language theory, compilers and systems programming.
                    I intend to start a <A href="/blog">blog</A> where I write tools and posts about my course!
                </p>

                <p class="indent-4">
                    As a bit of background,
                    I stem from <A href="https://www.openstreetmap.org/relation/407767#map=8/68.975/16.729">Harstad</A>,
                    a beautiful city of the north.
                    I later moved to Cambridge for uni where I still reside.
                </p>
                <p class="indent-4">
                    In my freetime I enjoy long distance biking,
                    rowing and, not as often as I would like to playing, the timps.
                </p>
            </div>
            <!-- <div class="flex flex-row items-end"> -->
            <!--     <a title="ACB Smith, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Gonville_%26_Caius_College_Crest_Monochrome.svg"> -->
            <!--         <img width="100" alt="Gonville &amp; Caius College Crest Monochrome" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Gonville_%26_Caius_College_Crest_Monochrome.svg/250px-Gonville_%26_Caius_College_Crest_Monochrome.svg.png"> -->
            <!--     </a> -->
            <!--     <div class="grayscale"> -->
            <!--         <img alt="Byvåpen" loading="lazy" height="20" src="https://www.harstad.kommune.no/images/18.3b84deaf195b24645314a7a1/1743682445663/byvapen.gif"> -->
            <!--     </div> -->
            <!-- </div> -->
        </div>
    </div>
</div>
