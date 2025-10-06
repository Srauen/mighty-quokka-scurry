import { ChartData, StatCardProps, Trader, Notification, ChartDataItem } from '@/types/dashboard'; // Added ChartDataItem
import { format, subDays } from 'date-fns';

const generateMockChartData = (days: number): ChartDataItem[] => {
  const data: ChartDataItem[] = [];
  let currentPrice = 150;
  let currentVolume = 100000;
  let currentSentiment = 50;

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    currentPrice += (Math.random() - 0.5) * 10; // Price change
    currentVolume += (Math.random() - 0.5) * 10000; // Volume change
    currentSentiment += (Math.random() - 0.5) * 5; // Sentiment change

    currentPrice = Math.max(10, currentPrice);
    currentVolume = Math.max(10000, currentVolume);
    currentSentiment = Math.max(0, Math.min(100, currentSentiment));

    data.push({
      date: format(date, 'MMM dd'),
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.round(currentVolume),
      sentiment: parseFloat(currentSentiment.toFixed(2)),
    });
  }
  return data;
};

export const mockChartData: ChartData = {
  week: generateMockChartData(7),
  month: generateMockChartData(30),
  year: generateMockChartData(365),
};

export const mockStats: StatCardProps[] = [
  {
    title: "Total Portfolio Value",
    value: "$12,345.67",
    change: "+5.2%",
    changeType: "positive",
  },
  {
    title: "Daily Profit/Loss",
    value: "$123.45",
    change: "+1.1%",
    changeType: "positive",
  },
  {
    title: "Open Positions",
    value: "7",
    change: "-1",
    changeType: "negative",
  },
  {
    title: "Market Sentiment",
    value: "Bullish",
    change: "+0.8%",
    changeType: "positive",
  },
];

export const mockTopTraders: Trader[] = [
  { id: "1", name: "Alice Smith", avatar: "/placeholder.svg", profit: 15000 },
  { id: "2", name: "Bob Johnson", avatar: "/placeholder.svg", profit: 12000 },
  { id: "3", name: "Charlie Brown", avatar: "/placeholder.svg", profit: 9500 },
  { id: "4", name: "Diana Prince", avatar: "/placeholder.svg", profit: 8000 },
  { id: "5", name: "Eve Adams", avatar: "/placeholder.svg", profit: 7200 },
];

export const mockNotifications: Notification[] = [
  { id: "1", message: "AAPL stock reached new high.", timestamp: "2 min ago", read: false, type: 'info' },
  { id: "2", message: "Your order #12345 was executed.", timestamp: "1 hour ago", read: false, type: 'info' },
  { id: "3", message: "Market volatility alert issued.", timestamp: "3 hours ago", read: true, type: 'negative' },
  { id: "4", message: "New feature: AI predictions available!", timestamp: "1 day ago", read: true, type: 'positive' },
];