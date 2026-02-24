import { marked } from 'marked';

// Strip the `public/` prefix that users mistakenly include in markdown image paths.
// Vite/GitHub Pages serves the public folder at the root, so `public/image/x.png`
// should just be `image/x.png` (relative) or `/image/x.png` (absolute).
const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }: { href: string; title: string | null; text: string }) => {
    // Remove leading "public/" from paths like "public/image/5/foo.png"
    const cleanHref = href.replace(/^public\//, '');
    const titleAttr = title ? ` title="${title}"` : '';
    return `<img src="${cleanHref}" alt="${text}"${titleAttr} style="max-width:100%;height:auto;" />`;
};

export const renderMarkdown = (markdown: string) => {
    if (!markdown) return { __html: '' };

    return {
        __html: marked.parse(markdown, { gfm: true, breaks: true, renderer }) as string
    };
};
