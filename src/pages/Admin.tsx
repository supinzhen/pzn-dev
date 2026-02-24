import React, { useState, useMemo } from 'react';
import { Plus, Save, Trash2, Edit2, Lock, ArrowLeft, LogOut, Download, Copy, Check, Code as CodeIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { noteService, Note } from '../utils/noteService';
import { renderMarkdown } from '../utils/markdown';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('admin_auth') === 'true');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const [notes, setNotes] = useState<Note[]>(noteService.getNotes());
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [showExport, setShowExport] = useState(false);
    const [copied, setCopied] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const [currentNote, setCurrentNote] = useState<Partial<Note>>({
        title_zh: '',
        title_en: '',
        category: 'Unreal Engine',
        date: new Date().toISOString().split('T')[0],
        author: 'Annie Su',
        readTime: '5 min read',
        tags: [],
        summary: '',
        content: ''
    });

    const categories = ['Unreal Engine', 'Virtual Production', 'Broadcast IP', 'Others'];
    const allExistingTags = useMemo(() => {
        const tags = new Set<string>();
        notes.forEach(note => note.tags?.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [notes]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPassword = (import.meta as unknown as { env: Record<string, string> }).env.VITE_ADMIN_PASSWORD || 'admin123';
        if (password === adminPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_auth', 'true');
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-6 py-24 min-h-screen flex items-center justify-center font-sans">
                <div className="glass p-12 rounded-3xl border-white/10 w-full max-w-md text-center animate-scale-up">
                    <div className="w-16 h-16 bg-ue-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <Lock className="text-ue-blue w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
                    <p className="text-slate-500 text-sm mb-8">Enter management password to proceed</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className={`w-full bg-slate-100 dark:bg-slate-900 border ${loginError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50 transition-all`}
                        />
                        {loginError && <p className="text-red-500 text-xs text-left">Invalid password. Please try again.</p>}
                        <button
                            type="submit"
                            className="w-full py-3 bg-ue-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-ue-blue/20"
                        >
                            AUTHENTICATE
                        </button>
                    </form>
                    <button onClick={() => navigate('/')} className="mt-8 text-xs text-slate-500 hover:text-ue-blue transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                        <ArrowLeft className="w-3 h-3" /> Back to Home
                    </button>
                </div>
            </div>
        );
    }



    const handleSaveLocal = () => {
        if (!currentNote.title_en?.trim()) {
            alert('English Title is required for URL generation!');
            return;
        }

        let updatedNote: Note;
        if (isEditing !== null) {
            updatedNote = { ...currentNote, id: isEditing } as Note;
        } else {
            const newId = Math.max(0, ...notes.map(n => n.id)) + 1;
            updatedNote = { ...currentNote, id: newId } as Note;
        }

        noteService.saveNote(updatedNote);
        setNotes(noteService.getNotes());
        setIsEditing(null);
        resetForm();
    };

    const resetForm = () => {
        setCurrentNote({
            title_zh: '',
            title_en: '',
            category: 'Unreal Engine',
            date: new Date().toISOString().split('T')[0],
            author: 'Annie Su',
            readTime: '5 min read',
            tags: [],
            summary: '',
            content: ''
        });
    };

    const handleEdit = (note: Note) => {
        setIsEditing(note.id);
        setCurrentNote(note);
        window.scrollTo(0, 0);
    };

    const handleExport = () => {
        const json = JSON.stringify(notes, null, 4);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('確定要刪除這篇文章嗎？')) {
            noteService.deleteNote(id);
            setNotes(noteService.getNotes());
        }
    };

    const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();

        const tag = tagInput.trim();
        if (tag && !currentNote.tags?.includes(tag)) {
            setCurrentNote({
                ...currentNote,
                tags: [...(currentNote.tags || []), tag]
            });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setCurrentNote({
            ...currentNote,
            tags: currentNote.tags?.filter(t => t !== tagToRemove) || []
        });
    };

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen font-sans relative">
            {/* Export Modal */}
            {showExport && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExport(false)}></div>
                    <div className="glass p-8 rounded-3xl border-white/10 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col relative z-10 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <CodeIcon className="w-5 h-5 text-ue-blue" />
                                導出專案資料 (JSON)
                            </h2>
                            <button onClick={() => setShowExport(false)} className="text-slate-500 hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 mb-6 overflow-y-auto flex-grow">
                            <p className="text-xs text-slate-400 mb-4 font-mono uppercase tracking-widest">
                                Copy this to src/assets/data/notes.json to make your changes permanent
                            </p>
                            <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {JSON.stringify(notes, null, 4)}
                            </pre>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowExport(false)}
                                className="px-6 py-3 text-slate-500 font-bold hover:text-white transition-colors"
                            >
                                CLOSE
                            </button>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-8 py-3 bg-ue-blue text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-ue-blue/20"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-center mb-12">
                <div>
                    <button onClick={() => navigate('/notes')} className="flex items-center gap-2 text-slate-600 dark:text-slate-500 hover:text-ue-blue transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Notes
                    </button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="w-2 h-8 bg-ue-blue rounded-full"></span>
                        Admin Dashboard
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowExport(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-bold hover:bg-ue-blue/10 hover:text-ue-blue transition-all"
                    >
                        <Download className="w-4 h-4" />
                        EXPORT JSON
                    </button>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('admin_auth');
                            setIsAuthenticated(false);
                            navigate('/');
                        }}
                        className="flex items-center gap-2 px-6 py-3 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        LOGOUT
                    </button>
                </div>
            </header>



            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Editor Panel */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border-white/10">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            {isEditing ? <Edit2 className="w-5 h-5 text-ue-blue" /> : <Plus className="w-5 h-5 text-cyan-500" />}
                            {isEditing ? 'Edit Article' : 'New Article'}
                        </h2>

                        {/* Markdown Help */}
                        <div className="mb-8 p-4 bg-ue-blue/5 border border-ue-blue/10 rounded-2xl">
                            <h4 className="text-xs font-bold text-ue-blue mb-2 flex items-center gap-2">
                                <CodeIcon className="w-3 h-3" />
                                MARKDOWN GUIDE
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                                <div><span className="text-ue-blue font-bold">#</span> Heading 1</div>
                                <div><span className="text-ue-blue font-bold">**</span>Bold<span className="text-ue-blue font-bold">**</span></div>
                                <div><span className="text-ue-blue font-bold">![</span>Alt<span className="text-ue-blue font-bold">](</span>url<span className="text-ue-blue font-bold">)</span> Image</div>
                                <div><span className="text-ue-blue font-bold">[</span>Text<span className="text-ue-blue font-bold">](</span>url<span className="text-ue-blue font-bold">)</span> Link</div>
                            </div>
                            <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 italic">
                                * Tip: Place images in <code className="bg-ue-blue/10 px-1 rounded text-ue-blue">public/image/</code> and use path <code className="bg-ue-blue/10 px-1 rounded text-ue-blue">/image/filename.jpg</code>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Title (ZH)</label>
                                    <input
                                        type="text"
                                        value={currentNote.title_zh}
                                        onChange={(e) => setCurrentNote({ ...currentNote, title_zh: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Title (EN) <span className="text-ue-blue">* Required for URL</span></label>
                                    <input
                                        type="text"
                                        placeholder="Enter English title..."
                                        value={currentNote.title_en}
                                        onChange={(e) => setCurrentNote({ ...currentNote, title_en: e.target.value })}
                                        className={`w-full bg-slate-100 dark:bg-slate-900 border ${!currentNote.title_en ? 'border-ue-blue/30' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50`}
                                    />
                                </div>
                            </div>

                            {/* Slug Preview */}
                            <div className="bg-slate-100 dark:bg-slate-900 shadow-inner rounded-xl px-4 py-3 border border-ue-blue/10">
                                <label className="block text-[10px] font-mono text-slate-500 mb-1 uppercase">Generated URL Slug (From English Title)</label>
                                <div className="text-sm font-mono text-ue-blue break-all">
                                    {(currentNote.title_en || '').toLowerCase()
                                        .replace(/[^\w\s-]/g, '')
                                        .replace(/\s+/g, '-')
                                        .replace(/-+/g, '-')
                                        .trim() || 'waiting for english title...'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Category</label>
                                    <select
                                        value={currentNote.category}
                                        onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Date</label>
                                    <input
                                        type="date"
                                        value={currentNote.date}
                                        onChange={(e) => setCurrentNote({ ...currentNote, date: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Read Time</label>
                                    <input
                                        type="text"
                                        value={currentNote.readTime}
                                        onChange={(e) => setCurrentNote({ ...currentNote, readTime: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {currentNote.tags?.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-ue-blue/10 text-ue-blue border border-ue-blue/20 rounded-full text-xs font-sans">
                                            #{tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2 relative">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Add a tag..."
                                        className="flex-grow bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50"
                                    />
                                    {tagInput && allExistingTags.filter(t => t.toLowerCase().startsWith(tagInput.toLowerCase()) && !currentNote.tags?.includes(t)).length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                            {allExistingTags
                                                .filter(t => t.toLowerCase().startsWith(tagInput.toLowerCase()) && !currentNote.tags?.includes(t))
                                                .slice(0, 5)
                                                .map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => {
                                                            setCurrentNote({ ...currentNote, tags: [...(currentNote.tags || []), tag] });
                                                            setTagInput('');
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-ue-blue hover:text-white transition-colors border-b border-white/5 last:border-0"
                                                    >
                                                        #{tag}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={handleAddTag}
                                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 border border-white/10 rounded-xl font-bold hover:bg-ue-blue hover:text-white transition-all text-xs"
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Summary</label>
                                <textarea
                                    value={currentNote.summary}
                                    onChange={(e) => setCurrentNote({ ...currentNote, summary: e.target.value })}
                                    rows={2}
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Content</label>
                                <textarea
                                    value={currentNote.content}
                                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                    rows={16}
                                    placeholder="Article content (Markdown supported)..."
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-sm focus:ring-2 focus:ring-ue-blue/50"
                                />
                            </div>

                            <div className="p-6 bg-slate-100 dark:bg-slate-900/50 border border-white/10 rounded-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        <CodeIcon className="w-4 h-4 text-ue-blue" />
                                        PREVIEW
                                    </h3>
                                    <button
                                        onClick={() => setPreviewMode(!previewMode)}
                                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${previewMode ? 'bg-ue-blue text-white' : 'bg-slate-100 dark:bg-slate-800 border border-white/10 text-slate-500'}`}
                                    >
                                        {previewMode ? 'HIDE PREVIEW' : 'SHOW PREVIEW'}
                                    </button>
                                </div>
                                {previewMode && (
                                    <article className="prose-markdown max-h-[400px] overflow-y-auto">
                                        <div dangerouslySetInnerHTML={renderMarkdown(currentNote.content || '')} />
                                    </article>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                                <button onClick={() => { setIsEditing(null); resetForm(); }} className="px-6 py-3 text-slate-500 font-bold">CANCEL</button>
                                <button
                                    onClick={handleSaveLocal}
                                    className="flex items-center gap-2 px-8 py-3 bg-ue-blue text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-ue-blue/20"
                                >
                                    <Save className="w-4 h-4" />
                                    {isEditing ? 'UPDATE LIST' : 'ADD TO LIST'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Panel */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center justify-between">
                        Article List
                        <span className="text-xs bg-ue-blue/10 text-ue-blue px-2 py-1 rounded">{notes.length} Total</span>
                    </h2>

                    <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2">
                        {notes.slice().reverse().map(note => (
                            <div key={note.id} className="glass p-5 rounded-2xl border-white/5 group hover:border-ue-blue/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">{note.category}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(note)} className="p-1.5 hover:text-ue-blue"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelete(note.id)} className="p-1.5 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold mb-1 truncate">{note.title_zh || note.title}</h3>
                                <p className="text-[10px] text-ue-blue font-mono mb-1 truncate">/{note.slug}</p>
                                <p className="text-[11px] text-slate-500 font-mono">{note.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
