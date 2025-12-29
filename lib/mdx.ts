import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const contentDirectory = path.join(process.cwd(), 'content/hardware');

export function getSortedPostsData() {
    if (!fs.existsSync(contentDirectory)) return [];

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            ...(matterResult.data as { date: string; title: string }),
        };
    });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostIds() {
    if (!fs.existsSync(contentDirectory)) return [];
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames.map((fileName) => ({
        params: { slug: fileName.replace(/\.mdx$/, '') },
    }));
}

export async function getPostData(id: string) {
    const fullPath = path.join(contentDirectory, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(gfm) // Support tables, checkboxes, github style
        .use(html, { sanitize: false }) // Allow raw HTML for components
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...(matterResult.data as { date: string; title: string }),
    };
}
