import type { WeatherForecast } from './weatherApi';

export type RiskLevel = 'low' | 'moderate' | 'high';
export type FarmActivityLevel = 'favorable' | 'caution' | 'unfavorable';
export type IrrigationLevel = 'reduce' | 'normal' | 'monitor';

export interface AgriculturalInsights {
  rainfall: { level: RiskLevel; total: number };
  heat: { level: RiskLevel; maximum: number };
  humidity?: { level: RiskLevel; average: number };
  farmActivity: { level: FarmActivityLevel };
  irrigation: { level: IrrigationLevel };
}

// These transparent, forecast-wide thresholds are intentionally kept together
// so they can be reviewed or tuned without changing UI code.
const RAINFALL_MODERATE_MM = 10;
const RAINFALL_HIGH_MM = 35;
const HEAT_MODERATE_C = 32;
const HEAT_HIGH_C = 38;
const HUMIDITY_MODERATE_PERCENT = 60;
const HUMIDITY_HIGH_PERCENT = 80;
const HEAVY_RAIN_UNFAVORABLE_MM = 60;

const levelFor = (value: number, moderate: number, high: number): RiskLevel =>
  value >= high ? 'high' : value >= moderate ? 'moderate' : 'low';

export const calculateAgriculturalInsights = (forecast: WeatherForecast): AgriculturalInsights | null => {
  const highs = forecast.daily.temperature_2m_max.filter(Number.isFinite);
  const rainfall = forecast.daily.precipitation_sum.filter(Number.isFinite);
  if (!highs.length || !rainfall.length) return null;

  const totalRainfall = rainfall.reduce((total, value) => total + value, 0);
  const maximumTemperature = Math.max(...highs);
  const rainfallLevel = levelFor(totalRainfall, RAINFALL_MODERATE_MM, RAINFALL_HIGH_MM);
  const heatLevel = levelFor(maximumTemperature, HEAT_MODERATE_C, HEAT_HIGH_C);
  const humidityValues = forecast.daily.relative_humidity_2m_mean?.filter(Number.isFinite) ?? [];
  const averageHumidity = humidityValues.length
    ? humidityValues.reduce((total, value) => total + value, 0) / humidityValues.length
    : undefined;
  const humidity = averageHumidity === undefined
    ? undefined
    : { level: levelFor(averageHumidity, HUMIDITY_MODERATE_PERCENT, HUMIDITY_HIGH_PERCENT), average: averageHumidity };
  const hasStorm = forecast.daily.weather_code?.some((code) => code >= 95) ?? false;

  const farmActivity: FarmActivityLevel =
    hasStorm || totalRainfall >= HEAVY_RAIN_UNFAVORABLE_MM || (heatLevel === 'high' && humidity?.level === 'high')
      ? 'unfavorable'
      : rainfallLevel !== 'low' || heatLevel !== 'low' || humidity?.level === 'high'
        ? 'caution'
        : 'favorable';

  return {
    rainfall: { level: rainfallLevel, total: totalRainfall },
    heat: { level: heatLevel, maximum: maximumTemperature },
    humidity,
    farmActivity: { level: farmActivity },
    irrigation: {
      level: rainfallLevel === 'high' ? 'reduce' : rainfallLevel === 'low' && heatLevel !== 'low' ? 'monitor' : 'normal',
    },
  };
};
