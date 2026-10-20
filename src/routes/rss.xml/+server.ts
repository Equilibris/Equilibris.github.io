import type { BlogPost } from "$lib/content/data";
import { renderSnippet } from "$lib/utils/renderSnippet"

export const prerender = true;

// ripped from https://www.adamsanderson.co.uk/blog/2023-05-29-bring-rss-back/

const renderPost = async (post: BlogPost): Promise<string> => {
    const title = (await renderSnippet(post.title,)).body
    const synopsis = (await renderSnippet(post.synopsis,)).body
    const content = (await renderSnippet(post.content)).body

    return `
    <item>
      <title>${title}</title>
      <link>https://s0r.no/blog/${post.slug}</link>
      <description>${synopsis}</description>
      <pubDate>${post.publishDate.toUTCString()}</pubDate>
      <content type="html"><![CDATA[${content}]]></content>
    </item>`
}

export async function GET() {
    const posts: BlogPost[] = Object.values(import.meta.glob("../blog/*/+page.svelte", { eager: true }))

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>My SvelteKit Blog</title>
    <link>https://example.com</link>
    <description>Updates from my blog</description>
    ${(await Promise.all(posts.map(renderPost))).join("\n")}
  </channel>
</rss>`;

    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml',
        },
    });
}
