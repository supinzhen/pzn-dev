import React, { useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, Cpu, Video, Filter, X, List, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { noteService } from '../utils/noteService';

interface NotesProps {
    lang: 'en' | 'zh';
    t: (key: string) => string;
}

const Notes: React.FC<NotesProps> = ({ lang, t }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category');
    const activeTag = searchParams.get('tag');

    const allNotes = useMemo(() => {
        return noteService.getNotes().map(note => ({
            ...note,
            title: lang === 'zh' ? (note.title_zh || note.title) : (note.title_en || note.title),
            summary: lang === 'zh' ? (note.summary_zh || note.summary) : (note.summary_en || note.summary)
        }));
    }, [lang]);

    useEffect(() => {
        document.title = `${t('nav-notes')} | Annie Su`;
        AOS.init({ duration: 800, once: true, easing: 'ease-out-quad' });
    }, [lang, t]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allNotes.forEach(n => {
            counts[n.category] = (counts[n.category] || 0) + 1;
        });
        return counts;
    }, [allNotes]);

    const categories = [
        { id: 1, title: 'Unreal Engine', icon: <Cpu className="w-8 h-8 text-ue-blue" />, desc: 'Technical logs about UE5, Blueprints, and C++.' },
        { id: 3, title: 'System Integration', icon: <Book className="w-8 h-8 text-ue-blue" />, desc: 'ST 2110, NMOS, and networking notes.' },
        { id: 2, title: 'Virtual Production', icon: <Video className="w-8 h-8 text-ue-blue" />, desc: 'On-set workflows and tracking systems.' },
        { id: 4, title: 'Others', icon: <List className="w-8 h-8 text-ue-blue" />, desc: 'React, LLM integration, and other technical tools.' },
    ];

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        noteService.getNotes().forEach(note => {
            note.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, []);

    const filteredNotes = useMemo(() => {
        let filtered = allNotes;
        if (activeCategory) {
            filtered = filtered.filter(note => note.category.toLowerCase() === activeCategory.toLowerCase());
        }
        if (activeTag) {
            filtered = filtered.filter(note => note.tags?.includes(activeTag));
        }
        return filtered;
    }, [activeCategory, activeTag, allNotes]);

    const handleTagClick = (tag: string) => {
        if (activeTag === tag) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('tag');
            setSearchParams(newParams);
        } else {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('tag', tag);
            setSearchParams(newParams);
        }
    };

    return (
        <div className="container mx-auto px-6 py-24">
            <div className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-sans" data-aos="fade-right">
                        <span className="text-ue-blue">{t('nav-notes')}</span>
                    </h1>
                    <Link
                        to="/notes/all"
                        className="flex items-center gap-2 px-8 py-4 bg-ue-blue text-white hover:bg-ue-blue/90 shadow-lg shadow-ue-blue/20 rounded-xl transition-all group font-sans text-sm font-bold active:scale-95"
                    >
                        <List className="w-5 h-5" />
                        瀏覽全部文章
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-sans text-lg" data-aos="fade-right" data-aos-delay="200">
                    {lang === 'zh' ? '工程實踐中的技術筆記、解決方案與學習心得。' : 'Technical logs, solutions, and learning notes from my engineering practice.'}
                </p>
            </div>



            {/* Subject Categories */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 font-sans flex items-center gap-3" data-aos="fade-up">
                    <span className="w-2 h-8 bg-ue-blue rounded-full"></span>
                    主題分類
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans focus-within:ring-0">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            to={`/notes?category=${cat.title.toLowerCase()}`}
                            className={`glass p-5 rounded-xl border transition-all group cursor-pointer block ${activeCategory === cat.title.toLowerCase() ? 'border-ue-blue ring-1 ring-ue-blue/20' : 'border-white/5 hover:border-ue-blue/30'}`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="mb-4 transform group-hover:scale-105 transition-transform flex items-center gap-3">
                                <div className="p-2 bg-ue-blue/5 rounded-lg">
                                    {React.cloneElement(cat.icon as React.ReactElement, { className: 'w-5 h-5 text-ue-blue' })}
                                </div>
                                <h3 className="text-base font-bold font-sans group-hover:text-ue-blue transition-colors">{cat.title}</h3>
                            </div>
                            <p className="text-slate-500 text-[11px] mb-3 font-sans leading-relaxed line-clamp-2">{cat.desc}</p>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-500 dark:text-slate-600 uppercase">{categoryCounts[cat.title] ?? 0} NOTES</span>
                                <span className="text-ue-blue font-bold flex items-center">
                                    BROWSE <ChevronRight className="w-2 h-2 ml-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* List Header with Filter Info */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6" data-aos="fade-up" data-aos-delay="100">
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

            {/* Tags Ribbon */}
            <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.delete('tag');
                            setSearchParams(newParams);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${!activeTag ? 'bg-ue-blue text-white border-ue-blue shadow-lg shadow-ue-blue/20' : 'bg-white/5 border-white/10 text-slate-400 hover:border-ue-blue/30'}`}
                    >
                        ALL TAGS
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeTag === tag ? 'bg-ue-blue text-white border-ue-blue shadow-lg shadow-ue-blue/20' : 'bg-white/5 border-white/10 text-slate-400 hover:border-ue-blue/30'}`}
                        >
                            #{tag.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes Grid */}
            <div className="mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.slice(0, 4).map((note, index) => (
                            <Link key={note.id} to={`/notes/${note.slug}`} data-aos="fade-up" data-aos-delay={index * 100} className="glass rounded-2xl border-white/5 hover:border-ue-blue/30 transition-all group relative overflow-hidden flex flex-col block font-sans min-h-[160px]">
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-text-secondary text-[10px] font-mono opacity-80">{note.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-ue-blue transition-colors line-clamp-1">{note.title}</h3>
                                    <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-2 italic font-sans">
                                        {note.summary}
                                    </p>

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-border-color">
                                        <div className="flex gap-1.5 overflow-hidden">
                                            {note.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[9px] text-text-secondary bg-text-primary/5 px-2 py-0.5 rounded border border-border-color whitespace-nowrap">#{tag}</span>
                                            ))}
                                        </div>
                                        <div className="text-ue-blue text-[10px] font-bold flex items-center gap-1.5 font-sans whitespace-nowrap">
                                            READ MORE
                                            <i className="fas fa-arrow-right text-[9px]"></i>
                                        </div>
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
            <div className="p-12 glass rounded-3xl border-dashed border-white/10 flex flex-col items-center text-center" data-aos="fade-up">
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
