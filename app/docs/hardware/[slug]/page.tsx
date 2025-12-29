import { getAllPostIds, getPostData } from '../../../../lib/mdx';
import { ChevronLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Card from '@/components/ui/Card';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths.map((path) => path.params);
}

export default async function Post({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
        <DashboardShell>
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                {/* Back Button */}
                <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Library</span>
                </Link>

                {/* Hero Header */}
                <div className="relative p-12 rounded-[2.5rem] overflow-hidden border border-white/10 glass">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 rounded-full bg-brand-primary text-black text-[10px] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    Hardware Reference
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                    v.2025.1
                                </span>
                            </div>
                            <h1 className="text-5xl font-montserrat font-black text-white leading-tight mb-8">
                                {postData.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar className="w-4 h-4 text-brand-primary" />
                                    <span className="text-xs font-bold">{postData.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <User className="w-4 h-4 text-brand-primary" />
                                    <span className="text-xs font-bold">Grids Micro Engineering</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock className="w-4 h-4 text-brand-primary" />
                                    <span className="text-xs font-bold">12 min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-brand-primary hover:text-black transition-all group">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content & Sidebar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Content Column */}
                    <div className="lg:col-span-3">
                        <Card className="p-12 overflow-visible">
                            <div
                                className="prose prose-invert prose-emerald max-w-none 
                                    prose-h2:font-montserrat prose-h2:font-black prose-h2:text-3xl prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6
                                    prose-h3:font-montserrat prose-h3:font-bold prose-h3:text-xl prose-h3:text-brand-primary prose-h3:mt-8
                                    prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                                    prose-li:text-slate-400
                                    prose-strong:text-white prose-strong:font-black
                                    prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-pre:shadow-none
                                    prose-code:text-brand-secondary
                                    "
                                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                            />
                        </Card>
                    </div>

                    {/* Meta Sidebar */}
                    <div className="space-y-6">
                        <Card title="Module Status" className="pb-8">
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Stability</span>
                                    <span className="text-brand-primary font-black">Production</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-brand-primary h-full w-[95%] shadow-[0_0_10px_var(--color-brand-primary)]" />
                                </div>

                                <div className="flex justify-between items-center text-sm pt-4">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cloud Sync</span>
                                    <span className="text-brand-primary font-black">Active</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-brand-primary h-full w-[100%] shadow-[0_0_10px_var(--color-brand-primary)]" />
                                </div>
                            </div>
                        </Card>

                        <Card title="Quick Resources">
                            <div className="flex flex-col gap-3 pt-4 text-xs font-bold uppercase tracking-widest">
                                <a href="#" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all text-slate-400 hover:text-white">
                                    Download Schematics
                                </a>
                                <a href="#" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all text-slate-400 hover:text-white">
                                    Firmware v1.4 (Hex)
                                </a>
                                <a href="#" className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-black transition-all">
                                    Join Community Hub
                                </a>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
