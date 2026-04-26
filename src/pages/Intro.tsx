import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Github, Mail, X } from 'lucide-react';

interface IntroProps {
    lang: 'en' | 'zh';
    t: (key: string) => string;
}

const Intro: React.FC<IntroProps> = ({ lang, t }) => {
    const [modalId, setModalId] = useState<string | null>(null);
    const { hash } = useLocation();

    // Helper to handle asset paths with base URL
    const getAssetPath = (path: string) => {
        if (path.startsWith('http') || path.startsWith('//')) return path;
        const base = import.meta.env.BASE_URL.replace(/\/$/, '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${cleanPath}`;
    };

    useEffect(() => {
        AOS.init({ duration: 800, once: true, easing: 'ease-out-quad' });
        document.title = '蘇品甄 | Annie Su | Unreal Engine Engineer';
    }, []);

    useEffect(() => {
        if (hash) {
            const id = hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    const navHeight = 80; // Approximate navbar height
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - navHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [hash]);

    interface ModalContent {
        year: string;
        title: string;
        tech: string;
        desc: string;
        videoEmbedUrl?: string;
        imageUrl?: string;
        paperUrl?: string;
        paperLabel?: string;
        githubUrl?: string;
    }

    interface ExperienceContent {
        title: string;
        tech: string;
        desc: string;
    }

    const modalData: Record<string, { en: ModalContent | ExperienceContent; zh: ModalContent | ExperienceContent }> = {
        'modal-1': {
            en: { 
                year: '2024-2025', 
                title: '3D AI Avatar System', 
                tech: 'UE5, MetaHuman, ChatGPT API, WebRTC', 
                desc: 'Explored integration of MetaHumans with LLMs. Implemented real-time lip-sync, dynamic behavioral trees, and cloud-based Pixel Streaming delivery.'
            },
            zh: { 
                year: '2024-2025', 
                title: '3D AI 虛擬人互動系統', 
                tech: 'UE5, MetaHuman, ChatGPT API, WebRTC', 
                desc: '本專案旨在探索虛擬製作與 AI 的結合。透過 WebSocket 串接 LLM 模型，實現具備即時口型同步、動態行為決策的 3D 接待員。'
            }
        },
        'modal-2': {
            en: {
                year: '2023-2024',
                title: 'Green-screen-free VP System',
                tech: 'Python, Unity, HTC Vive Tracker, Deep Learning',
                desc: 'Our VP system eliminates the need for a green screen by integrating deep-learning-based and depth-camera-based video matting methods, coupled with a 3D tracker for camera tracking. This allows for real-time previewing of composite footage, reducing green screen setup costs and simplifying the compositing process of virtual and real images.',
                videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/-cOFrrE-9bQ?rel=0&modestbranding=1',
                paperUrl: 'https://www.mdpi.com/2079-9292/13/16/3182',
                paperLabel: 'View Paper',
                githubUrl: 'https://github.com/supinzhen/Non-green-screen-Virtual-Production-System'
            },
            zh: {
                year: '2023-2024',
                title: '非綠幕虛擬影視製作系統',
                tech: 'Python, Unity, HTC Vive Tracker, 深度學習',
                desc: '本專案透過整合深度學習（Deep Learning）與深度相機（Depth Camera）的影像去背技術，結合 3D 追蹤器（HTC Vive Tracker）實現高精準度的相機追蹤。此系統消除了對傳統綠幕的需求，讓開發者能即時預覽虛實合成畫面，大幅降低棚內架設成本並簡化後期合成流程處理。',
                videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/-cOFrrE-9bQ?rel=0&modestbranding=1',
                paperUrl: 'https://www.mdpi.com/2079-9292/13/16/3182',
                paperLabel: '查看論文',
                githubUrl: 'https://github.com/supinzhen/Non-green-screen-Virtual-Production-System'
            }
        },
        'modal-3': {
            en: {
                year: '2026',
                title: 'Unreal Rivermax ST2110 Integration',
                tech: 'ST 2110, NVIDIA Rivermax, NMOS, UE5',
                desc: 'This project demonstrates a real-world system integration workflow between Unreal Engine and professional broadcast IP infrastructure based on SMPTE ST 2110 standards.<br><br>The system utilizes NVIDIA Rivermax SDK with Mellanox ConnectX-6 Lx NIC for high-performance IP video transmission, integrates with AJA Kona IP for SDI/IP interoperability, and employs EVS Cerebrum for centralized device control and routing management. NMOS (IS‑04/IS‑05) is used for device discovery, registration, and automated routing control across the entire IP workflow, enabling Unreal Engine and other ST 2110 nodes to participate in a unified, standards‑based control environment.',
                imageUrl: '/ST2110_Infra.png',
                githubUrl: 'https://github.com/supinzhen/Unreal-Rivermax-ST2110-Integration'
            },
            zh: {
                year: '2026',
                title: 'Unreal Rivermax ST2110 Integration',
                tech: 'ST 2110, NVIDIA Rivermax, NMOS, UE5',
                desc: '本專案展示了 Unreal Engine 與基於 SMPTE ST 2110 標準的專業廣播 IP 基礎設施之間的實際系統整合工作流程。<br>系統利用 NVIDIA Rivermax SDK 搭配 Mellanox ConnectX-6 Lx 網卡進行高效能 IP 影像傳輸，整合 AJA Kona IP 實現 SDI/IP 互通，並使用 EVS Cerebrum 進行集中設備控制與路由管理。透過 NMOS (IS‑04/IS‑05) 實現設備發現、註冊與自動路由控制，讓 Unreal Engine 與其他 ST 2110 節點能共同參與統一的標準化控制環境。',
                imageUrl: '/ST2110_Infra.png',
                githubUrl: 'https://github.com/supinzhen/Unreal-Rivermax-ST2110-Integration'
            }
        },

        'exp-akiyam': {
            en: {
                title: 'Unreal Engine Developer Intern @ Akiyam Solutions',
                tech: 'AI System Design × FPS Gameplay × Cross-border Collaboration',
                desc: '• Designed and implemented AI systems for a First-Person Shooter (FPS), including Behavior Trees, EQS, AI Controllers, and Blackboard data flow integration.<br>• Integrated AI systems with event-driven ability systems for complex character behaviors.<br>• Developed scalable and maintainable AI architectures, completing the full pipeline from perception to execution.<br>• Collaborated with international teams using Git for version control, Code Reviews, and multi-user workflows.'
            },
            zh: {
                title: 'Unreal Engine Developer Intern @ Akiyam Solutions',
                tech: 'AI 系統開發 × Gameplay × 跨國團隊協作',
                desc: '• 負責第一人稱射擊遊戲（FPS）AI 系統設計與實作，涵蓋 Behavior Tree、EQS、AI Controller、Blackboard 資料流設計與事件驅動能力系統整合。<br>• 打造可擴充、可維護的 AI 行為架構，並能獨立完成從 AI 感知、決策到行為執行的完整流程。<br>• 與跨國團隊協作開發，使用 Git 進行版本控制、Code Review 與多人協作流程，確保專案穩定與開發效率。'
            }
        },
        'exp-andas': {
            en: {
                title: 'System Engineer @ NDT (Taiwan) Ltd',
                tech: 'Broadcast Systems × Virtual Production × ST 2110 IP',
                desc: '• Participated in broadcast system integration projects, including SDI and ST 2110 IP video transmission architectures.<br>• Managed PTP clock synchronization, IP Routing, and multi-device integration workflows.<br>• Supported virtual production and Unreal Engine system integration with on-site technical deployment and troubleshooting.'
            },
            zh: {
                title: '系統工程師 @ NDT (Taiwan) Ltd',
                tech: '廣電系統整合 × Virtual Production × 系統架構規劃',
                desc: '• 參與廣電系統整合專案，包含 SDI 與 ST 2110 IP 影音傳輸架構、PTP 時鐘同步、IP Routing 與多設備整合。<br>• 支援虛擬製作與 Unreal Engine 系統整合，提供現場技術部署與故障排除。'
            }
        },
        'exp-n2': {
            en: {
                title: 'UE Engine Engineer @ BEARVFX',
                tech: 'AI Integration × Unreal Engine 3D Systems × Voice Optimization',
                desc: '• Integrated facial recognition, TTS, and LLMs (OpenAI, Bedrock) into 3D avatars.<br>• Developed Animation Blueprints for immersive interactive behaviors.<br>• Enhanced Pixel Streaming with user management and dashboard interfaces.<br>• Solved multi-user voice recognition interference issues.'
            },
            zh: {
                title: 'UE 遊戲引擎工程師 @ 能火動畫股份有限公司',
                tech: 'AI 技術整合 × Unreal Engine 3D 互動系統 × 語音優化',
                desc: '• 參與 3D AI 虛擬人專案，整合人臉辨識、語音生成、LLM 技術。<br>• 設計虛擬人動畫藍圖 (Animation Blueprint)，提升互動沉浸感。<br>• 串接第三方 API (OpenAI, Bedrock 等) 建立可擴充架構。<br>• 擴充 Pixel Streaming 並解決多人連線時語音辨識互相干擾問題。<br>• 成功解決多人連線時語音辨識互相干擾的技術問題，提高系統穩定度。'
            }
        },
        'exp-ndhu': {
            en: {
                title: 'Research Assistant / TA @ National Dong Hwa University',
                tech: 'Unity3D × VR/AR × Python × Computer Vision',
                desc: '• RA (NSC Project): Research on 360-degree pano video tracking and positioning.<br>• RA (MOE Project): VR course design for project-based learning.<br>• TA: VR/AR game development (Unity) and Computer Vision courses (OpenCV).<br>• Handling debugging support and curriculum management.'
            },
            zh: {
                title: '研發助理 / 教學助理 @ 國立東華大學',
                tech: 'Unity3D × VR/AR × Python × OpenCV × 跨領域協作',
                desc: '• 研發助理 (國科會計畫)：360 度全景影片的追蹤、定位與互動研究。<br>• 研發助理 (教育部計畫)：小組學習輔助之虛擬實境課程開發。<br>• 課堂助教：VR 課程、電腦視覺課程 OpenCV 實作指導。<br>• 協助學生程式 Debug、錄製教學影片、成績統整與作業批改。'
            }
        }
    };

    const openModal = (id: string) => {
        console.log("Opening modal:", id, "lang:", lang, "data:", modalData[id]);
        setModalId(id);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalId(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="relative">
            {/* Ambient background decorative glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-ue-blue/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-ue-blue/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 -right-1/4 w-80 h-80 bg-tech-green/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[70%] -left-1/4 w-96 h-96 bg-ue-blue/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-tech-green/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 -left-1/4 w-80 h-80 bg-tech-green/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-ue-blue/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-white/70 backdrop-blur-md dark:bg-transparent dark:backdrop-blur-none min-h-screen relative z-10">
                {/* Hero Section */}
                <section className="min-h-[85vh] flex items-center justify-center pt-32 pb-16 relative" id="hero">

                    <div className="container mx-auto px-6 z-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
                            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                                <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-snug font-sans" data-aos="fade-right">
                                    <span className="block lg:inline">{t('hero-name-zh')}</span>
                                    <span className="text-slate-500 font-light hidden lg:inline mx-2">|</span>
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-ue-blue to-cyan-500 block lg:inline-block mt-4 lg:mt-0 font-sans">
                                        {t('hero-name-en')}
                                    </span>
                                </h1>

                                <p className="max-w-2xl mx-auto lg:mx-0 text-slate-400 text-base md:text-lg mb-10 leading-relaxed font-sans text-center lg:text-left" data-aos="fade-right" data-aos-delay="400">
                                    {t('hero-desc')}
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 font-sans" data-aos="fade-right" data-aos-delay="600">
                                    <Link to="/#projects" className="px-8 py-3 bg-ue-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
                                        {t('btn-projects')}
                                    </Link>
                                    <Link to="/#contact" className="px-8 py-3 bg-ue-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20 text-center">
                                        {t('btn-contact')}
                                    </Link>
                                </div>

                                {/* Live Status Tag */}
                                <div className="mt-8 flex items-start justify-center lg:justify-start gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium" data-aos="fade-right" data-aos-delay="800">
                                    <span className="relative flex h-2 w-2 mt-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-green opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-green"></span>
                                    </span>
                                    <span className="text-center lg:text-left">{t('hero-status')}</span>
                                </div>
                            </div>

                            <div className="flex-1 flex justify-center order-1 lg:order-2" data-aos="zoom-in" data-aos-delay="300">
                                <div className="profile-container animate-float">
                                    <div className="profile-frame-decor"></div>
                                    <div className="profile-frame-decor-2"></div>
                                    <div className="profile-card">
                                        <img src={getAssetPath('/image/Gemini_Generated_Image_uydifmuydifmuydi.png')} alt="Annie Su" />
                                        <div className="profile-overlay"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="pt-[60px] pb-24 relative">
                    <div className="container mx-auto px-6 font-sans">
                        <h2 className="text-3xl font-bold mb-16 text-center" data-aos="fade-up">
                            <span>{t('skills-title')}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
                            <div className="glass p-8 rounded-2xl border-glow-blue transition-all" data-aos="fade-up">
                                <div className="text-ue-blue text-4xl mb-6"><i className="fas fa-cube"></i></div>
                                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">{t('skill-1-title')}</h3>
                                <ul className="space-y-3 text-slate-600 dark:text-slate-400 font-sans text-sm">
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Unreal Engine 5</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> C++ / Blueprints</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Pixel Streaming</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Python Scripting</li>
                                </ul>
                            </div>
                            <div className="glass p-8 rounded-2xl border-glow-green transition-all" data-aos="fade-up" data-aos-delay="200">
                                <div className="text-ue-blue text-4xl mb-6"><i className="fas fa-video"></i></div>
                                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">{t('skill-2-title')}</h3>
                                <ul className="space-y-3 text-slate-600 dark:text-slate-400 font-sans text-sm">
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Zero Density / Reality</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Camera Tracking</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> nDisplay Configuration</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> LiveLink Protocol</li>
                                </ul>
                            </div>
                            <div className="glass p-8 rounded-2xl border-glow-blue transition-all" data-aos="fade-up" data-aos-delay="400">
                                <div className="text-ue-blue text-4xl mb-6"><i className="fas fa-network-wired"></i></div>
                                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">{t('skill-3-title')}</h3>
                                <ul className="space-y-3 text-slate-600 dark:text-slate-400 font-sans text-sm">
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> SMPTE ST 2110 IP</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> PTP Synchronization</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> SDI / NDI Infrastructure</li>
                                    <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Cisco/Arista Switch</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-24 relative font-sans">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left">
                            <div data-aos="fade-right" className="w-full md:w-auto">
                                <h2 className="text-3xl font-bold font-sans">
                                    <span>{t('projects-title')}</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 font-sans">{t('projects-subtitle')}</p>
                            </div>
                            <div className="mt-4 md:mt-0 w-full md:w-auto" data-aos="fade-left">
                                <span className="text-slate-500 font-sans text-sm">{t('projects-gallery')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
                            {/* Project 3 */}
                            <div className="glass rounded-2xl overflow-hidden group cursor-pointer border-glow-blue transition-all font-sans" onClick={() => openModal('modal-3')} data-aos="zoom-in">
                                <div className="h-48 bg-slate-800 relative overflow-hidden">
                                    <img src={getAssetPath('/ST2110_Infra.png')} alt={t('proj-3-title')} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3 font-mono">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[10px] px-2 py-1 bg-ue-blue/10 text-ue-blue border border-ue-blue/20 rounded">UE5</span>
                                            <span className="text-[10px] px-2 py-1 bg-slate-700/10 text-slate-500 dark:text-slate-400 border border-slate-700/20 rounded">ST 2110</span>
                                            <span className="text-[10px] px-2 py-1 bg-tech-green/10 text-tech-green border border-tech-green/20 rounded">Rivermax</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 border border-slate-700 px-2 py-1 rounded-full whitespace-nowrap">2026</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-ue-blue transition-colors font-sans text-slate-900 dark:text-slate-100">{t('proj-3-title')}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 font-sans">{t('proj-3-desc')}</p>
                                    <button className="text-xs font-bold text-ue-blue flex items-center group-hover:translate-x-1 transition-transform font-sans">
                                        <span>{t('btn-details')}</span> <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Project 2 */}
                            <div className="glass rounded-2xl overflow-hidden group cursor-pointer border-glow-green transition-all font-sans" onClick={() => openModal('modal-2')} data-aos="zoom-in" data-aos-delay="200">
                                <div className="h-48 bg-slate-800 relative overflow-hidden">
                                    <img src={getAssetPath('/image/Green-screen-free VP System.gif')} alt={t('proj-2-title')} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3 font-mono">
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="text-[10px] px-2 py-1 bg-tech-green/10 text-tech-green border border-tech-green/20 rounded">Python</span>
                                            <span className="text-[10px] px-2 py-1 bg-white/10 text-slate-800 dark:text-white border border-white/20 rounded">Unity</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 border border-slate-700 px-2 py-1 rounded-full whitespace-nowrap">2023-2024</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-tech-green transition-colors font-sans text-slate-900 dark:text-slate-100">{t('proj-2-title')}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 font-sans">{t('proj-2-desc')}</p>
                                    <button className="text-xs font-bold text-tech-green flex items-center group-hover:translate-x-1 transition-transform font-sans">
                                        <span>{t('btn-details')}</span> <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Project 1 */}
                            <div className="glass rounded-2xl overflow-hidden group cursor-pointer border-glow-blue transition-all" onClick={() => openModal('modal-1')} data-aos="zoom-in" data-aos-delay="400">
                                <div className="h-48 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-ue-blue/20 to-slate-950"></div>
                                    <i className="fas fa-robot text-5xl text-ue-blue/40 group-hover:scale-110 transition-transform"></i>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3 font-mono">
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="text-[10px] px-2 py-1 bg-ue-blue/10 text-ue-blue border border-ue-blue/20 rounded">UE5</span>
                                            <span className="text-[10px] px-2 py-1 bg-tech-green/10 text-tech-green border border-tech-green/20 rounded">AI</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 border border-slate-700 px-2 py-1 rounded-full whitespace-nowrap">2024-2025</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-ue-blue transition-colors font-sans text-slate-900 dark:text-slate-100">{t('proj-1-title')}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 font-sans">{t('proj-1-desc')}</p>
                                    <button className="text-xs font-bold text-ue-blue flex items-center group-hover:translate-x-1 transition-transform font-sans">
                                        <span>{t('btn-details')}</span> <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section id="experience" className="py-24 relative font-sans overflow-hidden">
                    <div className="container mx-auto px-6 relative">
                        <h2 className="text-3xl font-bold mb-16 text-center font-sans tracking-tight" data-aos="fade-up">
                            <span>{t('exp-title')}</span>
                        </h2>

                        <div className="max-w-4xl mx-auto relative px-4 sm:px-8">
                            {/* Vertical Timeline Line (Left aligned) */}
                            <div className="absolute left-0 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-ue-blue via-tech-green to-transparent opacity-30"></div>

                            <div className="space-y-12">
                                {/* Exp 1: Akiyam */}
                                <div className="relative pl-8 sm:pl-12 group" data-aos="fade-up">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-[-4px] sm:left-[12px] top-2 w-2 h-2 rounded-full bg-ue-blue shadow-[0_0_10px_rgba(0,112,243,0.8)] group-hover:scale-150 transition-transform duration-300 z-10"></div>
                                    
                                    <div className="glass p-5 rounded-xl border-white/5 hover:border-ue-blue/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-ue-blue/10" onClick={() => openModal('exp-akiyam')}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-ue-blue transition-colors">{t('exp-1-title')}</h3>
                                            <span className="text-ue-blue font-mono text-[11px] font-bold bg-ue-blue/5 px-2 py-1 rounded border border-ue-blue/20 whitespace-nowrap">{t('exp-1-date')}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#AI</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#Gameplay</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#Git</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{t('exp-1-short')}</p>
                                        <div className="mt-3 flex items-center text-[10px] font-bold text-ue-blue/60 group-hover:text-ue-blue transition-colors uppercase tracking-wider">
                                            <span>{t('view-details')}</span>
                                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Exp 2: Andas */}
                                <div className="relative pl-8 sm:pl-12 group" data-aos="fade-up" data-aos-delay="100">
                                    <div className="absolute left-[-4px] sm:left-[12px] top-2 w-2 h-2 rounded-full bg-tech-green shadow-[0_0_10px_rgba(0,255,171,0.8)] group-hover:scale-150 transition-transform duration-300 z-10"></div>
                                    
                                    <div className="glass p-5 rounded-xl border-white/5 hover:border-tech-green/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-tech-green/10" onClick={() => openModal('exp-andas')}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-tech-green transition-colors">{t('exp-2-title')}</h3>
                                            <span className="text-tech-green font-mono text-[11px] font-bold bg-tech-green/5 px-2 py-1 rounded border border-tech-green/20 whitespace-nowrap">{t('exp-2-date')}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#ST2110</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#VP</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#Systems</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{t('exp-2-short')}</p>
                                        <div className="mt-3 flex items-center text-[10px] font-bold text-tech-green/60 group-hover:text-tech-green transition-colors uppercase tracking-wider">
                                            <span>{t('view-details')}</span>
                                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Exp 3: BEARVFX */}
                                <div className="relative pl-8 sm:pl-12 group" data-aos="fade-up" data-aos-delay="200">
                                    <div className="absolute left-[-4px] sm:left-[12px] top-2 w-2 h-2 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.8)] group-hover:scale-150 transition-transform duration-300 z-10"></div>
                                    
                                    <div className="glass p-5 rounded-xl border-white/5 hover:border-slate-500/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-white/5" onClick={() => openModal('exp-n2')}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-500 transition-colors">{t('exp-3-title')}</h3>
                                            <span className="text-slate-500 font-mono text-[11px] font-bold bg-slate-500/5 px-2 py-1 rounded border border-slate-500/20 whitespace-nowrap">{t('exp-3-date')}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#AI</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#UE5</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#API</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{t('exp-3-short')}</p>
                                        <div className="mt-3 flex items-center text-[10px] font-bold text-slate-500/60 group-hover:text-slate-500 transition-colors uppercase tracking-wider">
                                            <span>{t('view-details')}</span>
                                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Exp 4: NDHU */}
                                <div className="relative pl-8 sm:pl-12 group" data-aos="fade-up" data-aos-delay="300">
                                    <div className="absolute left-[-4px] sm:left-[12px] top-2 w-2 h-2 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.8)] group-hover:scale-150 transition-transform duration-300 z-10"></div>
                                    
                                    <div className="glass p-5 rounded-xl border-white/5 hover:border-slate-500/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-white/5" onClick={() => openModal('exp-ndhu')}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-500 transition-colors">{t('exp-4-title')}</h3>
                                            <span className="text-slate-500 font-mono text-[11px] font-bold bg-slate-500/5 px-2 py-1 rounded border border-slate-500/20 whitespace-nowrap">{t('exp-4-date')}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#VR/AR</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#Unity</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-white/5">#CV</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{t('exp-4-short')}</p>
                                        <div className="mt-3 flex items-center text-[10px] font-bold text-slate-500/60 group-hover:text-slate-500 transition-colors uppercase tracking-wider">
                                            <span>{t('view-details')}</span>
                                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events & Specialized Training Section */}
                <section id="events" className="py-24 relative font-sans">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left">
                            <div data-aos="fade-right" className="w-full md:w-auto">
                                <h2 className="text-3xl font-bold font-sans">
                                    <span>{t('events-title')}</span>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 font-sans">{t('events-subtitle')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 font-sans">
                            {/* Event 1 */}
                            <div className="glass p-6 rounded-xl border-glow-blue transition-all group max-w-2xl" data-aos="fade-up">
                                <div className="flex items-start gap-4">
                                    <div className="text-ue-blue text-2xl mt-1">
                                        <i className="fas fa-graduation-cap"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100 group-hover:text-ue-blue transition-colors">
                                            {t('event-1-title')}
                                        </h3>
                                        <div className="space-y-2 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                                            <p className="flex items-center">
                                                <span className="w-1 h-1 rounded-full bg-ue-blue mr-2 flex-shrink-0"></span>
                                                {t('event-1-focus')}
                                            </p>
                                            <p className="flex items-start">
                                                <span className="w-1 h-1 rounded-full bg-ue-blue mr-2 mt-1.5 flex-shrink-0"></span>
                                                {t('event-1-tech')}
                                            </p>
                                            <p className="flex items-start">
                                                <span className="w-1 h-1 rounded-full bg-ue-blue mr-2 mt-1.5 flex-shrink-0"></span>
                                                <span>
                                                    {lang === 'zh' ? '結業作品：' : 'Graduation Project: '}
                                                    <a 
                                                        href="https://youtu.be/nq8VTm7LuVs" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-ue-blue hover:underline break-all"
                                                    >
                                                        https://youtu.be/nq8VTm7LuVs
                                                    </a>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Connect */}
                <section id="contact" className="py-24 font-sans">
                    <div className="container mx-auto px-6 text-center md:text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-sans">
                            <div data-aos="fade-right">
                                <h2 className="text-3xl font-bold mb-8 font-sans">{t('edu-title')}</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-stretch">
                                        <div className="w-1 self-stretch bg-ue-blue rounded-full flex-shrink-0"></div>
                                        <div className="text-left font-sans">
                                            <h4 className="font-bold font-sans text-slate-900 dark:text-slate-100">{t('edu-1-uni')}</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm font-sans">{t('edu-1-deg')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-stretch">
                                        <div className="w-1 self-stretch bg-tech-green rounded-full flex-shrink-0"></div>
                                        <div className="text-left font-sans">
                                            <h4 className="font-bold font-sans text-slate-900 dark:text-slate-100">{t('edu-2-uni')}</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm font-sans">{t('edu-2-deg')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div data-aos="fade-left">
                                <h2 className="text-3xl font-bold mb-8 font-sans">{t('connect-title')}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 font-sans">{t('connect-desc')}</p>
                                <div className="flex justify-center md:justify-start items-center space-x-6 text-3xl">
                                    <a href="https://github.com/supinzhen" target="_blank" className="text-slate-500 hover:text-ue-blue transition-all"><Github /></a>
                                    <a href="https://www.linkedin.com/in/%E5%93%81%E7%94%84-%E8%98%87-b905491b8/" target="_blank" className="text-slate-500 hover:text-ue-blue transition-all"><i className="fab fa-linkedin"></i></a>
                                    <a href="mailto:anniesuworkshop@gmail.com" className="text-slate-500 hover:text-tech-green transition-all"><Mail /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Render Modal into Body using createPortal to escape parent stacking contexts */}
            {modalId && modalData[modalId] && modalData[modalId][lang] && createPortal(
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md" onClick={closeModal}></div>
                    <div className="bg-white dark:bg-slate-900 max-w-3xl w-full px-8 pb-8 pt-4 md:px-12 md:pb-12 md:pt-6 rounded-3xl relative z-10 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col font-sans border border-slate-200 dark:border-white/10 shadow-2xl">
                        {(() => {
                            const data = modalData[modalId][lang] as ModalContent & ExperienceContent;

                            return (
                                <div className="w-full">
                                    <button
                                        onClick={closeModal}
                                        className="sticky top-0 float-right text-slate-400 dark:text-slate-500 hover:text-ue-blue z-20 p-2"
                                    >
                                        <X className="w-8 h-8" />
                                    </button>

                                    <div className="clear-both">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-3xl font-bold text-ue-blue mb-2 font-sans">
                                                    {data.title}
                                                </h3>
                                                <p className="text-tech-green font-sans text-sm tracking-wide uppercase font-bold mb-4">
                                                    {data.tech}
                                                </p>
                                                {(data.paperUrl || data.githubUrl) && (
                                                    <div className="flex flex-wrap gap-4 mb-4">
                                                        {data.paperUrl && (
                                                            <a href={data.paperUrl} target="_blank" className="px-6 py-2 bg-tech-green/10 dark:bg-tech-green/20 hover:bg-tech-green/20 dark:hover:bg-tech-green/40 text-tech-green border border-tech-green/30 rounded-lg transition-all text-sm font-bold font-sans flex items-center">
                                                                <i className="fas fa-file-lines mr-2"></i> {data.paperLabel || t('view-paper') || '查看論文'}
                                                            </a>
                                                        )}
                                                        {data.githubUrl && (
                                                            <a href={data.githubUrl} target="_blank" className="px-6 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 rounded-lg transition-all text-sm font-bold font-sans flex items-center text-slate-700 dark:text-white">
                                                                <i className="fab fa-github mr-2"></i> GitHub
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="h-1 w-24 bg-gradient-to-r from-ue-blue to-tech-green mb-4"></div>

                                            {/* Media Support */}
                                            {(data.videoEmbedUrl || data.imageUrl) && (
                                                <div className="space-y-6">
                                                    {data.videoEmbedUrl && (
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-black mb-6">
                                                            <iframe className="w-full h-full" src={data.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                                        </div>
                                                    )}
                                                    {data.imageUrl && (
                                                        <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg mb-6 bg-slate-900/50">
                                                            <img src={getAssetPath(data.imageUrl || '')} alt={data.title} className="w-full h-auto block" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg space-y-4 font-sans">
                                                <div
                                                    className="font-sans"
                                                    dangerouslySetInnerHTML={{
                                                        __html: data.desc.includes('<br>')
                                                            ? data.desc
                                                            : data.desc.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')
                                                    }}
                                                >
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={closeModal}
                                                    className="px-6 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl transition-all text-sm font-bold font-sans border border-slate-200 dark:border-white/10 shadow-sm"
                                                >
                                                    Close Window
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>, document.body
            )}
        </div>
    );
};

export default Intro;
