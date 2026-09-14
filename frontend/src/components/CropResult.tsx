import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Info, X, Calendar, Droplet, Sprout, Layers } from 'lucide-react';
import { CropPredictionResponse } from '../types/crop';
import { ConfidenceMeter } from './ConfidenceMeter';
import { useLanguage } from '../context/LanguageContext';

interface CropResultProps {
  result: CropPredictionResponse;
  onPredictAgain: () => void;
}

export const CropResult: React.FC<CropResultProps> = ({ result, onPredictAgain }) => {
  const { t } = useLanguage();
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  const { bestCrop, alternativeCrops } = result;

  return (
    <div id="crop-result-container" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner: Best Crop Match */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#E5F6EC] opacity-60 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center lg:text-left space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E5F6EC] text-[#16834A] border border-[#16834A]/20">
              <Sprout className="w-3.5 h-3.5" />
              {t.cropResult.matchHeading}
            </span>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="text-5xl sm:text-6xl">{bestCrop.icon || '🌱'}</span>
              <h1 className="text-3xl sm:text-5xl font-black text-[#0D3B2A] tracking-tight">
                {bestCrop.name}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#66736B] leading-relaxed">
              {bestCrop.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                id="view-crop-details-btn"
                type="button"
                onClick={() => setShowDetailsModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#16834A] text-white text-sm font-bold shadow-md shadow-[#16834A]/25 hover:bg-[#0D3B2A] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#16834A]"
              >
                <Info className="w-4 h-4" />
                <span>{t.cropResult.viewDetails}</span>
              </button>

              <button
                id="crop-predict-again-btn"
                type="button"
                onClick={onPredictAgain}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F7FAF8] border border-[#E2E8F0] text-[#17211B] text-sm font-bold hover:bg-[#E5F6EC] hover:border-[#16834A]/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#16834A]" />
                <span>{t.cropResult.predictAgain}</span>
              </button>
            </div>
          </div>

          {/* Circular Confidence / Suitability Score */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0]">
            <ConfidenceMeter
              percentage={bestCrop.suitability}
              size={150}
              strokeWidth={12}
              label={t.cropResult.suitability}
              sublabel="Suitability"
            />
          </div>
        </div>

        {/* Why this crop? Checklist Card */}
        <div className="mt-10 pt-8 border-t border-[#F1F5F9]">
          <h3 className="text-lg font-bold text-[#0D3B2A] mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>
              {t.cropResult.whyTitle} {bestCrop.name}?
            </span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {bestCrop.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E2E8F0]/80"
              >
                <CheckCircle className="w-5 h-5 text-[#16834A] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#17211B]">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Suitable Crops Section */}
      {alternativeCrops && alternativeCrops.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-[#0D3B2A] tracking-tight flex items-center gap-2">
            <span>🌿</span>
            <span>{t.cropResult.otherHeading}</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            {alternativeCrops.map((alt, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{alt.icon || '🌱'}</span>
                      <h4 className="text-xl font-bold text-[#17211B]">{alt.name}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black font-mono bg-[#E5F6EC] text-[#16834A] border border-[#16834A]/20">
                      {alt.suitability}% {t.cropResult.suitability}
                    </span>
                  </div>

                  <p className="text-sm text-[#66736B] leading-relaxed mb-4">
                    {alt.summary}
                  </p>

                  <div className="space-y-1.5">
                    {alt.reasons.slice(0, 2).map((r, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 text-xs text-[#17211B]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#16834A]" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal / Dialog */}
      {showDetailsModal && (
        <div
          id="crop-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDetailsModal(false)}
              className="absolute right-6 top-6 p-2 rounded-full text-[#66736B] hover:text-[#17211B] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{bestCrop.icon || '🌱'}</span>
              <div>
                <h3 className="text-2xl font-black text-[#0D3B2A]">{bestCrop.name}</h3>
                <p className="text-xs text-[#16834A] font-bold uppercase tracking-wider">
                  {t.cropResult.modalTitle}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0] flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#16834A] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase text-[#66736B]">
                    {t.cropResult.growthDuration}
                  </h5>
                  <p className="text-sm font-semibold text-[#17211B]">
                    {bestCrop.details?.growthDurationDays || '90 - 120 Days'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0] flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#16834A] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase text-[#66736B]">
                    {t.cropResult.expectedYield}
                  </h5>
                  <p className="text-sm font-semibold text-[#17211B]">
                    {bestCrop.details?.expectedYield || '30 - 40 Q/Ha'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0] flex items-start gap-3">
                <Droplet className="w-5 h-5 text-[#16834A] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase text-[#66736B]">
                    {t.cropResult.waterReq}
                  </h5>
                  <p className="text-sm font-medium text-[#17211B]">
                    {bestCrop.details?.waterRequirementLevel || 'Moderate scheduled irrigation'}
                  </p>
                </div>
              </div>

              {bestCrop.details?.soilPreparationNote && (
                <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0]">
                  <h5 className="text-xs font-bold uppercase text-[#66736B] mb-1">
                    {t.cropResult.soilPrep}
                  </h5>
                  <p className="text-sm text-[#17211B] leading-relaxed">
                    {bestCrop.details.soilPreparationNote}
                  </p>
                </div>
              )}

              {bestCrop.details?.fertilizerTip && (
                <div className="p-4 rounded-2xl bg-[#E5F6EC] border border-[#16834A]/20">
                  <h5 className="text-xs font-bold uppercase text-[#16834A] mb-1">
                    {t.cropResult.fertilizerNote}
                  </h5>
                  <p className="text-sm text-[#0D3B2A] leading-relaxed">
                    {bestCrop.details.fertilizerTip}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#17211B] text-white text-sm font-bold hover:bg-[#0D3B2A] transition-colors cursor-pointer"
              >
                {t.cropResult.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
