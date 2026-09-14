import React from 'react';
import { Sprout, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCropPrediction } from '../hooks/useCropPrediction';
import { CropForm } from '../components/CropForm';
import { CropResult } from '../components/CropResult';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const CropPrediction: React.FC = () => {
  const { t } = useLanguage();
  const { loading, currentStep, result, error, predict, reset } = useCropPrediction();

  return (
    <div id="crop-prediction-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* State 1: Loading State */}
      {loading && (
        <div className="py-12">
          <LoadingState currentStep={currentStep} theme="crop" />
        </div>
      )}

      {/* State 2: Error State */}
      {!loading && error && (
        <div className="py-12">
          <ErrorState message={error} onRetry={() => reset()} onBack={() => reset()} />
        </div>
      )}

      {/* State 3: Result View */}
      {!loading && !error && result && (
        <CropResult result={result} onPredictAgain={reset} />
      )}

      {/* State 4: Default Form View (Consultation Layout) */}
      {!loading && !error && !result && (
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* LEFT SIDE: Heading, Consultation Intro & Plant/Field Visual */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5F6EC] text-[#16834A] text-xs font-black uppercase tracking-wider border border-[#16834A]/20">
              <Sprout className="w-4 h-4" />
              <span>{t.cropForm.smartConsultation || 'Smart Consultation'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0D3B2A] tracking-tight leading-tight">
              {t.cropForm.heading}
            </h1>

            <p className="text-base sm:text-lg text-[#66736B] leading-relaxed">
              {t.cropForm.subheading}
            </p>

            {/* Quality Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#17211B]">
                <CheckCircle2 className="w-5 h-5 text-[#16834A] shrink-0" />
                <span>{t.cropForm.quality1 || 'Multi-factor agronomic modeling'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#17211B]">
                <CheckCircle2 className="w-5 h-5 text-[#16834A] shrink-0" />
                <span>{t.cropForm.quality2 || 'Considers rainfall & regional season windows'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#17211B]">
                <CheckCircle2 className="w-5 h-5 text-[#16834A] shrink-0" />
                <span>{t.cropForm.quality3 || 'Alternative crop rotation recommendations'}</span>
              </div>
            </div>

            {/* Agricultural Visual Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E2E8F0] aspect-video sm:aspect-4/3 bg-[#0D3B2A]">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                alt="Fertile agricultural farmland"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B2A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0D3B2A]">
                    {t.cropForm.soilActive || 'Soil Intelligence Active'}
                  </span>
                  <span className="text-[11px] font-mono text-[#16834A] font-semibold">
                    pH 5.5 - 7.8
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Premium Form Card */}
          <div className="lg:col-span-7">
            <CropForm onSubmit={predict} isLoading={loading} />
          </div>
        </div>
      )}
    </div>
  );
};
