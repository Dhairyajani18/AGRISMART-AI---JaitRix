export type DiseaseDetectionStatus = 'disease_detected' | 'healthy' | 'low_confidence';

export interface DiseaseDetectionResponse {
  status: DiseaseDetectionStatus;
  diseaseName: string;
  scientificName?: string;
  cropType: string;
  growthStage?: string;
  confidence: number; // percentage (0 - 100)
  severity?: 'None' | 'Mild' | 'Moderate' | 'Severe';
  aiFindings: string[];
  recommendedActions: string[];
  originalImageUrl?: string;
  heatmapUrl?: string; // Optional AI heatmap from ML backend
  analyzedAt?: string;
  advisoryNote?: string;
}

export interface DiseaseInputPayload {
  imageFile: File;
  cropType: string;
  growthStage: string;
  farmType?: string;
  cropVariety?: string;
  waterSource?: string;
  season?: string;
  plantingDate?: string;
}
