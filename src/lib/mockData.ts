import { MockDashboardData, ChatData, ChatUser, ChatConversation } from "@/types/dashboard";
import { format } from "date-fns";

// Mock Dashboard Data for Stock OS
export const mockDashboardData: MockDashboardData = {
  dashboardStats: [
    {
      label: "PORTFOLIO VALUE",
      value: "$124,500",
      description: "TOTAL ASSETS UNDER MANAGEMENT",
      intent: "positive",
      icon: "LineChart", // Using Lucide icon name
      direction: "up"
    },
    {
      label: "DAILY GAIN/LOSS",
      value: "+2.35%",
      description: "TODAY'S PERFORMANCE",
      intent: "positive",
      icon: "TrendingUp", // Using Lucide icon name
      direction: "up"
    },
    {
      label: "OPEN POSITIONS",
      value: "7",
      description: "ACTIVE TRADES",
      intent: "neutral",
      icon: "Briefcase", // Using Lucide icon name
      tag: "High Volatility"
    }
  ],
  chartData: {
    week: [
      { date: "Mon", price: 150, volume: 12000, sentiment: 70 },
      { date: "Tue", price: 155, volume: 15000, sentiment: 75 },
      { date: "Wed", price: 152, volume: 11000, sentiment: 68 },
      { date: "Thu", price: 160, volume: 18000, sentiment: 80 },
      { date: "Fri", price: 158, volume: 13000, sentiment: 72 },
      { date: "Sat", price: 159, volume: 8000, sentiment: 73 },
      { date: "Sun", price: 162, volume: 9500, sentiment: 78 }
    ],
    month: [
      { date: "Week 1", price: 140, volume: 60000, sentiment: 65 },
      { date: "Week 2", price: 148, volume: 75000, sentiment: 70 },
      { date: "Week 3", price: 153, volume: 70000, sentiment: 72 },
      { date: "Week 4", price: 160, volume: 85000, sentiment: 78 }
    ],
    year: [
      { date: "Q1", price: 120, volume: 250000, sentiment: 60 },
      { date: "Q2", price: 135, volume: 300000, sentiment: 68 },
      { date: "Q3", price: 150, volume: 320000, sentiment: 75 },
      { date: "Q4", price: 165, volume: 380000, sentiment: 82 }
    ]
  },
  rebelsRanking: [ // Renamed to Top Traders in component
    {
      id: 1,
      name: "AlphaTrader",
      handle: "@AlphaTrader",
      streak: "5 WEEKS PROFIT 🔥",
      points: 14800, // Representing profit
      avatar: "/public/avatars/user_krimson.png",
      featured: true,
      subtitle: "Highest Profit"
    },
    {
      id: 2,
      name: "MarketMaestro",
      handle: "@Maestro",
      streak: "",
      points: 12900,
      avatar: "/public/avatars/user_mati.png"
    },
    {
      id: 3,
      name: "QuantKing",
      handle: "@QuantKing",
      streak: "",
      points: 10800,
      avatar: "/public/avatars/user_pek.png"
    },
    {
      id: 4,
      name: "AlgoAce",
      handle: "@AlgoAce",
      streak: "",
      points: 6400,
      avatar: "/public/avatars/user_joyboy.png"
    }
  ],
  securityStatus: [
    {
      title: "API CONNECTIVITY",
      value: "Stable",
      status: "[ONLINE]",
      variant: "success"
    },
    {
      title: "DATA ENCRYPTION",
      value: "AES-256",
      status: "[ACTIVE]",
      variant: "success"
    },
    {
      title: "UNUSUAL ACTIVITY",
      value: "0",
      status: "[MONITORED]",
      variant: "warning"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "TRADE EXECUTED",
      message: "Bought 100 shares of AAPL at $175.20.",
      timestamp: "2024-07-10T13:39:00Z",
      type: "success",
      read: false,
      priority: "medium"
    },
    {
      id: "notif-2",
      title: "MARKET ALERT",
      message: "GOOGL stock price dropped by 3% in the last hour.",
      timestamp: "2024-07-10T13:35:00Z",
      type: "warning",
      read: false,
      priority: "high"
    },
    {
      id: "notif-3",
      title: "SYSTEM MESSAGE",
      message: "AI prediction model updated to v2.1.",
      timestamp: "2024-07-10T12:15:00Z",
      type: "info",
      read: true,
      priority: "low"
    },
    {
      id: "notif-4",
      title: "PORTFOLIO REVIEW",
      message: "Your portfolio performance is ready for review.",
      timestamp: "2024-07-10T11:45:00Z",
      type: "info",
      read: true,
      priority: "medium"
    }
  ],
  widgetData: {
    location: "Global Markets",
    timezone: "UTC",
    temperature: "N/A", // Not relevant for market overview
    weather: "Market Open", // Changed to market status
    date: format(new Date(), "EEEE, MMMM do, yyyy")
  }
};

// Mock Chat Data (keeping as is, as it's not directly dashboard content)
const currentUser: ChatUser = {
  id: "joyboy",
  name: "JOYBOY",
  username: "@JOYBOY",
  avatar: "/public/avatars/user_joyboy.png",
  isOnline: true,
};

const users: Record<string, ChatUser> = {
  krimson: {
    id: "krimson",
    name: "KRIMSON",
    username: "@KRIMSON",
    avatar: "/public/avatars/user_krimson.png",
    isOnline: true,
  },
  mati: {
    id: "mati",
    name: "MATI",
    username: "@MATI",
    avatar: "/public/avatars/user_mati.png",
    isOnline: false,
  },
  pek: {
    id: "pek",
    name: "PEK",
    username: "@MATT",
    avatar: "/public/avatars/user_pek.png",
    isOnline: true,
  },
  v0: {
    id: "v0",
    name: "V0",
    username: "@KRIMSON",
    avatar: "/public/avatars/user_krimson.png",
    isOnline: false,
  },
  rampant: {
    id: "rampant",
    name: "RAMPANT",
    username: "@RAMPANT.WORKS",
    avatar: "/public/avatars/user_mati.png",
    isOnline: false,
  },
};

export const mockChatData: ChatData = {
  currentUser,
  conversations: [
    {
      id: "conv-krimson",
      participants: [currentUser, users.krimson],
      unreadCount: 1,
      lastMessage: {
        id: "msg-krimson-1",
        content: "💪💪💪💪💪",
        timestamp: "2024-07-10T16:00:00Z",
        senderId: "krimson",
        isFromCurrentUser: false,
      },
      messages: [
        {
          id: "msg-krimson-1",
          content: "💪💪💪💪💪",
          timestamp: "2024-07-10T16:00:00Z",
          senderId: "krimson",
          isFromCurrentUser: false,
        },
      ],
    },
    {
      id: "conv-mati",
      participants: [currentUser, users.mati],
      unreadCount: 0,
      lastMessage: {
        id: "msg-mati-1",
        content: "WE HAVE TO PAY TAXES?! DUDE",
        timestamp: "2024-06-06T14:30:00Z",
        senderId: "mati",
        isFromCurrentUser: false,
      },
      messages: [
        {
          id: "msg-mati-1",
          content: "WE HAVE TO PAY TAXES?! DUDE",
          timestamp: "2024-06-06T14:30:00Z",
          senderId: "mati",
          isFromCurrentUser: false,
        },
      ],
    },
    {
      id: "conv-pek",
      participants: [currentUser, users.pek],
      unreadCount: 0,
      lastMessage: {
        id: "msg-pek-last",
        content: "JUST SHIP IT",
        timestamp: "2024-06-06T12:15:00Z",
        senderId: "joyboy",
        isFromCurrentUser: true,
      },
      messages: [
        {
          id: "msg-pek-1",
          content: "HEY JOYBOY",
          timestamp: "2024-06-06T12:05:00Z",
          senderId: "pek",
          isFromCurrentUser: false,
        },
        {
          id: "msg-pek-2",
          content: "REMEMBER THE PR I SENT U YD",
          timestamp: "2024-06-06T12:05:00Z",
          senderId: "pek",
          isFromCurrentUser: false,
        },
        {
          id: "msg-pek-3",
          content: "Y",
          timestamp: "2024-06-06T12:08:00Z",
          senderId: "joyboy",
          isFromCurrentUser: true,
        },
        {
          id: "msg-pek-4",
          content: "WHAT ABOUT IT",
          timestamp: "2024-06-06T12:08:00Z",
          senderId: "joyboy",
          isFromCurrentUser: true,
        },
        {
          id: "msg-pek-5",
          content: "CAN U REVIEW",
          timestamp: "2024-06-06T12:11:00Z",
          senderId: "pek",
          isFromCurrentUser: false,
        },
        {
          id: "msg-pek-6",
          content: "PLZ",
          timestamp: "2024-06-06T12:11:00Z",
          senderId: "pek",
          isFromCurrentUser: false,
        },
        {
          id: "msg-pek-last",
          content: "JUST SHIP IT",
          timestamp: "2024-06-06T12:15:00Z",
          senderId: "joyboy",
          isFromCurrentUser: true,
        },
      ],
    },
    {
      id: "conv-v0",
      participants: [currentUser, users.v0],
      unreadCount: 0,
      lastMessage: {
        id: "msg-v0-1",
        content: "SO WILL YOU DO IT?",
        timestamp: "2024-06-02T10:00:00Z",
        senderId: "v0",
        isFromCurrentUser: false,
      },
      messages: [
        {
          id: "msg-v0-1",
          content: "SO WILL YOU DO IT?",
          timestamp: "2024-06-02T10:00:00Z",
          senderId: "v0",
          isFromCurrentUser: false,
        },
      ],
    },
    {
      id: "conv-rampant",
      participants: [currentUser, users.rampant],
      unreadCount: 0,
      lastMessage: {
        id: "msg-rampant-1",
        content: "THE CLIENT WANTS THE LOGO BIGGER",
        timestamp: "2024-06-04T09:30:00Z",
        senderId: "rampant",
        isFromCurrentUser: false,
      },
      messages: [
        {
          id: "msg-rampant-1",
          content: "THE CLIENT WANTS THE LOGO BIGGER",
          timestamp: "2024-06-04T09:30:00Z",
          senderId: "rampant",
          isFromCurrentUser: false,
        },
      ],
    },
  ],
};