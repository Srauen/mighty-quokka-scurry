"use client";

import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns'; // Import subDays

const stocksList = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'FB', 'NFLX', 'BABA', 'SBUX', 'KO', 'PEP', 'MCD', 'DIS', 'NKE', 'ADDYY', 'V', 'JPM', 'XOM', 'WMT', 'PG', 'MA', 'INTC', 'CSCO', 'CMCSA', 'PFE', 'T', 'VZ', 'CVX', 'HD', 'BA', 'MCO', 'BNS', 'RY', 'TD'];

interface StockDataItem {
  prices: number[];
  labels: string[];
  volumes: number[]; // Added volumes
  sentiments: number[]; // Added sentiments
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
      const initialPriceBase = parseFloat((Math.random() * 200 + 100).toFixed(2)); // Base price for historical generation
      const prices: number[] = [];
      const labels: string[] = [];
      const volumes: number[] = [];
      const sentiments: number[] = [];

      // Generate initial 50 data points for a more realistic starting chart
      for (let i = 49; i >= 0; i--) { // Go back 50 days
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
            const initialPrice = parseFloat((Math.random() * 200 + 100).toFixed(2));
            newStockData[stock] = {
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


          newStockData[stock].prices.push(newPrice);
          newStockData[stock].labels.push(format(new Date(), 'MM/dd')); // Use current date for new point
          newStockData[stock].volumes.push(Math.floor(newVolume));
          newStockData[stock].sentiments.push(parseFloat(newSentiment.toFixed(2)));


          // Keep only the last 50 data points for the chart
          if (newStockData[stock].prices.length > 50) {
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