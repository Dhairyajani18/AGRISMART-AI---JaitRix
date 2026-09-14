import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Cpu, CloudSun, ArrowUp, Globe, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#082218] text-white overflow-hidden border-t border-[#16834A]/30">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#16834A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info & Mission (Col 1-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#16834A] to-[#22C55E] p-0.5 shadow-lg shadow-[#16834A]/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#082218] rounded-[14px] flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-[#22C55E]" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  AGRISMART <span className="text-[#22C55E]">AI</span>
                </span>
                <span className="text-xs text-[#A3E635] font-semibold tracking-wide uppercase">
                  {t.footer?.platformSub || 'Precision Agriculture Platform'}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#A3B8B0] leading-relaxed max-w-md">
              {t.footer?.missionText || 'Empowering farmers with AI-driven crop pathology diagnostics, NPK soil suitability matching, and real-time microclimate forecasts for maximum yield and sustainability.'}
            </p>

            {/* AI Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
              </span>
              <span className="text-white/90 font-medium">
                {t.footer?.engineStatus || 'AI Diagnostic Neural Engine:'}{' '}
                <strong className="text-[#22C55E]">{t.footer?.operational || 'Operational'}</strong>
              </span>
            </div>
          </div>

          {/* Quick Navigation Links (Col 6-8) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#22C55E]">
              {t.footer?.navHeader || 'Navigation & Tools'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[#A3B8B0] hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all">
                  <span className="text-[#22C55E]">›</span> {t.footer?.homeLink || 'Home Page'}
                </Link>
              </li>
              <li>
                <Link to="/disease-detection" className="text-[#A3B8B0] hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all">
                  <span className="text-[#22C55E]">›</span> {t.footer?.diseaseLink || 'Leaf Disease Detection'}
                </Link>
              </li>
              <li>
                <Link to="/crop-prediction" className="text-[#A3B8B0] hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all">
                  <span className="text-[#22C55E]">›</span> {t.footer?.cropLink || 'Crop Recommendation'}
                </Link>
              </li>
              <li>
                <Link to="/weather-prediction" className="text-[#A3B8B0] hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all">
                  <span className="text-[#22C55E]">›</span> {t.footer?.weatherLink || 'Live Weather Forecast'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Features & Languages (Col 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#22C55E]">
              {t.footer?.multiHeader || 'Multilingual Advisory'}
            </h4>
            <p className="text-xs text-[#A3B8B0] leading-relaxed">
              {t.footer?.multiDesc || 'AgriSmart AI supports regional farm operational needs in multiple languages:'}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#22C55E]" /> English
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-white">
                हिन्दी (Hindi)
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-white">
                ગુજરાતી (Gujarati)
              </span>
            </div>

            <div className="pt-2 text-xs text-[#A3B8B0]">
              <div className="flex items-center gap-2 text-white/80 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>{t.footer?.freeUtility || '100% Free Agricultural AI Utility for Farmers'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B8B0]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AgriSmart AI. {t.footer?.rights || 'All rights reserved.'}</span>
            <span className="text-white/30">•</span>
            <span className="inline-flex items-center gap-1 text-white font-medium">
              Created by <strong className="text-[#22C55E]">Jaitrix</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#A3B8B0]">{t.footer?.solutions || 'Smart Agriculture Solutions'}</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-[#16834A] text-white transition-all shadow-sm flex items-center justify-center gap-1 text-xs font-bold"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">{t.footer?.topBtn || 'Top'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
