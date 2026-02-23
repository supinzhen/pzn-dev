import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Tag, ChevronRight, Filter } from 'lucide-react';
import { noteService, Note } from '../utils/noteService';

interface AllNotesProps {
    lang: 'en' | 'zh';
    t: (key: string) => string;
}

const AllNotes: React.FC<AllNotesProps> = ({ lang, t }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const notes = useMemo(() => noteService.getNotes(), []);

    const categories = useMemo(() => {
        const cats = new Set(notes.map(n => n.category));
        return ['All', ...Array.from(cats)];
    }, [notes]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const title = lang === 'zh' ? note.title_zh : note.title_en;
            const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [notes, searchTerm, selectedCategory, lang]);

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen font-sans">
            {/* Header */}
            <div className="mb-12">
                <button
                    onClick={() => navigate('/notes')}
                    className="flex items-center gap-2 text-slate-500 hover:text-ue-blue transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-wider font-mono">BACK TO NOTES</span>
                </button>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-ue-blue">All</span> Technical Articles
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                    {lang === 'zh' ? '完整的技術筆記檔案庫，涵蓋 Unreal Engine、虛擬製作與廣播系統。' : 'Complete technical archives covering Unreal Engine, Virtual Production, and Broadcast systems.'}
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder={lang === 'zh' ? '搜尋文章或標籤...' : 'Search articles or tags...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-ue-blue/50 transition-all font-sans"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-xl border text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-ue-blue text-white border-ue-blue shadow-lg shadow-ue-blue/20' : 'border-white/10 text-slate-500 hover:border-ue-blue/30'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table-like List */}
            <div className="glass rounded-3xl border border-white/10 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-black/10 dark:bg-white/5 border-b border-white/10 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <div className="col-span-1">Date</div>
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Tags</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="divide-y divide-white/5 font-sans">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <Link
                                key={note.id}
                                to={`/notes/${note.id}`}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-6 hover:bg-ue-blue/5 transition-all group items-center"
                            >
                                <div className="col-span-1 text-xs font-mono text-slate-500">
                                    {note.date.split('-').slice(1).join('/')}
                                    <span className="md:hidden ml-2 text-slate-400">/ {note.date.split('-')[0]}</span>
                                    <div className="hidden md:block text-[10px] opacity-40">{note.date.split('-')[0]}</div>
                                </div>
                                <div className="col-span-6">
                                    <h3 className="font-bold group-hover:text-ue-blue transition-colors text-lg md:text-base">
                                        {lang === 'zh' ? note.title_zh : note.title_en}
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1 md:hidden line-clamp-2">
                                        {lang === 'zh' ? note.summary_zh : note.summary_en}
                                    </p>
                                </div>
                                <div className="col-span-2 text-xs">
                                    <span className="px-2 py-0.5 bg-ue-blue/10 text-ue-blue rounded border border-ue-blue/20 uppercase font-mono text-[10px]">
                                        {note.category}
                                    </span>
                                </div>
                                <div className="col-span-2 flex flex-wrap gap-1">
                                    {note.tags.map(tag => (
                                        <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-900/50 px-2 py-0.5 rounded border border-white/5">#{tag}</span>
                                    ))}
                                </div>
                                <div className="col-span-1 text-right hidden md:block">
                                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-ue-blue group-hover:translate-x-1 transition-all ml-auto" />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="py-32 text-center text-slate-500 italic">
                            No articles match your search criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-slate-500 tracking-tighter uppercase">
                <div>Total: {filteredNotes.length} articles</div>
                <div className="flex gap-4">
                    <span>Archive: 2024-2025</span>
                    <span className="text-ue-blue underline cursor-help">RSS Feed coming soon</span>
                </div>
            </div>
        </div>
    );
};

export default AllNotes;
