import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, Cpu, Video, Code, Filter, X, List, ChevronRight } from 'lucide-react';
import { noteService } from '../utils/noteService';

interface NotesProps {
    lang: 'en' | 'zh';
    t: (key: string) => string;
}

const Notes: React.FC<NotesProps> = ({ lang, t }) => {
    const [searchParams] = useSearchParams();
    const activeCategory = searchParams.get('category');

    const categories = [
        { id: 1, title: 'Unreal Engine', icon: <Cpu className="w-8 h-8 text-ue-blue" />, count: 12, desc: 'Technical logs about UE5, Blueprints, and C++.' },
        { id: 2, title: 'Virtual Production', icon: <Video className="w-8 h-8 text-ue-blue" />, count: 8, desc: 'On-set workflows and tracking systems.' },
        { id: 3, title: 'Broadcast IP', icon: <Book className="w-8 h-8 text-ue-blue" />, count: 5, desc: 'ST 2110, NMOS, and networking notes.' },
        { id: 4, title: 'Web & AI', icon: <Code className="w-8 h-8 text-ue-blue" />, count: 10, desc: 'React, LLM integration, and web tools.' },
    ];

    const allNotes = useMemo(() => {
        return noteService.getNotes().map(note => ({
            ...note,
            title: lang === 'zh' ? note.title_zh : note.title_en,
            summary: lang === 'zh' ? note.summary_zh : note.summary_en
        }));
    }, [lang]);

    const filteredNotes = useMemo(() => {
        if (!activeCategory) return allNotes;
        return allNotes.filter(note => note.category.toLowerCase() === activeCategory.toLowerCase());
    }, [activeCategory, allNotes]);

    return (
        <div className="container mx-auto px-6 py-24">
            <div className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-sans">
                        <span className="text-ue-blue">{t('nav-notes')}</span>
                    </h1>
                    <Link
                        to="/notes/all"
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-ue-blue/10 border border-white/10 hover:border-ue-blue/30 rounded-xl transition-all group font-sans text-sm font-bold"
                    >
                        <List className="w-4 h-4 text-ue-blue" />
                        瀏覽全部文章
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-sans text-lg">
                    {lang === 'zh' ? '工程實踐中的技術筆記、解決方案與學習心得。' : 'Technical logs, solutions, and learning notes from my engineering practice.'}
                </p>
            </div>

            {/* Categories Grid */}
            <div className="mb-20">
                <h2 className="text-2xl font-bold mb-8 font-sans flex items-center gap-3">
                    <span className="w-2 h-8 bg-ue-blue rounded-full"></span>
                    主題分類
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/notes?category=${cat.title.toLowerCase()}`}
                            className={`glass p-8 rounded-2xl border transition-all group cursor-pointer block ${activeCategory === cat.title.toLowerCase() ? 'border-ue-blue ring-1 ring-ue-blue/20' : 'border-white/5 hover:border-ue-blue/30'}`}
                        >
                            <div className="mb-6 transform group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-sans group-hover:text-ue-blue transition-colors">{cat.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 font-sans leading-relaxed">{cat.desc}</p>
                            <div className="flex justify-between items-center text-xs font-mono">
                                <span className="text-slate-500 dark:text-slate-600 uppercase">{cat.count} NOTES</span>
                                <span className="text-ue-blue font-bold flex items-center">
                                    BROWSE <i className="fas fa-chevron-right ml-2 text-[10px]"></i>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* List Header with Filter Info */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl font-bold font-sans flex items-center gap-3">
                    <span className="w-2 h-8 bg-ue-blue rounded-full"></span>
                    {activeCategory ? (
                        <>
                            <span className="uppercase">{activeCategory}</span>
                            <span className="text-slate-500 text-lg font-light">({filteredNotes.length})</span>
                        </>
                    ) : (
                        lang === 'zh' ? '近期技術洞察' : 'Recent Technical Insights'
                    )}
                </h2>

                {activeCategory && (
                    <Link
                        to="/notes"
                        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-ue-blue transition-colors bg-black/5 dark:bg-white/5 px-4 py-2 rounded-lg border border-white/10"
                    >
                        <X className="w-4 h-4" />
                        清除篩選
                    </Link>
                )}
            </div>

            {/* Notes Grid */}
            <div className="mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <Link key={note.id} to={`/notes/${note.id}`} className="glass p-8 rounded-2xl border-white/5 hover:border-ue-blue/30 transition-all group relative overflow-hidden flex flex-col justify-between block font-sans">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-ue-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-ue-blue/10 text-ue-blue rounded text-[10px] font-mono border border-ue-blue/20">
                                            {note.category}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-600 text-xs font-mono">{note.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-ue-blue transition-colors">{note.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2 italic font-sans dark:font-light">"{note.summary}"</p>
                                </div>

                                <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/5">
                                    <div className="flex gap-2">
                                        {note.tags.map(tag => (
                                            <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-white/5">#{tag}</span>
                                        ))}
                                    </div>
                                    <div className="text-ue-blue text-xs font-bold hover:underline flex items-center gap-2 font-sans">
                                        READ MORE
                                        <i className="fas fa-arrow-right text-[10px]"></i>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass rounded-2xl border-dashed border-white/5">
                            <Filter className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 line-height-relaxed font-sans">此分類暫無筆記，內容遷移中...<br /><span className="text-xs uppercase opacity-60">Content coming soon</span></p>
                        </div>
                    )}
                </div>
            </div>

            {/* Migration Status Card */}
            <div className="p-12 glass rounded-3xl border-dashed border-white/10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                    <Book className="text-slate-400 dark:text-slate-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">筆記內容持續遷移中...</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-sans">
                    目前的教學文章與技術日誌正在從 Notion 與 Obsidian 等平台逐步轉移至此。
                    <br />Looking for deeper technical insights? Stay tuned.
                </p>
                <div className="mt-8 flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 bg-ue-blue rounded-full animate-pulse"></span>
                        Content Processing
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notes;
