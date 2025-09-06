# Frontend Development Plan - OneClick Copy Trading Platform
*Comprehensive Frontend Architecture & Implementation Guide*

## Table of Contents
1. [Frontend Architecture Overview](#frontend-architecture-overview)
2. [Technology Stack & Dependencies](#technology-stack--dependencies)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [UI/UX Design System](#uiux-design-system)
7. [Real-time Data Integration](#real-time-data-integration)
8. [Implementation Timeline](#implementation-timeline)
9. [Code Examples](#code-examples)
10. [Testing Strategy](#testing-strategy)

---

## Frontend Architecture Overview

### Core Principles
- **Component-First Design**: Modular, reusable React components
- **Real-time First**: Live data streaming and updates
- **Mobile-Responsive**: Works seamlessly across all devices
- **Performance Optimized**: Lazy loading and efficient rendering
- **Type-Safe**: Full TypeScript implementation

### Application Flow
```
User Login (Wallet) → Dashboard → Trader Selection → Risk Setup → Live Trading → Analytics
```

### Key User Journeys
1. **New User Onboarding**
   - Connect wallet → Set trading preferences → Browse top traders → Start copy trading

2. **Experienced Trader**
   - Dashboard overview → Adjust positions → Monitor performance → Manage risk

3. **Community Engagement**
   - View leaderboards → Follow top performers → Share insights → Track trends

---

## Technology Stack & Dependencies

### Core Framework
```json
{
  "framework": "Next.js 14",
  "ui-library": "React 18",
  "language": "TypeScript",
  "styling": "Tailwind CSS + shadcn/ui",
  "charts": "TradingView Lightweight Charts",
  "wallet": "Aptos Wallet Adapter",
  "http-client": "Axios + SWR",
  "forms": "React Hook Form + Zod",
  "animations": "Framer Motion",
  "icons": "Lucide React"
}
```

### Package.json Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@aptos-labs/ts-sdk": "^1.0.0",
    "@aptos-labs/wallet-adapter-react": "^3.0.0",
    "lightweight-charts": "^4.1.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "swr": "^2.2.4",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.292.0",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard
│   │   ├── analytics/page.tsx   # Analytics page
│   │   └── settings/page.tsx    # User settings
│   ├── traders/
│   │   ├── page.tsx             # Trader discovery
│   │   └── [id]/page.tsx        # Trader details
│   ├── community/
│   │   ├── page.tsx             # Community hub & posts
│   │   ├── leaderboard/page.tsx # Leaderboards
│   │   ├── channels/page.tsx    # Premium channels discovery
│   │   ├── channels/[id]/page.tsx # Individual channel page
│   │   └── create-channel/page.tsx # Create new channel
│   ├── subscriptions/
│   │   ├── page.tsx             # My subscriptions
│   │   ├── manage/page.tsx      # Manage my channels
│   │   └── payment/page.tsx     # Payment processing
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── toast.tsx
│   ├── charts/                  # Trading charts
│   │   ├── TradingChart.tsx
│   │   ├── OrderBook.tsx
│   │   ├── TradeHistory.tsx
│   │   └── PerformanceChart.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── DashboardHeader.tsx
│   │   ├── PortfolioOverview.tsx
│   │   ├── ActivePositions.tsx
│   │   └── QuickActions.tsx
│   ├── trader/                  # Trader components
│   │   ├── TraderCard.tsx
│   │   ├── TraderDetails.tsx
│   │   ├── TraderStats.tsx
│   │   └── FollowButton.tsx
│   ├── community/               # Community components
│   │   ├── Leaderboard.tsx
│   │   ├── TopPerformers.tsx
│   │   ├── TradingFeed.tsx
│   │   ├── SocialStats.tsx
│   │   ├── PostCard.tsx
│   │   ├── CreatePost.tsx
│   │   ├── ChannelCard.tsx
│   │   └── ChannelChat.tsx
│   ├── subscription/            # Subscription components
│   │   ├── ChannelSubscribe.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── RealtimeTradeAlert.tsx
│   │   └── ChannelSettings.tsx
│   └── wallet/                  # Wallet components
│       ├── WalletButton.tsx
│       ├── WalletModal.tsx
│       └── NetworkSelector.tsx
├── hooks/                       # Custom React hooks
│   ├── useAptos.ts             # Aptos blockchain integration
│   ├── useTraders.ts           # Trader data management
│   ├── usePortfolio.ts         # Portfolio state
│   ├── useRealtime.ts          # Real-time data
│   ├── useWebSocket.ts         # WebSocket connections
│   ├── useCommunity.ts         # Community posts and interactions
│   ├── useSubscriptions.ts     # Subscription management
│   └── usePayments.ts          # Payment processing
├── lib/                        # Utility libraries
│   ├── aptos.ts                # Aptos client setup
│   ├── api.ts                  # API client
│   ├── utils.ts                # Helper functions
│   ├── constants.ts            # App constants
│   ├── types.ts                # TypeScript types
│   └── validations.ts          # Zod schemas
├── store/                      # Global state management
│   ├── index.ts                # Store setup
│   ├── userSlice.ts           # User state
│   ├── tradersSlice.ts        # Traders data
│   └── marketSlice.ts         # Market data
└── styles/                     # Styling files
    ├── globals.css
    ├── components.css
    └── charts.css
```

---

## Component Architecture

### Core Component Hierarchy

#### 1. Layout Components
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
```

#### 2. Dashboard Components
```typescript
// components/dashboard/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      {sidebar && (
        <div className="w-80 bg-white border-l border-gray-200">
          {sidebar}
        </div>
      )}
    </div>
  );
};
```

#### 3. Trading Chart Component
```typescript
// components/charts/TradingChart.tsx
interface TradingChartProps {
  symbol: string;
  interval: string;
  height?: number;
  showVWAP?: boolean;
  showOrderBook?: boolean;
}

export const TradingChart = ({ 
  symbol, 
  interval, 
  height = 400,
  showVWAP = true,
  showOrderBook = false 
}: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const vwapSeries = useRef<ISeriesApi<'Line'> | null>(null);

  const { data: priceData, error, isLoading } = useSWR(
    `/api/charts/${symbol}?interval=${interval}`,
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add candlestick series
    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add VWAP line if enabled
    if (showVWAP) {
      vwapSeries.current = chart.current.addLineSeries({
        color: '#2196f3',
        lineWidth: 2,
        title: 'VWAP',
      });
    }

    return () => {
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [height, showVWAP]);

  // Update chart data
  useEffect(() => {
    if (!priceData || !candleSeries.current) return;

    candleSeries.current.setData(priceData.candles);
    
    if (showVWAP && vwapSeries.current && priceData.vwap) {
      vwapSeries.current.setData(priceData.vwap);
    }
  }, [priceData, showVWAP]);

  if (isLoading) return <ChartSkeleton height={height} />;
  if (error) return <ChartError />;

  return (
    <div className="w-full">
      <div ref={chartContainerRef} className="w-full" />
      <ChartControls 
        symbol={symbol}
        interval={interval}
        onIntervalChange={setInterval}
      />
    </div>
  );
};
```

#### 4. Trader Card Component
```typescript
// components/trader/TraderCard.tsx
interface TraderCardProps {
  trader: Trader;
  onFollow: (traderId: string) => void;
  onUnfollow: (traderId: string) => void;
  isFollowing: boolean;
}

export const TraderCard = ({ 
  trader, 
  onFollow, 
  onUnfollow, 
  isFollowing 
}: TraderCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow(trader.id);
      } else {
        await onFollow(trader.id);
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={trader.avatar} alt={trader.name} />
            <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{trader.name}</h3>
            <p className="text-sm text-gray-600">@{trader.username}</p>
          </div>
        </div>
        <Badge 
          variant={trader.riskLevel === 'low' ? 'success' : 
                  trader.riskLevel === 'medium' ? 'warning' : 'destructive'}
        >
          {trader.riskLevel.toUpperCase()}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            +{trader.monthlyReturn}%
          </p>
          <p className="text-sm text-gray-600">30D Return</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{trader.followers}</p>
          <p className="text-sm text-gray-600">Followers</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="text-center">
          <p className="font-medium">{trader.winRate}%</p>
          <p className="text-gray-600">Win Rate</p>
        </div>
        <div className="text-center">
          <p className="font-medium">{trader.avgHoldTime}</p>
          <p className="text-gray-600">Avg Hold</p>
        </div>
        <div className="text-center">
          <p className="font-medium">{trader.sharpeRatio}</p>
          <p className="text-gray-600">Sharpe</p>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <Button
          onClick={handleFollowToggle}
          disabled={isLoading}
          className="flex-1"
          variant={isFollowing ? "outline" : "default"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
```

#### 5. Community Post Component
```typescript
// components/community/PostCard.tsx
interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
}

export const PostCard = ({ post, onLike, onComment, onShare }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  return (
    <Card className="p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{post.author.name}</h4>
            <p className="text-sm text-gray-500">{formatDistanceToNow(post.createdAt)} ago</p>
          </div>
        </div>
        <Badge variant={post.type === 'trade' ? 'success' : 'secondary'}>
          {post.type.toUpperCase()}
        </Badge>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 mb-3">{post.content}</p>
        
        {/* Trade Details if trade post */}
        {post.type === 'trade' && post.tradeData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Asset:</span> {post.tradeData.symbol}
              </div>
              <div>
                <span className="font-medium">Action:</span> 
                <Badge variant={post.tradeData.side === 'buy' ? 'success' : 'destructive'} className="ml-2">
                  {post.tradeData.side.toUpperCase()}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Price:</span> ${post.tradeData.price}
              </div>
              <div>
                <span className="font-medium">P&L:</span> 
                <span className={post.tradeData.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {post.tradeData.pnl >= 0 ? '+' : ''}${post.tradeData.pnl}
                </span>
              </div>
            </div>
            {post.tradeData.reasoning && (
              <div className="mt-3">
                <span className="font-medium">Reasoning:</span>
                <p className="text-gray-600 mt-1">{post.tradeData.reasoning}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-2"
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(post.id)}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>

        {/* Copy Trade Button for trade posts */}
        {post.type === 'trade' && post.tradeData && (
          <Button size="sm" variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy Trade
          </Button>
        )}
      </div>
    </Card>
  );
};
```

#### 6. Premium Channel Card Component
```typescript
// components/subscription/ChannelCard.tsx
interface ChannelCardProps {
  channel: PremiumChannel;
  onSubscribe: (channelId: string) => void;
  isSubscribed: boolean;
}

export const ChannelCard = ({ channel, onSubscribe, isSubscribed }: ChannelCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      {/* Channel Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={channel.creator.avatar} alt={channel.creator.name} />
            <AvatarFallback>{channel.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{channel.name}</h3>
            <p className="text-sm text-gray-600">by {channel.creator.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            ${channel.pricing.monthly}/mo
          </p>
        </div>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">
            +{channel.stats.avgSubscriberReturn}%
          </p>
          <p className="text-xs text-gray-600">Avg Return</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{channel.stats.subscribers}</p>
          <p className="text-xs text-gray-600">Subscribers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{channel.stats.signalAccuracy}%</p>
          <p className="text-xs text-gray-600">Accuracy</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {isSubscribed ? (
          <Button className="flex-1" variant="outline" disabled>
            <Check className="h-4 w-4 mr-2" />
            Subscribed
          </Button>
        ) : (
          <Button 
            className="flex-1"
            onClick={() => onSubscribe(channel.id)}
          >
            Subscribe Now
          </Button>
        )}
      </div>
    </Card>
  );
};
```

#### 7. Real-time Signal Alert Component
```typescript
// components/subscription/RealtimeTradeAlert.tsx
interface SignalAlertProps {
  signal: TradingSignal;
  onCopyTrade: (signalId: string) => void;
  onDismiss: (signalId: string) => void;
}

export const RealtimeTradeAlert = ({ signal, onCopyTrade, onDismiss }: SignalAlertProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`p-4 border-l-4 ${
      signal.type === 'buy' ? 'border-l-green-500' : 'border-l-red-500'
    } animate-pulse-once`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={signal.creator.avatar} alt={signal.creator.name} />
            <AvatarFallback>{signal.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant={signal.type === 'buy' ? 'success' : 'destructive'}>
                {signal.type.toUpperCase()}
              </Badge>
              <span className="font-semibold">{signal.asset}</span>
              <span className="text-sm text-gray-500">@${signal.price}</span>
            </div>
            <p className="text-xs text-gray-500">
              from {signal.creator.name} • {timeElapsed}s ago
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => onCopyTrade(signal.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Copy Trade
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDismiss(signal.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {signal.stopLoss && signal.takeProfit && (
        <div className="mt-2 text-xs text-gray-600 grid grid-cols-2 gap-4">
          <div>SL: ${signal.stopLoss}</div>
          <div>TP: ${signal.takeProfit}</div>
        </div>
      )}
    </Card>
  );
};
```

#### 8. Subscription Management Components
```typescript
// components/subscription/SubscriptionManager.tsx
export const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);

  return (
    <div className="space-y-6">
      {/* Active Subscriptions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={sub.channel.creator.avatar} />
                  <AvatarFallback>{sub.channel.creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{sub.channel.name}</h4>
                  <p className="text-sm text-gray-600">
                    Next billing: {format(sub.nextBillingDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold">${sub.amount}/month</p>
                  <Badge variant={sub.status === 'active' ? 'success' : 'secondary'}>
                    {sub.status}
                  </Badge>
                </div>
                
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <Badge variant="secondary">Primary</Badge>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Billing History</h3>
        <div className="space-y-3">
          {billingHistory.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">{record.description}</p>
                <p className="text-sm text-gray-600">
                  {format(record.date, 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${record.amount}</p>
                <Badge variant={record.status === 'paid' ? 'success' : 'destructive'}>
                  {record.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
```

#### 9. Payment Processing Component
```typescript
// components/subscription/PaymentModal.tsx
interface PaymentModalProps {
  channel: PremiumChannel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (subscriptionId: string) => void;
}

export const PaymentModal = ({ channel, isOpen, onClose, onSuccess }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Payment processing logic
      const response = await processSubscriptionPayment({
        channelId: channel.id,
        paymentMethod,
        amount: channel.pricing.monthly
      });
      
      onSuccess(response.subscriptionId);
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {channel.name}</DialogTitle>
          <DialogDescription>
            You'll get access to premium trading signals and exclusive content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subscription Summary */}
          <Card className="p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span>Monthly Subscription</span>
              <span className="font-semibold">${channel.pricing.monthly}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Billing cycle</span>
              <span>Monthly (auto-renew)</span>
            </div>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Credit Card</span>
              </Button>
              <Button
                variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('crypto')}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Crypto</span>
              </Button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'crypto' && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Connect your crypto wallet to complete the payment with APT tokens
                </p>
              </div>
              <Button variant="outline" className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe for $${channel.pricing.monthly}/mo`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

## 6. API Integration

### Community & Social Features APIs
```typescript
// services/api/community.ts
export const communityAPI = {
  // Community Posts
  getPosts: (filters?: PostFilters) => 
    api.get<CommunityPost[]>('/api/community/posts', { params: filters }),
  
  createPost: (postData: CreatePostRequest) =>
    api.post<CommunityPost>('/api/community/posts', postData),
    
  likePost: (postId: string) =>
    api.post(`/api/community/posts/${postId}/like`),
    
  addComment: (postId: string, comment: string) =>
    api.post(`/api/community/posts/${postId}/comments`, { comment }),
    
  sharePost: (postId: string) =>
    api.post(`/api/community/posts/${postId}/share`),

  // Channel Discovery
  getChannels: (filters?: ChannelFilters) =>
    api.get<PremiumChannel[]>('/api/channels', { params: filters }),
    
  getChannelDetails: (channelId: string) =>
    api.get<PremiumChannelDetails>(`/api/channels/${channelId}`),
    
  getChannelPosts: (channelId: string, page = 1) =>
    api.get<CommunityPost[]>(`/api/channels/${channelId}/posts`, { 
      params: { page } 
    }),
};
```

### Subscription & Payment APIs
```typescript
// services/api/subscriptions.ts
export const subscriptionAPI = {
  // Subscription Management
  getUserSubscriptions: () =>
    api.get<Subscription[]>('/api/subscriptions'),
    
  subscribeToChannel: (channelId: string, paymentData: PaymentRequest) =>
    api.post<SubscriptionResponse>('/api/subscriptions', {
      channelId,
      ...paymentData
    }),
    
  cancelSubscription: (subscriptionId: string) =>
    api.delete(`/api/subscriptions/${subscriptionId}`),
    
  updateSubscription: (subscriptionId: string, updates: SubscriptionUpdate) =>
    api.patch(`/api/subscriptions/${subscriptionId}`, updates),

  // Payment Processing
  processPayment: (paymentData: PaymentRequest) =>
    api.post<PaymentResponse>('/api/payments/process', paymentData),
    
  getBillingHistory: () =>
    api.get<BillingRecord[]>('/api/payments/history'),
    
  updatePaymentMethod: (methodData: PaymentMethodData) =>
    api.post<PaymentMethod>('/api/payments/methods', methodData),
    
  getPaymentMethods: () =>
    api.get<PaymentMethod[]>('/api/payments/methods'),
};
```

### Real-time Trading Signals API
```typescript
// services/api/signals.ts
export const signalsAPI = {
  // Signal Streaming
  connectSignalStream: (channelIds: string[]) => {
    const socket = io('/signals', {
      query: { channels: channelIds.join(',') }
    });
    
    return {
      onSignal: (callback: (signal: TradingSignal) => void) =>
        socket.on('new_signal', callback),
        
      onSignalUpdate: (callback: (update: SignalUpdate) => void) =>
        socket.on('signal_update', callback),
        
      disconnect: () => socket.disconnect()
    };
  },
  
  // Signal Management
  copyTrade: (signalId: string, customAmount?: number) =>
    api.post<TradeExecutionResult>(`/api/signals/${signalId}/copy`, {
      amount: customAmount
    }),
    
  getSignalHistory: (channelId: string, limit = 50) =>
    api.get<TradingSignal[]>(`/api/channels/${channelId}/signals`, {
      params: { limit }
    }),
    
  getSignalPerformance: (signalId: string) =>
    api.get<SignalPerformance>(`/api/signals/${signalId}/performance`),
};
```

## 7. TypeScript Interfaces

### Community & Social Types
```typescript
// types/community.ts
export interface CommunityPost {
  id: string;
  type: 'trade' | 'analysis' | 'discussion';
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  tradeData?: {
    symbol: string;
    side: 'buy' | 'sell';
    price: number;
    quantity: number;
    pnl: number;
    reasoning?: string;
    stopLoss?: number;
    takeProfit?: number;
  };
  tags: string[];
  visibility: 'public' | 'subscribers_only';
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: Date;
  likes: number;
}

export interface PremiumChannel {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    totalSubscribers: number;
  };
  pricing: {
    monthly: number;
    yearly?: number;
    currency: 'USD' | 'APT';
  };
  stats: {
    subscribers: number;
    avgSubscriberReturn: number;
    signalAccuracy: number;
    totalSignals: number;
    activeTraders: number;
  };
  categories: string[];
  isSubscribed: boolean;
  subscribedAt?: Date;
  tier: 'basic' | 'premium' | 'vip';
}
```

### Subscription & Payment Types
```typescript
// types/subscriptions.ts
export interface Subscription {
  id: string;
  channelId: string;
  channel: PremiumChannel;
  userId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'crypto';
  autoRenew: boolean;
}

export interface PaymentRequest {
  channelId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'crypto';
  cardData?: {
    number: string;
    expiry: string;
    cvc: string;
    holderName: string;
  };
  cryptoData?: {
    walletAddress: string;
    transactionHash?: string;
  };
}

export interface BillingRecord {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'paid' | 'failed' | 'pending' | 'refunded';
  paymentMethod: string;
  invoiceUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto';
  isPrimary: boolean;
  cardData?: {
    last4: string;
    brand: string;
    expiry: string;
  };
  cryptoData?: {
    walletAddress: string;
    network: string;
  };
  createdAt: Date;
}
```

### Trading Signal Types
```typescript
// types/signals.ts
export interface TradingSignal {
  id: string;
  channelId: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  type: 'buy' | 'sell';
  asset: string;
  price: number;
  quantity?: number;
  stopLoss?: number;
  takeProfit?: number;
  reasoning: string;
  confidence: number; // 1-10
  timeframe: string;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  performance?: {
    currentPrice: number;
    pnlPercent: number;
    followers: number;
    successRate: number;
  };
}

export interface SignalUpdate {
  signalId: string;
  type: 'price_update' | 'status_change' | 'performance_update';
  data: any;
  timestamp: Date;
}

export interface TradeExecutionResult {
  success: boolean;
  orderId?: string;
  message: string;
  executedPrice?: number;
  executedQuantity?: number;
  fees?: number;
}
```

## 8. Implementation Roadmap

### Phase 1: Foundation Setup (Week 1-2)
1. **Project Structure Enhancement**
   - Set up new routing for community/channels/subscriptions
   - Configure additional dependencies (react-query, socket.io-client)
   - Set up TypeScript interfaces and API structures

2. **Basic Community Features**
   - Implement community posts display
   - Add post creation functionality
   - Basic like/comment system

### Phase 2: Premium Channels (Week 3-4)
1. **Channel Discovery**
   - Channel listing page with filters
   - Channel detail pages
   - Creator profiles and statistics

2. **Subscription System**
   - Payment modal implementation
   - Subscription management dashboard
   - Basic billing integration

### Phase 3: Real-time Features (Week 5-6)
1. **Live Trading Signals**
   - WebSocket integration for real-time signals
   - Signal alert notifications
   - Copy trading functionality

2. **Enhanced Community**
   - Real-time post updates
   - Live chat in premium channels
   - Advanced post filtering and search

### Phase 4: Advanced Features (Week 7-8)
1. **Analytics & Performance**
   - Detailed subscription analytics
   - Signal performance tracking
   - Creator dashboard enhancements

2. **Payment & Billing**
   - Multiple payment methods
   - Crypto payment integration
   - Advanced billing management

## 9. Integration with Existing System

### Current System Compatibility
- All new features are additive and won't break existing functionality
- Maintains existing dashboard, portfolio, and trading pages
- Uses same authentication and user management system
- Extends existing API structure with new endpoints

### Database Schema Extensions
```sql
-- Community Posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  trade_data JSONB,
  visibility VARCHAR(20) DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Premium Channels
CREATE TABLE premium_channels (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pricing JSONB NOT NULL,
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  channel_id UUID REFERENCES premium_channels(id),
  status VARCHAR(20) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  amount DECIMAL(10,2),
  payment_method VARCHAR(20)
);

-- Trading Signals
CREATE TABLE trading_signals (
  id UUID PRIMARY KEY,
  channel_id UUID REFERENCES premium_channels(id),
  creator_id UUID REFERENCES users(id),
  signal_type VARCHAR(10) NOT NULL,
  asset VARCHAR(20) NOT NULL,
  price DECIMAL(15,8),
  stop_loss DECIMAL(15,8),
  take_profit DECIMAL(15,8),
  reasoning TEXT,
  confidence INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Security Considerations
1. **Authentication**: All premium features require user authentication
2. **Authorization**: Subscription-based access control for premium content
3. **Payment Security**: PCI compliance for card payments, secure wallet integration for crypto
4. **Data Protection**: User trading data and payment information encryption
5. **API Rate Limiting**: Prevent abuse of community and signal endpoints

### Performance Optimizations
1. **Caching Strategy**: Redis caching for channel data, signal history, and user subscriptions
2. **Database Indexing**: Optimized queries for community posts and signal feeds
3. **Real-time Efficiency**: WebSocket connection pooling and message queuing
4. **CDN Integration**: Static assets and image optimization for user-generated content

## 10. Monitoring & Analytics

### Key Metrics to Track
1. **Community Engagement**
   - Daily/monthly active users in community
   - Post creation and interaction rates
   - User retention in community features

2. **Subscription Performance**
   - Conversion rates from free to premium
   - Subscription retention rates
   - Revenue per channel/creator

3. **Trading Signal Effectiveness**
   - Signal accuracy and performance
   - Copy trade success rates
   - User profitability from following signals

### Development Tools
- **State Management**: Zustand for local state, React Query for server state
- **Testing**: Jest + React Testing Library for component tests
- **Monitoring**: Error tracking with Sentry, analytics with custom dashboard
- **Documentation**: Storybook for component documentation

This comprehensive frontend plan integrates seamlessly with your existing copy trading platform while adding powerful community features and a sustainable subscription model. The architecture supports real-time trading signals, social interaction, and monetization through premium channels.

---

## State Management

### Global State Architecture
Using Zustand for lightweight state management:

```typescript
// store/useAppStore.ts
interface AppState {
  // User state
  user: User | null;
  isConnected: boolean;
  
  // Portfolio state
  portfolio: Portfolio | null;
  positions: Position[];
  
  // Market data
  marketData: MarketData;
  
  // UI state
  sidebarOpen: boolean;
  currentTheme: 'light' | 'dark';
  
  // Actions
  setUser: (user: User | null) => void;
  updatePortfolio: (portfolio: Portfolio) => void;
  addPosition: (position: Position) => void;
  removePosition: (positionId: string) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isConnected: false,
  portfolio: null,
  positions: [],
  marketData: {},
  sidebarOpen: true,
  currentTheme: 'light',

  // Actions
  setUser: (user) => set({ user, isConnected: !!user }),
  
  updatePortfolio: (portfolio) => set({ portfolio }),
  
  addPosition: (position) => 
    set((state) => ({ 
      positions: [...state.positions, position] 
    })),
    
  removePosition: (positionId) =>
    set((state) => ({
      positions: state.positions.filter(p => p.id !== positionId)
    })),
    
  toggleSidebar: () => 
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

### Custom Hooks for Data Management

```typescript
// hooks/useTraders.ts
export const useTraders = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/traders/top',
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  const followTrader = async (traderId: string, amount: number) => {
    try {
      await api.post('/api/traders/follow', { traderId, amount });
      mutate(); // Revalidate data
      toast.success('Successfully following trader!');
    } catch (error) {
      toast.error('Failed to follow trader');
      throw error;
    }
  };

  const unfollowTrader = async (traderId: string) => {
    try {
      await api.post('/api/traders/unfollow', { traderId });
      mutate();
      toast.success('Unfollowed trader');
    } catch (error) {
      toast.error('Failed to unfollow trader');
      throw error;
    }
  };

  return {
    traders: data?.traders || [],
    isLoading,
    error,
    followTrader,
    unfollowTrader,
    refresh: mutate,
  };
};
```

```typescript
// hooks/useRealtime.ts
export const useRealtime = (symbol: string) => {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/realtime/${symbol}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch realtime data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { data, isConnected };
};
```

---

## UI/UX Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --color-primary: #2563eb;
  --color-primary-foreground: #ffffff;
  
  /* Success/Profit Colors */
  --color-success: #16a34a;
  --color-success-foreground: #ffffff;
  
  /* Danger/Loss Colors */
  --color-destructive: #dc2626;
  --color-destructive-foreground: #ffffff;
  
  /* Neutral Colors */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #f8fafc;
  --color-muted-foreground: #64748b;
  
  /* Border Colors */
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
}

[data-theme="dark"] {
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-border: #334155;
  --color-input: #334155;
}
```

### Typography Scale
```css
.text-display {
  font-size: 3.5rem;
  line-height: 1.2;
  font-weight: 800;
}

.text-h1 {
  font-size: 2.5rem;
  line-height: 1.2;
  font-weight: 700;
}

.text-h2 {
  font-size: 2rem;
  line-height: 1.3;
  font-weight: 600;
}

.text-h3 {
  font-size: 1.5rem;
  line-height: 1.4;
  font-weight: 600;
}

.text-body {
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 400;
}

.text-small {
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 400;
}
```

### Component Variants
```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        success: "bg-success text-success-foreground hover:bg-success/90",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## Real-time Data Integration

### WebSocket Implementation
```typescript
// hooks/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);

  return { data, isConnected, sendMessage };
};
```

### Data Polling Strategy
```typescript
// hooks/usePolling.ts
export const usePolling = <T>(
  fetcher: () => Promise<T>,
  interval: number = 2000,
  enabled: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        const result = await fetcher();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    poll();

    // Set up interval
    const intervalId = setInterval(poll, interval);

    return () => clearInterval(intervalId);
  }, [fetcher, interval, enabled]);

  return { data, error, isLoading };
};
```

---

## Implementation Timeline

### Hour 1: Project Setup & Base Components
- [x] Create Next.js project with TypeScript
- [x] Install and configure dependencies
- [x] Set up Tailwind CSS and shadcn/ui
- [x] Create base layout components

### Hour 2: Core UI Components
- [x] Implement Button, Card, Dialog components
- [x] Create navigation and sidebar
- [x] Set up routing structure
- [x] Add wallet connection UI

### Hour 3: Dashboard Layout
- [x] Create dashboard layout
- [x] Implement grid system
- [x] Add header and sidebar
- [x] Create placeholder content areas

### Hour 4: Trading Chart Integration
- [x] Install TradingView Lightweight Charts
- [x] Create TradingChart component
- [x] Implement data fetching
- [x] Add chart controls

### Hour 5: Trader Components
- [x] Create TraderCard component
- [x] Implement TraderDetails view
- [x] Add follow/unfollow functionality
- [x] Create trader list/grid views

### Hour 6: Real-time Data
- [x] Set up SWR for data fetching
- [x] Implement polling mechanism
- [x] Add real-time updates
- [x] Handle loading states

### Hour 7: Community Features
- [x] Create Leaderboard component
- [x] Implement performance rankings
- [x] Add social features
- [x] Create community dashboard

### Hour 8: Forms & User Settings
- [x] Create user preferences form
- [x] Implement risk settings
- [x] Add form validation
- [x] Handle form submissions

### Hour 9: Performance Optimization
- [x] Add lazy loading
- [x] Implement code splitting
- [x] Optimize bundle size
- [x] Add error boundaries

### Hour 10: Testing & Polish
- [x] Add loading skeletons
- [x] Implement error handling
- [x] Add animations
- [x] Final UI polish

---

## Complete Page-by-Page Frontend Specifications

### 1. Landing Page (`/`)
**Purpose**: First impression, user acquisition, and wallet connection

**Layout & Design**:
- **Hero Section**: 
  - Large heading: "Copy Trading Made Simple on Aptos"
  - Subheading: "Follow top performers, automate your trading, maximize returns"
  - Primary CTA: "Connect Wallet & Start Trading" (prominent blue button)
  - Background: Gradient with subtle trading chart animation
  
- **Stats Banner**: Real-time platform statistics
  - Total traders on platform
  - Total trading volume (24h)
  - Average user returns
  - Number of successful copies today
  
- **Feature Highlights**: 3-column grid
  - **Automated Copy Trading**: "Set once, profit always" with robot icon
  - **Risk Management**: "Your safety, our priority" with shield icon
  - **Real-time Analytics**: "Data-driven decisions" with chart icon
  
- **How It Works**: 4-step process
  - Step 1: Connect your Aptos wallet
  - Step 2: Browse and select top traders
  - Step 3: Set your risk preferences
  - Step 4: Start copying trades automatically
  
- **Top Performers Preview**: Horizontal scrolling trader cards
  - Shows 5 top traders with basic stats
  - "View All Traders" button at the end
  
- **Social Proof**: Testimonials and user count
- **Footer**: Links, social media, legal pages

**Interactive Elements**:
- Wallet connection modal on CTA click
- Animated counters for statistics
- Hover effects on feature cards
- Smooth scrolling navigation

---

### 2. Dashboard Page (`/dashboard`)
**Purpose**: Central hub for user's trading activity and portfolio overview

**Layout Structure**:
- **Top Navigation Bar**:
  - Logo and platform name
  - Wallet address display (truncated)
  - Network indicator (Aptos mainnet/testnet)
  - User avatar dropdown menu
  - Notifications bell icon with count

- **Page Header**:
  - Welcome message: "Welcome back, [Username]"
  - Last login timestamp
  - Quick action buttons: "Find Traders", "Manage Risk", "Settings"

- **Portfolio Summary Cards** (4-card grid):
  - **Total Portfolio Value**: 
    - Large number display ($125,432.56)
    - 24h change with color coding (green/red)
    - Percentage change (+2.45%)
  - **Active Copy Trades**:
    - Number of traders being copied (8)
    - Number of active positions (24)
    - Link to "Manage Copies"
  - **Today's Performance**:
    - P&L for current day ($+432.12)
    - Best performing copy trade
    - Worst performing position
  - **Monthly Returns**:
    - Current month percentage (+12.8%)
    - Comparison to previous month
    - Annual projection

- **Main Content Area** (2-column layout):
  
  **Left Column (70% width)**:
  - **Portfolio Performance Chart**:
    - Time-series chart showing portfolio value
    - Selectable timeframes: 1D, 7D, 1M, 3M, 1Y
    - Overlay options: benchmark comparison, individual trader performance
    - Interactive tooltips with exact values
    
  - **Active Positions Table**:
    - Columns: Asset, Trader, Entry Price, Current Price, P&L, Size, Actions
    - Sortable by any column
    - Color-coded P&L (green for profit, red for loss)
    - Action buttons: View Details, Close Position, Adjust Size
    - Pagination for large position lists
  
  **Right Column (30% width)**:
  - **Following Traders Panel**:
    - List of currently followed traders
    - Each item shows: trader name, allocation amount, 24h performance
    - Quick action buttons: Pause, Adjust, Unfollow
    - "Add Trader" button at bottom
  
  - **Recent Activity Feed**:
    - Live feed of copy trades executed
    - Shows: timestamp, trader, action (buy/sell), asset, amount
    - Real-time updates via WebSocket
    - "View All Activity" link
  
  - **Market Insights Widget**:
    - Trending assets on the platform
    - Popular traders this week
    - Platform-wide performance metrics

**Interactive Features**:
- Real-time data updates every 2 seconds
- Drag-and-drop to rearrange widgets
- Click-through navigation to detailed views
- Export functionality for performance data
- Quick trade execution from positions table

---

### 3. Trader Discovery Page (`/traders`)
**Purpose**: Browse, filter, and discover top-performing traders to copy

**Layout Structure**:
- **Page Header**:
  - Title: "Discover Top Traders"
  - Search bar: "Search by name, strategy, or asset"
  - View toggle: Grid view vs List view
  - Sort dropdown: "Top Rated", "Highest Returns", "Most Followers", "Newest"

- **Filter Sidebar** (collapsible on mobile):
  - **Performance Filters**:
    - Minimum monthly return slider (0% to 100%+)
    - Maximum drawdown slider (0% to -50%)
    - Sharpe ratio range
    - Win rate minimum (slider 0% to 100%)
  
  - **Risk Filters**:
    - Risk level checkboxes: Low, Medium, High
    - Average position size range
    - Maximum leverage used
    - Stop loss usage (Yes/No)
  
  - **Strategy Filters**:
    - Trading style: Scalping, Day Trading, Swing, Long-term
    - Asset categories: DeFi, NFTs, Meme Coins, Blue Chips
    - Trading frequency: High, Medium, Low
  
  - **Social Filters**:
    - Minimum followers count
    - Verified traders only
    - Active in last 7 days
    - Accepting new copiers

- **Main Content Area**:
  
  **Grid View** (default):
  - 3-column grid on desktop, 2-column on tablet, 1-column on mobile
  - Each trader card contains:
    - **Header**: Profile photo, name, username, verification badge
    - **Key Stats**: Monthly return, followers count, risk rating
    - **Performance Metrics**: Win rate, average hold time, Sharpe ratio
    - **Chart**: Mini performance chart (last 30 days)
    - **Strategy Tags**: Visual tags for trading style and assets
    - **Action Buttons**: "Follow" (primary), "View Profile" (secondary)
    - **Quick Info**: Last active, total trades, avg position size
  
  **List View**:
  - Table format with columns:
    - Trader (photo, name, verification)
    - 1M Return (percentage and chart)
    - 3M Return
    - Followers
    - Risk Level
    - Sharpe Ratio
    - Win Rate
    - Last Active
    - Actions (Follow/View buttons)

- **Pagination/Loading**:
  - Infinite scroll or traditional pagination
  - Loading skeletons during data fetch
  - "Load More" button if using pagination

**Interactive Features**:
- Real-time filter application
- Favorite traders (heart icon)
- Quick follow without page navigation
- Hover effects showing additional stats
- Sort by multiple criteria
- Export trader list functionality

---

### 4. Individual Trader Profile Page (`/traders/[id]`)
**Purpose**: Detailed view of a specific trader's performance and strategy

**Layout Structure**:
- **Trader Header Section**:
  - **Left Side**:
    - Large profile photo
    - Trader name and username
    - Verification badges (verified, pro trader, etc.)
    - Registration date and country flag
    - Social links (Twitter, Telegram if available)
  
  - **Right Side**:
    - **Follow/Unfollow Button** (prominent)
    - **Current Allocation** input field and "Update" button (if following)
    - **Quick Stats Cards**:
      - Total followers
      - Current copiers
      - Total trades executed
      - Account age

- **Performance Overview Section** (3-column layout):
  - **Return Metrics**:
    - 7D, 30D, 90D, 1Y returns
    - All-time return since joining
    - Best month / Worst month
    - Year-to-date performance
  
  - **Risk Metrics**:
    - Maximum drawdown
    - Sharpe ratio
    - Sortino ratio
    - Value at Risk (VaR)
    - Risk-adjusted return
  
  - **Trading Metrics**:
    - Win rate percentage
    - Average holding time
    - Trading frequency (trades per week)
    - Average position size
    - Largest single gain/loss

- **Interactive Performance Chart**:
  - Large time-series chart showing account value over time
  - Selectable timeframes: 1M, 3M, 6M, 1Y, All
  - Overlay options:
    - Benchmark comparison (e.g., APT price)
    - Drawdown visualization
    - Major trade markers
  - Chart controls: zoom, pan, crosshair cursor
  - Export chart functionality

- **Trading Strategy Section**:
  - **Strategy Description**: Trader's own description of their approach
  - **Asset Allocation Pie Chart**: Current portfolio distribution
  - **Trading Style Tags**: Visual indicators (Scalper, DeFi Farmer, etc.)
  - **Preferred Assets**: List of most traded tokens
  - **Trading Hours**: Heatmap showing when trader is most active
  - **Average Hold Times**: Distribution chart of position durations

- **Trade History Table**:
  - Columns: Date, Action, Asset, Entry Price, Exit Price, Size, P&L, Duration
  - Sortable and filterable by date range, asset, profit/loss
  - Pagination with 20 trades per page
  - Export to CSV functionality
  - Color coding for profitable vs losing trades

- **Follower Analytics**:
  - **Follower Growth Chart**: How follower count has changed over time
  - **Copy Allocation Distribution**: Chart showing how much followers typically allocate
  - **Follower Performance**: Average returns of people copying this trader
  - **Recent Followers**: List of newest followers (if public)

- **Risk Management Section**:
  - **Stop Loss Usage**: Percentage of trades with stop losses
  - **Position Sizing**: Chart showing position size distribution
  - **Correlation Analysis**: How trades correlate with market movements
  - **Risk Controls**: What automated risk controls the trader uses

- **Social Features**:
  - **Comments Section**: Follower comments and trader responses
  - **Trading Notes**: Trader's explanations for recent trades
  - **Social Stats**: Likes, shares, saves from the community
  - **Similar Traders**: Recommendations for traders with similar strategies

**Interactive Features**:
- Follow/unfollow with real-time updates
- Allocation amount adjustment with immediate effect
- Trade copying toggle (can pause without unfollowing)
- Real-time chat or messaging with trader (if enabled)
- Bookmark trader for later review
- Share trader profile on social media
- Report trader if suspicious activity detected

---

### 5. Portfolio Management Page (`/portfolio`)
**Purpose**: Detailed portfolio analysis and management tools

**Layout Structure**:
- **Portfolio Header**:
  - **Total Portfolio Value**: Large display with real-time updates
  - **Performance Summary**: Cards showing 1D, 7D, 30D performance
  - **Asset Allocation**: Pie chart showing distribution across different assets
  - **Risk Score**: Overall portfolio risk rating with explanation

- **Position Management Section**:
  - **Active Positions Table** (detailed version):
    - Asset name with logo
    - Trader who initiated the position
    - Entry date and price
    - Current price with real-time updates
    - Unrealized P&L ($ and %)
    - Position size and allocation percentage
    - Risk metrics (beta, volatility)
    - Action buttons: Close, Modify, Add to position
  
  - **Position Filters**:
    - Filter by trader
    - Filter by asset type
    - Filter by profit/loss status
    - Filter by position size
    - Date range selector

- **Copy Trade Management**:
  - **Active Copy Trades Table**:
    - Trader name and photo
    - Start date of copying
    - Amount allocated
    - Performance since copying started
    - Current exposure (how much is actively invested)
    - Status (Active, Paused, Closed)
    - Action buttons: Pause, Adjust Allocation, Stop Copying
  
  - **Copy Trade Settings** (expandable for each trader):
    - Maximum allocation per trade
    - Stop loss settings
    - Take profit settings
    - Asset blacklist (assets not to copy)
    - Time-based filters (when to copy)

- **Performance Analytics**:
  - **Returns Chart**: Interactive chart with multiple overlays
    - Portfolio performance line
    - Individual trader performance lines
    - Benchmark comparison (APT, market index)
    - Risk-adjusted returns
  
  - **Risk Analysis**:
    - Portfolio beta and alpha
    - Sharpe and Sortino ratios
    - Maximum drawdown analysis
    - Value at Risk calculations
    - Correlation matrix with major assets

- **Trade History Section**:
  - **All Trades Table**: Complete history of executed trades
    - Columns: Date, Trader, Action, Asset, Price, Size, Fees, P&L
    - Advanced filtering and sorting options
    - Export functionality (CSV, PDF)
    - Trade tagging and notes
  
  - **Performance Attribution**:
    - Which traders contributed most to returns
    - Which assets performed best/worst
    - Monthly/quarterly performance breakdown
    - Risk attribution analysis

**Interactive Features**:
- Real-time position updates
- Bulk actions for multiple positions
- Advanced charting with technical indicators
- Custom alerts and notifications
- Portfolio optimization suggestions
- Rebalancing recommendations
- Risk warnings and limit notifications

---

### 6. Risk Management Page (`/risk`)
**Purpose**: Configure risk parameters and monitor portfolio risk

**Layout Structure**:
- **Risk Overview Dashboard**:
  - **Current Risk Score**: Large gauge showing overall portfolio risk (1-10 scale)
  - **Risk Breakdown**: Cards showing different risk components
    - Concentration risk
    - Liquidity risk
    - Volatility risk
    - Correlation risk
  - **Risk Alerts**: Active warnings and recommendations

- **Global Risk Settings**:
  - **Portfolio Limits**:
    - Maximum total portfolio allocation (percentage of balance)
    - Maximum allocation per trader (percentage and dollar amount)
    - Maximum allocation per asset (percentage)
    - Maximum number of concurrent positions
  
  - **Loss Limits**:
    - Daily loss limit (percentage and dollar amount)
    - Monthly loss limit
    - Maximum drawdown before auto-stop
    - Per-position stop loss percentage
  
  - **Time-based Controls**:
    - Trading hours restrictions
    - Weekend trading toggle
    - Maximum holding time per position
    - Cooling-off periods between large losses

- **Trader-Specific Risk Controls**:
  - **For Each Followed Trader**:
    - Individual allocation limits
    - Custom stop loss settings
    - Asset restrictions (blacklist certain tokens)
    - Strategy filters (only copy certain types of trades)
    - Performance-based adjustments (reduce allocation after losses)

- **Risk Monitoring Tools**:
  - **Real-time Risk Metrics**:
    - Portfolio volatility
    - Beta relative to market
    - Correlation between positions
    - Concentration ratios
  
  - **Stress Testing**:
    - What-if scenarios (market crash, specific asset collapse)
    - Historical stress test results
    - Monte Carlo simulations
    - Scenario analysis tools
  
  - **Risk Alerts Configuration**:
    - Email/SMS alert settings
    - Push notification preferences
    - Alert thresholds for various risk metrics
    - Emergency contact information

- **Advanced Risk Features**:
  - **Portfolio Hedging**:
    - Automatic hedging suggestions
    - Correlation-based hedging
    - Market-neutral strategies
    - Options-based protection (if available)
  
  - **Dynamic Risk Adjustment**:
    - Volatility-based position sizing
    - Kelly criterion implementation
    - Risk parity allocation
    - Adaptive risk limits based on market conditions

**Interactive Features**:
- Real-time risk calculations
- Interactive risk scenario modeling
- Custom risk alerts and notifications
- Risk limit testing before implementation
- Historical risk analysis
- Risk reporting and compliance tools

---

### 7. Community Page (`/community`) - Enhanced Social Hub
**Purpose**: Social features, leaderboards, community posts, and premium channel discovery

**Layout Structure**:
- **Community Header**:
  - Welcome message and community stats
  - Quick navigation tabs: Feed, Leaderboard, Channels, My Posts
  - User's community level and achievements
  - "Create Post" button (prominent)

- **Main Feed Section**:
  - **Create Post Widget**:
    - Post type selector: Text, Trade Share, Strategy, News
    - Rich text editor with media upload
    - Trading position sharing (auto-fill from portfolio)
    - Hashtag suggestions and mentions
    - Privacy settings (Public, Followers, Premium Channel)
  
  - **Social Feed**:
    - **Post Types Display**:
      - Text posts with market analysis
      - Trade sharing with P&L screenshots
      - Strategy explanations with charts
      - Achievement celebrations
      - Market news and commentary
    
    - **Post Interactions**:
      - Like, comment, share, save
      - Follow/unfollow post author
      - Copy trade button (if trade post)
      - Report inappropriate content
    
    - **Post Filtering**:
      - Filter by post type
      - Filter by followed users
      - Filter by performance (profitable trades only)
      - Filter by asset/market

- **Premium Channels Discovery**:
  - **Featured Channels Section**:
    - Top performing channels (by subscriber returns)
    - Newest channels with introductory offers
    - Most popular channels by subscriber count
    - Verified trader channels
  
  - **Channel Preview Cards**:
    - Channel name and creator profile
    - Subscription price (monthly/yearly)
    - Number of subscribers
    - Average subscriber returns
    - Sample posts/signals (last 24h)
    - "Subscribe" button with price
    - Free trial availability

- **Leaderboard Section** (Same as before):
  - Top Performers, Most Followed, etc.
  - Now includes "Channel Creators" leaderboard

**Interactive Features**:
- Real-time post updates and notifications
- Live chat in channel previews
- Community voting and polls
- Post analytics for creators
- Social sharing integration
- Advanced post search and filtering

---

### 8. Premium Channels Page (`/community/channels`)
**Purpose**: Discover and subscribe to premium trading channels

**Layout Structure**:
- **Page Header**:
  - Title: "Premium Trading Channels"
  - Search bar: "Search channels by name, strategy, or creator"
  - Filter options: Price range, Performance, Category
  - Sort dropdown: "Top Rated", "Best Performance", "Most Subscribers", "Newest"

- **Filter Sidebar**:
  - **Price Filters**:
    - Price range slider ($0 - $500/month)
    - Free trial available
    - Discount offers
    - Payment frequency (monthly/yearly)
  
  - **Performance Filters**:
    - Minimum subscriber returns
    - Channel creator performance
    - Number of signals per day
    - Success rate of signals
  
  - **Category Filters**:
    - DeFi signals
    - NFT trading
    - Swing trading
    - Day trading
    - Long-term investing

- **Channel Grid Display**:
  - **Channel Cards**:
    - Creator profile with verification badge
    - Channel name and description
    - Subscription pricing
    - Key statistics (subscribers, avg returns, signal frequency)
    - Performance chart (last 30 days)
    - Sample recent signals
    - Member testimonials/reviews
    - "Subscribe Now" or "Free Trial" button

**Interactive Features**:
- Channel preview without subscription
- Compare multiple channels
- Wishlist favorite channels
- Share channel recommendations
- Filter by subscriber reviews

---

### 9. Individual Channel Page (`/community/channels/[id]`)
**Purpose**: Detailed view of a premium channel with subscription options

**Layout Structure**:
- **Channel Header**:
  - **Left Side**:
    - Channel banner/logo
    - Channel name and tagline
    - Creator profile and verification
    - Channel category tags
    - Creation date and subscriber count
  
  - **Right Side**:
    - **Subscription Widget**:
      - Current pricing (monthly/yearly)
      - Free trial information
      - "Subscribe Now" button
      - "Start Free Trial" button
      - Money-back guarantee info

- **Channel Statistics Section**:
  - **Performance Metrics**:
    - Average subscriber returns
    - Signal accuracy rate
    - Signals per week
    - Average holding time
    - Best performing month
  
  - **Subscriber Analytics**:
    - Total subscribers
    - Subscriber growth chart
    - Retention rate
    - Average subscription length
    - Testimonials and reviews

- **Sample Content Preview**:
  - **Recent Signals** (last 5 without details):
    - Signal type and asset
    - Entry price and timestamp
    - Current status (open/closed)
    - P&L if closed (blurred for non-subscribers)
  
  - **Educational Content Preview**:
    - Strategy explanations
    - Market analysis posts
    - Trading tips and insights
    - Live trading session recordings

- **Subscription Benefits**:
  - **What You Get**:
    - Real-time trading signals
    - Entry/exit notifications
    - Risk management advice
    - Educational content access
    - Community chat access
    - Strategy explanations
  
  - **Pricing Tiers** (if multiple):
    - Basic: Signals only
    - Premium: Signals + education
    - VIP: Everything + 1-on-1 sessions

**Interactive Features**:
- Subscribe with one click
- Payment processing integration
- Free trial activation
- Review and rating system
- Channel recommendation engine
- Social sharing of channel

---

### 10. My Subscriptions Page (`/subscriptions`)
**Purpose**: Manage active subscriptions and view subscription benefits

**Layout Structure**:
- **Subscriptions Overview**:
  - **Active Subscriptions Cards**:
    - Channel name and creator
    - Subscription type and price
    - Next billing date
    - Days remaining if trial
    - Performance since subscribing
    - Quick actions: Pause, Cancel, Upgrade
  
  - **Subscription Statistics**:
    - Total monthly subscription cost
    - Average return across all channels
    - Best performing subscription
    - Money saved/earned from signals

- **Real-time Signals Feed**:
  - **Live Trading Alerts**:
    - Channel name and creator photo
    - Signal type (Buy/Sell/Hold)
    - Asset name and current price
    - Recommended entry price
    - Stop loss and take profit levels
    - Risk level and position size suggestion
    - Time since signal (live counter)
  
  - **Signal Interactions**:
    - "Copy Trade" button
    - "Add to Watchlist" button
    - Like/save signal
    - Comment on signal
    - Report signal accuracy

- **Channel Chat Access**:
  - **Active Channel Chats**:
    - Real-time chat with other subscribers
    - Creator occasional participation
    - Q&A sessions
    - Signal discussions
    - Market analysis debates

**Interactive Features**:
- Real-time signal notifications
- One-click trade copying from signals
- Signal performance tracking
- Subscription management tools
- Billing history and invoices

---

### 11. Channel Management Page (`/subscriptions/manage`)
**Purpose**: For channel creators to manage their premium channels

**Layout Structure**:
- **Channel Overview Dashboard**:
  - **Channel Statistics**:
    - Total subscribers
    - Monthly recurring revenue
    - Subscriber growth rate
    - Average subscriber lifetime
    - Channel performance rating
  
  - **Revenue Analytics**:
    - Monthly revenue chart
    - Subscription conversion rates
    - Trial to paid conversion
    - Churn rate analysis
    - Revenue projections

- **Content Management**:
  - **Signal Publishing**:
    - Quick signal creation form
    - Signal templates for common setups
    - Bulk signal publishing
    - Signal scheduling
    - Performance tracking per signal
  
  - **Post Management**:
    - Create educational content
    - Market analysis posts
    - Strategy explanations
    - Community announcements
    - Subscriber-only content

- **Subscriber Management**:
  - **Subscriber List**:
    - Subscriber profiles and join dates
    - Subscription status and type
    - Performance of each subscriber
    - Engagement metrics
    - Communication tools
  
  - **Engagement Tools**:
    - Send messages to all subscribers
    - Schedule announcements
    - Create polls and surveys
    - Host live Q&A sessions
    - Moderate channel chat

- **Channel Settings**:
  - **Pricing Management**:
    - Subscription price adjustment
    - Free trial duration
    - Discount promotions
    - Payment frequency options
    - Currency selection
  
  - **Channel Configuration**:
    - Channel description and rules
    - Content categories
    - Privacy settings
    - Moderation settings
    - Auto-responses setup

**Interactive Features**:
- Real-time subscriber notifications
- Signal performance analytics
- Revenue optimization suggestions
- Subscriber feedback system
- Channel promotion tools

---

### 12. Payment Processing Page (`/subscriptions/payment`)
**Purpose**: Handle subscription payments and billing

**Layout Structure**:
- **Payment Form**:
  - **Subscription Details**:
    - Channel name and creator
    - Subscription type and benefits
    - Pricing breakdown
    - Tax calculations (if applicable)
    - Total amount due
  
  - **Payment Methods**:
    - Credit/Debit card form
    - Crypto payment options (APT, USDC)
    - PayPal integration
    - Bank transfer (for higher amounts)
    - Saved payment methods
  
  - **Billing Information**:
    - Billing address
    - Tax identification (if required)
    - Invoice preferences
    - Billing frequency selection
    - Auto-renewal settings

- **Payment Security**:
  - **Security Features**:
    - SSL encryption indicators
    - Payment processor badges
    - Security policy links
    - Refund policy information
    - Customer support contact

- **Order Summary**:
  - **Final Review**:
    - Complete subscription details
    - Payment method confirmation
    - Terms and conditions
    - Money-back guarantee info
    - "Complete Payment" button

**Interactive Features**:
- Real-time payment processing
- Payment failure handling
- Subscription confirmation
- Automatic invoice generation
- Receipt email sending

---

### 8. Analytics & Reports Page (`/analytics`)
**Purpose**: Advanced analytics, detailed reporting, and performance insights

**Layout Structure**:
- **Analytics Dashboard Header**:
  - Date range selector (1M, 3M, 6M, 1Y, Custom)
  - Report type selector (Performance, Risk, Tax, Attribution)
  - Export options (PDF, Excel, CSV)

- **Performance Analytics Section**:
  - **Return Analysis**:
    - Time-weighted returns vs money-weighted returns
    - Benchmark comparison charts
    - Rolling returns analysis
    - Return attribution by trader and asset
  
  - **Risk-Adjusted Performance**:
    - Sharpe ratio evolution over time
    - Information ratio analysis
    - Maximum drawdown periods
    - Upside/downside capture ratios
  
  - **Performance Attribution**:
    - Which traders contributed most to returns
    - Asset allocation impact on performance
    - Timing effect analysis
    - Alpha and beta decomposition

- **Risk Analytics Section**:
  - **Portfolio Risk Metrics**:
    - Value at Risk (VaR) calculations
    - Expected Shortfall (ES)
    - Portfolio volatility breakdown
    - Risk contribution by position
  
  - **Correlation Analysis**:
    - Asset correlation matrix
    - Rolling correlation charts
    - Principal component analysis
    - Factor exposure analysis
  
  - **Stress Testing Results**:
    - Historical scenario analysis
    - Monte Carlo simulation results
    - Tail risk analysis
    - Liquidity risk assessment

- **Trading Analytics Section**:
  - **Trade Analysis**:
    - Win/loss ratio trends
    - Average trade duration
    - Trade size distribution
    - Slippage and execution analysis
  
  - **Trader Performance Comparison**:
    - Side-by-side trader comparison
    - Relative performance metrics
    - Style analysis and categorization
    - Consistency scoring

- **Custom Reports Section**:
  - **Report Builder**:
    - Drag-and-drop report creation
    - Custom metric selection
    - Flexible date ranges
    - Multiple visualization options
  
  - **Scheduled Reports**:
    - Daily/weekly/monthly automated reports
    - Email delivery options
    - Custom report templates
    - Performance alert integration

**Interactive Features**:
- Interactive charts with drill-down capabilities
- Custom dashboard creation
- Advanced filtering and sorting
- Real-time metric calculations
- Comparative analysis tools
- Data export in multiple formats

---

### 9. Settings Page (`/settings`)
**Purpose**: User preferences, account management, and platform configuration

**Layout Structure**:
- **Settings Navigation Sidebar**:
  - Account Settings
  - Trading Preferences  
  - Risk Management
  - Notifications
  - Security
  - Privacy
  - Billing & Subscription
  - API Management

- **Account Settings Tab**:
  - **Profile Information**:
    - Profile photo upload
    - Display name and username
    - Bio and description
    - Country and timezone
    - Preferred language
  
  - **Contact Information**:
    - Email address (verified)
    - Phone number (for 2FA)
    - Emergency contact
    - Communication preferences

- **Trading Preferences Tab**:
  - **Default Settings**:
    - Default allocation amount for new follows
    - Preferred position sizing method
    - Default stop loss percentage
    - Auto-reinvest profits toggle
  
  - **User Interface Preferences**:
    - Theme selection (Light/Dark/Auto)
    - Dashboard layout preferences
    - Chart preferences and indicators
    - Table display options

- **Notifications Tab**:
  - **Notification Types**:
    - Trade execution notifications
    - Performance milestone alerts
    - Risk limit warnings
    - New trader recommendations
    - Market news and updates
  
  - **Delivery Methods**:
    - In-app notifications
    - Email notifications
    - SMS notifications
    - Push notifications
    - Webhook URLs

- **Security Tab**:
  - **Authentication**:
    - Two-factor authentication setup
    - Backup codes generation
    - Login history and active sessions
    - Password change options
  
  - **Wallet Security**:
    - Connected wallet management
    - Transaction signing preferences
    - Withdrawal limits and confirmations
    - Hardware wallet integration

- **Privacy Tab**:
  - **Profile Visibility**:
    - Public profile toggle
    - Performance sharing preferences
    - Social features participation
    - Data sharing with traders
  
  - **Data Management**:
    - Data export options
    - Account deletion requests
    - Privacy policy acknowledgment
    - Cookie preferences

**Interactive Features**:
- Real-time setting validation
- Import/export settings functionality
- Setting backup and restore
- Advanced security verification
- Integration testing tools
- Help documentation links

This comprehensive page specification provides complete detail for every frontend page, including layout, functionality, interactive features, and user experience considerations. Each page is designed to work seamlessly together while serving specific user needs in the copy trading platform.

---

## Testing Strategy

### Unit Testing
```typescript
// __tests__/components/TraderCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TraderCard } from '@/components/trader/TraderCard';

const mockTrader = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  monthlyReturn: 15.5,
  followers: 1250,
  riskLevel: 'medium' as const,
  winRate: 75,
  avgHoldTime: '2.5d',
  sharpeRatio: 1.8,
};

describe('TraderCard', () => {
  it('renders trader information correctly', () => {
    render(
      <TraderCard
        trader={mockTrader}
        onFollow={jest.fn()}
        onUnfollow={jest.fn()}
        isFollowing={false}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('+15.5%')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
  });

  it('calls onFollow when follow button is clicked', () => {
    const onFollow = jest.fn();
    
    render(
      <TraderCard
        trader={mockTrader}
        onFollow={onFollow}
        onUnfollow={jest.fn()}
        isFollowing={false}
      />
    );

    fireEvent.click(screen.getByText('Follow'));
    expect(onFollow).toHaveBeenCalledWith('1');
  });
});
```

### Integration Testing
```typescript
// __tests__/pages/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';
import { useAppStore } from '@/store/useAppStore';

jest.mock('@/store/useAppStore');
jest.mock('@/hooks/usePortfolio');
jest.mock('@/hooks/useTraders');

describe('Dashboard Page', () => {
  beforeEach(() => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'Test User' },
    });
  });

  it('renders dashboard when user is logged in', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Value')).toBeInTheDocument();
      expect(screen.getByText('Active Positions')).toBeInTheDocument();
    });
  });

  it('shows login prompt when user is not logged in', () => {
    (useAppStore as jest.Mock).mockReturnValue({
      user: null,
    });

    render(<Dashboard />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
```

### E2E Testing
```typescript
// e2e/trader-discovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Trader Discovery', () => {
  test('should display traders and allow filtering', async ({ page }) => {
    await page.goto('/traders');
    
    // Check if traders are displayed
    await expect(page.locator('[data-testid="trader-card"]').first()).toBeVisible();
    
    // Test filtering
    await page.click('[data-testid="filter-button"]');
    await page.selectOption('[data-testid="risk-filter"]', 'low');
    await page.click('[data-testid="apply-filters"]');
    
    // Verify filter applied
    await expect(page.locator('[data-testid="trader-card"]')).toContainText('LOW');
  });

  test('should allow following a trader', async ({ page }) => {
    await page.goto('/traders');
    
    const firstTraderCard = page.locator('[data-testid="trader-card"]').first();
    await firstTraderCard.locator('[data-testid="follow-button"]').click();
    
    // Should show success message
    await expect(page.locator('[data-testid="toast"]')).toContainText('Successfully following');
    
    // Button should change to "Unfollow"
    await expect(firstTraderCard.locator('[data-testid="follow-button"]')).toContainText('Unfollow');
  });
});
```

---

## Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for large components
const TradingChart = dynamic(() => import('@/components/charts/TradingChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const TraderDetails = dynamic(() => import('@/components/trader/TraderDetails'), {
  loading: () => <DetailsSkeleton />,
});
```

### Memoization
```typescript
// Memoize expensive calculations
const memoizedStats = useMemo(() => {
  return calculatePortfolioStats(positions, prices);
}, [positions, prices]);

// Memoize components that don't change often
const MemoizedTraderCard = memo(TraderCard, (prevProps, nextProps) => {
  return prevProps.trader.id === nextProps.trader.id &&
         prevProps.isFollowing === nextProps.isFollowing;
});
```

### Virtual Scrolling
```typescript
// For large lists of traders
import { FixedSizeList as List } from 'react-window';

const TraderList = ({ traders }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TraderCard trader={traders[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={traders.length}
      itemSize={200}
    >
      {Row}
    </List>
  );
};
```

This comprehensive frontend plan provides everything needed to build a professional, scalable, and performant copy trading platform frontend. The modular architecture ensures maintainability while the real-time features provide the responsive experience users expect from modern trading applications.