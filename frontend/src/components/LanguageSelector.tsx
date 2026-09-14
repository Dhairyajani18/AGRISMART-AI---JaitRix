import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="language-selector-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-[#17211B] text-sm font-medium hover:border-[#16834A] hover:bg-[#F7FAF8] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#16834A]/20"
      >
        <Globe className="w-4 h-4 text-[#16834A]" />
        <span className="hidden sm:inline font-semibold">{currentLang.nativeLabel}</span>
        <span className="sm:hidden font-semibold">{currentLang.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#66736B] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="language-dropdown-menu"
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right"
        >
          <div className="px-4 py-2 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#66736B] uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#16834A]" />
              {t.nav.chooseLanguage}
            </div>
          </div>

          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((langItem) => {
              const isSelected = langItem.code === language;
              return (
                <button
                  key={langItem.code}
                  id={`lang-option-${langItem.code}`}
                  onClick={() => {
                    setLanguage(langItem.code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#E5F6EC] text-[#0D3B2A] font-semibold'
                      : 'text-[#17211B] hover:bg-[#F7FAF8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{langItem.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{langItem.nativeLabel}</span>
                      {langItem.nativeLabel !== langItem.label && (
                        <span className="text-xs text-[#66736B]">{langItem.label}</span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#16834A] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
