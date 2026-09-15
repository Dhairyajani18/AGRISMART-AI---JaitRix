import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { DiseaseInputPayload } from '../types/disease';
import { useLanguage } from '../context/LanguageContext';

interface DiseaseUploaderProps {
  onAnalyze: (payload: DiseaseInputPayload) => void;
  isAnalyzing: boolean;
}

// Public image examples; selecting one still sends the real image to the backend.
const SAMPLE_LEAVES = [
  {
    id: 'sample-early-blight',
    nameKey: 'sampleLeaf1',
    cropTypeKey: 'tomato',
    growthStageKey: 'vegetative',
    url: 'test_image_1.jpg',
  },
  {
    id: 'sample-late',
    nameKey: 'sampleLeaf2',
    cropTypeKey: 'tomato',
    growthStageKey: 'flowering',
    url: 'test_image_2.jpg',
  },
  {
    id: 'sample-potato-blight',
    nameKey: 'sampleLeaf3',
    cropTypeKey: 'potato',
    growthStageKey: 'fruiting',
    url: 'test_image_3.jpg',
  },
] as const;

export const DiseaseUploader: React.FC<DiseaseUploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const { t, language } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>(t.disease.cropTypeOptions.tomato);
  const [growthStage, setGrowthStage] = useState<string>(t.disease.growthStageOptions.vegetative);
  const [farmType, setFarmType] = useState<string>('Open Field');
  const [cropVariety, setCropVariety] = useState<string>('');
  const [waterSource, setWaterSource] = useState<string>('Irrigated');
  const [season, setSeason] = useState<string>('Kharif');
  const [plantingDate, setPlantingDate] = useState<string>('');
  
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCropType(t.disease.cropTypeOptions.tomato);
    setGrowthStage(t.disease.growthStageOptions.vegetative);
  }, [language, t]);

  const localizedSampleLeaves = SAMPLE_LEAVES.map((sample) => ({
    ...sample,
    name:
      sample.nameKey === 'sampleLeaf1'
        ? t.disease.sampleLeaf1
        : sample.nameKey === 'sampleLeaf2'
          ? t.disease.sampleLeaf2
          : t.disease.sampleLeaf3,
    cropType: t.disease.cropTypeOptions[sample.cropTypeKey],
    growthStage: t.disease.growthStageOptions[sample.growthStageKey],
  }));

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setValidationError(t.errors.invalidImage);
      return;
    }

    // Validate size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError(t.errors.imageTooLarge);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith('http')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSelectSample = async (sample: (typeof localizedSampleLeaves)[number]) => {
    try {
      setCropType(sample.cropType);
      setGrowthStage(sample.growthStage);
      setPreviewUrl(sample.url);

      const response = await fetch(sample.url);
      if (!response.ok) throw new Error('Unable to load sample image');
      const blob = await response.blob();
      const sampleFile = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(sampleFile);
      setValidationError(null);
    } catch (error) {
      setPreviewUrl(null);
      setSelectedFile(null);
      setValidationError(t.errors.sampleLoadFailed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError(t.errors.invalidImage);
      return;
    }

    onAnalyze({
      imageFile: selectedFile,
      cropType,
      growthStage,
      farmType,
      cropVariety,
      waterSource,
      season,
      plantingDate,
    });
  };

  return (
    <div
      id="disease-uploader-card"
      className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl relative overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden inputs for File and Camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="leaf-file-upload-input"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="leaf-camera-upload-input"
        />

        {/* Validation Error Banner */}
        {validationError && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Upload Dropzone OR Image Preview */}
        {!previewUrl ? (
          <div
            id="leaf-dropzone"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] ${
              dragActive
                ? 'border-[#16834A] bg-[#E5F6EC]/40 scale-[0.99]'
                : 'border-[#CBD5E1] bg-[#F7FAF8] hover:border-[#16834A]/50 hover:bg-[#F1F5F9]/60'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#16834A] shadow-xs mb-4">
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            </div>

            <h3 className="text-lg font-bold text-[#17211B] mb-1">
              {t.disease.uploadTitle}
            </h3>
            <p className="text-sm text-[#66736B] mb-2 font-medium">
              {t.disease.dragDropText}
            </p>
            <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider mb-4">
              {t.disease.orText}
            </span>

            {/* Action Buttons inside dropzone */}
            <div
              className="flex flex-wrap items-center justify-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="choose-image-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#CBD5E1] text-xs sm:text-sm font-bold text-[#17211B] shadow-xs hover:border-[#16834A] hover:bg-[#F7FAF8] transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-[#16834A]" />
                <span>{t.disease.uploadBtn}</span>
              </button>

              <button
                id="camera-capture-btn"
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#CBD5E1] text-xs sm:text-sm font-bold text-[#17211B] shadow-xs hover:border-[#16834A] hover:bg-[#F7FAF8] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#16834A]" />
                <span>{t.disease.cameraBtn}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#94A3B8] mt-4">
              {t.disease.supportedFormats}
            </p>
          </div>
        ) : (
          /* Image Preview Area */
          <div id="leaf-image-preview-box" className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-[#0D3B2A] aspect-video sm:aspect-[21/9] flex items-center justify-center shadow-lg border border-[#0D3B2A]">
              <img
                src={previewUrl}
                alt={t.disease.uploadTitle}
                className="w-full h-full object-contain max-h-[340px]"
              />

              {/* Status overlay */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>{t.disease.specimenReady}</span>
              </div>

              {/* Action Buttons overlay */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  id="change-leaf-image-btn"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-[#17211B] text-xs font-bold shadow-md hover:bg-white transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>{t.disease.changeImage}</span>
                </button>

                <button
                  id="remove-leaf-image-btn"
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEE2E2]/90 backdrop-blur-xs text-[#DC2626] text-xs font-bold shadow-md hover:bg-[#FEE2E2] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.disease.removeImage}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Leaves for Immediate Demo Testing */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#66736B]">
            <Sparkles className="w-3.5 h-3.5 text-[#16834A]" />
            <span>{t.disease.sampleLeavesTitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {localizedSampleLeaves.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] hover:bg-[#E5F6EC] hover:border-[#16834A]/40 text-left transition-all text-xs font-semibold text-[#17211B] cursor-pointer"
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <span className="truncate">{sample.name}</span>
              </button>
            ))}
          </div>
        </div>

        
        {/* Primary Analyze Button */}
        <div className="pt-4 border-t border-[#F1F5F9]">
          <button
            id="disease-analyze-submit-btn"
            type="submit"
            disabled={isAnalyzing || !selectedFile}
            className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#0D3B2A] to-[#16834A] text-white text-base sm:text-lg font-extrabold shadow-xl shadow-[#0D3B2A]/20 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#16834A]/30"
          >
            <span className="text-xl">🔬</span>
            <span>{t.disease.analyzeBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
