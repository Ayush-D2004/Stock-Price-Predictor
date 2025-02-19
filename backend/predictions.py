#!/usr/bin/env python

from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.linear_model import LinearRegression
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def fetch_stock_data(ticker: str, period: str = "1y") -> pd.DataFrame:
    df = yf.download(ticker, period=period)
    return df

def train_model(ticker: str) -> LinearRegression:
    
    df = fetch_stock_data(ticker)
    
    if df.empty or len(df) < 10:
        raise ValueError(f"Not enough historical data for ticker: {ticker}")
    
    df = df[['Open', 'High', 'Low', 'Close']].dropna()
    df.columns = ['open', 'high', 'low', 'close']
    
    X = df[['open', 'high', 'low']]
    y = df['close']
    
    model = LinearRegression()
    model.fit(X, y)
    
    return model

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    
    required_keys = ['ticker', 'open', 'high', 'low']
    for key in required_keys:
        if key not in data:
            return jsonify({'error': f'Missing key: {key}'}), 400

    ticker = data['ticker']
    
    try:
        model = train_model(ticker)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    try:
        open_price = float(data['open'])
        high_price = float(data['high'])
        low_price = float(data['low'])
    except ValueError:
        return jsonify({'error': 'Open, high, and low prices must be numeric.'}), 400

    features = np.array([[open_price, high_price, low_price]])
    
    predicted_close = model.predict(features)[0]
    
    return jsonify({
        'ticker': ticker,
        'predicted_close': predicted_close
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
