import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

const contentDirectory = path.join(process.cwd(), 'content/hardware');

export function getSortedPostsData() {
    // Get file names under /content/hardware
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".mdx" from file name to get id
        const id = fileName.replace(/\.mdx$/, '');

        // Read markdown file as string
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            ...(matterResult.data as { date: string; title: string }),
        };
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.mdx$/, ''),
            },
        };
    });
}

export async function getPostData(id: string) {
    const fullPath = path.join(contentDirectory, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Serialize the content string for MDX
    const mdxSource = await serialize(matterResult.content);

    return {
        id,
        mdxSource,
        ...(matterResult.data as { date: string; title: string }),
    };
}
