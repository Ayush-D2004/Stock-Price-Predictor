import React, { useState } from 'react';
import { LineChart, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { predictStockPrice } from './lib/mockMLService';
import type { PredictionInput } from './lib/types';

const stockOptions = ['TSLA', 'AMZN', 'AAPL', 'MSFT', 'GOOGL', 'NVDA']; 

function App() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [input, setInput] = useState<PredictionInput>({
    ticker: '',
    openPrice: 0,
    highPrice: 0,
    lowPrice: 0,
  });
  const [showDropdown, setShowDropdown] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const requestData = {
      ticker: input.ticker,
      openPrice: input.openPrice,
      highPrice: input.highPrice,
      lowPrice: input.lowPrice,
    };

    try {
      const result = await predictStockPrice(requestData);
      setPrediction(result.prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberInput = (field: keyof Omit<PredictionInput, 'ticker'>, value: string) => {
    const parsedValue = value === '' ? 0 : Math.max(0, Number(value));
    setInput(prev => ({
      ...prev,
      [field]: parsedValue,
    }));
  };

  const handleTickerSelect = (ticker: string) => {
    setInput(prev => ({ ...prev, ticker }));
    setShowDropdown(false); // Hide dropdown after selection
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LineChart className="h-12 w-12 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Stock Price Predictor</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Leverage machine learning to predict stock closing prices with precision.
            Enter your stock details below to get started.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="ticker" className="block text-sm font-medium text-gray-300">
                  Stock Ticker Symbol
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ticker"
                    value={input.ticker}
                    onChange={(e) => {
                      setInput(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }));
                      setShowDropdown(true); // Show dropdown when typing
                    }}
                    onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                      {stockOptions.filter(option => option.includes(input.ticker)).map((option) => (
                        <div
                          key={option}
                          onClick={() => handleTickerSelect(option)}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="openPrice" className="block text-sm font-medium text-gray-300">
                    Open Price
                  </label>
                  <input
                    type="number"
                    id="openPrice"
                    value={input.openPrice || ''}
                    onChange={(e) => handleNumberInput('openPrice', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="highPrice" className="block text-sm font-medium text-gray-300">
                    High Price
                  </label>
                  <input
                    type="number"
                    id="highPrice"
                    value={input.highPrice || ''}
                    onChange={(e) => handleNumberInput('highPrice', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lowPrice" className="block text-sm font-medium text-gray-300">
                    Low Price
                  </label>
                  <input
                    type="number"
                    id="lowPrice"
                    value={input.lowPrice || ''}
                    onChange={(e) => handleNumberInput('lowPrice', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <span>Predict Price</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Prediction Result */}
            {prediction !== null && (
              <div className="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Predicted Closing Price</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-emerald-400">
                    ${prediction.toFixed(2)}
                  </span>
                  <span className="text-gray-400">USD</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  This prediction is based on the provided open, high, and low prices.
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          
        </div>
      </div>
    </div>
  );
}

export default App;
