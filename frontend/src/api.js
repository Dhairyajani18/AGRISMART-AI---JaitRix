const BASE_URL = "http://127.0.0.1:8000/api";

export async function predictDisease(imageFile, farmData) {
  const fd = new FormData();
  fd.append("image", imageFile);
  Object.entries(farmData).forEach(([k, v]) => fd.append(k, v));

  const res = await fetch(`${BASE_URL}/predict/`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Disease prediction failed");
  return data;
}

export async function recommendCrop(cropData) {
  const res = await fetch(`${BASE_URL}/recommend-crop/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cropData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Crop recommendation failed");
  return data;
}

export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(`${BASE_URL}/recommend-crop/weather/?lat=${lat}&lon=${lon}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch weather data");
  return data;
} //Returns: { temperature, humidity, rainfall, city, lat, lon }

export async function fetchWeatherByCity(city) {
  const res = await fetch(`${BASE_URL}/recommend-crop/weather/?city=${encodeURIComponent(city)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch weather data");
  return data;
}


export async function fetchSoilByCoords(lat, lon) {
  const res = await fetch(`${BASE_URL}/recommend-crop/soil/?lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return data;
} //Returns: { success, soil: { ph, nitrogen } }
