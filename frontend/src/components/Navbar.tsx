import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, ScanEye, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const isDiseaseActive = location.pathname === '/disease-detection';
  const isCropActive = location.pathname === '/crop-prediction';
  const isWeatherActive = location.pathname === '/weather-prediction';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LEFT: Brand Logo */}
          <Link
            to="/"
            id="nav-brand-link"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834A]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16834A] to-[#0D3B2A] flex items-center justify-center text-white shadow-md shadow-[#16834A]/20 transition-transform group-hover:scale-105">
              <Sprout className="w-5 h-5 text-[#E5F6EC]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0D3B2A] flex items-center gap-1.5">
                {t.appName}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F6EC] text-[#16834A]">
                  AI
                </span>
              </span>
              <span className="text-[11px] text-[#66736B] hidden sm:block leading-none font-medium">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* CENTER: The Three Main Features (Desktop) */}
          <nav className="hidden md:flex items-center p-1.5 rounded-full bg-[#F1F5F9]/80 border border-[#E2E8F0]/60 space-x-1 shadow-inner">
            <Link
              to="/disease-detection"
              id="desktop-nav-disease"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isDiseaseActive
                  ? 'bg-white text-[#0D3B2A] shadow-xs ring-1 ring-[#16834A]/20'
                  : 'text-[#66736B] hover:text-[#17211B] hover:bg-white/50'
              }`}
            >
              <span className="text-base">🔬</span>
              <span>{t.nav.diseaseDetection}</span>
              {isDiseaseActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#16834A]" />
              )}
            </Link>
            <Link
              to="/crop-prediction"
              id="desktop-nav-crop"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isCropActive
                  ? 'bg-white text-[#0D3B2A] shadow-xs ring-1 ring-[#16834A]/20'
                  : 'text-[#66736B] hover:text-[#17211B] hover:bg-white/50'
              }`}
            >
              <span className="text-base">🌱</span>
              <span>{t.nav.cropPrediction}</span>
              {isCropActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#16834A]" />
              )}
            </Link>
            <Link
              to="/weather-prediction"
              id="desktop-nav-weather"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isWeatherActive
                  ? 'bg-white text-[#0D3B2A] shadow-xs ring-1 ring-[#16834A]/20'
                  : 'text-[#66736B] hover:text-[#17211B] hover:bg-white/50'
              }`}
            >
              <span className="text-base">☁️</span>
              <span>{t.nav.weatherPrediction}</span>
              {isWeatherActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#16834A]" />
              )}
            </Link>
          </nav>

          {/* RIGHT: Language Selector & Status */}
          <div className="flex items-center gap-3">
            <LanguageSelector />

            {/* Quick Demo status pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5F6EC] border border-[#16834A]/20 text-xs font-semibold text-[#0D3B2A]">
              <Sparkles className="w-3.5 h-3.5 text-[#16834A]" />
              <span>Smart Agro v1.0</span>
            </div>

            {/* Farmer avatar */}
            <div
              className="w-9 h-9 rounded-full bg-[#E5F6EC] border-2 border-white shadow-xs flex items-center justify-center text-[#16834A] font-bold text-sm"
              title="Kisan AI Assistant"
            >
              👨‍🌾
            </div>
          </div>
        </div>

        {/* MOBILE SUB-NAVBAR: Compact Feature Switch */}
        <div className="md:hidden py-2.5 border-t border-[#F1F5F9]">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] gap-1">
            <Link
              to="/disease-detection"
              id="mobile-nav-disease"
              className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-all ${
                isDiseaseActive
                  ? 'bg-white text-[#0D3B2A] shadow-xs'
                  : 'text-[#66736B] hover:text-[#17211B]'
              }`}
            >
              <span className="text-sm">🔬</span>
              <span className="truncate w-full text-center">{t.nav.diseaseDetection}</span>
            </Link>
            <Link
              to="/crop-prediction"
              id="mobile-nav-crop"
              className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-all ${
                isCropActive
                  ? 'bg-white text-[#0D3B2A] shadow-xs'
                  : 'text-[#66736B] hover:text-[#17211B]'
              }`}
            >
              <span className="text-sm">🌱</span>
              <span className="truncate w-full text-center">{t.nav.cropPrediction}</span>
            </Link>
            <Link
              to="/weather-prediction"
              id="mobile-nav-weather"
              className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg text-[10px] font-bold transition-all ${
                isWeatherActive
                  ? 'bg-white text-[#0D3B2A] shadow-xs'
                  : 'text-[#66736B] hover:text-[#17211B]'
              }`}
            >
              <span className="text-sm">☁️</span>
              <span className="truncate w-full text-center">{t.nav.weatherPrediction}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
