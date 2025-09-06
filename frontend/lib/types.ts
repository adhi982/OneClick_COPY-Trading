export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  verified: boolean
  createdAt: Date
}

export interface Trader extends User {
  stats: {
    totalReturn: number
    winRate: number
    followers: number
    totalTrades: number
    averageHoldTime: number
    maxDrawdown: number
  }
  performance: {
    daily: number[]
    monthly: number[]
    yearly: number[]
  }
  isFollowing?: boolean
}

export interface CommunityPost {
  id: string
  author: User
  type: "trade" | "analysis" | "discussion"
  content: string
  createdAt: Date
  likes: number
  comments: Comment[]
  isLiked: boolean
  tradeData?: {
    symbol: string
    side: "buy" | "sell"
    price: number
    pnl: number
    reasoning?: string
  }
}

export interface PremiumChannel {
  id: string
  name: string
  description: string
  creator: User
  pricing: {
    monthly: number
    yearly?: number
  }
  stats: {
    subscribers: number
    winRate: number
    totalSignals: number
    averageReturn: number
  }
  tags: string[]
  rating: number
  isSubscribed?: boolean
}

export interface Subscription {
  id: string
  userId: string
  channelId: string
  channel: PremiumChannel
  status: "active" | "cancelled" | "expired"
  startDate: Date
  endDate?: Date
  nextBillingDate: Date
  amount: number
  paymentMethod: string
}

export interface TradeSignal {
  id: string
  channelId: string
  symbol: string
  side: "buy" | "sell"
  price: number
  targetPrice: number
  stopLoss: number
  confidence: number
  reasoning: string
  timestamp: Date
  status: "active" | "filled" | "cancelled"
  performance?: {
    pnl: number
    percentReturn: number
  }
}

export interface Portfolio {
  id: string
  userId: string
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  positions: Position[]
  performance: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
}

export interface Position {
  id: string
  symbol: string
  side: "long" | "short"
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  openedAt: Date
  traderId?: string
  isCopyTrade: boolean
}
