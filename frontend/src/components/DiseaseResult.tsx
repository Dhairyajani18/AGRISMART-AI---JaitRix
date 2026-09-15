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
  const { t, language } = useLanguage();
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

  const localizeDiseaseName = (name: string) => {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/[_/]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const diseaseMap: Record<string, Record<'en' | 'hi' | 'gu', string>> = {
      'powdery mildew': { en: 'Powdery Mildew', hi: 'पाउडरी मिल्ड्यू', gu: 'પાવડરી મિલ્ડ્યુ' },
      'apple scab': { en: 'Apple Scab', hi: 'एप्पल स्कैब', gu: 'આપલ સ્કેબ' },
      'black rot': { en: 'Black Rot', hi: 'ब्लैक रोट', gu: 'બ્લેક રોટ' },
      'cedar apple rust': { en: 'Cedar Apple Rust', hi: 'सिडार एप्पल रस्ट', gu: 'સિડાર એપલ રસ્ટ' },
      healthy: { en: 'Healthy', hi: 'स्वस्थ', gu: 'સ્વસ્થ' },
      'cercospora leaf spot / gray leaf spot': {
        en: 'Cercospora Leaf Spot / Gray Leaf Spot',
        hi: 'सेरकोस्पोरा लीफ स्पॉट / ग्रे लीफ स्पॉट',
        gu: 'સર્કોસ્પોરા પાન ડાઘ / ગ્રે પાન ડાઘ',
      },
      'common rust': { en: 'Common Rust', hi: 'कॉमन रस्ट', gu: 'કોમન રસ્ટ' },
      'northern leaf blight': { en: 'Northern Leaf Blight', hi: 'नॉर्दर्न लीफ ब्लाइट', gu: 'નોર્થન પાન બ્લાઇટ' },
      'early blight': { en: 'Early Blight', hi: 'अर्ली ब्लाइट', gu: 'અરલી બ્લાઇટ' },
      'late blight': { en: 'Late Blight', hi: 'लेट ब्लाइट', gu: 'લેટ બ્લાઇટ' },
      'leaf mold': { en: 'Leaf Mold', hi: 'लीफ mould', gu: 'પાનનું mould' },
      'bacterial spot': { en: 'Bacterial Spot', hi: 'बैक्टीरियल स्पॉट', gu: 'બેક્ટેરિયલ સ્પોટ' },
      'tomato mosaic virus': { en: 'Tomato Mosaic Virus', hi: 'टमाटो मोज़ेक वायरस', gu: 'ટમેટા મોઝેક વાયરસ' },
    };

    return diseaseMap[normalized]?.[language] ?? name;
  };

  const normalizeText = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[_/\\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const localizeCropType = (value: string) => {
    const normalized = normalizeText(value);
    const cropMap: Record<string, Record<'en' | 'hi' | 'gu', string>> = {
      tomato: { en: 'Tomato', hi: 'टमाटर', gu: 'ટમેટા' },
      potato: { en: 'Potato', hi: 'आलू', gu: 'બટાકા' },
      corn: { en: 'Corn', hi: 'मक्का', gu: 'મકાઈ' },
      maize: { en: 'Maize', hi: 'मक्का', gu: 'મકાઈ' },
      apple: { en: 'Apple', hi: 'सेब', gu: 'સફરજન' },
      grape: { en: 'Grape', hi: 'अंगूर', gu: 'દ્રાક્ષ' },
      pepper: { en: 'Pepper', hi: 'मिर्च', gu: 'મરચાં' },
      cherry: { en: 'Cherry', hi: 'चेरी', gu: 'ચેરી' },
    };

    return cropMap[normalized]?.[language] ?? value;
  };

  const localizeGrowthStage = (value: string) => {
    const normalized = normalizeText(value);
    const stageMap: Record<string, Record<'en' | 'hi' | 'gu', string>> = {
      'vegetative growth': { en: 'Vegetative foliage growth', hi: 'पत्ती विकास / पत्तियों का विकास', gu: 'પાંદડા વિકાસ / પાંદડાની વૃદ્ધિ' },
      'flowering stage': { en: 'Flowering stage', hi: 'फूल आने की अवस्था', gu: 'ફૂલનો વિકાસ' },
      'fruit development': { en: 'Fruit development', hi: 'फल विकास', gu: 'ફળ વિકાસ' },
      'seedling stage': { en: 'Seedling stage', hi: 'अंकुरण अवस्था', gu: 'મૂળદિપ અવસ્થા' },
      'maturity stage': { en: 'Maturity stage', hi: 'परिपक्वता', gu: 'પરિપાક્વता' },
    };

    return stageMap[normalized]?.[language] ?? value;
  };

  const localizeAdviceEntries = (items: string[] | undefined, type: 'description' | 'precautions') => {
    const diseaseKey = normalizeText(diseaseName || '');
    const adviceMap: Record<string, Record<'en' | 'hi' | 'gu', { description: string[]; precautions: string[] }>> = {
      'powdery mildew': {
        en: {
          description: [
            'A fungal disease that produces a characteristic white, powder-like growth on leaves and young plant tissues.',
            'White powdery coating on leaves',
            'Distorted young leaves',
            'Reduced plant growth',
            'Affected shoots may become weakened',
          ],
          precautions: [
            'Remove severely affected plant material.',
            'Improve air circulation around the plant.',
            'Avoid excessive nitrogen fertilization.',
            'Monitor new growth regularly.',
          ],
        },
        hi: {
          description: [
            'यह एक कवकजनित रोग है जो पत्तियों और युवा पौधों की टिशू पर सफेद, पाउडर जैसा विकास बनाता है।',
            'पत्तियों पर सफेद पाउडर जैसापन',
            'नरम और विकृत युवा पत्तियां',
            'पौधे की वृद्धि कम हो जाती है',
            'प्रभावित तनों की मजबूती कम हो सकती है',
          ],
          precautions: [
            'काफी अधिक प्रभावित भागों को हटा दें।',
            'पौधे के आसपास हवा का प्रवाह बेहतर बनाएं।',
            'अत्यधिक नाइट्रोजन उर्वरक का उपयोग न करें।',
            'नई वृद्धि का नियमित रूप से निरीक्षण करें।',
          ],
        },
        gu: {
          description: [
            'આ ફંગસથી થતો રોગ પાંદડા અને jeunes નરમ ભાગો પર સફેદ, પાઉડર જેવી_grwoth બનાવે છે.',
            'પાંદડાં પર સફેદ પાઉડર જેવી કોટિંગ',
            'વિકૃત નાનાં પાંદડા',
            'પાકની વૃદ્ધિ ઘટી જાય છે',
            'સપડેલા શાખાઓ નબળા થઈ શકે છે',
          ],
          precautions: [
            'ઘણું અસરગ્રસ્ત છોડના ભાગો દૂર કરો.',
            'છોડની આસપાસ હવાની જાળવણી સુધારો.',
            'વધારે નાઇટ્રોજન ખાતરનો ઉપયોગ ટાળો.',
            'નવા વિકાસનું નિયમિત નિરીક્ષણ કરો.',
          ],
        },
      },
      'late blight': {
        en: {
          description: [
            'A serious disease that can rapidly damage tomato foliage and fruit under favorable conditions.',
            'Dark or water-soaked leaf lesions',
            'Rapid browning of affected foliage',
            'Dark lesions on stems',
            'Fruit may develop dark, firm lesions',
          ],
          precautions: [
            'Remove severely affected plant material.',
            'Avoid overhead watering.',
            'Improve air circulation.',
            'Monitor nearby plants closely.',
            'Seek local agricultural guidance if symptoms spread rapidly.',
          ],
        },
        hi: {
          description: [
            'यह एक गंभीर रोग है जो अनुकूल परिस्थितियों में टमाटर की पत्तियों और फलों को तेजी से नुकसान पहुंचा सकता है।',
            'पत्तियों पर गहरे या पानी से भीगे हुए घाव',
            'प्रभावित पत्तियों का तेजी से भूरा होना',
            'तनों पर गहरे घाव',
            'फलों पर गहरे और कठोर घाव बन सकते हैं',
          ],
          precautions: [
            'बहुत अधिक प्रभावित पौधों के हिस्सों को हटा दें।',
            'ऊपर से पानी देने से बचें।',
            'हवा का प्रवाह बेहतर बनाएं।',
            'पास के पौधों की नियमित निगरानी करें।',
            'यदि लक्षण तेजी से फैलें तो स्थानीय कृषि विशेषज्ञ से सलाह लें।',
          ],
        },
        gu: {
          description: [
            'આ એક ગંભીર રોગ છે જે અનુકૂળ પરિસ્થિતિઓમાં ટામેટાના પાંદડા અને ફળને ઝડપથી નુકસાન પહોંચાડી શકે છે.',
            'પાંદડા પર ઘેરા અથવા પાણીથી ભીના થયેલા ડાઘા',
            'અસરગ્રસ્ત પાંદડાં ઝડપથી ભૂરા થઈ જાય છે',
            'થડ પર ઘેરા ડાઘા',
            'ફળ પર ઘેરા અને કઠણ ડાઘા થઈ શકે છે',
          ],
          precautions: [
            'ખૂબ અસરગ્રસ્ત છોડના ભાગો દૂર કરો.',
            'ઉપરથી પાણી આપવાનું ટાળો.',
            'હવાની અવરજવર સુધારો.',
            'નજીકના છોડનું નિયમિત નિરીક્ષણ કરો.',
            'લક્ષણો ઝડપથી ફેલાય તો સ્થાનિક કૃષિ નિષ્ણાતની સલાહ લો.',
          ],
        },
      },
    };

    const entry = adviceMap[diseaseKey]?.[language];
    if (!entry) return items ?? [];
    return type === 'description' ? entry.description : entry.precautions;
  };

  const localizedDiseaseName = localizeDiseaseName(diseaseName);
  const localizedScientificName = scientificName ? scientificName.replace(/[_/]+/g, ' ').replace(/\s+/g, ' ').trim() : undefined;
  const localizedCropType = localizeCropType(cropType || '');
  const localizedGrowthStage = localizeGrowthStage(growthStage || '');
  const localizedAiFindings = localizeAdviceEntries(aiFindings, 'description');
  const localizedRecommendedActions = localizeAdviceEntries(recommendedActions, 'precautions');
  const localizedSpecimenLabel =
    language === 'hi' ? 'पत्ती नमूना' : language === 'gu' ? 'નમૂના પાંદડા' : 'Specimen Leaf';
  const localizedHeatmapLabel = language === 'hi' ? 'एआई हीटमैप' : language === 'gu' ? 'એઆઈ હીટમેપ' : 'AI Heatmap';

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
                alt={localizedDiseaseName}
                className="w-full h-full object-contain"
              />

              {/* Tag indicator on image */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16834A]" />
                <span>{activeImageTab === 'heatmap' ? localizedHeatmapLabel : localizedSpecimenLabel}</span>
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
              <span>{localizedCropType}</span>
              {localizedGrowthStage && <span className="font-semibold text-[#17211B]">{localizedGrowthStage}</span>}
            </div>
          </div>

          {/* RIGHT: Findings, Diagnosis & Confidence */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
              <div>
                <div className="mb-2">{statusBadge()}</div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#0D3B2A] tracking-tight">
                  {localizedDiseaseName}
                </h2>
                {localizedScientificName && (
                  <p className="text-xs sm:text-sm text-[#66736B] italic font-serif mt-0.5">
                    {localizedScientificName}
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
            {localizedAiFindings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>{t.diseaseResult.findingsTitle}</span>
                </h4>
                <ul className="space-y-2">
                  {localizedAiFindings.map((finding, idx) => (
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
            {localizedRecommendedActions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>{t.diseaseResult.actionsTitle}</span>
                </h4>
                <div className="space-y-2">
                  {localizedRecommendedActions.map((action, idx) => (
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
              <h3 className="text-2xl font-black text-[#0D3B2A] mt-1">{localizedDiseaseName}</h3>
              {localizedScientificName && <p className="text-sm italic text-[#66736B]">{localizedScientificName}</p>}
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
                    {confidence.toFixed(2)}%
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
