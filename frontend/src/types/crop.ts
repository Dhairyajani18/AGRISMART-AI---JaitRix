export interface CropInput {
  soilType: string;
  soilPh: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  waterAvailability: string;
  season: string;
  previousCrop: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface CropRecommendationReason {
  label: string;
  matched: boolean;
}

export interface CropPredictionItem {
  name: string;
  suitability: number; // percentage (0 - 100)
  icon?: string;
  image?: string;
  category?: string;
  summary: string;
  reasons: string[];
  details?: {
    growthDurationDays?: string;
    expectedYield?: string;
    waterRequirementLevel?: string;
    soilPreparationNote?: string;
    fertilizerTip?: string;
  };
}

export interface CropPredictionResponse {
  bestCrop: CropPredictionItem;
  alternativeCrops: CropPredictionItem[];
  modelConfidence?: number;
  soilHealthIndex?: string;
  analyzedAt?: string;
}
