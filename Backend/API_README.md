# AgriSmart AI — API Reference

Backend: **Django REST Framework** · Base URL: `http://127.0.0.1:8000/api/`

---

## 1. Disease Detection

### `POST /api/predict/`

Accepts a leaf image and returns the predicted disease with precautions.

**Request** — `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `image` | File | ✅ |

**Response**
```json
{
  "class": "Tomato___Early_blight",
  "crop": "Tomato",
  "disease": "Early Blight",
  "confidence": 0.91,
  "description": "...",
  "symptoms": ["..."],
  "precautions": ["..."],
  "severity": "Moderate"
}
```

---

## 2. Crop Recommendation

### `POST /api/recommend-crop/`

Accepts soil and environment data and returns the top 3 crop recommendations using `crop_model.joblib`.

**Request** — `application/json`

| Field | Type | Source |
|-------|------|--------|
| `SOIL` | string | User selects from dropdown |
| `SEASON` | string | User selects from dropdown |
| `WATER_SOURCE` | string | User selects from dropdown |
| `SOIL_PH` | float | Auto-filled by Soil API or user input |
| `TEMP` | float | Auto-filled by Weather API or user input |
| `RELATIVE_HUMIDITY` | float | Auto-filled by Weather API or user input |
| `N` | float | Auto-filled by Soil API or user input |
| `P` | float | User input (SoilGrids does not provide P) |
| `K` | float | User input (SoilGrids does not provide K) |

**Example Request**
```json
{
  "SOIL": "Alluvial soil",
  "SEASON": "kharif",
  "WATER_SOURCE": "irrigated",
  "SOIL_PH": 7.1,
  "TEMP": 31.5,
  "RELATIVE_HUMIDITY": 68.0,
  "N": 1.17,
  "P": 40,
  "K": 45
}
```

**Response**
```json
{
  "recommendations": [
    { "crop": "gingely",      "confidence": 70.0 },
    { "crop": "pearl millet", "confidence": 11.0 },
    { "crop": "ragi",         "confidence": 9.5  }
  ]
}
```

> `confidence` is the model's predicted probability × 100. It is not a guaranteed real-world accuracy.

---

## 3. Weather Data

### `GET /api/recommend-crop/weather/`

Fetches current weather from the **OpenWeather API** for a city or coordinate.

**Query Parameters** — one of:

| Param | Type | Example |
|-------|------|---------|
| `city` | string | `?city=Ahmedabad` |
| `lat` + `lon` | float | `?lat=23.02&lon=72.57` |

**Response**
```json
{
  "temperature": 31.5,
  "humidity": 68,
  "rainfall": 0,
  "city": "Ahmedabad",
  "lat": 23.0225,
  "lon": 72.5714
}
```

| Field | Maps to model field | Notes |
|-------|---------------------|-------|
| `temperature` | `TEMP` | °C |
| `humidity` | `RELATIVE_HUMIDITY` | % |
| `rainfall` | — | Display only, not sent to model |
| `lat`, `lon` | — | Used by frontend to call Soil API |

**Setup** — add to `Backend/.env`:
```
OPENWEATHER_API_KEY=your_key_here
```

---

## 4. Soil Data

### `GET /api/recommend-crop/soil/`

Fetches soil properties from **ISRIC SoilGrids WCS** (no API key required).

**Query Parameters**

| Param | Type | Example |
|-------|------|---------|
| `lat` | float | `?lat=23.02&lon=72.57` |
| `lon` | float | |

**Response**
```json
{
  "success": true,
  "location": { "latitude": 23.0225, "longitude": 72.5714 },
  "soil": {
    "ph": 7.1,
    "nitrogen": 1.17
  }
}
```

| Field | Maps to model field | Unit | Scale applied |
|-------|---------------------|------|---------------|
| `ph` | `SOIL_PH` | pH (H₂O) | raw ÷ 10 |
| `nitrogen` | `N` | g/kg | raw ÷ 100 |

**How it works:**
1. Builds a `0.02° × 0.02°` bounding box (~2 km) around the coordinate
2. Calls the SoilGrids WCS `GetCoverage` endpoint (WCS 2.0.1, EPSG:4326)
3. Receives a small GeoTIFF, parsed in-memory with **Pillow + NumPy** (no GDAL)
4. Extracts the most frequent valid pixel value (mode) and applies the scale factor

**Why P and K are not included:**
SoilGrids does not provide phosphorus or potassium data globally. These must be entered manually.

**Why SOIL type is not auto-filled:**
SoilGrids uses WRB classification (e.g. *Vertisol*, *Cambisol*). The training dataset uses local Indian labels (*Alluvial soil*, *Black Soil*, etc.). Automatic mapping would produce incorrect predictions.

**Coverage used:** `0–5 cm depth, mean estimate`

---

### `GET /api/recommend-crop/soil/test/`

Health check for the soil API.

```json
{ "success": true, "message": "Soil API is working" }
```

---

## 5. Frontend Data Flow

```
User opens Crop Recommendation tab
        ↓
Types city name OR clicks "Use My Location"
        ↓
Frontend → GET /api/recommend-crop/weather/
        ↓
Returns TEMP, RELATIVE_HUMIDITY, city, lat, lon
        ↓
Frontend → GET /api/recommend-crop/soil/?lat=...&lon=...
        ↓
Returns SOIL_PH, N
        ↓
All fetched fields auto-fill the form (user can edit)
        ↓
User fills SOIL, SEASON, WATER_SOURCE, P, K manually
        ↓
Click "Recommend Crops"
        ↓
Frontend → POST /api/recommend-crop/
        ↓
Returns top 3 crop recommendations
```

---

## 6. Error Responses

All endpoints return errors in this format:
```json
{ "error": "Human-readable error message" }
```
or for soil API:
```json
{ "success": false, "error": "Human-readable error message" }
```

Common errors:

| Scenario | HTTP Status |
|----------|-------------|
| Missing required fields | 400 |
| Invalid lat/lon range | 400 |
| OpenWeather city not found | 400 |
| OpenWeather API key missing | 500 |
| SoilGrids property unavailable | 200 with `null` value |
| No image uploaded | 400 |
| Model not loaded | 500 |
