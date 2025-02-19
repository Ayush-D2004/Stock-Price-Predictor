import { PredictionInput, PredictionResponse } from './types';

export const predictStockPrice = async (input: PredictionInput): Promise<PredictionResponse> => {
    const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticker: input.ticker,
            open: input.openPrice,
            high: input.highPrice,
            low: input.lowPrice,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch prediction');
    }

    const result = await response.json();
    return {
        status: 'success',
        prediction: result.predicted_close,
        confidence: 0.95, // Placeholder for confidence
        modelVersion: '1.0', // Placeholder for model version
        predictionId: '12345', // Placeholder for prediction ID
        timestamp: new Date().toISOString(), // Current timestamp
    };
}; 