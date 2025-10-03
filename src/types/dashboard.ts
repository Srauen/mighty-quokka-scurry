export interface ChartDataItem {
  date: string;
  price: number;
  volume: number;
  sentiment: number;
}

export interface ChartData {
  week: ChartDataItem[];
  month: ChartDataItem[];
  year: ChartDataItem[];
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export interface Trader {
  id: string;
  name: string;
  avatar: string;
  profit: number;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}