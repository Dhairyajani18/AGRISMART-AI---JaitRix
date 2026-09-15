import React from 'react';
import { motion } from 'motion/react';
import { Check, Loader2, Sparkles, Scan } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DiseaseScannerProps {
  imageSrc: string;
  step: number; // 1 to 4
}

export const DiseaseScanner: React.FC<DiseaseScannerProps> = ({ imageSrc, step }) => {
  const { t } = useLanguage();

  const steps = [
    t.diseaseScanning.step1,
    t.diseaseScanning.step2,
    t.diseaseScanning.step3,
    t.diseaseScanning.step4,
  ];

  return (
    <div
      id="ai-disease-scanner-container"
      className="p-6 sm:p-10 rounded-3xl bg-[#0B1E15] border border-[#16834A]/30 shadow-2xl text-white max-w-2xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header with status pill */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#16834A]/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#16834A]/30 border border-[#16834A]/40 flex items-center justify-center text-[#E5F6EC]">
            <Scan className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold tracking-wide text-[#E5F6EC]">
            {t.diseaseScanning.engineName}
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#16834A]/20 text-[#22C55E] border border-[#22C55E]/40">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          {t.diseaseScanning.badgeScanning}
        </span>
      </div>

      {/* Center Image Scanner Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[16/10] flex items-center justify-center border border-[#16834A]/40 shadow-inner">
        {/* Leaf Image under analysis */}
        <img
          src={imageSrc}
          alt={t.diseaseScanning.scanAlt}
          className="w-full h-full object-contain filter contrast-105"
        />

        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(#16834A 1px, transparent 1px), linear-gradient(90deg, #16834A 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Animated Horizontal Laser Scanning Line (motion/react) */}
        <motion.div
          animate={{
            top: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_15px_#22C55E] z-20 pointer-events-none"
        >
          <div className="w-full h-12 bg-gradient-to-b from-[#22C55E]/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Corner Viewfinder Markers */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#22C55E] z-10" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#22C55E] z-10" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#22C55E] z-10" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#22C55E] z-10" />

        {/* AI Detection Focus Points / Bounding Bounding Tags */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute top-1/4 left-1/3 p-1.5 rounded-lg border border-[#F59E0B] bg-[#F59E0B]/15 z-10 text-[10px] font-mono text-[#F59E0B] flex items-center gap-1 shadow-xs"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{t.diseaseScanning.lesionLabel}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-1/3 right-1/4 p-1.5 rounded-lg border border-[#22C55E] bg-[#22C55E]/15 z-10 text-[10px] font-mono text-[#22C55E] flex items-center gap-1 shadow-xs"
        >
          <span>{t.diseaseScanning.chlorophyllLabel}</span>
        </motion.div>
      </div>

      {/* Progress Steps readout */}
      <div className="mt-8 space-y-4">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {t.diseaseScanning.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1">
            {t.diseaseScanning.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
          {steps.map((stepLabel, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  isCurrent
                    ? 'bg-[#16834A]/30 border-[#22C55E]/50 shadow-md'
                    : isCompleted
                    ? 'bg-[#0E281C] border-[#16834A]/20 opacity-85'
                    : 'bg-black/20 border-white/5 opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-[#22C55E] text-[#0D3B2A]'
                      : isCurrent
                      ? 'bg-[#16834A] text-white ring-2 ring-[#22C55E]'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>

                <span
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isCurrent
                      ? 'text-[#22C55E]'
                      : isCompleted
                      ? 'text-white'
                      : 'text-white/60'
                  }`}
                >
                  {stepLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
