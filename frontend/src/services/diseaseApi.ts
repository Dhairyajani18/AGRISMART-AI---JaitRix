import { DiseaseDetectionResponse, DiseaseInputPayload } from '../types/disease';
import { AppApiError, DISEASE_PREDICTION_ENDPOINT, request } from './api';

/**
 * Service to analyze crop disease from leaf image.
 * Uses multipart/form-data as required for image transfer to Python backend.
 */
export async function detectDisease(payload: DiseaseInputPayload): Promise<DiseaseDetectionResponse> {
  const formData = new FormData();
  formData.append('image', payload.imageFile);
  let response: {
    class: string;
    crop: string;
    disease: string;
    confidence: number;
    description: string;
    symptoms: string[];
    precautions: string[];
    severity: DiseaseDetectionResponse['severity'];
  };
  try {
    response = await request<typeof response>(DISEASE_PREDICTION_ENDPOINT, { method: 'POST', body: formData });
  } catch (error) {
    if (error instanceof AppApiError && typeof error.details === 'object' && error.details !== null) {
      const errorCode = (error.details as { error_code?: string }).error_code;
      if (errorCode === 'INVALID_LEAF_IMAGE') throw new Error('INVALID_LEAF_IMAGE');
      if (errorCode === 'LOW_CONFIDENCE_IMAGE') throw new Error('LOW_CONFIDENCE_IMAGE');
    }
    throw error;
  }

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
