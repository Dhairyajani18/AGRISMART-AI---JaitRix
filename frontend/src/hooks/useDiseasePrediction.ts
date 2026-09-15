import { useState, useCallback } from 'react';
import { DiseaseDetectionResponse, DiseaseInputPayload } from '../types/disease';
import { detectDisease } from '../services/diseaseApi';
import { useLanguage } from '../context/LanguageContext';

export type DiseaseScanStep = 0 | 1 | 2 | 3 | 4;

export function useDiseasePrediction() {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<DiseaseScanStep>(0);
  const [result, setResult] = useState<DiseaseDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (payload: DiseaseInputPayload) => {
    setScanning(true);
    setError(null);
    setResult(null);
    setScanStep(1);

    // Sequence stages for AI Vision scanner
    const t1 = setTimeout(() => setScanStep(2), 700);
    const t2 = setTimeout(() => setScanStep(3), 1400);
    const t3 = setTimeout(() => setScanStep(4), 2100);

    try {
      const apiCall = detectDisease(payload);

      // Maintain visual scanning rhythm for at least 2.6s
      const [apiResponse] = await Promise.all([
        apiCall,
        new Promise((resolve) => setTimeout(resolve, 2700)),
      ]);

      // Preserve image preview if not in response
      setResult(apiResponse);
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      const e = err as Error;
      const message = e.message === 'INVALID_LEAF_IMAGE'
        ? t.errors.invalidLeafImage
        : e.message === 'LOW_CONFIDENCE_IMAGE'
          ? t.errors.lowConfidenceImage
          : e.message;
      setError(message || t.errors.predictionFailed);
    } finally {
      setScanning(false);
      setScanStep(0);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setScanning(false);
    setScanStep(0);
  }, []);

  return {
    scanning,
    scanStep,
    result,
    error,
    analyze,
    reset,
  };
}
