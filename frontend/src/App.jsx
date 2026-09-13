import { useState } from "react";
import "./App.css";
import {
  predictDisease,
  recommendCrop,
  fetchWeatherByCoords,
  fetchWeatherByCity,
  fetchSoilByCoords,
} from "./api";

// Simple inline SVG icons (no emoji, no library)
const Icon = {
  alert: (
    <svg className="banner-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  upload: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  ),
};

function Banner({ message, type = "error" }) {
  if (!message) return null;
  return (
    <div className={`banner banner-${type}`}>
      {Icon.alert}
      <span>{message}</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("disease");

  // --- Disease Detection ---
  const [file,    setFile]    = useState(null);
  const [res,     setRes]     = useState({ data: null, load: false, err: "" });
  const [farm,    setFarm]    = useState({ ph: "", soil_moisture: "", water_availability: "", previous_crop: "", growth_stage: "", soil_type: "", location: "" });

  // --- Crop Recommendation ---
  const [cropRes,  setCropRes]  = useState({ data: null, load: false, err: "" });
  const [cropData, setCropData] = useState({ SOIL: "", SEASON: "", WATER_SOURCE: "", SOIL_PH: "", TEMP: "", RELATIVE_HUMIDITY: "", N: "", P: "", K: "" });
  const [rainfall,  setRainfall]  = useState(null);
  const [cityName,  setCityName]  = useState("");
  const [locLoad,   setLocLoad]   = useState(false);
  const [locErr,    setLocErr]    = useState("");

  // --- Handlers ---
  const handleImg      = (e) => setFile(e.target.files[0] || null);
  const handleFarm     = (e) => setFarm({ ...farm, [e.target.name]: e.target.value });
  const handleCropData = (e) => setCropData({ ...cropData, [e.target.name]: e.target.value });

  // Apply weather + soil results into form state
  const applyData = (weather, soil) => {
    const soilUpdates = {};
    if (soil?.success) {
      if (soil.soil.ph       != null) soilUpdates.SOIL_PH = soil.soil.ph;
      if (soil.soil.nitrogen != null) soilUpdates.N       = soil.soil.nitrogen;
    }
    setCropData(prev => ({
      ...prev,
      TEMP:              weather.temperature ?? "",
      RELATIVE_HUMIDITY: weather.humidity    ?? "",
      ...soilUpdates,
    }));
    setRainfall(weather.rainfall > 0 ? weather.rainfall : null);
    if (weather.city) setCityName(weather.city);
  };

  // Use GPS location
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocErr("Geolocation is not supported by this browser.");
      return;
    }
    setLocErr("");
    setLocLoad(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const [weather, soil] = await Promise.all([
            fetchWeatherByCoords(latitude, longitude),
            fetchSoilByCoords(latitude, longitude),
          ]);
          applyData(weather, soil);
        } catch (err) {
          setLocErr(err.message);
        } finally {
          setLocLoad(false);
        }
      },
      (err) => {
        setLocErr("Location access denied. Please allow location or type a city name.");
        setLocLoad(false);
      }
    );
  };

  // Fetch by city name
  const getWeatherByCity = async () => {
    if (!cityName.trim()) {
      setLocErr("Please enter a city name.");
      return;
    }
    setLocErr("");
    setLocLoad(true);
    try {
      const weather = await fetchWeatherByCity(cityName);
      let soil = null;
      if (weather.lat != null && weather.lon != null) {
        soil = await fetchSoilByCoords(weather.lat, weather.lon).catch(() => null);
      }
      applyData(weather, soil);
    } catch (err) {
      setLocErr(err.message);
    } finally {
      setLocLoad(false);
    }
  };

  // Disease prediction
  const predict = async () => {
    if (!file) { setRes(p => ({ ...p, err: "Please select a leaf image before analyzing." })); return; }
    setRes({ data: null, load: true, err: "" });
    try {
      const data = await predictDisease(file, farm);
      setRes({ data, load: false, err: "" });
    } catch (err) {
      setRes({ data: null, load: false, err: err.message });
    }
  };

  // Crop recommendation
  const recommend = async () => {
    setCropRes({ data: null, load: true, err: "" });
    try {
      const data = await recommendCrop(cropData);
      setCropRes({ data, load: false, err: "" });
    } catch (err) {
      setCropRes({ data: null, load: false, err: err.message });
    }
  };

  // --- Field definitions ---
  const fields = [
    { n: "ph",                l: "Soil pH",       t: "number", p: { min: 0, max: 14, step: 0.1 } },
    { n: "soil_moisture",     l: "Moisture (%)",  t: "number", p: { min: 0, max: 100 } },
    { n: "previous_crop",     l: "Previous Crop", t: "text" },
    { n: "location",          l: "Location",      t: "text" },
    { n: "water_availability",l: "Water",         opts: ["Low", "Medium", "High"] },
    { n: "growth_stage",      l: "Stage",         opts: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
    { n: "soil_type",         l: "Soil Type",     opts: ["Alluvial", "Black", "Red", "Laterite", "Loamy", "Sandy", "Clay", "Silty"] },
  ];

  const cropFields = [
    { n: "SOIL",             l: "Soil Type",       opts: ["Alluvial soil", "Loamy soil", "Clay soil", "well-drained soil", "Red soil", "Black Soil", "Sandy soil", "Laterite soil"] },
    { n: "SEASON",           l: "Season",          opts: ["kharif", "rabi", "Zaid"] },
    { n: "WATER_SOURCE",     l: "Water Source",    opts: ["irrigated", "rainfed"] },
    { n: "SOIL_PH",          l: "Soil pH",         t: "number", p: { step: 0.1 } },
    { n: "TEMP",             l: "Temperature (C)", t: "number", p: { step: 0.1 } },
    { n: "RELATIVE_HUMIDITY",l: "Humidity (%)",    t: "number", p: { step: 0.1 } },
    { n: "N",                l: "Nitrogen (N)",    t: "number", p: { step: 0.1 } },
    { n: "P",                l: "Phosphorus (P)",  t: "number", p: { step: 0.1 } },
    { n: "K",                l: "Potassium (K)",   t: "number", p: { step: 0.1 } },
  ];

  const FormField = ({ f, value, onChange }) => (
    <div className="field">
      <label>{f.l}</label>
      {f.opts ? (
        <select name={f.n} onChange={onChange} value={value}>
          <option value="">Select {f.l}</option>
          {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={f.t} name={f.n} onChange={onChange} value={value} placeholder={`Enter ${f.l}`} {...f.p} />
      )}
    </div>
  );

  return (
    <div className="app">
      <header>
        <div>
          <h1>AgriSmart AI</h1>
          <p>AI-powered crop health and farm analysis</p>
        </div>
        <span className="badge">SIH 2026</span>
      </header>

      <div className="tabs">
        <button className={tab === "disease" ? "tab active" : "tab"} onClick={() => setTab("disease")}>Disease Detection</button>
        <button className={tab === "crop"    ? "tab active" : "tab"} onClick={() => setTab("crop")}>Crop Recommendation</button>
      </div>

      <main>

        {/* ── Disease Detection ──────────────────────────────── */}
        {tab === "disease" && (
          <>
            <div className="card">
              <div className="card-title">
                <span className="step">1</span>
                <h2>Upload Leaf Image</h2>
              </div>
              <label className="upload">
                {file
                  ? <img src={URL.createObjectURL(file)} alt="Preview" />
                  : <>
                      {Icon.upload}
                      <span>Click to choose an image</span>
                      <small>JPG, PNG, WEBP supported</small>
                    </>
                }
                <input type="file" accept="image/*" onChange={handleImg} hidden />
              </label>
            </div>

            <div className="card">
              <div className="card-title">
                <span className="step">2</span>
                <h2>Farm Information</h2>
              </div>
              <div className="grid">
                {fields.map(f => <FormField key={f.n} f={f} value={farm[f.n]} onChange={handleFarm} />)}
              </div>
            </div>

            <button className="btn" onClick={predict} disabled={res.load}>
              {res.load ? "Analyzing..." : "Analyze Farm"}
            </button>

            <Banner message={res.err} type="error" />

            {res.data && (
              <div className="card">
                <div className="result-header">
                  <div>
                    <div className="result-label">Analysis Complete</div>
                    <div className="result-title">{res.data.disease || res.data.class}</div>
                  </div>
                  <div className="confidence-badge">
                    <div className="confidence-value">{(res.data.confidence * 100).toFixed(1)}%</div>
                    <small className="confidence-label">Confidence</small>
                  </div>
                </div>

                {res.data.description && <p className="result-desc">{res.data.description}</p>}

                <div className="grid">
                  {res.data.symptoms?.length > 0 && (
                    <div className="info-box">
                      <h3>Symptoms</h3>
                      <ul>{res.data.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                  )}
                  {res.data.precautions?.length > 0 && (
                    <div className="info-box">
                      <h3>Precautions</h3>
                      <ul>{res.data.precautions.map((p, i) => <li key={i}>{p}</li>)}</ul>
                    </div>
                  )}
                </div>

                <div className="summary-section">
                  <h3>Farm Summary</h3>
                  <div className="summary-grid">
                    {Object.entries(farm).map(([k, v]) => (
                      <div key={k}>
                        <small>{k.replace(/_/g, ' ')}</small>
                        <strong>{v || "—"}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Crop Recommendation ────────────────────────────── */}
        {tab === "crop" && (
          <>
            <div className="card">
              <div className="card-title">
                <span className="step">1</span>
                <h2>Soil &amp; Environment Data</h2>
              </div>

              {/* Location / Weather fetch */}
              <div className="location-bar">
                <label>Fetch weather and soil data automatically</label>
                <div className="row">
                  <input
                    type="text"
                    placeholder="City name, e.g. Ahmedabad"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && getWeatherByCity()}
                  />
                  <button className="btn btn-sm" onClick={getWeatherByCity} disabled={locLoad}>
                    {locLoad ? "Fetching..." : "Get Weather"}
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={useMyLocation} disabled={locLoad}>
                    {locLoad ? "Locating..." : "Use My Location"}
                  </button>
                </div>
              </div>

              <Banner message={locErr} type="error" />

              {/* Rainfall display (only when > 0) */}
              {rainfall !== null && rainfall > 0 && (
                <div className="rainfall-row">
                  <span>Rainfall (last 1h)</span>
                  <input
                    type="number" step="0.1" value={rainfall}
                    onChange={(e) => setRainfall(parseFloat(e.target.value) || 0)}
                  />
                  <span>mm</span>
                </div>
              )}

              {/* Crop form */}
              <div className="grid">
                {cropFields.map(f => <FormField key={f.n} f={f} value={cropData[f.n]} onChange={handleCropData} />)}
              </div>
            </div>

            <button className="btn" onClick={recommend} disabled={cropRes.load}>
              {cropRes.load ? "Getting Recommendations..." : "Recommend Crops"}
            </button>

            <Banner message={cropRes.err} type="error" />

            {cropRes.data?.recommendations && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: '16px' }}>
                  <span className="step">2</span>
                  <h2>Top Crop Recommendations</h2>
                </div>
                <div className="crop-results">
                  {cropRes.data.recommendations.map((rec, i) => (
                    <div className={`crop-card rank-${i + 1}`} key={i}>
                      <div className="crop-rank">{i === 0 ? "Best Match" : `Option ${i + 1}`}</div>
                      <div className="crop-name">{rec.crop}</div>
                      <div className="crop-prob">
                        {rec.confidence.toFixed(1)}%
                        <small>model probability</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}