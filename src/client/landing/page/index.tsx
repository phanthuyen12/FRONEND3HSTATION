import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { motion, type Variants } from 'framer-motion';
import HostingLayout from '../layouts/HostingLayout';
import DomainSection from '../components/DomainSection';
import WebDesignSection from '../components/WebDesignSection';
import HostingSection from '../components/HostingSection';
import CoursesSection from '../components/CoursesSection';
import SoftwareSection from '../components/SoftwareSection';
import WorkflowSection from '../components/WorkflowSection';
import ExperienceSection from '../components/ExperienceSection';
import FAQSection from '../components/FAQSection';

const heroContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
};

const heroItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const heroRight: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut', delay: 0.3 } }
};

const LandingPage = () => {
    return (
        <HostingLayout>
            {/* ── Hero Section ── */}
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative pt-28 md:pt-40 pb-24">

                {/* Left – Hero Copy */}
                <motion.div
                    className="flex-1 space-y-7 max-w-xl"
                    variants={heroContainer}
                    initial="hidden"
                    animate="show"
                >
                    {/* Badge */}
                    <motion.div variants={heroItem}>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[10px] font-black uppercase tracking-widest text-[#00ff9d]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse"></span>
                            Được tin dùng bởi 80,000+ Khách hàng
                        </span>
                    </motion.div>

                    {/* H1 */}
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight"
                        variants={heroItem}
                    >
                        Hosting Tốc độ & Bền bỉ
                        cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-blue-400">
                            Tên Miền Uy Tín
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-[17px] md:text-lg text-gray-400 font-medium leading-[1.7] max-w-md"
                        variants={heroItem}
                    >
                        Cung cấp hosting tốc độ cao, bảo mật và tên miền uy tín giúp website của bạn luôn hoạt động mượt mà — mọi lúc, mọi nơi.
                    </motion.p>

                    {/* CTA Row */}
                    <motion.div className="flex flex-wrap items-center gap-4 pt-2" variants={heroItem}>
                        <button className="px-10 py-4 bg-gradient-to-r from-[#00ff9d] to-[#01c67c] text-[#060a09] font-black rounded-full hover:shadow-[0_0_40px_rgba(0,255,157,0.5)] transform hover:-translate-y-1 active:scale-95 transition-all duration-500 flex items-center gap-2.5 text-xs uppercase tracking-wider group">
                            Khám phá ngay
                            <div className="w-6 h-6 bg-[#060a09]/10 rounded-full flex items-center justify-center group-hover:bg-[#060a09]/20 transition-all">
                                <FeatherIcon icon="arrow-right" size={14} />
                            </div>
                        </button>
                        <button className="px-8 py-4 rounded-full border border-white/10 text-white/70 text-xs font-black uppercase tracking-wider hover:border-[#00ff9d]/40 hover:text-white transition-all duration-500 hover:bg-[#00ff9d]/5">
                            Xem Demo
                        </button>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        className="flex items-center gap-6 pt-4 border-t border-white/5"
                        variants={heroItem}
                    >
                        {[
                            { icon: 'shield', label: 'SSL Miễn Phí' },
                            { icon: 'clock', label: '99.9% Uptime' },
                            { icon: 'zap', label: 'Tốc độ NVMe' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 group">
                                <div className="w-6 h-6 rounded-lg bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20 group-hover:bg-[#00ff9d]/20 transition-all duration-300">
                                    <FeatherIcon icon={item.icon} className="text-[#00ff9d]" size={12} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right – Visual */}
                <motion.div
                    className="flex-1 relative flex justify-center lg:justify-end"
                    variants={heroRight}
                    initial="hidden"
                    animate="show"
                >
                    {/* Main glass box */}
                    {/* Main Visual Container */}
                    <div className="relative w-full max-w-[520px] aspect-square flex flex-col items-center justify-center">

                        {/* Background Spinning Shape */}
                        <img 
                            src="https://unifato.com/hostc/assets/img/shapes/hero6-image-shape.png" 
                            alt="Background Shape" 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] md:w-[130%] h-auto object-contain -z-10 animate-[spin_40s_linear_infinite] opacity-60"
                        />

                        {/* Main Image from Unifato */}
                        <img
                            src="https://unifato.com/hostc/assets/img/images/hero6-image.png"
                            alt="Fast Reliable Hosting"
                            className="w-full h-auto object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] transform scale-[1.05]"
                        />

                        {/* Floating Card 1 – 24/7 Support */}
                        <motion.div
                            className="absolute -top-4 left-0 md:-left-8 w-[200px] p-4 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl z-20 hidden md:block"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20 flex-shrink-0">
                                    <FeatherIcon icon="clock" className="text-[#00ff9d]" size={18} />
                                </div>
                                <div>
                                    <p className="font-black text-xs text-white leading-tight">Hỗ Trợ 24/7</p>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Trực Tuyến Mọi Lúc</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Card 2 – Lifetime Guarantee */}
                        <motion.div
                            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-[180px] p-5 rounded-[20px] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl z-20 hidden md:block"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        >
                            <div className="space-y-3 hidden">
                                <div className="w-10 h-10 rounded-full bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20">
                                    <FeatherIcon icon="globe" className="text-[#00ff9d]" size={18} />
                                </div>
                                <p className="font-black text-xs text-white leading-tight">Bảo Hành<br />Trọn Đời</p>
                            </div>
                        </motion.div>

                        {/* Floating Card 3 – Free SSL */}
                        <motion.div
                            className="absolute -bottom-8 right-0 md:-right-8 w-[200px] p-4 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl z-20"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20 flex-shrink-0">
                                    <FeatherIcon icon="shield" className="text-[#00ff9d]" size={18} />
                                </div>
                                <div>
                                    <p className="font-black text-xs text-white leading-tight">SSL Miễn Phí &<br />Bảo Mật</p>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Tự Động Gia Hạn</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Card 4 – Speed metric */}
                        <motion.div
                            className="absolute top-10 -right-4 md:-right-8 w-[120px] p-4 rounded-[20px] bg-black/40 backdrop-blur-2xl border border-[#00ff9d]/30 shadow-2xl z-20"
                            animate={{ y: [0, -14, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                        >
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tốc độ NVMe</p>
                            <p className="text-3xl font-black text-white leading-none">10<span className="text-[#00ff9d]">x</span></p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">Nhanh hơn</p>
                        </motion.div>
                    </div>

                    {/* Ambient glow */}
                    <div className="absolute inset-0 -z-10 bg-[#00ff9d]/8 blur-[120px] rounded-full scale-75"></div>
                </motion.div>
            </div>

            {/* ── All Content Sections ── */}
            <DomainSection />
            <WebDesignSection />
            <HostingSection />
            <CoursesSection />
            <SoftwareSection />
            <WorkflowSection />
            <ExperienceSection />
            <FAQSection />
        </HostingLayout>
    );
};

export default LandingPage;
