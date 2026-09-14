import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { DiseaseInputPayload } from '../types/disease';
import { useLanguage } from '../context/LanguageContext';

interface DiseaseUploaderProps {
  onAnalyze: (payload: DiseaseInputPayload) => void;
  isAnalyzing: boolean;
}

// Built-in SVG base64 or generated sample leaves for immediate hackathon demos
const SAMPLE_LEAVES = [
  {
    id: 'sample-early-blight',
    name: 'Tomato Early Blight',
    cropType: 'Tomato (ટામેટા / टमाटर)',
    growthStage: 'Vegetative foliage growth',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a4a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-healthy',
    name: 'Healthy Leaf Specimen',
    cropType: 'Tomato (ટામેટા / टमाटर)',
    growthStage: 'Flowering / Blossom stage',
    url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-potato-blight',
    name: 'Potato Late Blight',
    cropType: 'Potato (બટાટા / आलू)',
    growthStage: 'Fruiting / Pod development',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
  },
];

export const DiseaseUploader: React.FC<DiseaseUploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const { t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>('Tomato (ટામેટા / टमाटर)');
  const [growthStage, setGrowthStage] = useState<string>('Vegetative foliage growth');
  const [farmType, setFarmType] = useState<string>('Open Field');
  const [cropVariety, setCropVariety] = useState<string>('');
  const [waterSource, setWaterSource] = useState<string>('Irrigated');
  const [season, setSeason] = useState<string>('Kharif');
  const [plantingDate, setPlantingDate] = useState<string>('');
  
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleSelectSample = async (sample: (typeof SAMPLE_LEAVES)[0]) => {
    try {
      setCropType(sample.cropType);
      setGrowthStage(sample.growthStage);
      setPreviewUrl(sample.url);

      // Create a dummy File instance representing this sample for formData transmission
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const sampleFile = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(sampleFile);
      setValidationError(null);
    } catch {
      // Fallback
      setPreviewUrl(sample.url);
      const mockFile = new File(['sample-bytes'], `${sample.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(mockFile);
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
                alt="Selected leaf specimen"
                className="w-full h-full object-contain max-h-[340px]"
              />

              {/* Status overlay */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>Specimen Ready</span>
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
            {SAMPLE_LEAVES.map((sample) => (
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

        {/* Crop Metadata Selectors */}
        <div className="pt-6 border-t border-[#F1F5F9]">
          <h4 className="text-sm font-bold text-[#17211B] mb-4 uppercase tracking-wide">
            Farm Information
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label
                htmlFor="disease-crop-type"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.disease.cropType}
              </label>
              <select
                id="disease-crop-type"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Tomato (ટામેટા / टमाटर)">{t.disease.cropTypeOptions.tomato}</option>
                <option value="Potato (બટાટા / आलू)">{t.disease.cropTypeOptions.potato}</option>
                <option value="Cotton (કપાસ / कपास)">{t.disease.cropTypeOptions.cotton}</option>
                <option value="Rice / Paddy (ડાંગર / धान)">{t.disease.cropTypeOptions.rice}</option>
                <option value="Wheat (ઘઉં / गेहूं)">{t.disease.cropTypeOptions.wheat}</option>
                <option value="Corn / Maize (મકાઈ / मक्का)">{t.disease.cropTypeOptions.maize}</option>
                <option value="Chilli (મરચાં / मिर्च)">{t.disease.cropTypeOptions.chilli}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="disease-crop-variety" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.disease.cropVariety}
              </label>
              <input
                id="disease-crop-variety"
                type="text"
                placeholder="e.g. Roma"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="disease-growth-stage" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.disease.growthStage}
              </label>
              <select
                id="disease-growth-stage"
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Seedling / Early vegetative">{t.disease.growthStageOptions.seedling}</option>
                <option value="Vegetative foliage growth">{t.disease.growthStageOptions.vegetative}</option>
                <option value="Flowering / Blossom stage">{t.disease.growthStageOptions.flowering}</option>
                <option value="Fruiting / Pod development">{t.disease.growthStageOptions.fruiting}</option>
                <option value="Maturity / Pre-harvest">{t.disease.growthStageOptions.mature}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="disease-farm-type" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.disease.farmType}
              </label>
              <select
                id="disease-farm-type"
                value={farmType}
                onChange={(e) => setFarmType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Open Field">Open Field</option>
                <option value="Greenhouse">Greenhouse</option>
                <option value="Polyhouse">Polyhouse</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="disease-water-source" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.disease.waterSource}
              </label>
              <select
                id="disease-water-source"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Irrigated">Irrigated</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="disease-season" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.disease.season}
              </label>
              <select
                id="disease-season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="disease-planting-date" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.disease.plantingDate}
              </label>
              <input
                id="disease-planting-date"
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              />
            </div>
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
