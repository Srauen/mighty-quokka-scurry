"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PortfolioAppProps {
  portfolio: { [key: string]: number };
  stockData: {
    [key: string]: { prices: number[]; labels: string[] };
  };
  cashBalance: number;
  setPortfolio: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const PortfolioApp: React.FC<PortfolioAppProps> = ({ portfolio, stockData, cashBalance, setPortfolio }) => {

  const removeStockFromPortfolio = (stock: string) => {
    setPortfolio(prevPortfolio => {
      const newPortfolio = { ...prevPortfolio };
      delete newPortfolio[stock];
      toast.info("Stock Removed", { description: `${stock} removed from your portfolio.` });
      return newPortfolio;
    });
  };

  const totalPortfolioValue = Object.keys(portfolio).reduce((sum, stock) => {
    const quantity = portfolio[stock];
    const lastPrice = stockData[stock] ? stockData[stock].prices[stockData[stock].prices.length - 1] : 0;
    return sum + (quantity * lastPrice);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#2d3748] p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2 text-white">My Portfolio</h3>
        <div className="flex justify-between text-gray-300 mb-2">
          <span>Total Cash:</span>
          <span className="text-green-400">${cashBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Total Portfolio Value:</span>
          <span className="text-blue-400">${totalPortfolioValue.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-[#2d3748] p-4 rounded-lg flex-grow overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-semibold mb-2 text-white">Holdings</h3>
        {Object.keys(portfolio).length === 0 ? (
          <p className="text-gray-400">Your portfolio is empty. Start trading!</p>
        ) : (
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-400 border-b border-gray-600">
                <th className="py-2">Stock</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Last Price</th>
                <th className="py-2">Current Value</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(portfolio).map((stock) => {
                const quantity = portfolio[stock];
                const lastPrice = stockData[stock] ? stockData[stock].prices[stockData[stock].prices.length - 1] : 0;
                const value = lastPrice * quantity;
                return (
                  <tr key={stock} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-2">{stock}</td>
                    <td className="py-2">{quantity}</td>
                    <td className="py-2">${lastPrice.toFixed(2)}</td>
                    <td className="py-2">${value.toFixed(2)}</td>
                    <td className="py-2">
                      <Button
                        onClick={() => removeStockFromPortfolio(stock)}
                        className="px-3 py-1 bg-red-600 rounded-md text-sm hover:bg-red-700 text-white"
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PortfolioApp;