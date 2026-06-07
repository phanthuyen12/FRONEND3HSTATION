import React, { ReactNode } from 'react';
import Header from '../components/header';
import Footer from '../components/Footer';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import ScrollToTopOnNavigate from '../components/ScrollToTopOnNavigate';

interface HostingLayoutProps {
  children: ReactNode;
}

// ── Light Mode CSS (unifato-inspired palette) ────────────────────────────────
// Primary accent : #FCD34D  (vivid yellow)
// Background     : #F5FCF8  (mint white)
// Alt section bg : #EDF7F1  (soft sage)
// Heading text   : #0B0B0B
// Body text      : #4B5563
// Card bg        : #ffffff
const lightCSS = `
  /* ══ ROOT ══════════════════════════════════ */
  .theme-light {
    background-color: #F5FCF8 !important;
    color: #0B0B0B !important;
  }

  /* ══ ALL SECTIONS ═══════════════════════════ */
  .theme-light section {
    background-color: #F5FCF8 !important;
    color: #0B0B0B !important;
  }
  .theme-light section:nth-child(even) {
    background-color: #EDF7F1 !important;
  }

  /* ══ DARK BG → WHITE ════════════════════════ */
  .theme-light [class*="bg-[#0"],
  .theme-light [class*="bg-[#1"],
  .theme-light .bg-black\\/40,
  .theme-light .bg-black\\/50,
  .theme-light .bg-black\\/60,
  .theme-light .bg-black {

  }

  /* ══ CARDS (course / software / workflow) ══ */
  .theme-light .group.relative.flex.flex-col {

    border-color: rgba(252,211,77,0.12) !important;
    box-shadow: 0 2px 20px rgba(252,180,20,0.06) !important;
  }
  .theme-light .group .w-full.h-full.object-cover {
    opacity: 0.88 !important;
  }
  .theme-light .absolute.inset-0[style*="linear-gradient"] {
    background: linear-gradient(180deg, transparent 35%, rgba(255,255,255,0.97) 100%) !important;
  }
  /* Backdrop/glass cards */
  .theme-light .backdrop-blur-md,
  .theme-light .backdrop-blur-lg,
  .theme-light .backdrop-blur-xl {
    background-color: rgba(255,255,255,0.85) !important;
    border-color: rgba(252,211,77,0.1) !important;
  }

  /* ══ TEXT ═══════════════════════════════════ */
  .theme-light .text-force-white  { color: #ffffff !important; }
  .theme-light .text-white        { color: #ffffffff !important; }
  .theme-light .text-white\\/90   { color: #1a2e1f !important; }
  .theme-light .text-white\\/70   { color: #374151 !important; }
  .theme-light .text-white\\/60   { color: #ffffffff !important; }
  .theme-light .text-white\\/50   { color: #6B7280 !important; }
  .theme-light .text-gray-100     { color: #111827 !important; }
  .theme-light .text-gray-200     { color: #1f2937 !important; }
  .theme-light .text-gray-300     { color: #374151 !important; }
  .theme-light .text-gray-400     { color: #4B5563 !important; }
  .theme-light .text-gray-400     { color: #6B7280 !important; }
  .theme-light .text-gray-400     { color: #6B7280 !important; }

  /* Change text-[#FDE047] to a darker yellow in light mode so it's readable */
  .theme-light .text-\\[\\#FDE047\\] { color: #FCD34D !important; }

  /* OVERRIDE PALE GRADIENTS IN LIGHT MODE */
  .theme-light .from-\\[\\#FDE047\\] { --tw-gradient-from: #FCD34D var(--tw-gradient-from-position) !important; }
  .theme-light .to-blue-400 { --tw-gradient-to: #2563EB var(--tw-gradient-to-position) !important; }
  .theme-light .to-\\[\\#FDE047\\] { --tw-gradient-to: #F59E0B var(--tw-gradient-to-position) !important; }

  /* ══ BUTTONS ════════════════════════════════ */
  .theme-light button {
    color: #0B0B0B;
  }
  .theme-light button.text-gray-400,
  .theme-light button.text-gray-400,
  .theme-light button.text-white {
    color: #374151 !important;
  }
  /* Tab/filter bg */
  .theme-light .bg-[#0d1412]\\/5,
  .theme-light .bg-[#0d1412]\\/\\[0\\.05\\],
  .theme-light .bg-[#0d1412]\\/\\[0\\.04\\] {
    background-color: rgba(251,191,36,0.06) !important;
  }
  .theme-light button:hover:not([class*="bg-gradient"]):not([class*="bg-[#00"]) {
    background-color: rgba(251,191,36,0.08) !important;
    color: #0B0B0B !important;
  }
  /* Ghost / outline buttons */
  .theme-light button[class*="border-white"],
  .theme-light a[class*="border-white"] {
    border-color: rgba(251,191,36,0.25) !important;
    color: #0B0B0B !important;
  }

  /* ══ BORDERS ════════════════════════════════ */
  .theme-light [class*="border-white"] {
    border-color: rgba(251,191,36,0.12) !important;
  }
  .theme-light .divide-white\\/10 > * + * {
    border-color: rgba(251,191,36,0.1) !important;
  }

  /* ══ INPUTS ════════════════════════════════ */
  .theme-light input,
  .theme-light textarea {

    border-color: rgba(251,191,36,0.18) !important;
    color: #0B0B0B !important;
  }
  .theme-light input::placeholder,
  .theme-light textarea::placeholder {
    color: #9CA3AF !important;
  }

  /* ══ GLOWS ═════════════════════════════════ */
  .theme-light .lp-glow-tr { background: rgba(251,191,36,0.06) !important; }
  .theme-light .lp-glow-bl { background: rgba(251,191,36,0.03) !important; }

  /* ══ GRADIENT TEXT ══════════════════════════ */
  .theme-light .bg-clip-text {
    -webkit-background-clip: text !important;
    background-clip: text !important;
  }

  /* ══ ICON OVERRIDES ═════════════════════════ */
  .theme-light svg[class*="text-white"] { color: #374151 !important; }
  .theme-light svg[class*="text-gray-"] { color: #6B7280 !important; }

  /* ══ PAGINATION BUTTONS ═════════════════════ */
  .theme-light .rounded-full[class*="border-white"] {
    border-color: rgba(251,191,36,0.15) !important;
    color: #0B0B0B !important;
  }
  .theme-light .rounded-full[class*="bg-[#0d1412]\\/5"] {
    background-color: rgba(251,191,36,0.06) !important;
  }

  /* ══ SCROLLBAR ══════════════════════════════ */
  .theme-light ::-webkit-scrollbar-track { background: #EDF7F1; }
  .theme-light ::-webkit-scrollbar-thumb { background: #a8d5bc; border-radius: 8px; }

  /* ══ HERO dark overlay ═══════════════════════ */
  .theme-light .min-h-screen.relative { background: transparent !important; }
  .theme-light .absolute.inset-0 {  }
`;

const darkCSS = `
  /* Dark mode readability across client landing */
  .theme-dark {
    color: #F8FAFC !important;
  }

  .theme-dark .text-white,
  .theme-dark .dark\\:text-white {
    color: #F8FAFC !important;
  }
  .theme-dark .text-white\\/90 { color: rgba(248,250,252,0.92) !important; }
  .theme-dark .text-white\\/80 { color: rgba(248,250,252,0.84) !important; }
  .theme-dark .text-white\\/70 { color: rgba(226,232,240,0.78) !important; }
  .theme-dark .text-white\\/60 { color: rgba(203,213,225,0.74) !important; }
  .theme-dark .text-white\\/50 { color: rgba(203,213,225,0.68) !important; }
  .theme-dark .text-gray-100 { color: #F1F5F9 !important; }
  .theme-dark .text-gray-200 { color: #E2E8F0 !important; }
  .theme-dark .text-gray-300 { color: #D3DAE6 !important; }
  .theme-dark .text-gray-400 { color: #B8C1CE !important; }
  .theme-dark .text-gray-500 { color: #98A4B5 !important; }
  .theme-dark .text-gray-600 { color: #8490A3 !important; }
  .theme-dark input::placeholder,
  .theme-dark textarea::placeholder {
    color: #8792A3 !important;
  }

  /* Soften bright borders globally while keeping cards visible */
  .theme-dark [class*="border-white"] {
    border-color: rgba(255,255,255,0.055) !important;
  }
  .theme-dark [class*="hover:border-white"]:hover {
    border-color: rgba(255,255,255,0.12) !important;
  }
  .theme-dark [class*="divide-white"] > * + * {
    border-color: rgba(255,255,255,0.055) !important;
  }
  .theme-dark [class*="border-[#FBBF24]"],
  .theme-dark [class*="border-[#FCD34D]"] {
    border-color: rgba(251,191,36,0.16) !important;
  }
  .theme-dark [class*="hover:border-[#FBBF24]"]:hover,
  .theme-dark [class*="hover:border-[#FCD34D]"]:hover {
    border-color: rgba(251,191,36,0.28) !important;
  }
  .theme-dark [class*="border-t"][class*="border-[#FBBF24]"],
  .theme-dark [class*="border-t"][class*="border-[#FCD34D]"] {
    border-color: rgba(251,191,36,0.12) !important;
  }
`;

// ── Layout Inner ─────────────────────────────────────────────────────────────
const LayoutInner = ({ children }: HostingLayoutProps) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen font-sans overflow-x-hidden flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#060a09] text-white theme-dark dark' : 'bg-[#F5FCF8] text-[#0B0B0B] theme-light'
        }`}
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'Outfit', sans-serif" }}
    >
      {/* Soft bg glows */}
      <div
        className="lp-glow-tr fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] -z-10 pointer-events-none transition-all duration-500"
        style={{ background: isDark ? 'rgba(251,191,36,0.08)' : 'rgba(251,191,36,0.05)' }}
      />
      <div
        className="lp-glow-bl fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] -z-10 pointer-events-none transition-all duration-500"
        style={{ background: isDark ? 'rgba(251,191,36,0.04)' : 'rgba(251,191,36,0.03)' }}
      />

      <Header />
      <ScrollToTopOnNavigate />

      <main className="flex-grow pt-[100px] md:pt-[110px] pb-24 md:pb-32 relative">
        {children}
      </main>



      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33%       { transform: translate(2px, -15px) rotate(1deg); }
          66%       { transform: translate(-2px, -8px) rotate(-1deg); }
        }
        .animate-float { animation: float 8s cubic-bezier(0.4,0,0.2,1) infinite; }
        .animate-in    { animation-timing-function: cubic-bezier(0.4,0,0.2,1); }

        * { box-sizing: border-box; }

        ${darkCSS}
        ${lightCSS}
      `}} />
    </div>
  );
};

// ── Layout with Provider ──────────────────────────────────────────────────────
const HostingLayout = ({ children }: HostingLayoutProps) => (
  <ThemeProvider>
    <LayoutInner>{children}</LayoutInner>
  </ThemeProvider>
);

export default HostingLayout;
