import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2, Search, MapPin } from 'lucide-react';
import { CropInput } from '../types/crop';
import { useLanguage } from '../context/LanguageContext';
import { fetchWeatherByLocation, searchCity } from '../services/weatherApi';

interface CropFormProps {
  onSubmit: (data: CropInput) => void;
  isLoading?: boolean;
}

export const CropForm: React.FC<CropFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<CropInput>({
    soilType: 'Alluvial Soil',
    soilPh: 6.5,
    temperature: 26,
    humidity: 65,
    rainfall: 720,
    waterAvailability: 'Moderate (Borewell / Drip irrigation)',
    season: 'Kharif (Monsoon / June - Oct)',
    previousCrop: 'Pulses / Legumes (Nitrogen fixing)',
    nitrogen: 40,
    phosphorus: 30,
    potassium: 30,
  });

  // Mobile multi-step state (1: Soil, 2: Climate, 3: Farm)
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState("");

  const handleInputChange = (
    field: keyof CropInput,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFetchWeather = () => {
    if (!navigator.geolocation) {
      setWeatherError('Geolocation is not supported by your browser.');
      return;
    }

    setIsFetchingWeather(true);
    setWeatherError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherByLocation(latitude, longitude);
          
          setFormData(prev => ({
            ...prev,
            temperature: Math.round(weather.current.temperature),
            humidity: Math.round(weather.current.humidity),
            rainfall: Math.round(weather.current.rainfall),
          }));
        } catch (err) {
          setWeatherError('Failed to fetch local weather.');
        } finally {
          setIsFetchingWeather(false);
        }
      },
      () => {
        setWeatherError('Location access denied.');
        setIsFetchingWeather(false);
      }
    );
  };

  const handleCitySearch = async () => {
    if (!cityQuery.trim()) return;
    
    setIsFetchingWeather(true);
    setWeatherError(null);

    try {
      const location = await searchCity(cityQuery.trim());
      if (location) {
        const weather = await fetchWeatherByLocation(location.latitude, location.longitude);
        setFormData(prev => ({
          ...prev,
          temperature: Math.round(weather.current.temperature),
          humidity: Math.round(weather.current.humidity),
          rainfall: Math.round(weather.current.rainfall),
        }));
      } else {
        setWeatherError('City not found.');
      }
    } catch (err) {
      setWeatherError('Failed to fetch weather for city.');
    } finally {
      setIsFetchingWeather(false);
    }
  };

  return (
    <div
      id="crop-prediction-form-card"
      className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl relative overflow-hidden max-w-5xl mx-auto"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#F1F5F9]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D3B2A] tracking-tight flex items-center gap-2">
            <span>🌱</span>
            <span>{t.cropForm.formTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            {t.cropForm.formSubtitle}
          </p>
        </div>

      </div>

      {/* Mobile Step Indicator Tabs (<sm screens) */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <button
            type="button"
            onClick={() => setMobileStep(1)}
            className={`flex-1 text-center py-1.5 text-xs font-bold border-b-2 transition-colors ${
              mobileStep === 1
                ? 'border-[#16834A] text-[#16834A]'
                : 'border-transparent text-[#66736B]'
            }`}
          >
            01 {t.cropForm.stepSoil}
          </button>
          <button
            type="button"
            onClick={() => setMobileStep(2)}
            className={`flex-1 text-center py-1.5 text-xs font-bold border-b-2 transition-colors ${
              mobileStep === 2
                ? 'border-[#16834A] text-[#16834A]'
                : 'border-transparent text-[#66736B]'
            }`}
          >
            02 {t.cropForm.stepClimate}
          </button>
          <button
            type="button"
            onClick={() => setMobileStep(3)}
            className={`flex-1 text-center py-1.5 text-xs font-bold border-b-2 transition-colors ${
              mobileStep === 3
                ? 'border-[#16834A] text-[#16834A]'
                : 'border-transparent text-[#66736B]'
            }`}
          >
            03 {t.cropForm.stepFarm}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Desktop or Mobile Step 1: Soil & Nutrients */}
        <div
          className={`${
            mobileStep === 1 ? 'block' : 'hidden sm:block'
          } space-y-4`}
        >
          <h3 className="text-sm font-bold text-[#17211B] uppercase tracking-wider hidden sm:block">
            01. {t.cropForm.stepSoil}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Soil Type */}
            <div className="space-y-2">
              <label
                htmlFor="field-soilType"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.soilType}
              </label>
              <select
                id="field-soilType"
                value={formData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Alluvial Soil">{t.cropForm.options.soilTypes.alluvial}</option>
                <option value="Black Cotton Soil">{t.cropForm.options.soilTypes.black}</option>
                <option value="Red & Loamy Soil">{t.cropForm.options.soilTypes.red}</option>
                <option value="Clay Soil">{t.cropForm.options.soilTypes.clay}</option>
                <option value="Sandy Loam">{t.cropForm.options.soilTypes.sandy}</option>
                <option value="Laterite Soil">{t.cropForm.options.soilTypes.laterite}</option>
              </select>
            </div>

            {/* 2. Soil pH */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="field-soilPh"
                  className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
                >
                  {t.cropForm.soilPh}
                </label>
                <span className="text-[11px] text-[#66736B]">{t.cropForm.soilPhHint}</span>
              </div>
              <div className="relative">
                <input
                  id="field-soilPh"
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="10.0"
                  value={formData.soilPh}
                  onChange={(e) => handleInputChange('soilPh', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
                />
                <span className="absolute right-4 top-3.5 text-xs text-[#66736B] font-mono">
                  pH
                </span>
              </div>
            </div>

            {/* Nitrogen */}
            <div className="space-y-2">
              <label htmlFor="field-nitrogen" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.cropForm.nitrogen}
              </label>
              <input
                id="field-nitrogen"
                type="number"
                min="0"
                max="200"
                value={formData.nitrogen}
                onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              />
            </div>

            {/* Phosphorus */}
            <div className="space-y-2">
              <label htmlFor="field-phosphorus" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.cropForm.phosphorus}
              </label>
              <input
                id="field-phosphorus"
                type="number"
                min="0"
                max="200"
                value={formData.phosphorus}
                onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              />
            </div>

            {/* Potassium */}
            <div className="space-y-2">
              <label htmlFor="field-potassium" className="block text-xs font-bold uppercase tracking-wider text-[#17211B]">
                {t.cropForm.potassium}
              </label>
              <input
                id="field-potassium"
                type="number"
                min="0"
                max="200"
                value={formData.potassium}
                onChange={(e) => handleInputChange('potassium', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Desktop or Mobile Step 2: Climate */}
        <div
          className={`${
            mobileStep === 2 ? 'block' : 'hidden sm:block'
          } space-y-4`}
        >
          {/* Section header + Weather Search Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#17211B] uppercase tracking-wider hidden sm:block">
              02. {t.cropForm.stepClimate}
            </h3>

            {/* Expanded Weather Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64 md:w-80">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleCitySearch(); } }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-sm font-semibold text-[#17211B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all placeholder:font-normal"
                />
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#66736B]" />
              </div>

              <button
                type="button"
                onClick={handleCitySearch}
                disabled={isFetchingWeather || !cityQuery.trim()}
                className="px-4 py-2.5 bg-[#17211B] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={handleFetchWeather}
                disabled={isFetchingWeather}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#16834A] bg-[#E5F6EC] hover:bg-[#D1F0DF] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-[#16834A]/10"
                title={t.cropForm.fetchWeather || 'Auto-fill from My Location'}
              >
                {isFetchingWeather ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>Use Current Location</span>
              </button>
            </div>
          </div>
          
          {weatherError && (
            <div className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              {weatherError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 3. Temperature */}
            <div className="space-y-2">
              <label
                htmlFor="field-temperature"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.temperature}
              </label>
              <div className="relative">
                <input
                  id="field-temperature"
                  type="number"
                  min="0"
                  max="55"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-[#66736B] font-semibold">
                  °C
                </span>
              </div>
            </div>

            {/* 4. Humidity */}
            <div className="space-y-2">
              <label
                htmlFor="field-humidity"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.humidity}
              </label>
              <div className="relative">
                <input
                  id="field-humidity"
                  type="number"
                  min="10"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-[#66736B] font-semibold">
                  %
                </span>
              </div>
            </div>

            {/* 5. Rainfall */}
            <div className="space-y-2">
              <label
                htmlFor="field-rainfall"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.rainfall}
              </label>
              <div className="relative">
                <input
                  id="field-rainfall"
                  type="number"
                  min="50"
                  max="3500"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-[#66736B] font-semibold">
                  mm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop or Mobile Step 3: Farm details */}
        <div
          className={`${
            mobileStep === 3 ? 'block' : 'hidden sm:block'
          } space-y-4`}
        >
          <h3 className="text-sm font-bold text-[#17211B] uppercase tracking-wider hidden sm:block">
            03. {t.cropForm.stepFarm}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 6. Water Availability */}
            <div className="space-y-2">
              <label
                htmlFor="field-waterAvailability"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.waterAvailability}
              </label>
              <select
                id="field-waterAvailability"
                value={formData.waterAvailability}
                onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="High (Canal / Tube well abundant)">
                  {t.cropForm.options.waterAvailability.high}
                </option>
                <option value="Moderate (Borewell / Drip irrigation)">
                  {t.cropForm.options.waterAvailability.moderate}
                </option>
                <option value="Low (Limited borewell supply)">
                  {t.cropForm.options.waterAvailability.low}
                </option>
                <option value="Rainfed only (Monsoon dependent)">
                  {t.cropForm.options.waterAvailability.rainfed}
                </option>
              </select>
            </div>

            {/* 7. Season */}
            <div className="space-y-2">
              <label
                htmlFor="field-season"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.season}
              </label>
              <select
                id="field-season"
                value={formData.season}
                onChange={(e) => handleInputChange('season', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="Kharif (Monsoon / June - Oct)">
                  {t.cropForm.options.seasons.kharif}
                </option>
                <option value="Rabi (Winter / Oct - March)">
                  {t.cropForm.options.seasons.rabi}
                </option>
                <option value="Zaid (Summer / March - June)">
                  {t.cropForm.options.seasons.zaid}
                </option>
                <option value="Perennial / All Season">
                  {t.cropForm.options.seasons.annual}
                </option>
              </select>
            </div>

            {/* 8. Previous Crop */}
            <div className="space-y-2">
              <label
                htmlFor="field-previousCrop"
                className="block text-xs font-bold uppercase tracking-wider text-[#17211B]"
              >
                {t.cropForm.previousCrop}
              </label>
              <select
                id="field-previousCrop"
                value={formData.previousCrop}
                onChange={(e) => handleInputChange('previousCrop', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all"
              >
                <option value="None / Fallow Field">
                  {t.cropForm.options.previousCrops.none}
                </option>
                <option value="Wheat">{t.cropForm.options.previousCrops.wheat}</option>
                <option value="Rice / Paddy">{t.cropForm.options.previousCrops.rice}</option>
                <option value="Cotton">{t.cropForm.options.previousCrops.cotton}</option>
                <option value="Pulses / Legumes (Nitrogen fixing)">
                  {t.cropForm.options.previousCrops.pulses}
                </option>
                <option value="Sugarcane">{t.cropForm.options.previousCrops.sugarcane}</option>
                <option value="Corn / Maize">{t.cropForm.options.previousCrops.maize}</option>
                <option value="Mustard">{t.cropForm.options.previousCrops.mustard}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Controls (<sm) */}
        <div className="sm:hidden flex items-center justify-between gap-3 pt-2">
          {mobileStep > 1 ? (
            <button
              type="button"
              onClick={() => setMobileStep((prev) => (prev - 1) as 1 | 2)}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#17211B] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.cropForm.prevStep}</span>
            </button>
          ) : <div />}

          {mobileStep < 3 ? (
            <button
              type="button"
              onClick={() => setMobileStep((prev) => (prev + 1) as 2 | 3)}
              className="px-5 py-2.5 rounded-xl bg-[#16834A] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#16834A]/20"
            >
              <span>{t.cropForm.nextStep}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Primary Submit Button */}
        <div className={`${mobileStep === 3 ? 'block' : 'hidden sm:block'} pt-4 border-t border-[#F1F5F9]`}>
          <button
            id="crop-predict-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#16834A] to-[#0D3B2A] text-white text-base sm:text-lg font-extrabold shadow-xl shadow-[#16834A]/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#16834A]/30"
          >
            <span className="text-xl">🌱</span>
            <span>{t.cropForm.submitBtn}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>
      </form>
    </div>
  );
};