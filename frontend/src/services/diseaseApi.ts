import { DiseaseDetectionResponse, DiseaseInputPayload } from '../types/disease';
import { DISEASE_PREDICTION_ENDPOINT, request } from './api';

/**
 * Service to analyze crop disease from leaf image.
 * Uses multipart/form-data as required for image transfer to Python backend.
 */
export async function detectDisease(payload: DiseaseInputPayload): Promise<DiseaseDetectionResponse> {
  const formData = new FormData();
  formData.append('image', payload.imageFile);
  const response = await request<{
    class: string;
    crop: string;
    disease: string;
    confidence: number;
    description: string;
    symptoms: string[];
    precautions: string[];
    severity: DiseaseDetectionResponse['severity'];
  }>(DISEASE_PREDICTION_ENDPOINT, { method: 'POST', body: formData });

  return {
    status: response.disease.toLowerCase().includes('healthy') ? 'healthy' : 'disease_detected',
    diseaseName: response.disease,
    scientificName: response.class,
    cropType: response.crop,
    growthStage: payload.growthStage,
    confidence: Number((response.confidence * 100).toFixed(2)),
    severity: response.severity,
    aiFindings: [response.description, ...response.symptoms],
    recommendedActions: response.precautions,
    analyzedAt: new Date().toISOString(),
  };
}
