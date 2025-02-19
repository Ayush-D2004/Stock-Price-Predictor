export interface PredictionInput {
    ticker: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
}

export interface PredictionResponse {
    status: string;
    prediction: number | null;
    confidence: number;
    modelVersion: string;
    predictionId: string;
    timestamp: string;
} 