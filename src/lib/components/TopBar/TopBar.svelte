<script>
	import { resolve } from "$app/paths";
	import A from "../A";
    import WS from "../WS";
</script>
<div class = "sticky w-full top-0 p-4 z-100">
    <div class=" flex justify-between align-middle p-4 backdrop-blur-xs border border-gray-300 rounded-sm gap-2">
        <a href={resolve("/")}> <WS/> </a>
        <div class="flex-1"></div>
        <div class="flex flex-row align-middle mix-blend-screen text-red">
            <A href={resolve("/#about-me")}>
                About me
            </A>
        </div>
        <div class="flex flex-row align-middle mix-blend-screen text-red">
            <A href={resolve("/blog")}>
                Blog
            </A>
        </div>
    </div>
</div>
