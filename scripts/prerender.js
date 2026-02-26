import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const NOTES_DATA_PATH = path.resolve(__dirname, '../src/assets/data/notes.json');
const POSTS_DIR = path.resolve(__dirname, '../public/posts');
const INDEX_HTML_PATH = path.resolve(DIST_DIR, 'index.html');
const DEFAULT_IMAGE = 'https://supinzhen.github.io/pzn-dev/image/Gemini_Generated_Image_uydifmuydifmuydi.png';

async function prerender() {
    console.log('🚀 Starting custom prerender script...');

    if (!fs.existsSync(INDEX_HTML_PATH)) {
        console.error('❌ dist/index.html not found. Run build first.');
        process.exit(1);
    }

    const template = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    const notesArr = JSON.parse(fs.readFileSync(NOTES_DATA_PATH, 'utf-8'));

    for (const note of notesArr) {
        const slug = note.slug;
        const noteDir = path.join(DIST_DIR, 'notes', slug);

        if (!fs.existsSync(noteDir)) {
            fs.mkdirSync(noteDir, { recursive: true });
        }

        const title = note.title_zh || note.title;
        const fullTitle = `${title} | Annie Su`;
        // Clean up summary: remove newlines, limit length
        const description = (note.summary_zh || note.summary || '')
            .replace(/\r?\n|\r/g, ' ')
            .replace(/"/g, '&quot;')
            .trim()
            .substring(0, 160);

        const url = `https://supinzhen.github.io/pzn-dev/notes/${slug}`;

        // Attempt to find the first image in the content
        let ogImage = DEFAULT_IMAGE;
        try {
            const postPath = path.join(POSTS_DIR, `${slug}.json`);
            if (fs.existsSync(postPath)) {
                const postData = JSON.parse(fs.readFileSync(postPath, 'utf-8'));
                const content = postData.content || '';
                // Look for markdown image: ![alt](url)
                const imgMatch = content.match(/!\[.*?\]\((.*?)\)/);
                if (imgMatch && imgMatch[1]) {
                    let imgSrc = imgMatch[1];
                    if (imgSrc.startsWith('/')) {
                        ogImage = `https://supinzhen.github.io/pzn-dev${imgSrc}`;
                    } else if (!imgSrc.startsWith('http')) {
                        // Handle relative paths if any (unlikely in this setup but safe)
                        ogImage = `https://supinzhen.github.io/pzn-dev/posts/${imgSrc}`;
                    } else {
                        ogImage = imgSrc;
                    }
                }
            }
        } catch (e) {
            console.warn(`Could not extract image for ${slug}:`, e.message);
        }

        let html = template;

        // Replace Titles
        html = html.replace(/<title>.*?<\/title>/g, `<title>${fullTitle}</title>`);

        // Replace OG Tags (using non-greedy match to handle existing content)
        html = html.replace(/<meta property="og:title" content=".*?">/g, `<meta property="og:title" content="${fullTitle}">`);
        html = html.replace(/<meta property="og:description" content=".*?">/g, `<meta property="og:description" content="${description}">`);
        html = html.replace(/<meta property="og:url" content=".*?">/g, `<meta property="og:url" content="${url}">`);
        html = html.replace(/<meta property="og:image" content=".*?">/g, `<meta property="og:image" content="${ogImage}">`);

        // Replace Twitter Tags
        html = html.replace(/<meta property="twitter:title" content=".*?">/g, `<meta property="twitter:title" content="${fullTitle}">`);
        html = html.replace(/<meta property="twitter:description" content=".*?">/g, `<meta property="twitter:description" content="${description}">`);
        html = html.replace(/<meta property="twitter:url" content=".*?">/g, `<meta property="twitter:url" content="${url}">`);
        html = html.replace(/<meta property="twitter:image" content=".*?">/g, `<meta property="twitter:image" content="${ogImage}">`);

        fs.writeFileSync(path.join(noteDir, 'index.html'), html);
        console.log(`✅ Prerendered: /notes/${slug}`);
    }

    console.log('✨ Prerender complete!');
}

prerender();
