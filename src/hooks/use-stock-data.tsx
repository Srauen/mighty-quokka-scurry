"use client";

import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns'; // Import subDays

const stocksList = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'FB', 'NFLX', 'BABA', 'SBUX', 'KO', 'PEP', 'MCD', 'DIS', 'NKE', 'ADDYY', 'V', 'JPM', 'XOM', 'WMT', 'PG', 'MA', 'INTC', 'CSCO', 'CMCSA', 'PFE', 'T', 'VZ', 'CVX', 'HD', 'BA', 'MCO', 'BNS', 'RY', 'TD'];

// Mock company names and sectors for realism
const companyDetails: { [key: string]: { name: string; sector: string } } = {
  'AAPL': { name: 'Apple Inc.', sector: 'Technology' },
  'MSFT': { name: 'Microsoft Corp.', sector: 'Technology' },
  'GOOGL': { name: 'Alphabet Inc. (Class A)', sector: 'Technology' },
  'TSLA': { name: 'Tesla Inc.', sector: 'Automotive' },
  'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
  'NVDA': { name: 'NVIDIA Corp.', sector: 'Technology' },
  'FB': { name: 'Meta Platforms Inc.', sector: 'Technology' },
  'NFLX': { name: 'Netflix Inc.', sector: 'Communication Services' },
  'BABA': { name: 'Alibaba Group Holding Ltd.', sector: 'Consumer Discretionary' },
  'SBUX': { name: 'Starbucks Corp.', sector: 'Consumer Discretionary' },
  'KO': { name: 'The Coca-Cola Company', sector: 'Consumer Staples' },
  'PEP': { name: 'PepsiCo Inc.', sector: 'Consumer Staples' },
  'MCD': { name: 'McDonald\'s Corp.', sector: 'Consumer Discretionary' },
  'DIS': { name: 'The Walt Disney Company', sector: 'Communication Services' },
  'NKE': { name: 'Nike Inc.', sector: 'Consumer Discretionary' },
  'ADDYY': { name: 'Adidas AG', sector: 'Consumer Discretionary' },
  'V': { name: 'Visa Inc.', sector: 'Financials' },
  'JPM': { name: 'JPMorgan Chase & Co.', sector: 'Financials' },
  'XOM': { name: 'Exxon Mobil Corp.', sector: 'Energy' },
  'WMT': { name: 'Walmart Inc.', sector: 'Consumer Staples' },
  'PG': { name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
  'MA': { name: 'Mastercard Inc.', sector: 'Financials' },
  'INTC': { name: 'Intel Corp.', sector: 'Technology' },
  'CSCO': { name: 'Cisco Systems Inc.', sector: 'Technology' },
  'CMCSA': { name: 'Comcast Corp.', sector: 'Communication Services' },
  'PFE': { name: 'Pfizer Inc.', sector: 'Healthcare' },
  'T': { name: 'AT&T Inc.', sector: 'Communication Services' },
  'VZ': { name: 'Verizon Communications Inc.', sector: 'Communication Services' },
  'CVX': { name: 'Chevron Corp.', sector: 'Energy' },
  'HD': { name: 'The Home Depot Inc.', sector: 'Consumer Discretionary' },
  'BA': { name: 'The Boeing Company', sector: 'Industrials' },
  'MCO': { name: 'Moody\'s Corp.', sector: 'Financials' },
  'BNS': { name: 'Bank of Nova Scotia', sector: 'Financials' },
  'RY': { name: 'Royal Bank of Canada', sector: 'Financials' },
  'TD': { name: 'Toronto-Dominion Bank', sector: 'Financials' },
};


interface StockDataItem {
  companyName: string; // Added company name
  sector: string;      // Added sector
  marketCap: number;   // Added market cap
  prices: number[];
  labels: string[];
  volumes: number[];
  sentiments: number[];
  initialPrice: number;
  lastPrice: number;
  dailyChange: number; // Percentage change for the day
}

interface StockData {
  [key: string]: StockDataItem;
}

export const useStockData = () => {
  const [stockData, setStockData] = useState<StockData>({});

  const initializeStockData = useCallback(() => {
    const initialData: StockData = {};
    stocksList.forEach(stock => {
      const detail = companyDetails[stock] || { name: `${stock} Company`, sector: 'Diversified' };
      const initialPriceBase = parseFloat((Math.random() * 200 + 100).toFixed(2)); // Base price for historical generation
      const marketCapBase = parseFloat((Math.random() * 500 + 50).toFixed(2)); // Base market cap in billions

      const prices: number[] = [];
      const labels: string[] = [];
      const volumes: number[] = [];
      const sentiments: number[] = [];

      // Generate initial 365 data points for a more realistic starting chart (1 year)
      for (let i = 364; i >= 0; i--) { // Go back 365 days
        const date = subDays(new Date(), i);
        // Simulate price fluctuation around the initialPriceBase
        const price = parseFloat((initialPriceBase + (Math.random() - 0.5) * 50).toFixed(2)); 
        const volume = Math.floor(Math.random() * 1000000) + 100000;
        const sentiment = parseFloat((Math.random() * 100).toFixed(2));

        prices.push(Math.max(0.01, price)); // Ensure price doesn't go below 0.01
        labels.push(format(date, 'MM/dd'));
        volumes.push(volume);
        sentiments.push(sentiment);
      }

      initialData[stock] = {
        companyName: detail.name,
        sector: detail.sector,
        marketCap: marketCapBase * 1_000_000_000, // Convert to actual market cap value
        prices: prices,
        labels: labels,
        volumes: volumes,
        sentiments: sentiments,
        initialPrice: prices[0], // Use the first generated price as the "initial" for daily change calculation
        lastPrice: prices[prices.length - 1],
        dailyChange: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100, // Calculate initial daily change
      };
    });
    setStockData(initialData);
  }, []);

  useEffect(() => {
    initializeStockData();

    const priceUpdateInterval = setInterval(() => {
      setStockData(prevStockData => {
        const newStockData = { ...prevStockData };
        stocksList.forEach(stock => {
          if (!newStockData[stock]) {
            // Fallback if for some reason a stock is missing (shouldn't happen after initialisation)
            const detail = companyDetails[stock] || { name: `${stock} Company`, sector: 'Diversified' };
            const initialPrice = parseFloat((Math.random() * 200 + 100).toFixed(2));
            const marketCapBase = parseFloat((Math.random() * 500 + 50).toFixed(2));

            newStockData[stock] = {
              companyName: detail.name,
              sector: detail.sector,
              marketCap: marketCapBase * 1_000_000_000,
              prices: [initialPrice],
              labels: [format(new Date(), 'MM/dd')],
              volumes: [Math.floor(Math.random() * 1000000) + 100000],
              sentiments: [parseFloat((Math.random() * 100).toFixed(2))],
              initialPrice: initialPrice,
              lastPrice: initialPrice,
              dailyChange: 0,
            };
          }

          const lastPrice = newStockData[stock].prices[newStockData[stock].prices.length - 1];
          const change = (Math.random() - 0.5) * 5; // Price change between -2.5 and +2.5
          const newPrice = parseFloat(Math.max(0.01, lastPrice + change).toFixed(2)); // Ensure price doesn't go below 0.01

          const newVolume = Math.max(10000, newStockData[stock].volumes[newStockData[stock].volumes.length - 1] + (Math.random() - 0.5) * 50000);
          const newSentiment = Math.max(0, Math.min(100, newStockData[stock].sentiments[newStockData[stock].sentiments.length - 1] + (Math.random() - 0.5) * 10));

          // Simulate market cap change based on price change
          const marketCapChangeFactor = newPrice / lastPrice;
          const newMarketCap = newStockData[stock].marketCap * marketCapChangeFactor;


          newStockData[stock].prices.push(newPrice);
          newStockData[stock].labels.push(format(new Date(), 'MM/dd')); // Use current date for new point
          newStockData[stock].volumes.push(Math.floor(newVolume));
          newStockData[stock].sentiments.push(parseFloat(newSentiment.toFixed(2)));
          newStockData[stock].marketCap = newMarketCap;


          // Keep only the last 365 data points for the chart (1 year)
          if (newStockData[stock].prices.length > 365) {
            newStockData[stock].prices.shift();
            newStockData[stock].labels.shift();
            newStockData[stock].volumes.shift();
            newStockData[stock].sentiments.shift();
          }

          // Calculate daily change from initial price
          const dailyChange = ((newPrice - newStockData[stock].initialPrice) / newStockData[stock].initialPrice) * 100;
          newStockData[stock].lastPrice = newPrice;
          newStockData[stock].dailyChange = dailyChange;
        });
        return newStockData;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(priceUpdateInterval);
  }, [initializeStockData]);

  return { stockData, stocksList, initializeStockData };
};