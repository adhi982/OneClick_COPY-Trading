export const APP_NAME = "Copy Trading Platform"
export const APP_DESCRIPTION = "Professional copy trading platform for cryptocurrency markets"

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  TRADERS: "/traders",
  PORTFOLIO: "/portfolio",
  RISK: "/risk",
  COMMUNITY: "/community",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  SUBSCRIPTIONS: "/subscriptions",
  CHANNELS: "/community/channels",
  LEADERBOARD: "/community/leaderboard",
} as const

export const TRADING_PAIRS = [
  "BTC/USDT",
  "ETH/USDT",
  "BNB/USDT",
  "ADA/USDT",
  "SOL/USDT",
  "DOT/USDT",
  "MATIC/USDT",
  "AVAX/USDT",
] as const

export const TIMEFRAMES = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1d", value: "1d" },
  { label: "1w", value: "1w" },
] as const

export const RISK_LEVELS = {
  LOW: { label: "Low", color: "green", maxRisk: 2 },
  MEDIUM: { label: "Medium", color: "yellow", maxRisk: 5 },
  HIGH: { label: "High", color: "red", maxRisk: 10 },
} as const

export const SUBSCRIPTION_TIERS = {
  BASIC: { name: "Basic", price: 29, features: ["Basic signals", "Community access"] },
  PRO: { name: "Pro", price: 99, features: ["Premium signals", "Advanced analytics", "Priority support"] },
  PREMIUM: { name: "Premium", price: 199, features: ["All features", "Custom strategies", "1-on-1 coaching"] },
} as const
