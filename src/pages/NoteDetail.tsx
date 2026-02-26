import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, ChevronRight, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { noteService } from '../utils/noteService';
import { renderMarkdown } from '../utils/markdown';
import { translations } from '../assets/translations/data';

interface NoteDetailProps {
    lang: 'en' | 'zh';
}

const NoteDetail: React.FC<NoteDetailProps> = ({ lang }) => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [copied, setCopied] = React.useState(false);

    const t = (key: string): string => {
        const data = translations[lang] as unknown as Record<string, string>;
        return data[key] || key;
    };

    const [noteContent, setNoteContent] = React.useState<{ content: string, content_zh?: string, content_en?: string } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const note = useMemo(() => {
        return noteService.getNoteBySlug(slug || '');
    }, [slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (slug) {
            setIsLoading(true);
            noteService.getNoteContent(slug).then(content => {
                setNoteContent(content);
                setIsLoading(false);
            });
        }
    }, [slug]);

    if (!note) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Note not found</h1>
                <button onClick={() => navigate('/notes')} className="text-ue-blue hover:underline">Back to List</button>
            </div>
        );
    }

    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(note.title);

    const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
        let url = '';
        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
        }
        window.open(url, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const displayContent = lang === 'en' ? (noteContent?.content_en || noteContent?.content) : (noteContent?.content_zh || noteContent?.content);

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500 mb-12 font-mono">
                <Link to="/" className="hover:text-ue-blue transition-colors text-ue-blue/60">{t('breadcrumb-home')}</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/notes" className="hover:text-ue-blue transition-colors text-ue-blue/60">{t('breadcrumb-notes')}</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px] uppercase font-bold">{note.title}</span>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <button
                        onClick={() => navigate('/notes')}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-ue-blue transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold tracking-wider font-mono uppercase">{t('back-to-list')}</span>
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-ue-blue/10 text-ue-blue rounded text-[10px] font-mono border border-ue-blue/20">
                            {note.category}
                        </span>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500 text-xs font-mono">
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
                        <div className="flex items-center gap-4 text-slate-500">
                            <div className="flex items-center gap-2 text-xs font-mono mr-2">
                                <Clock className="w-4 h-4" />
                                {note.readTime}
                            </div>

                            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="p-2 hover:bg-ue-blue/10 hover:text-ue-blue rounded-full transition-all"
                                    title="Share on Twitter"
                                >
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="p-2 hover:bg-ue-blue/10 hover:text-ue-blue rounded-full transition-all"
                                    title="Share on Facebook"
                                >
                                    <Facebook className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="p-2 hover:bg-ue-blue/10 hover:text-ue-blue rounded-full transition-all"
                                    title="Share on LinkedIn"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 hover:bg-ue-blue/10 hover:text-ue-blue rounded-full transition-all relative"
                                    title="Copy Link"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-fade-in-up">
                                            COPIED
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="max-w-none font-sans prose-markdown">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-500">
                            <div className="w-8 h-8 border-2 border-ue-blue/30 border-t-ue-blue rounded-full animate-spin"></div>
                            <span className="text-xs font-mono uppercase tracking-widest">Loading content...</span>
                        </div>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={renderMarkdown(displayContent || '')}
                            className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg"
                        />
                    )}
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
                            <h4 className="text-lg font-bold mb-1">{t('note-helpful')}</h4>
                            <p className="text-sm text-slate-500 font-sans">{t('note-desc')}</p>
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