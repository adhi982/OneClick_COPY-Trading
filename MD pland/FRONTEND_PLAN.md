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

### 7. Community Page (`/community`)
**Purpose**: Social features, leaderboards, and community engagement

**Layout Structure**:
- **Community Header**:
  - Welcome message and community stats
  - Quick navigation tabs: Leaderboard, Discussions, Insights, Events
  - User's community level and achievements

- **Leaderboard Section**:
  - **Multiple Leaderboard Types**:
    - Top Performers (monthly returns)
    - Most Followed Traders
    - Best Risk-Adjusted Returns
    - Rising Stars (new traders with good performance)
    - Community Favorites (most liked/commented)
  
  - **Leaderboard Display**:
    - Ranking positions (1-100)
    - Trader avatars and names
    - Key performance metrics
    - Verification badges
    - Follow buttons for easy copying
    - Percentage changes from previous period

- **Discussions & Social Feed**:
  - **Trading Discussions**:
    - Recent posts from traders and community
    - Market analysis and predictions
    - Trading tips and strategies
    - Q&A sections with experienced traders
  
  - **Post Types**:
    - Text posts with market analysis
    - Trade explanations and reasoning
    - Educational content and tutorials
    - Market news and updates
    - Achievement celebrations
  
  - **Interaction Features**:
    - Like, comment, and share posts
    - Follow specific discussion topics
    - Tag other users and traders
    - Share trading results and screenshots

- **Market Insights Section**:
  - **Community Sentiment**:
    - Bullish/bearish sentiment indicators
    - Most discussed assets
    - Community predictions and polls
    - Sentiment heat map by asset
  
  - **Trending Topics**:
    - Hot discussion topics
    - Trending hashtags
    - Popular trading strategies
    - Emerging market opportunities
  
  - **Educational Content**:
    - Trading guides and tutorials
    - Strategy explanations
    - Risk management tips
    - Platform how-to guides

- **Events & Competitions**:
  - **Trading Competitions**:
    - Monthly trading challenges
    - Leaderboard competitions
    - Prize pools and rewards
    - Competition rules and standings
  
  - **Community Events**:
    - Live trading sessions
    - AMA (Ask Me Anything) with top traders
    - Educational webinars
    - Community meetups (virtual/physical)
  
  - **Achievement System**:
    - Trading milestones and badges
    - Community contribution rewards
    - Referral program achievements
    - Special recognition for top performers

**Interactive Features**:
- Real-time community feed updates
- Live chat during events
- Community voting and polls
- User-generated content submission
- Social sharing integration
- Community moderation tools

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