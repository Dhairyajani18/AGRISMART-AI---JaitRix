import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Sprout, ScanEye, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FeatureCard } from '../components/FeatureCard';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div id="home-page-container" className="space-y-12 sm:space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 overflow-hidden">
        {/* Soft background ambient gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#E5F6EC]/60 via-transparent to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5F6EC] border border-[#16834A]/25 text-[#16834A] text-xs sm:text-sm font-black tracking-wider uppercase shadow-xs">
                <Sparkles className="w-4 h-4 text-[#16834A]" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0D3B2A] tracking-tight leading-[1.08]">
                {t.hero.headline}
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-[#66736B] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {t.hero.subtext}
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/disease-detection"
                  id="hero-cta-disease"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#16834A] text-white text-base font-extrabold shadow-xl shadow-[#16834A]/25 hover:bg-[#0D3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="text-xl">🔬</span>
                  <span>{t.hero.ctaDisease}</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
                <Link
                  to="/crop-prediction"
                  id="hero-cta-crop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-[#16834A]/30 text-[#0D3B2A] text-base font-extrabold shadow-sm hover:bg-[#E5F6EC] hover:border-[#16834A] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="text-xl">🌱</span>
                  <span>{t.hero.ctaCrop}</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
                <Link
                  to="/weather-prediction"
                  id="hero-cta-weather"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-[#16834A]/30 text-[#0D3B2A] text-base font-extrabold shadow-sm hover:bg-[#E5F6EC] hover:border-[#16834A] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="text-xl">☁️</span>
                  <span>{t.hero.ctaWeather}</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </div>

              {/* Farmer Trust Proof points */}
              <div className="pt-6 border-t border-[#E2E8F0]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-semibold text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16834A]" />
                  <span>{t.hero.featureBadge1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16834A]" />
                  <span>{t.hero.featureBadge2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16834A]" />
                  <span>{t.hero.featureBadge3}</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: High-Quality Agricultural AI Canvas */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#16834A] via-[#22C55E] to-[#10B981] opacity-30 blur-lg animate-pulse" />

                {/* Visual Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#0D3B2A] aspect-4/5 sm:aspect-square">
                  <img
                    src="/hero-agri-ai.jpg"
                    alt="AgriSmart AI Smart Farming Diagnostics"
                    onError={(e) => {
                      // Fallback to high-quality high-availability agricultural visual
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = '1';
                        target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop';
                      } else if (target.dataset.triedFallback === '1') {
                        target.dataset.triedFallback = '2';
                        target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Soft gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B2A] via-transparent to-black/20 opacity-80 pointer-events-none" />

                  {/* Simulated AI Leaf Scanning Grid Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white space-y-1 shadow-lg">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                          <span>{t.heroOverlay?.aiVisionBadge || 'AI AGRI VISION 2.0'}</span>
                        </div>
                        <p className="text-[11px] text-white/90 font-mono">
                          {t.heroOverlay?.spectrometry || 'Spectrometry: 98.6% Accuracy'}
                        </p>
                      </div>

                      <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                        <ScanEye className="w-6 h-6 text-[#22C55E]" />
                      </div>
                    </div>

                    {/* Bottom AI Diagnostic Tag */}
                    <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[#0D3B2A] tracking-wider">
                          {t.heroOverlay?.targetSpecimen || 'Target Specimen'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E5F6EC] text-[#16834A] border border-[#16834A]/20">
                          {t.heroOverlay?.verifiedHealthy || '✓ Verified Healthy'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#17211B]">Solanum Lycopersicum</span>
                        <span className="font-mono font-black text-[#16834A]">
                          {t.heroOverlay?.healthIndex || '96% Health Index'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Badge 1 */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3.5 p-4 rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-[#E5F6EC] flex items-center justify-center text-[#16834A] text-2xl font-bold">
                    🌱
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#17211B]">
                      {t.heroOverlay?.optimalSeason || 'Optimal Season Match'}
                    </div>
                    <div className="text-[11px] text-[#66736B] font-medium">
                      {t.heroOverlay?.rotationMatrix || 'Kharif / Rabi Rotation Matrix'}
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Badge 2 */}
                <div className="absolute -top-5 -right-5 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0D3B2A] text-white shadow-xl border border-white/20 text-xs font-bold transform rotate-2 hover:rotate-0 transition-transform">
                  <Sparkles className="w-4 h-4 text-[#22C55E]" />
                  <span>{t.heroOverlay?.realtimeInference || 'Real-time AI Inference'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#16834A] bg-[#E5F6EC] px-3.5 py-1 rounded-full">
            {t.cards.coreCapabilities || 'Core AI Capabilities'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D3B2A] tracking-tight mt-3">
            {t.cards.toolsHeading || 'Intelligent Tools Built for Farmers'}
          </h2>
          <p className="text-sm sm:text-base text-[#66736B] mt-2">
            {t.cards.toolsSubheading || 'No complex dashboards or bloated menus. Direct, immediate agricultural assistance.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Disease Detection */}
          <FeatureCard
            id="feature-card-disease"
            to="/disease-detection"
            icon="🔬"
            badgeText={t.cards.diseaseBadge || 'Computer Vision Engine'}
            title={t.cards.diseaseTitle}
            description={t.cards.diseaseDesc}
            buttonText={t.cards.diseaseBtn}
            highlights={[
              t.cards.diseaseHigh1 || 'Fast leaf scanning with real-time lesion analysis',
              t.cards.diseaseHigh2 || 'Detects early blight, late blight, leaf molds, and healthy leaves',
              t.cards.diseaseHigh3 || 'Farmer-friendly treatment guidelines and preventive measures',
            ]}
          />

          {/* Feature 2: Crop Prediction */}
          <FeatureCard
            id="feature-card-crop"
            to="/crop-prediction"
            icon="🌱"
            badgeText={t.cards.cropBadge || 'Soil & Weather Model'}
            title={t.cards.cropTitle}
            description={t.cards.cropDesc}
            buttonText={t.cards.cropBtn}
            highlights={[
              t.cards.cropHigh1 || 'Matches soil pH, rainfall, temperature and seasonal data',
              t.cards.cropHigh2 || 'Ranks top alternative crops with suitability percentages',
              t.cards.cropHigh3 || 'Provides specific fertilizer, soil preparation and duration tips',
            ]}
          />

          {/* Feature 3: Weather Prediction */}
          <FeatureCard
            id="feature-card-weather"
            to="/weather-prediction"
            icon="☁️"
            badgeText={t.cards.weatherBadge || 'Real-time Meteorological Data'}
            title={t.cards.weatherTitle}
            description={t.cards.weatherDesc}
            buttonText={t.cards.weatherBtn}
            highlights={[
              t.cards.weatherHigh1 || 'Live location-based weather tracking',
              t.cards.weatherHigh2 || '7-Day forecast for temperature, rainfall, and humidity',
              t.cards.weatherHigh3 || 'Optimize planting and harvesting times based on precise data',
            ]}
          />
        </div>
      </section>

      {/* Quick Farmer Guidance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0D3B2A] to-[#16834A] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Available in English, हिन्दी, and ગુજરાતી
            </h3>
            <p className="text-sm text-[#E5F6EC]/90 max-w-xl">
              Switch languages at any time from the top navigation bar. Every form, recommendation,
              and advisory is fully translated.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/crop-prediction"
              className="px-6 py-3 rounded-full bg-white text-[#0D3B2A] text-sm font-bold shadow-md hover:bg-[#E5F6EC] transition-all"
            >
              Start Crop Analysis →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
