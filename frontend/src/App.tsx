import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CropPrediction } from './pages/CropPrediction';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { WeatherPrediction } from './pages/WeatherPrediction';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#17211B] antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/crop-prediction" element={<CropPrediction />} />
          <Route path="/weather-prediction" element={<WeatherPrediction />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Premium Agriculture AI Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LanguageProvider>
  );
}
