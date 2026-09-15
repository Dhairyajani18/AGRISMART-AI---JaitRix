export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  relative_humidity_2m_mean?: number[];
  weather_code?: number[];
}

export interface WeatherForecast {
  current: WeatherData;
  daily: DailyWeather;
  locationName?: string;
}

export interface LocationSearchResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export const searchCity = async (query: string): Promise<LocationSearchResult | null> => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=1&format=json`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch city data');
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding API Error:', error);
    return null;
  }
};

export const fetchWeatherByLocation = async (lat: number, lon: number, locationName?: string): Promise<WeatherForecast> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return {
      locationName,
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        rainfall: data.current.precipitation,
      },
      daily: {
        time: data.daily.time,
        temperature_2m_max: data.daily.temperature_2m_max,
        temperature_2m_min: data.daily.temperature_2m_min,
        precipitation_sum: data.daily.precipitation_sum,
        weather_code: data.daily.weather_code,
        relative_humidity_2m_mean: data.daily.time?.map((day: string) => {
          const values = data.hourly?.time?.reduce((result: number[], time: string, index: number) => {
            if (time.startsWith(day) && Number.isFinite(data.hourly.relative_humidity_2m?.[index])) result.push(data.hourly.relative_humidity_2m[index]);
            return result;
          }, []);
          return values?.length ? values.reduce((sum: number, value: number) => sum + value, 0) / values.length : NaN;
        }),
      },
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};
