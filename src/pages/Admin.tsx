import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit2, Lock, Settings, ArrowLeft, Loader2, LogOut, Download, Copy, Check, Code as CodeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { noteService, Note } from '../utils/noteService';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('admin_auth') === 'true');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const [notes, setNotes] = useState<Note[]>(noteService.getNotes());
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [showExport, setShowExport] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'admin123';
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

    const [currentNote, setCurrentNote] = useState<Partial<Note>>({
        title_zh: '',
        title_en: '',
        category: 'Unreal Engine',
        date: new Date().toISOString().split('T')[0],
        author: 'Annie Su',
        readTime: '5 min read',
        tags: [],
        summary_zh: '',
        summary_en: '',
        content_zh: '',
        content_en: ''
    });

    const categories = ['Unreal Engine', 'Virtual Production', 'Broadcast IP', 'Web & AI'];

    const handleSaveLocal = () => {
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
            summary_zh: '',
            summary_en: '',
            content_zh: '',
            content_en: ''
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
                    <button onClick={() => navigate('/notes')} className="flex items-center gap-2 text-slate-500 hover:text-ue-blue transition-colors mb-4">
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
                                    <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Title (EN)</label>
                                    <input
                                        type="text"
                                        value={currentNote.title_en}
                                        onChange={(e) => setCurrentNote({ ...currentNote, title_en: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50"
                                    />
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
                                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Summary (ZH)</label>
                                <textarea
                                    value={currentNote.summary_zh}
                                    onChange={(e) => setCurrentNote({ ...currentNote, summary_zh: e.target.value })}
                                    rows={2}
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ue-blue/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Content (ZH - HTML Supported)</label>
                                <textarea
                                    value={currentNote.content_zh}
                                    onChange={(e) => setCurrentNote({ ...currentNote, content_zh: e.target.value })}
                                    rows={8}
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-sm focus:ring-2 focus:ring-ue-blue/50"
                                />
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
                                <h3 className="text-sm font-bold mb-1 truncate">{note.title_zh}</h3>
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
