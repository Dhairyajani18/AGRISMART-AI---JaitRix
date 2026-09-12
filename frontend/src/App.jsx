import { useState } from "react";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState({ data: null, load: false, err: "" });
  const [farm, setFarm] = useState({ ph: "", soil_moisture: "", water_availability: "", previous_crop: "", growth_stage: "", soil_type: "", location: "" });

  const handleImg = (e) => setFile(e.target.files[0] || null);
  const handleFarm = (e) => setFarm({ ...farm, [e.target.name]: e.target.value });

  const predict = async () => {
    if (!file) return setRes({ ...res, err: "Please select a leaf image." });
    setRes({ data: null, load: true, err: "" });
    
    const fd = new FormData();
    fd.append("image", file);
    Object.entries(farm).forEach(([k, v]) => fd.append(k, v));

    try {
      const req = await fetch("http://127.0.0.1:8000/api/predict/", { method: "POST", body: fd });
      const data = await req.json();
      console.log(data)
      if (!req.ok) throw new Error(data.error || "Prediction failed");
      setRes({ data, load: false, err: "" });
    } catch (err) {
      setRes({ data: null, load: false, err: err.message });
    }
  };

  const fields = [
    { n: "ph", l: "Soil pH", t: "number", p: { min: 0, max: 14, step: 0.1 } },
    { n: "soil_moisture", l: "Moisture (%)", t: "number", p: { min: 0, max: 100 } },
    { n: "previous_crop", l: "Previous Crop", t: "text" },
    { n: "location", l: "Location", t: "text" },
    { n: "water_availability", l: "Water", opts: ["Low", "Medium", "High"] },
    { n: "growth_stage", l: "Stage", opts: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
    { n: "soil_type", l: "Soil Type", opts: ["Alluvial", "Black", "Red", "Laterite", "Loamy", "Sandy", "Clay", "Silty"] },
  ];

  return (
    <div className="app">
      <header>
        <div><h1>🌱 AgriSmart AI</h1><p>AI-powered crop health & farm analysis</p></div>
        <span className="badge">AI Agriculture</span>
      </header>

      <main>
        <section className="card">
          <div className="title"><span>01</span><h2>Leaf Image</h2></div>
          <label className="upload">
            {file ? <img src={URL.createObjectURL(file)} alt="Preview" /> : <div>📷 Choose image</div>}
            <input type="file" accept="image/*" onChange={handleImg} hidden />
          </label>
        </section>

        <section className="card">
          <div className="title"><span>02</span><h2>Farm Information</h2></div>
          <div className="grid">
            {fields.map((f) => (
              <div className="field" key={f.n}>
                <label>{f.l}</label>
                {f.opts ? (
                  <select name={f.n} onChange={handleFarm} value={farm[f.n]}>
                    <option value="">Select {f.l}</option>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.t} name={f.n} onChange={handleFarm} value={farm[f.n]} placeholder={`Ex: ${f.l}`} {...f.p} />
                )}
              </div>
            ))}
          </div>
        </section>

        <button className="btn" onClick={predict} disabled={!file || res.load}>
          {res.load ? "⏳ Analyzing..." : "🔍 Analyze Farm"}
        </button>

        {res.err && <div className="err">⚠️ {res.err}</div>}

        {res.data && (
          <section className="card res">
            <div className="res-head">
              <div><small>ANALYSIS COMPLETE</small><h2>🌿 {res.data.disease || res.data.class}</h2></div>
              <div className="conf">{(res.data.confidence * 100).toFixed(1)}%<small>confidence</small></div>
            </div>
            <p>{res.data.description}</p>
            
            <div className="grid">
              {res.data.symptoms?.length > 0 && <div className="box"><h3>🔎 Symptoms</h3><ul>{res.data.symptoms.map((s, i)=><li key={i}>{s}</li>)}</ul></div>}
              {res.data.precautions?.length > 0 && <div className="box"><h3>🛡️ Precautions</h3><ul>{res.data.precautions.map((p, i)=><li key={i}>{p}</li>)}</ul></div>}
            </div>

            <div className="summary">
              <h3>🌾 Farm Summary</h3>
              <div className="grid sum-grid">
                {Object.entries(farm).map(([k, v]) => (
                  <div key={k}><small>{k.replace('_', ' ')}</small><strong>{v || "N/A"}</strong></div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}