import React, { useState } from 'react';
import { ScanEye, Sparkles, ShieldCheck, Microscope } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDiseasePrediction } from '../hooks/useDiseasePrediction';
import { DiseaseUploader } from '../components/DiseaseUploader';
import { DiseaseScanner } from '../components/DiseaseScanner';
import { DiseaseResult } from '../components/DiseaseResult';
import { ErrorState } from '../components/ErrorState';
import { DiseaseInputPayload } from '../types/disease';

export const DiseaseDetection: React.FC = () => {
  const { t } = useLanguage();
  const { scanning, scanStep, result, error, analyze, reset } = useDiseasePrediction();

  // Keep a reference to the active specimen image for scanner & result displays
  const [activeImageSrc, setActiveImageSrc] = useState<string>('');

  const handleStartAnalysis = (payload: DiseaseInputPayload) => {
    // Generate object url or use existing
    const url = URL.createObjectURL(payload.imageFile);
    setActiveImageSrc(url);
    analyze(payload);
  };

  const handleResetAll = () => {
    reset();
    setActiveImageSrc('');
  };

  return (
    <div id="disease-detection-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Banner & Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5F6EC] text-[#16834A] text-xs font-black uppercase tracking-wider border border-[#16834A]/25 shadow-xs">
          <Microscope className="w-4 h-4 text-[#16834A]" />
          <span>{t.disease.flagshipBadge || 'FLAGSHIP AI VISION DIAGNOSTICS'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0D3B2A] tracking-tight leading-tight">
          {t.disease.heading}
        </h1>

        <p className="text-base sm:text-lg text-[#66736B] max-w-2xl mx-auto leading-relaxed">
          {t.disease.subheading}
        </p>
      </div>

      {/* STATE 1: SCANNING ANIMATION */}
      {scanning && (
        <div className="py-6">
          <DiseaseScanner imageSrc={activeImageSrc} step={scanStep} />
        </div>
      )}

      {/* STATE 2: ERROR STATE */}
      {!scanning && error && (
        <div className="py-8">
          <ErrorState
            title={t.errors.predictionFailed}
            message={error}
            onRetry={handleResetAll}
            onBack={handleResetAll}
          />
        </div>
      )}

      {/* STATE 3: RESULT VIEW */}
      {!scanning && !error && result && (
        <div className="py-2">
          <DiseaseResult
            result={result}
            originalImageSrc={activeImageSrc}
            onReset={handleResetAll}
          />
        </div>
      )}

      {/* STATE 4: DEFAULT UPLOAD VIEW */}
      {!scanning && !error && !result && (
        <div className="max-w-3xl mx-auto">
          <DiseaseUploader onAnalyze={handleStartAnalysis} isAnalyzing={scanning} />
        </div>
      )}

      {/* Bottom Educational Tips */}
      {!scanning && !result && (
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#F1F5F9]/70 border border-[#E2E8F0] grid sm:grid-cols-3 gap-4 text-xs text-[#17211B]">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">📸</span>
            <div>
              <strong className="block text-[#0D3B2A] font-bold">
                {t.disease.tipLightingTitle || 'Good Lighting'}
              </strong>
              <span className="text-[#66736B]">
                {t.disease.tipLightingDesc || 'Take photos in bright outdoor light without heavy shadows.'}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-lg">🔍</span>
            <div>
              <strong className="block text-[#0D3B2A] font-bold">
                {t.disease.tipFocusTitle || 'Focus on Symptoms'}
              </strong>
              <span className="text-[#66736B]">
                {t.disease.tipFocusDesc || 'Center spots, lesions, or yellowing edges in frame.'}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-lg">🍃</span>
            <div>
              <strong className="block text-[#0D3B2A] font-bold">
                {t.disease.tipSpecimenTitle || 'Single Specimen'}
              </strong>
              <span className="text-[#66736B]">
                {t.disease.tipSpecimenDesc || 'Capture one infected leaf per analysis for best accuracy.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
