import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LoadingStateProps {
  currentStep: number; // 1, 2, 3, 4
  title?: string;
  subtitle?: string;
  steps?: string[];
  theme?: 'crop' | 'disease';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  currentStep,
  title,
  subtitle,
  steps,
  theme = 'crop',
}) => {
  const { t } = useLanguage();

  const defaultTitle = theme === 'crop' ? t.cropLoading.title : t.diseaseScanning.title;
  const defaultSubtitle = theme === 'crop' ? t.cropLoading.subtitle : t.diseaseScanning.subtitle;

  const defaultSteps =
    theme === 'crop'
      ? [
          t.cropLoading.step1,
          t.cropLoading.step2,
          t.cropLoading.step3,
          t.cropLoading.step4,
        ]
      : [
          t.diseaseScanning.step1,
          t.diseaseScanning.step2,
          t.diseaseScanning.step3,
          t.diseaseScanning.step4,
        ];

  const displaySteps = steps || defaultSteps;

  return (
    <div
      id="analysis-loading-state"
      className="w-full p-8 sm:p-12 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Animated visual ring */}
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        {/* Soft pulse rings */}
        <div className="absolute inset-0 rounded-full bg-[#E5F6EC] animate-ping opacity-60" />
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#16834A]/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0D3B2A] to-[#16834A] flex items-center justify-center text-3xl text-white shadow-lg shadow-[#16834A]/30">
          {theme === 'crop' ? '🌱' : '🔬'}
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D3B2A] mb-2 tracking-tight">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-[#66736B] max-w-md mx-auto mb-8">
        {subtitle || defaultSubtitle}
      </p>

      {/* Progressive Step Indicators */}
      <div className="space-y-3 text-left max-w-md mx-auto bg-[#F7FAF8] p-5 rounded-2xl border border-[#E2E8F0]/80">
        {displaySteps.map((stepText, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-white shadow-xs border border-[#16834A]/20'
                  : 'bg-transparent'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isDone
                    ? 'bg-[#16834A] text-white'
                    : isActive
                    ? 'bg-[#E5F6EC] text-[#16834A] ring-2 ring-[#16834A]'
                    : 'bg-[#E2E8F0] text-[#66736B]'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              <span
                className={`text-sm ${
                  isDone
                    ? 'text-[#0D3B2A] font-semibold'
                    : isActive
                    ? 'text-[#16834A] font-bold'
                    : 'text-[#66736B]'
                }`}
              >
                {stepText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
