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
\`\`\`
User Login (Wallet) → Dashboard → Trader Selection → Risk Setup → Live Trading → Analytics
\`\`\`

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
\`\`\`json
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
\`\`\`

### Package.json Dependencies
\`\`\`json
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
\`\`\`

---

## Project Structure

\`\`\`
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
│   │   ├── page.tsx             # Community hub
│   │   └── leaderboard/page.tsx # Leaderboards
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
│   │   └── SocialStats.tsx
│   └── wallet/                  # Wallet components
│       ├── WalletButton.tsx
│       ├── WalletModal.tsx
│       └── NetworkSelector.tsx
├── hooks/                       # Custom React hooks
│   ├── useAptos.ts             # Aptos blockchain integration
│   ├── useTraders.ts           # Trader data management
│   ├── usePortfolio.ts         # Portfolio state
│   ├── useRealtime.ts          # Real-time data
│   └── useWebSocket.ts         # WebSocket connections
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
\`\`\`

---

## Component Architecture

### Core Component Hierarchy

#### 1. Layout Components
\`\`\`typescript
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
\`\`\`

#### 2. Dashboard Components
\`\`\`typescript
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
\`\`\`

#### 3. Trading Chart Component
\`\`\`typescript
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
\`\`\`

#### 4. Trader Card Component
\`\`\`typescript
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
\`\`\`

---

## State Management

### Global State Architecture
Using Zustand for lightweight state management:

\`\`\`typescript
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
\`\`\`

### Custom Hooks for Data Management

\`\`\`typescript
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
\`\`\`

\`\`\`typescript
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
\`\`\`

---

## UI/UX Design System

### Color Palette
\`\`\`css
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
\`\`\`

### Typography Scale
\`\`\`css
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
\`\`\`

### Component Variants
\`\`\`typescript
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
\`\`\`

---

## Real-time Data Integration

### WebSocket Implementation
\`\`\`typescript
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
\`\`\`

### Data Polling Strategy
\`\`\`typescript
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
\`\`\`

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

## Code Examples

### Main Dashboard Page
\`\`\`typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  const { user } = useAppStore();
  const { portfolio } = usePortfolio();
  const { traders } = useTraders();

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Value"
            value={`$${portfolio?.totalValue.toLocaleString()}`}
            change={portfolio?.dayChange}
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatsCard
            title="Active Positions"
            value={portfolio?.activePositions.toString()}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatsCard
            title="Following"
            value={portfolio?.followingCount.toString()}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            title="Monthly Return"
            value={`${portfolio?.monthlyReturn}%`}
            change={portfolio?.monthlyReturn}
            icon={<Percent className="h-6 w-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
              <TradingChart 
                symbol="PORTFOLIO" 
                interval="1D"
                height={400}
                showVWAP={true}
              />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Positions</h3>
              <ActivePositionsTable positions={portfolio?.positions} />
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Traders</h3>
              <div className="space-y-3">
                {traders.slice(0, 5).map(trader => (
                  <TraderQuickCard key={trader.id} trader={trader} />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <RecentActivityFeed />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
\`\`\`

### Trader Discovery Page
\`\`\`typescript
// app/traders/page.tsx
export default function TradersPage() {
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    minReturn: 0,
    timeframe: '30d',
    strategy: 'all'
  });
  
  const { traders, isLoading } = useTraders(filters);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Discover Traders</h1>
          <Button onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        <TraderFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Trader Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <TraderCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traders.map(trader => (
              <TraderCard
                key={trader.id}
                trader={trader}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                isFollowing={followedTraders.includes(trader.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
\`\`\`

---

## Testing Strategy

### Unit Testing
\`\`\`typescript
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
\`\`\`

### Integration Testing
\`\`\`typescript
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
\`\`\`

### E2E Testing
\`\`\`typescript
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
\`\`\`

---

## Performance Optimization

### Code Splitting
\`\`\`typescript
// Dynamic imports for large components
const TradingChart = dynamic(() => import('@/components/charts/TradingChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const TraderDetails = dynamic(() => import('@/components/trader/TraderDetails'), {
  loading: () => <DetailsSkeleton />,
});
\`\`\`

### Memoization
\`\`\`typescript
// Memoize expensive calculations
const memoizedStats = useMemo(() => {
  return calculatePortfolioStats(positions, prices);
}, [positions, prices]);

// Memoize components that don't change often
const MemoizedTraderCard = memo(TraderCard, (prevProps, nextProps) => {
  return prevProps.trader.id === nextProps.trader.id &&
         prevProps.isFollowing === nextProps.isFollowing;
});
\`\`\`

### Virtual Scrolling
\`\`\`typescript
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
\`\`\`

This comprehensive frontend plan provides everything needed to build a professional, scalable, and performant copy trading platform frontend. The modular architecture ensures maintainability while the real-time features provide the responsive experience users expect from modern trading applications.
