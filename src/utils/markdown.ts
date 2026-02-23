import { marked } from 'marked';

/**
 * Converts a markdown string to sanitized HTML.
 * @param markdown The markdown string to convert.
 * @returns An object containing the HTML string that can be used with dangerouslySetInnerHTML.
 */
export const renderMarkdown = (markdown: string) => {
    if (!markdown) return { __html: '' };

    // Configure marked options if needed (e.g., gfm: true, breaks: true)
    const options = {
        gfm: true,
        breaks: true,
    };

    return {
        __html: marked.parse(markdown, options) as string
    };
};
