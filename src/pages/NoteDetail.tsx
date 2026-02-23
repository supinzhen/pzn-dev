import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, Share2, ChevronRight } from 'lucide-react';
import { noteService } from '../utils/noteService';

interface NoteDetailProps {
    lang: 'en' | 'zh';
}

const NoteDetail: React.FC<NoteDetailProps> = ({ lang }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const note = useMemo(() => {
        const found = noteService.getNoteById(id || '');
        if (!found) return null;
        return {
            ...found,
            title: lang === 'zh' ? found.title_zh : found.title_en,
            summary: lang === 'zh' ? found.summary_zh : found.summary_en,
            content: lang === 'zh' ? found.content_zh : found.content_en
        };
    }, [id, lang]);

    if (!note) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Note not found</h1>
                <button onClick={() => navigate('/notes')} className="text-ue-blue hover:underline">Back to List</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-12 font-mono">
                <Link to="/" className="hover:text-ue-blue transition-colors">HOME</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/notes" className="hover:text-ue-blue transition-colors">NOTES</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-500 dark:text-slate-300 truncate max-w-[200px] uppercase">{note.title}</span>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <button
                        onClick={() => navigate('/notes')}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-ue-blue transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold tracking-wider font-mono">BACK TO LIST</span>
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-ue-blue/10 text-ue-blue rounded text-[10px] font-mono border border-ue-blue/20">
                            {note.category}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                            <Calendar className="w-3 h-3" />
                            {note.date}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8 font-sans">
                        {note.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-ue-blue/20 border border-ue-blue/30 flex items-center justify-center text-ue-blue font-bold font-mono">
                                AS
                            </div>
                            <div>
                                <div className="text-sm font-bold">{note.author}</div>
                                <div className="text-xs text-slate-500 font-mono uppercase">Systems Engineer</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-slate-500">
                            <div className="flex items-center gap-2 text-xs font-mono">
                                <Clock className="w-4 h-4" />
                                {note.readTime}
                            </div>
                            <button className="hover:text-ue-blue transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="prose prose-slate dark:prose-invert max-w-none font-sans">
                    <div
                        dangerouslySetInnerHTML={{ __html: note.content }}
                        className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-6"
                    />
                </article>

                {/* Footer / Tags */}
                <footer className="mt-16 pt-8 border-t border-white/10 dark:border-white/5">
                    <div className="flex items-center gap-3 text-slate-500 mb-8">
                        <Tag className="w-4 h-4" />
                        <div className="flex gap-2 font-sans">
                            {note.tags.map((tag: string) => (
                                <span key={tag} className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-white/5">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl bg-gradient-to-br from-ue-blue/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold mb-1">覺得這篇筆記有幫助嗎？</h4>
                            <p className="text-sm text-slate-500 font-sans">這篇文章是專業技術系列的一部分，如有疑問歡迎聯繫討論。</p>
                        </div>
                        <Link to="/#contact" className="px-6 py-2 bg-ue-blue hover:bg-blue-600 text-white text-xs font-bold rounded transition-all">
                            CONTACT ME
                        </Link>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default NoteDetail;
