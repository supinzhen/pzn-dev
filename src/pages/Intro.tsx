import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

    useEffect(() => {
        AOS.init({ duration: 800, once: true, easing: 'ease-out-quad' });
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
            en: { year: '2024-2025', title: '3D AI Avatar System', tech: 'UE5, MetaHuman, ChatGPT API, WebRTC', desc: 'Explored integration of MetaHumans with LLMs. Implemented real-time lip-sync, dynamic behavioral trees, and cloud-based Pixel Streaming delivery.' },
            zh: { year: '2024-2025', title: '3D AI 虛擬人互動系統', tech: 'UE5, MetaHuman, ChatGPT API, WebRTC', desc: '本專案旨在探索虛擬製作與 AI 的結合。透過 WebSocket 串接 LLM 模型，實現具備即時口型同步、動態行為決策的 3D 接待員。' }
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
                desc: '本專案透過整合深度學習（Deep Learning）與深度相機（Depth Camera）的影像去背技術，結合 3D 追蹤器（HTC Vive Tracker）實現高精準度的相機追蹤。此系統消除了對傳統綠幕的需求，讓開發者能即時預覽虛實合成畫面，大幅降低棚內架設成本並簡化後期合成流程。',
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
                imageUrl: './ST2110_Infra.png',
                githubUrl: 'https://github.com/supinzhen/Unreal-Rivermax-ST2110-Integration'
            },
            zh: {
                year: '2026',
                title: 'Unreal Rivermax ST2110 Integration',
                tech: 'ST 2110, NVIDIA Rivermax, NMOS, UE5',
                desc: '本專案展示了 Unreal Engine 與基於 SMPTE ST 2110 標準的專業廣播 IP 基礎設施之間的實際系統整合工作流程。<br>系統利用 NVIDIA Rivermax SDK 搭配 Mellanox ConnectX-6 Lx 網卡進行高效能 IP 影像傳輸，整合 AJA Kona IP 實現 SDI/IP 互通，並使用 EVS Cerebrum 進行集中設備控制與路由管理。透過 NMOS (IS‑04/IS‑05) 實現設備發現、註冊與自動路由控制，讓 Unreal Engine 與其他 ST 2110 節點能共同參與統一的標準化控制環境。',
                imageUrl: './ST2110_Infra.png',
                githubUrl: 'https://github.com/supinzhen/Unreal-Rivermax-ST2110-Integration'
            }
        },
        'exp-antest': {
            en: {
                title: 'System Engineer @ New Digital Technology Holdings Ltd.',
                tech: 'Broadcasting × ST 2110 × Virtual Production × UE5 × Architecture',
                desc: '• Designing SDI & ST 2110 IP transmission architectures.<br>• Handling PTP synchronization, IP Routing, and multi-vendor device integration.<br>• Managing SDI-to-IP transitions including switch configuration and traffic flow management.<br>• Supporting VP/UE technical deployment and on-site troubleshooting.'
            },
            zh: {
                title: '系統工程師 @ 台灣安達斯有限公司',
                tech: '廣電系統整合 × ST 2110 × Virtual Production × 系統架構',
                desc: '• 參與廣電系統整合專案，包含 SDI 與 ST 2110 IP 影音傳輸架構、PTP 時鐘同步與 IP Routing。<br>• 協助客戶完成 SDI → IP 系統轉換，負責交換器設定、流量管理與視音訊路由規劃。<br>• 支援虛擬製作與 Unreal Engine 系統整合，提供現場技術部署與故障排除。'
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
        setModalId(id);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalId(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="animated-bg">
            {/* Hero Section */}
            <section className="min-h-[85vh] flex items-center justify-center pt-32 pb-16 relative overflow-hidden" id="hero">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-ue-blue/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-tech-green/10 rounded-full blur-[120px]"></div>

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

                            <p className="max-w-2xl mx-auto lg:mx-0 text-slate-400 text-base md:text-lg mb-10 leading-relaxed font-sans" data-aos="fade-right" data-aos-delay="400">
                                {t('hero-desc')}
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 font-sans" data-aos="fade-right" data-aos-delay="600">
                                <a href="#projects" className="px-8 py-3 bg-ue-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
                                    {t('btn-projects')}
                                </a>
                                <a href="#contact" className="px-8 py-3 bg-ue-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
                                    {t('btn-contact')}
                                </a>
                            </div>
                        </div>

                        <div className="flex-1 flex justify-center order-1 lg:order-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="profile-container animate-float">
                                <div className="profile-frame-decor"></div>
                                <div className="profile-frame-decor-2"></div>
                                <div className="profile-card">
                                    <img src="./image/Gemini_Generated_Image_uydifmuydifmuydi.png" alt="Annie Su" />
                                    <div className="profile-overlay"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="pt-[60px] pb-24 relative bg-slate-900/30">
                <div className="container mx-auto px-6 font-sans">
                    <h2 className="text-3xl font-bold mb-16 text-center" data-aos="fade-up">
                        <span>{t('skills-title')}</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
                        <div className="glass p-8 rounded-2xl border-glow-blue transition-all" data-aos="fade-up">
                            <div className="text-ue-blue text-4xl mb-6"><i className="fas fa-cube"></i></div>
                            <h3 className="text-xl font-bold mb-4">{t('skill-1-title')}</h3>
                            <ul className="space-y-3 text-slate-400 font-sans text-sm">
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Unreal Engine 5</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> C++ / Blueprints</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Pixel Streaming</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Python Scripting</li>
                            </ul>
                        </div>
                        <div className="glass p-8 rounded-2xl border-glow-green transition-all" data-aos="fade-up" data-aos-delay="200">
                            <div className="text-ue-blue text-4xl mb-6"><i className="fas fa-video"></i></div>
                            <h3 className="text-xl font-bold mb-4">{t('skill-2-title')}</h3>
                            <ul className="space-y-3 text-slate-400 font-sans text-sm">
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Zero Density / Reality</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Camera Tracking</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> nDisplay Configuration</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> LiveLink Protocol</li>
                            </ul>
                        </div>
                        <div className="glass p-8 rounded-2xl border-glow-blue transition-all" data-aos="fade-up" data-aos-delay="400">
                            <div className="text-ue-blue text-4xl mb-6"><i className="fas fa-network-wired"></i></div>
                            <h3 className="text-xl font-bold mb-4">{t('skill-3-title')}</h3>
                            <ul className="space-y-3 text-slate-400 font-sans text-sm">
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> SMPTE ST 2110 IP</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> PTP Synchronization</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> SDI / NDI Infrastructure</li>
                                <li className="flex items-center"><i className="fas fa-check text-ue-blue mr-2"></i> Cisco/Arista Switch</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-24 relative overflow-hidden font-sans">
                <div className="container mx-auto px-6 relative">
                    <h2 className="text-3xl font-bold mb-20 text-center font-sans tracking-tight" data-aos="fade-up">
                        <span>{t('exp-title')}</span>
                    </h2>

                    <div className="relative font-sans">
                        <div className="timeline-line"></div>

                        {/* Exp 1 */}
                        <div className="mb-10 flex flex-col md:flex-row items-center w-full relative group" data-aos="fade-right">
                            <div className="hidden md:flex w-1/2 pr-12 justify-end text-right">
                                <div className="max-w-md glass p-6 rounded-xl border-glow-blue cursor-pointer transition-all hover:scale-[1.02]" onClick={() => openModal('exp-antest')}>
                                    <div className="text-ue-blue font-sans font-bold text-xs mb-2">{t('exp-1-date')}</div>
                                    <h3 className="text-xl font-bold mb-1 font-sans">{t('exp-1-title')}</h3>
                                    <div className="flex flex-wrap justify-end gap-2 mb-4 font-mono">
                                        <span className="tag-pill border-ue-blue/30 text-ue-blue bg-ue-blue/5">#ST2110</span>
                                        <span className="tag-pill border-ue-blue/30 text-ue-blue bg-ue-blue/5">#VP</span>
                                        <span className="tag-pill border-slate-500/30 text-slate-400 bg-slate-500/5">#UE5</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t('exp-1-short')}</p>
                                    <div className="mt-4 text-ue-blue text-[10px] font-bold tracking-widest uppercase font-sans">
                                        {t('view-details')} <i className="fas fa-chevron-right ml-1"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="z-20 flex items-center bg-ue-blue shadow-[0_0_15px_rgba(0,112,255,0.6)] w-6 h-6 rounded-full border-4 border-slate-900 absolute left-0 md:left-1/2 md:-ml-3 ml-[-11px]"></div>
                            <div className="md:hidden w-full pl-10">
                                <div className="glass p-6 rounded-xl border-glow-blue cursor-pointer font-sans" onClick={() => openModal('exp-antest')}>
                                    <span className="text-ue-blue font-sans font-bold block mb-2">{t('exp-1-date')}</span>
                                    <h3 className="text-xl font-bold mb-1 font-sans">{t('exp-1-title')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('exp-1-short')}</p>
                                </div>
                            </div>
                            <div className="hidden md:flex w-1/2 pl-12 font-sans"></div>
                        </div>

                        {/* Exp 2 */}
                        <div className="mb-10 flex flex-col md:flex-row items-center w-full relative group" data-aos="fade-left">
                            <div className="hidden md:block w-1/2 pr-12 font-sans"></div>
                            <div className="z-20 flex items-center bg-tech-green shadow-[0_0_15px_rgba(0,255,171,0.6)] w-6 h-6 rounded-full border-4 border-slate-900 absolute left-0 md:left-1/2 md:-ml-3 ml-[-11px]"></div>
                            <div className="w-full md:w-1/2 pl-10 md:pl-12 font-sans">
                                <div className="max-w-md glass p-6 rounded-xl border-glow-green cursor-pointer transition-all hover:scale-[1.02]" onClick={() => openModal('exp-n2')}>
                                    <div className="text-tech-green font-sans font-bold text-xs mb-2">{t('exp-2-date')}</div>
                                    <h3 className="text-xl font-bold mb-1 font-sans">{t('exp-2-title')}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4 font-mono">
                                        <span className="tag-pill border-tech-green/30 text-tech-green bg-tech-green/5">#AI</span>
                                        <span className="tag-pill border-ue-blue/30 text-ue-blue bg-ue-blue/5">#Unreal Engine</span>
                                        <span className="tag-pill border-slate-500/30 text-slate-400 bg-slate-500/5">#API整合</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t('exp-2-short')}</p>
                                    <div className="mt-4 text-tech-green text-[10px] font-bold tracking-widest uppercase font-sans">
                                        {t('view-details')} <i className="fas fa-chevron-right ml-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exp 3 */}
                        <div className="mb-10 flex flex-col md:flex-row items-center w-full relative group font-sans" data-aos="fade-right">
                            <div className="hidden md:flex w-1/2 pr-12 justify-end text-right">
                                <div className="max-w-md glass p-6 rounded-xl border-glow-blue cursor-pointer transition-all hover:scale-[1.02]" onClick={() => openModal('exp-ndhu')}>
                                    <div className="text-slate-500 font-sans font-bold text-xs mb-2">
                                        {t('exp-3-date')}</div>
                                    <h3 className="text-xl font-bold mb-1 font-sans">{t('exp-3-title')}</h3>
                                    <div className="flex flex-wrap justify-end gap-2 mb-4 font-mono">
                                        <span className="tag-pill border-slate-500/30 text-slate-400 bg-slate-500/5">#VR/AR</span>
                                        <span className="tag-pill border-ue-blue/30 text-ue-blue bg-ue-blue/5">#Unity3D</span>
                                        <span className="tag-pill border-tech-green/30 text-tech-green bg-tech-green/5">#Python</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t('exp-3-short')}</p>
                                    <div className="mt-4 text-slate-500 text-[10px] font-bold tracking-widest uppercase font-sans">
                                        {t('view-details')} <i className="fas fa-chevron-right ml-1"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="z-20 flex items-center bg-slate-700 shadow-xl w-6 h-6 rounded-full border-4 border-slate-900 absolute left-0 md:left-1/2 md:-ml-3 ml-[-11px]"></div>
                            <div className="md:hidden w-full pl-10 font-sans">
                                <div className="glass p-6 rounded-xl border-glow-blue cursor-pointer" onClick={() => openModal('exp-ndhu')}>
                                    <span className="text-slate-500 font-sans font-bold block mb-2">{t('exp-3-date')}</span>
                                    <h3 className="text-xl font-bold mb-1 font-sans">{t('exp-3-title')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('exp-3-short')}</p>
                                </div>
                            </div>
                            <div className="hidden md:flex w-1/2 pl-12 font-sans"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 relative font-sans">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div data-aos="fade-right">
                            <h2 className="text-3xl font-bold font-sans">
                                <span>{t('projects-title')}</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 font-sans">{t('projects-subtitle')}</p>
                        </div>
                        <div className="mt-4 md:mt-0" data-aos="fade-left">
                            <span className="text-slate-500 font-sans text-sm">{t('projects-gallery')}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
                        {/* Project 3 */}
                        <div className="glass rounded-2xl overflow-hidden group cursor-pointer border-glow-blue transition-all font-sans" onClick={() => openModal('modal-3')} data-aos="zoom-in">
                            <div className="h-48 bg-slate-800 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop" alt="Server Project" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-950 flex items-center justify-center">
                                    <i className="fas fa-server text-6xl text-white/20"></i>
                                </div>
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
                                <h3 className="text-lg font-bold mb-2 group-hover:text-ue-blue transition-colors font-sans">{t('proj-3-title')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-sans">{t('proj-3-desc')}</p>
                                <button className="text-xs font-bold text-ue-blue flex items-center group-hover:translate-x-1 transition-transform font-sans">
                                    <span>{t('btn-details')}</span> <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>

                        {/* Project 2 */}
                        <div className="glass rounded-2xl overflow-hidden group cursor-pointer border-glow-green transition-all font-sans" onClick={() => openModal('modal-2')} data-aos="zoom-in" data-aos-delay="200">
                            <div className="h-48 bg-slate-800 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?q=80&w=800&auto=format&fit=crop" alt="VP Project" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-tech-green/40 to-slate-950 flex items-center justify-center">
                                    <i className="fas fa-video-slash text-6xl text-white/20"></i>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3 font-mono">
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-[10px] px-2 py-1 bg-tech-green/10 text-tech-green border border-tech-green/20 rounded">Python</span>
                                        <span className="text-[10px] px-2 py-1 bg-white/10 text-slate-800 dark:text-white border border-white/20 rounded">Unity</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 border border-slate-700 px-2 py-1 rounded-full whitespace-nowrap">2023-2024</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-tech-green transition-colors font-sans">{t('proj-2-title')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-sans">{t('proj-2-desc')}</p>
                                <button className="text-xs font-bold text-tech-green flex items-center group-hover:translate-x-1 transition-transform font-sans">
                                    <span>{t('btn-details')}</span> <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>

                        {/* Project 1 */}
                        <div className="glass rounded-2xl overflow-hidden group cursor-pointer border-glow-blue transition-all" onClick={() => openModal('modal-1')} data-aos="zoom-in" data-aos-delay="400">
                            <div className="h-48 bg-slate-800 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop" alt="AI Project" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-ue-blue/40 to-slate-950 flex items-center justify-center">
                                    <i className="fas fa-robot text-6xl text-white/20"></i>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3 font-mono">
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-[10px] px-2 py-1 bg-ue-blue/10 text-ue-blue border border-ue-blue/20 rounded">UE5</span>
                                        <span className="text-[10px] px-2 py-1 bg-tech-green/10 text-tech-green border border-tech-green/20 rounded">AI</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 border border-slate-700 px-2 py-1 rounded-full whitespace-nowrap">2024-2025</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-ue-blue transition-colors font-sans">{t('proj-1-title')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-sans">{t('proj-1-desc')}</p>
                                <button className="text-xs font-bold text-ue-blue flex items-center group-hover:translate-x-1 transition-transform font-sans">
                                    <span>{t('btn-details')}</span> <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Connect */}
            <section id="contact" className="py-24 border-t border-white/5 font-sans">
                <div className="container mx-auto px-6 text-center md:text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-sans">
                        <div data-aos="fade-right">
                            <h2 className="text-3xl font-bold mb-8 font-sans">{t('edu-title')}</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start justify-center md:justify-start">
                                    <div className="w-1 h-12 bg-ue-blue"></div>
                                    <div className="text-left font-sans">
                                        <h4 className="font-bold font-sans">{t('edu-1-uni')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-sans">{t('edu-1-deg')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start justify-center md:justify-start">
                                    <div className="w-1 h-12 bg-tech-green"></div>
                                    <div className="text-left font-sans">
                                        <h4 className="font-bold font-sans">{t('edu-2-uni')}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-sans">{t('edu-2-deg')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div data-aos="fade-left">
                            <h2 className="text-3xl font-bold mb-8 font-sans">{t('connect-title')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-sans">{t('connect-desc')}</p>
                            <div className="flex justify-center md:justify-start space-x-6 text-3xl">
                                <a href="https://github.com/supinzhen" target="_blank" className="text-slate-500 hover:text-ue-blue transition-all"><Github /></a>
                                <a href="https://www.linkedin.com/in/%E5%93%81%E7%94%84-%E8%98%87-b905491b8/" target="_blank" className="text-slate-500 hover:text-ue-blue transition-all"><i className="fab fa-linkedin"></i></a>
                                <a href="mailto:anniesuworkshop@gmail.com" className="text-slate-500 hover:text-tech-green transition-all"><Mail /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {modalId && modalData[modalId] && modalData[modalId][lang] && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-950/90 light:bg-slate-200/80 backdrop-blur-xl" onClick={closeModal}></div>
                    <div className="glass max-w-2xl w-full p-8 rounded-2xl relative z-10 animate-scale-up max-h-[90vh] overflow-y-auto font-sans">
                        {(() => {
                            const data = modalData[modalId][lang] as ModalContent & ExperienceContent;
                            return (
                                <>
                                    <button onClick={closeModal} className="sticky top-0 float-right text-slate-400 hover:text-ue-blue z-20">
                                        <X className="w-8 h-8" />
                                    </button>
                                    <div className="clear-both">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-3xl font-bold text-ue-blue mb-2 font-sans">{data.title}</h3>
                                                <p className="text-tech-green font-sans text-sm tracking-wide uppercase font-bold mb-4">{data.tech}</p>
                                                <div className="flex gap-4 mb-4">
                                                    {data.paperUrl && (
                                                        <a href={data.paperUrl} target="_blank" className="px-6 py-2 bg-tech-green/20 hover:bg-tech-green/40 text-tech-green border border-tech-green/30 rounded-lg transition-all text-sm font-bold font-sans flex items-center">
                                                            <i className="fas fa-file-lines mr-2"></i> {data.paperLabel || 'Paper'}
                                                        </a>
                                                    )}
                                                    {data.githubUrl && (
                                                        <a href={data.githubUrl} target="_blank" className="px-6 py-2 bg-slate-800/10 dark:bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all text-sm font-bold font-sans flex items-center">
                                                            <i className="fab fa-github mr-2"></i> GitHub
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="h-1 w-24 bg-gradient-to-r from-ue-blue to-tech-green mb-4"></div>

                                            {data.videoEmbedUrl && (
                                                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-6 bg-black">
                                                    <iframe className="w-full h-full" src={data.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                                </div>
                                            )}
                                            {data.imageUrl && (
                                                <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-6">
                                                    <img src={data.imageUrl} alt={data.title} className="w-full h-auto object-cover" />
                                                </div>
                                            )}

                                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg space-y-4 font-sans" dangerouslySetInnerHTML={{ __html: data.desc.includes('<br>') ? `<div class="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-white/5 font-sans">${data.desc}</div>` : `<p>${data.desc}</p>` }}>
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <button onClick={closeModal} className="px-6 py-2 glass hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all text-sm font-bold font-sans">Close Window</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Intro;
