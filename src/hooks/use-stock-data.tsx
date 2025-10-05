"use client";

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns'; // Import format from date-fns

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
      const initialPrice = parseFloat((Math.random() * 200 + 100).toFixed(2)); // Random price between 100 and 300
      initialData[stock] = {
        prices: [initialPrice],
        labels: [format(new Date(), 'MM/dd')], // Format date as MM/dd
        volumes: [Math.floor(Math.random() * 1000000) + 100000], // Initial volume
        sentiments: [parseFloat((Math.random() * 100).toFixed(2))], // Initial sentiment (0-100)
        initialPrice: initialPrice,
        lastPrice: initialPrice,
        dailyChange: 0,
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
            // Should not happen if initialized correctly, but as a fallback
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
          newStockData[stock].labels.push(format(new Date(), 'MM/dd')); // Format date as MM/dd
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