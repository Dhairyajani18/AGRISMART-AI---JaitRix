import { useState, useCallback } from 'react';
import { CropInput, CropPredictionResponse } from '../types/crop';
import { predictCrop } from '../services/cropApi';

export type CropAnalysisStep = 0 | 1 | 2 | 3 | 4;

export function useCropPrediction() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<CropAnalysisStep>(0);
  const [result, setResult] = useState<CropPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (input: CropInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(1);

    // Controlled progressive animation stages for user-perceived AI quality
    const stepTimer1 = setTimeout(() => setCurrentStep(2), 600);
    const stepTimer2 = setTimeout(() => setCurrentStep(3), 1300);
    const stepTimer3 = setTimeout(() => setCurrentStep(4), 1900);

    try {
      const responsePromise = predictCrop(input);

      // Ensure min animation duration of 2.2s so user sees all analysis stages
      const [apiResponse] = await Promise.all([
        responsePromise,
        new Promise((resolve) => setTimeout(resolve, 2400)),
      ]);

      setResult(apiResponse);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      const e = err as Error;
      setError(e.message || 'Failed to predict crop suitability. Please check inputs.');
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
    setCurrentStep(0);
  }, []);

  return {
    loading,
    currentStep,
    result,
    error,
    predict,
    reset,
  };
}
