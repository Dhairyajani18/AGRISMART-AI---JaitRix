import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  FileText,
  X,
  Eye,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { DiseaseDetectionResponse } from '../types/disease';
import { ConfidenceMeter } from './ConfidenceMeter';
import { useLanguage } from '../context/LanguageContext';

interface DiseaseResultProps {
  result: DiseaseDetectionResponse;
  originalImageSrc: string;
  onReset: () => void;
}

export const DiseaseResult: React.FC<DiseaseResultProps> = ({
  result,
  originalImageSrc,
  onReset,
}) => {
  const { t } = useLanguage();
  const [showDetailedModal, setShowDetailedModal] = useState<boolean>(false);
  const [activeImageTab, setActiveImageTab] = useState<'original' | 'heatmap'>('original');

  const {
    status,
    diseaseName,
    scientificName,
    cropType,
    growthStage,
    confidence,
    severity,
    aiFindings,
    recommendedActions,
    heatmapUrl,
    advisoryNote,
  } = result;

  // Status-dependent styling and badges
  const isHealthy = status === 'healthy';
  const isLowConfidence = status === 'low_confidence';
  const isDiseaseDetected = status === 'disease_detected';

  const statusBadge = () => {
    if (isHealthy) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#E5F6EC] text-[#16834A] border border-[#16834A]/20">
          <ShieldCheck className="w-4 h-4 text-[#16834A]" />
          {t.diseaseResult.statusHealthy}
        </span>
      );
    }
    if (isLowConfidence) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30">
          <HelpCircle className="w-4 h-4 text-[#D97706]" />
          {t.diseaseResult.statusLowConfidence}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20">
        <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
        {t.diseaseResult.statusDetected}
      </span>
    );
  };

  return (
    <div id="disease-result-container" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Main Dual-Column Analysis Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl relative overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Leaf Specimen Image & Heatmap Toggle */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#0D3B2A] aspect-square flex items-center justify-center border border-[#E2E8F0] shadow-md">
              <img
                src={activeImageTab === 'heatmap' && heatmapUrl ? heatmapUrl : originalImageSrc}
                alt={diseaseName}
                className="w-full h-full object-contain"
              />

              {/* Tag indicator on image */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16834A]" />
                <span>{activeImageTab === 'heatmap' ? 'AI Heatmap' : 'Specimen Leaf'}</span>
              </div>
            </div>

            {/* If backend returns a heatmapUrl, show toggle tabs */}
            {heatmapUrl && (
              <div className="flex rounded-xl bg-[#F1F5F9] p-1 border border-[#E2E8F0] gap-1">
                <button
                  type="button"
                  onClick={() => setActiveImageTab('original')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeImageTab === 'original'
                      ? 'bg-white text-[#0D3B2A] shadow-xs'
                      : 'text-[#66736B] hover:text-[#17211B]'
                  }`}
                >
                  {t.diseaseResult.toggleOriginal}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab('heatmap')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeImageTab === 'heatmap'
                      ? 'bg-white text-[#0D3B2A] shadow-xs'
                      : 'text-[#66736B] hover:text-[#17211B]'
                  }`}
                >
                  {t.diseaseResult.toggleHeatmap}
                </button>
              </div>
            )}

            {/* Specimen metadata pill */}
            <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E2E8F0] text-xs text-[#66736B] flex items-center justify-between">
              <span>{cropType}</span>
              {growthStage && <span className="font-semibold text-[#17211B]">{growthStage}</span>}
            </div>
          </div>

          {/* RIGHT: Findings, Diagnosis & Confidence */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
              <div>
                <div className="mb-2">{statusBadge()}</div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#0D3B2A] tracking-tight">
                  {diseaseName}
                </h2>
                {scientificName && (
                  <p className="text-xs sm:text-sm text-[#66736B] italic font-serif mt-0.5">
                    {scientificName}
                  </p>
                )}
              </div>

              {/* Confidence Meter Circular */}
              <div className="shrink-0 p-3 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0]/80">
                <ConfidenceMeter
                  percentage={confidence}
                  size={100}
                  strokeWidth={9}
                  sublabel="Confidence"
                />
              </div>
            </div>

            {/* Status-specific advisory message */}
            {isHealthy && (
              <div className="p-4 rounded-2xl bg-[#E5F6EC] border border-[#16834A]/20 text-[#0D3B2A] text-sm leading-relaxed">
                {t.diseaseResult.healthyMessage}
              </div>
            )}

            {isLowConfidence && (
              <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#D97706]/30 text-[#92400E] text-sm leading-relaxed">
                {t.diseaseResult.lowConfidenceMessage}
              </div>
            )}

            {/* AI Findings List */}
            {aiFindings && aiFindings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>{t.diseaseResult.findingsTitle}</span>
                </h4>
                <ul className="space-y-2">
                  {aiFindings.map((finding, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#17211B]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16834A] mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Actions Checklist */}
            {recommendedActions && recommendedActions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>{t.diseaseResult.actionsTitle}</span>
                </h4>
                <div className="space-y-2">
                  {recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#F7FAF8] border border-[#E2E8F0]/80 text-xs sm:text-sm font-medium text-[#17211B]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons Footer */}
            <div className="pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center gap-3">
              <button
                id="disease-view-detailed-btn"
                type="button"
                onClick={() => setShowDetailedModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#16834A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#16834A]/25 hover:bg-[#0D3B2A] transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t.diseaseResult.viewAnalysis}</span>
              </button>

              <button
                id="disease-analyze-another-btn"
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F7FAF8] border border-[#E2E8F0] text-[#17211B] text-xs sm:text-sm font-bold hover:bg-[#E5F6EC] hover:border-[#16834A]/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#16834A]" />
                <span>
                  {isLowConfidence
                    ? t.diseaseResult.uploadAnother
                    : t.diseaseResult.analyzeAnother}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Modal */}
      {showDetailedModal && (
        <div
          id="disease-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDetailedModal(false)}
              className="absolute right-6 top-6 p-2 rounded-full text-[#66736B] hover:text-[#17211B] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#16834A]">
                Comprehensive Diagnostic Report
              </span>
              <h3 className="text-2xl font-black text-[#0D3B2A] mt-1">{diseaseName}</h3>
              {scientificName && <p className="text-sm italic text-[#66736B]">{scientificName}</p>}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0]">
                  <span className="text-[11px] font-bold text-[#66736B] uppercase block">
                    {t.diseaseResult.severity}
                  </span>
                  <span className="text-sm font-extrabold text-[#0D3B2A]">
                    {severity || (isHealthy ? 'None' : 'Moderate')}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0]">
                  <span className="text-[11px] font-bold text-[#66736B] uppercase block">
                    {t.diseaseResult.confidence}
                  </span>
                  <span className="text-sm font-extrabold text-[#16834A] font-mono">
                    {confidence}%
                  </span>
                </div>
              </div>

              {advisoryNote && (
                <div className="p-4 rounded-2xl bg-[#E5F6EC] border border-[#16834A]/20">
                  <h5 className="text-xs font-bold uppercase text-[#16834A] mb-1">
                    Clinical Agronomist Note
                  </h5>
                  <p className="text-sm text-[#0D3B2A] leading-relaxed">{advisoryNote}</p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#66736B]">
                  <Layers className="w-4 h-4 text-[#16834A]" />
                  <span>Bio-Safety & Prevention Protocol</span>
                </div>
                <p className="text-xs text-[#17211B] leading-relaxed">
                  Clean pruning shears with 70% isopropyl alcohol or bleach solution between cuts.
                  Avoid walking through wet foliage in early morning hours to curtail mechanical transmission
                  of fungal conidia.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailedModal(false)}
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
