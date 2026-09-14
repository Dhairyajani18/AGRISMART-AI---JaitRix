import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  onBack?: () => void;
  title?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onBack,
  title,
}) => {
  const { t } = useLanguage();

  return (
    <div
      id="farmer-error-container"
      className="p-8 sm:p-10 rounded-3xl bg-white border border-[#DC2626]/20 shadow-lg text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5 text-[#DC2626] shadow-xs">
        <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
      </div>

      <h3 className="text-xl font-extrabold text-[#17211B] mb-2 tracking-tight">
        {title || t.errors.predictionFailed}
      </h3>

      <p className="text-sm text-[#66736B] mb-8 leading-relaxed max-w-sm mx-auto">
        {message || t.errors.networkError}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id="error-retry-btn"
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#16834A] text-white text-sm font-bold shadow-md shadow-[#16834A]/25 hover:bg-[#0D3B2A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16834A]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.errors.tryAgain}</span>
        </button>

        {onBack && (
          <button
            id="error-back-btn"
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F1F5F9] text-[#17211B] text-sm font-semibold hover:bg-[#E2E8F0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.cancel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
