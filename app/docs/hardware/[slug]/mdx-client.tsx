'use client';

import { MDXRemote } from 'next-mdx-remote';
import Video from '../../../../components/mdx/Video';
import LineContactButton from '../../../../components/LineContactButton';

const components = { Video, LineContactButton };

export default function BuildMdxClient({ source }: { source: any }) {
    return <MDXRemote {...source} components={components} />;
}
