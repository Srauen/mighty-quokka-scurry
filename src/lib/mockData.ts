import { MockDashboardData, ChatData, ChatUser, ChatConversation } from "@/types/dashboard"; // Import types from dashboard.ts
import { format } from "date-fns";

// Mock Dashboard Data
export const mockDashboardData: MockDashboardData = {
  dashboardStats: [
    {
      label: "ISSUES COMPLETED",
      value: "49%",
      description: "WEEKLY SCOPE",
      intent: "positive",
      icon: "CheckCircle", // Using Lucide icon name
      direction: "up"
    },
    {
      label: "MINUTES LOST",
      value: "642'",
      description: "IN MEETINGS AND RABBIT HOLES",
      intent: "negative",
      icon: "Clock", // Using Lucide icon name
      direction: "down"
    },
    {
      label: "ACCIDENTS",
      value: "0",
      description: "THE CLIENT ALWAYS IS RIGHT",
      intent: "neutral",
      icon: "Bomb", // Using Lucide icon name
      tag: "4 weeks 🔥"
    }
  ],
  chartData: {
    week: [
      {
        date: "06/07",
        sales: 50000,
        spendings: 30000,
        coffee: 10000
      },
      {
        date: "07/07",
        sales: 250000,
        spendings: 15000,
        coffee: 30000
      },
      {
        date: "08/07",
        sales: 200000,
        spendings: 50000,
        coffee: 25000
      },
      {
        date: "09/07",
        sales: 280000,
        spendings: 60000,
        coffee: 45000
      },
      {
        date: "10/07",
        sales: 120000,
        spendings: 20000,
        coffee: 15000
      },
      {
        date: "11/07",
        sales: 180000,
        spendings: 55000,
        coffee: 20000
      },
      {
        date: "12/07",
        sales: 500000,
        spendings: 35000,
        coffee: 20000
      },
      {
        date: "13/07",
        spendings: 60000,
        sales: 130000,
        coffee: 10000
      }
    ],
    month: [
      { date: "Jan", spendings: 45000, sales: 180000, coffee: 25000 },
      { date: "Feb", spendings: 30000, sales: 120000, coffee: 20000 },
      { date: "Mar", spendings: 65000, sales: 280000, coffee: 35000 },
      { date: "Apr", spendings: 25000, sales: 160000, coffee: 18000 },
      { date: "May", spendings: 80000, sales: 350000, coffee: 45000 },
      { date: "Jun", spendings: 40000, sales: 90000, coffee: 25000 },
      { date: "Jul", spendings: 70000, sales: 220000, coffee: 40000 },
      { date: "Aug", spendings: 55000, sales: 170000, coffee: 30000 },
      { date: "Sep", spendings: 60000, sales: 200000, coffee: 35000 },
      { date: "Oct", spendings: 35000, sales: 140000, coffee: 22000 },
      { date: "Nov", spendings: 75000, sales: 340000, coffee: 38000 },
      { date: "Dec", spendings: 90000, sales: 420000, coffee: 50000 }
    ],
    year: [
      {
        date: "2020",
        spendings: 280000,
        sales: 580000,
        coffee: 150000
      },
      {
        date: "2021",
        spendings: 320000,
        sales: 650000,
        coffee: 180000
      },
      {
        date: "2022",
        spendings: 450000,
        sales: 950000,
        coffee: 250000
      },
      {
        date: "2023",
        spendings: 200000,
        sales: 520000,
        coffee: 120000
      },
      { date: "2024", spendings: 380000, sales: 820000, coffee: 200000 }
    ]
  },
  rebelsRanking: [
    {
      id: 1,
      name: "KRIMSON",
      handle: "@KRIMSON",
      streak: "2 WEEKS STREAK 🔥",
      points: 148,
      avatar: "/avatars/user_krimson.png",
      featured: true,
      subtitle: "2 WEEKS STREAK 🔥"
    },
    {
      id: 2,
      name: "MATI",
      handle: "@MATI",
      streak: "",
      points: 129,
      avatar: "/avatars/user_mati.png"
    },
    {
      id: 3,
      name: "PEK",
      handle: "@MATT",
      streak: "",
      points: 108,
      avatar: "/avatars/user_pek.png"
    },
    {
      id: 4,
      name: "JOYBOY",
      handle: "@JOYBOY",
      streak: "",
      points: 64,
      avatar: "/avatars/user_joyboy.png"
    }
  ],
  securityStatus: [
    {
      title: "GUARD BOTS",
      value: "124/124",
      status: "[RUNNING...]",
      variant: "success"
    },
    {
      title: "FIREWALL",
      value: "99.9%",
      status: "[BLOCKED]",
      variant: "success"
    },
    {
      title: "HTML WARNINGS",
      value: "12042",
      status: "[ACCESSIBILITY]",
      variant: "warning"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "PAYMENT RECEIVED",
      message: "Your payment to Rampant Studio has been processed successfully.",
      timestamp: "2024-07-10T13:39:00Z",
      type: "success",
      read: false,
      priority: "medium"
    },
    {
      id: "notif-2",
      title: "INTRO: JOYCO STUDIO AND V0",
      message: "About us - We're a healthcare company focused on accessibility and innovation.",
      timestamp: "2024-07-10T13:35:00Z",
      type: "info",
      read: false,
      priority: "low"
    },
    {
      id: "notif-3",
      title: "SYSTEM UPDATE",
      message: "Security patches have been applied to all guard bots.",
      timestamp: "2024-07-10T12:15:00Z",
      type: "info",
      read: true,
      priority: "medium"
    },
    {
      id: "notif-4",
      title: "FIREWALL ALERT",
      message: "Blocked 247 suspicious connection attempts in the last hour.",
      timestamp: "2024-07-10T11:45:00Z",
      type: "warning",
      read: true,
      priority: "high"
    }
  ],
  widgetData: {
    location: "Buenos Aires, Argentina",
    timezone: "UTC-3",
    temperature: "18°C",
    weather: "Partly Cloudy",
    date: format(new Date(), "EEEE, MMMM do, yyyy")
  }
};

// Mock Chat Data
const currentUser: ChatUser = {
  id: "joyboy",
  name: "JOYBOY",
  username: "@JOYBOY",
  avatar: "/public/avatars/user_joyboy.png", // Assuming avatars are in public/avatars
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