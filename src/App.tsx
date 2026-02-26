import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X as XIcon } from 'lucide-react';
import Intro from './pages/Intro';
import Notes from './pages/Notes';
import AllNotes from './pages/AllNotes';
import NoteDetail from './pages/NoteDetail';
import Admin from './pages/Admin';
import { translations } from './assets/translations/data';

const App: React.FC = () => {
    const [lang, setLang] = useState<'en' | 'zh'>('zh');
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('light-mode');
        } else {
            root.classList.remove('light-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const t = (key: string): string => {
        const val = translations[lang][key as keyof typeof translations['en']] || key;
        return Array.isArray(val) ? val[0] : val;
    };

    return (
        <Router>
            <Layout lang={lang} setLang={setLang} t={t} theme={theme} toggleTheme={toggleTheme}>
                <Routes>
                    <Route path="/" element={<Intro lang={lang} t={t} />} />
                    <Route path="/notes" element={<Notes lang={lang} t={t} />} />
                    <Route path="/notes/all" element={<AllNotes lang={lang} />} />
                    <Route path="/notes/:slug" element={<NoteDetail lang={lang} />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Layout>
        </Router>
    );
};

interface LayoutProps {
    children: React.ReactNode;
    lang: 'en' | 'zh';
    setLang: (lang: 'en' | 'zh') => void;
    t: (key: string) => string;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, lang, setLang, t, theme, toggleTheme }) => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close menu on route change
    useEffect(() => { setMobileOpen(false); }, [location]);

    const dropLinkCls = `block px-4 py-3 text-sm hover:text-ue-blue hover:bg-white/5 transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`;

    return (
        <div className={`selection:bg-ue-blue/30 font-sans min-h-screen text-slate-100 overflow-x-hidden ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-[100] glass border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/#hero" className="text-xl font-bold tracking-tighter font-mono cursor-pointer">
                        <span className="text-ue-blue">SU</span>{' '}
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>P.C.</span>
                    </Link>

                    {/* ── Desktop nav ── */}
                    <div className="hidden lg:flex space-x-8 text-sm font-medium items-center font-sans">
                        <div className="relative group px-2">
                            <Link
                                to="/#hero"
                                className={`hover:text-ue-blue transition-colors flex items-center gap-2 py-1 px-4 ${location.pathname === '/' ? 'text-ue-blue' : (theme === 'dark' ? '' : 'text-slate-700')}`}
                            >
                                {t('nav-about')}
                                <i className="fas fa-chevron-down text-[10px] group-hover:rotate-180 transition-transform"></i>
                            </Link>

                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[140px] w-full invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top -translate-y-1 group-hover:translate-y-0 z-[110]">
                                <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-xl text-center bg-white/5 backdrop-blur-md">
                                    <div className="py-1">
                                        <Link to="/#skills" className={dropLinkCls}>{t('nav-skills')}</Link>
                                        <Link to="/#experience" className={dropLinkCls}>{t('nav-exp')}</Link>
                                        <Link to="/#projects" className={dropLinkCls}>{t('nav-projects')}</Link>
                                        <Link to="/#contact" className={dropLinkCls}>{t('nav-contact')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/notes"
                            className={`hover:text-ue-blue transition-colors ${location.pathname.startsWith('/notes') ? 'text-ue-blue' : (theme === 'dark' ? '' : 'text-slate-700')}`}
                        >
                            {t('nav-notes')}
                        </Link>

                        <div className={`flex items-center space-x-1 ml-4 p-1 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                            <button
                                onClick={() => setLang('en')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-ue-blue text-white' : 'text-slate-400 hover:text-white'}`}
                            >EN</button>
                            <button
                                onClick={() => setLang('zh')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${lang === 'zh' ? 'bg-ue-blue text-white' : 'text-slate-400 hover:text-white'}`}
                            >中文</button>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className={`ml-4 p-2 rounded-lg transition-all border group ${theme === 'dark' ? 'bg-slate-900/50 hover:bg-slate-800 border-white/5' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark'
                                ? <Sun className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                                : <Moon className="w-4 h-4 text-ue-blue   group-hover:scale-110 transition-transform" />}
                        </button>
                    </div>

                    {/* ── Mobile: theme + lang + hamburger ── */}
                    <div className="lg:hidden flex items-center gap-3">
                        <button onClick={toggleTheme} className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-ue-blue" />}
                        </button>
                        <div className={`flex items-center space-x-1 p-1 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                            <button
                                onClick={() => setLang('en')}
                                className={`px-2 py-1 rounded text-[10px] font-bold ${lang === 'en' ? 'bg-ue-blue text-white' : 'text-slate-400'}`}
                            >EN</button>
                            <button
                                onClick={() => setLang('zh')}
                                className={`px-2 py-1 rounded text-[10px] font-bold ${lang === 'zh' ? 'bg-ue-blue text-white' : 'text-slate-400'}`}
                            >中文</button>
                        </div>
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile dropdown ── */}
                {mobileOpen && (
                    <div className={`lg:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-1 ${theme === 'dark' ? 'bg-slate-950/95' : 'bg-slate-50/95'} backdrop-blur-md`}>
                        <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {t('nav-about')}
                        </p>
                        <Link to="/#hero" onClick={() => setMobileOpen(false)} className={dropLinkCls}>{t('nav-about')}</Link>
                        <Link to="/#skills" onClick={() => setMobileOpen(false)} className={dropLinkCls}>{t('nav-skills')}</Link>
                        <Link to="/#experience" onClick={() => setMobileOpen(false)} className={dropLinkCls}>{t('nav-exp')}</Link>
                        <Link to="/#projects" onClick={() => setMobileOpen(false)} className={dropLinkCls}>{t('nav-projects')}</Link>
                        <Link to="/#contact" onClick={() => setMobileOpen(false)} className={dropLinkCls}>{t('nav-contact')}</Link>
                        <div className="border-t border-white/5 mt-2 pt-2">
                            <Link to="/notes" onClick={() => setMobileOpen(false)} className={dropLinkCls}>
                                {t('nav-notes')}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {children}
            </main>

            <footer className={`py-12 border-t border-white/5 text-center text-xs ${theme === 'dark' ? 'bg-slate-950 text-slate-600' : 'bg-slate-50 text-slate-400'}`}>
                <div className="container mx-auto px-6 font-mono tracking-widest flex flex-col items-center gap-4">
                    <div>
                        &copy; 2025 SU PIN-CHEN. CRAFTED WITH <span className="text-ue-blue">CODE</span> AND <span className="text-ue-blue">UE5</span>.
                    </div>
                    {/* Hidden Admin Access */}
                </div>
            </footer>
        </div>
    );
};

export default App;
