import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FeatureCardProps {
  id: string;
  to: string;
  icon: string;
  badgeText: string;
  title: string;
  description: string;
  buttonText: string;
  highlights: string[];
  gradientTheme?: 'green' | 'emerald';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  to,
  icon,
  badgeText,
  title,
  description,
  buttonText,
  highlights,
}) => {
  const { t } = useLanguage();

  return (
    <Link
      to={to}
      id={id}
      className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-2xl hover:border-[#16834A]/40 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Subtle background ambient glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#E5F6EC] opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div>
        {/* Top bar with icon & badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#E5F6EC] border border-[#16834A]/20 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            {icon}
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F7FAF8] text-[#16834A] border border-[#16834A]/20">
            <Sparkles className="w-3 h-3 text-[#16834A]" />
            {badgeText}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B2A] tracking-tight mb-3 group-hover:text-[#16834A] transition-colors">
          {title}
        </h3>
        <p className="text-base text-[#66736B] leading-relaxed mb-6 font-normal">
          {description}
        </p>

        {/* Key Highlights checklist */}
        <ul className="space-y-2.5 mb-8">
          {highlights.map((item, index) => (
            <li key={index} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#17211B]">
              <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#16834A] group-hover:text-[#0D3B2A] transition-colors">
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </span>
        <span className="text-xs font-semibold text-[#66736B] group-hover:text-[#16834A] transition-colors">
          {t.cards.instantAi || 'Instant AI'}
        </span>
      </div>
    </Link>
  );
};
