import { getAllPostIds, getPostData } from '../../../../lib/mdx';
import Video from '../../../../components/mdx/Video';
// We use a "client-side" wrapper for the MDXRemote if needed, or import directly if using RSC compatible methods. 
// For "next-mdx-remote/serialize" (server side) + <MDXRemote /> (client side usually), we need a client component wrapper.
// HOWEVER, since Next.js 13+, we can use a simpler approach or the user might be on standard setup.
// Let's use a standard client-component approach for the renderer to be safe with hooks.

import BuildMdxClient from './mdx-client';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths.map((path) => path.params);
}

export default async function Post({ params }: { params: { slug: string } }) {
    // Await params in Next.js 15 (if applicable) or access directly. 
    // To be safe for future/current versions, we treat it as async compatible.
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
        <div className="min-h-screen py-10 px-4 sm:px-8 max-w-4xl mx-auto">
            <article className="glass-card">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-300 dark:to-teal-200">
                    {postData.title}
                </h1>
                <div className="text-sm opacity-60 mb-8">{postData.date}</div>

                <div className="prose prose-emerald dark:prose-invert max-w-none">
                    <BuildMdxClient source={postData.mdxSource} />
                </div>
            </article>
        </div>
    );
}
