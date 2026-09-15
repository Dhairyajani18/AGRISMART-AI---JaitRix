import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchWeatherByLocation, searchCity, WeatherForecast } from '../services/weatherApi';
import { calculateAgriculturalInsights } from '../services/weatherInsights';
import { MapPin, ThermometerSun, Droplets, CloudRain, Loader2, Calendar, Search } from 'lucide-react';

export const WeatherPrediction: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [cityQuery, setCityQuery] = useState('');
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const insights = forecast ? calculateAgriculturalInsights(forecast) : null;

  const insightLabel = (level: string) => t.weatherPage?.[`insight${level[0].toUpperCase()}${level.slice(1)}` as 'insightLow'] || level;

  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityQuery.trim()) return;

    setIsSearchingCity(true);
    setError(null);

    try {
      const location = await searchCity(cityQuery.trim());
      if (location) {
        const data = await fetchWeatherByLocation(location.latitude, location.longitude, `${location.name}, ${location.country}`);
        setForecast(data);
      } else {
        setError(t.weatherPage?.cityNotFound || 'City not found. Please try again.');
      }
    } catch (err) {
      setError(t.weatherPage?.cityNotFound || 'Failed to search for city weather.');
    } finally {
      setIsSearchingCity(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByLocation(latitude, longitude);
          setForecast(data);
        } catch (err) {
          setError('Failed to fetch weather data. Please try again later.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0D3B2A] tracking-tight mb-3">
          {t.weatherPage?.title || 'Farm Weather Forecast'}
        </h1>
        <p className="text-[#3A5746] text-base md:text-lg max-w-2xl mx-auto">
          {t.weatherPage?.subtitle || 'Real-time meteorological data and 7-day outlook for agricultural planning.'}
        </p>
      </div>

      {!forecast && (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E2E8F0] text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ThermometerSun className="w-8 h-8 text-[#16834A]" />
          </div>
          
          <form onSubmit={handleSearchCity} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder={t.weatherPage?.cityPlaceholder || 'Enter city name (e.g., Surat)'}
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] bg-[#F7FAF8] text-[#17211B] text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16834A]/20 focus:border-[#16834A] transition-all text-center"
            />
            <button
              type="submit"
              disabled={isSearchingCity || !cityQuery.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#17211B] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-black transition-colors disabled:opacity-70"
            >
              {isSearchingCity ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {t.weatherPage?.searchCity || 'Search'}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E2E8F0]"></div>
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{t.weatherPage?.or || 'OR'}</span>
            <div className="flex-1 h-px bg-[#E2E8F0]"></div>
          </div>

          <button
            onClick={handleGetLocation}
            disabled={loading || isSearchingCity}
            className="w-full flex items-center justify-center gap-2 bg-[#16834A] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#116639] transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.weatherPage?.locating || 'Locating...'}
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                {t.weatherPage?.getLocation || 'Get My Location Weather'}
              </>
            )}
          </button>
          {error && <p className="text-red-600 mt-4 text-sm font-medium">{error}</p>}
        </div>
      )}

      {forecast && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          {/* Current Conditions */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <h2 className="text-lg font-bold text-[#17211B] flex items-center gap-2">
                <ThermometerSun className="w-5 h-5 text-[#16834A]" />
                {t.weatherPage?.current || 'Current Conditions'}
              </h2>
              {forecast.locationName && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7FAF8] border border-[#E2E8F0] text-sm font-semibold text-[#3A5746]">
                  <MapPin className="w-4 h-4 text-[#16834A]" />
                  {forecast.locationName}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F7FAF8] p-5 rounded-2xl border border-[#E2E8F0]">
                <div className="text-sm font-bold text-[#3A5746] uppercase tracking-wider mb-1">
                  {t.weatherPage?.temp || 'Temperature'}
                </div>
                <div className="text-3xl font-extrabold text-[#0D3B2A] flex items-end gap-1">
                  {forecast.current.temperature.toFixed(1)}<span className="text-lg text-[#527763] mb-1">°C</span>
                </div>
              </div>
              <div className="bg-[#F7FAF8] p-5 rounded-2xl border border-[#E2E8F0]">
                <div className="text-sm font-bold text-[#3A5746] uppercase tracking-wider mb-1">
                  {t.weatherPage?.humidity || 'Humidity'}
                </div>
                <div className="text-3xl font-extrabold text-[#0D3B2A] flex items-end gap-1">
                  {forecast.current.humidity.toFixed(0)}<span className="text-lg text-[#527763] mb-1">%</span>
                </div>
              </div>
              <div className="bg-[#F7FAF8] p-5 rounded-2xl border border-[#E2E8F0]">
                <div className="text-sm font-bold text-[#3A5746] uppercase tracking-wider mb-1">
                  {t.weatherPage?.rain || 'Precipitation'}
                </div>
                <div className="text-3xl font-extrabold text-[#0D3B2A] flex items-end gap-1">
                  {forecast.current.rainfall.toFixed(1)}<span className="text-lg text-[#527763] mb-1">mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#17211B] mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#16834A]" />
              {t.weatherPage?.forecast || '7-Day Forecast'}
            </h2>
            <div className="space-y-3">
              {forecast.daily.time.map((time, index) => {
                const date = new Date(time);
                const dayName = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                return (
                  <div key={time} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F7FAF8] rounded-2xl border border-[#E2E8F0]/50 gap-4">
                    <div className="font-bold text-[#17211B] w-32">{dayName}</div>
                    
                    <div className="flex-1 flex flex-wrap gap-4 md:gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-[#0D3B2A]">
                          {t.weatherPage?.high || 'High'}: {forecast.daily.temperature_2m_max[index].toFixed(1)}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-[#3A5746]">
                          {t.weatherPage?.low || 'Low'}: {forecast.daily.temperature_2m_min[index].toFixed(1)}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-[#3A5746]">
                          {forecast.daily.precipitation_sum[index].toFixed(1)} mm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {insights && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E2E8F0]">
              <h2 className="text-lg font-bold text-[#17211B] mb-2 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-[#16834A]" />
                {t.weatherPage?.agriculturalInsights || 'Agricultural Weather Insights'}
              </h2>
              <p className="text-sm text-[#527763] mb-6">{t.weatherPage?.insightNotice || 'Forecast-based decision support, not a crop-specific irrigation schedule.'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  [t.weatherPage?.rainfallRisk || 'Rainfall Risk', insightLabel(insights.rainfall.level), (t.weatherPage?.rainfallMessage || '{total} mm of rain is expected across the forecast.').replace('{total}', insights.rainfall.total.toFixed(1))],
                  [t.weatherPage?.heatRisk || 'Heat Risk', insightLabel(insights.heat.level), (t.weatherPage?.heatMessage || 'Temperatures may reach {temperature}°C during the forecast.').replace('{temperature}', insights.heat.maximum.toFixed(1))],
                  ...(insights.humidity ? [[t.weatherPage?.humidityRisk || 'Humidity Risk', insightLabel(insights.humidity.level), (t.weatherPage?.humidityMessage || 'Average forecast humidity is {humidity}%.').replace('{humidity}', insights.humidity.average.toFixed(0))]] : []),
                  [t.weatherPage?.farmActivity || 'Farm Activity', insightLabel(insights.farmActivity.level), t.weatherPage?.[`farm${insights.farmActivity.level[0].toUpperCase()}${insights.farmActivity.level.slice(1)}` as 'farmFavorable'] || 'Conditions are based on the full forecast.'],
                  [t.weatherPage?.irrigationGuidance || 'Irrigation Guidance', insightLabel(insights.irrigation.level), t.weatherPage?.[`irrigation${insights.irrigation.level[0].toUpperCase()}${insights.irrigation.level.slice(1)}` as 'irrigationReduce'] || 'Use this as a forecast-based indicator.'],
                ].map(([title, level, message]) => (
                  <div key={String(title)} className="rounded-2xl border border-[#E2E8F0] bg-[#F7FAF8] p-4">
                    <div className="text-sm font-bold uppercase tracking-wider text-[#3A5746]">{title}</div>
                    <div className="mt-1 text-xl font-extrabold text-[#0D3B2A]">{level}</div>
                    <p className="mt-1 text-sm text-[#527763]">{message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
