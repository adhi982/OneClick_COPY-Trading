# Project Structure
*OneClick Copy-Trading Platform - Complete Project Organization*

```
OneClick_COPY-Trading/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json
│
├── docs/                                    # 📚 Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── USER_MANUAL.md
│   └── DEVELOPER_SETUP.md
│
├── frontend/                                # 🎨 Frontend Application (Next.js)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .env.local
│   │
│   ├── public/                              # Static Assets
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   ├── icons/                           # Icon assets
│   │   │   ├── wallet-icon.svg
│   │   │   ├── trading-icon.svg
│   │   │   └── analytics-icon.svg
│   │   └── images/                          # Image assets
│   │       ├── hero-bg.jpg
│   │       ├── trader-avatars/
│   │       └── screenshots/
│   │
│   └── src/                                 # Source Code
│       ├── components/                      # React Components
│       │   ├── ui/                          # Base UI Components
│       │   │   ├── button.tsx
│       │   │   ├── input.tsx
│       │   │   ├── modal.tsx
│       │   │   ├── dropdown.tsx
│       │   │   ├── card.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── tooltip.tsx
│       │   │   └── loading.tsx
│       │   │
│       │   ├── layout/                      # Layout Components
│       │   │   ├── Header.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── Navigation.tsx
│       │   │   └── MobileMenu.tsx
│       │   │
│       │   ├── trading/                     # Trading Components
│       │   │   ├── TradingDashboard.tsx
│       │   │   ├── OrderBook.tsx
│       │   │   ├── TradingChart.tsx
│       │   │   ├── TradeHistory.tsx
│       │   │   ├── PositionManager.tsx
│       │   │   ├── RiskControls.tsx
│       │   │   ├── TraderSelector.tsx
│       │   │   └── OneClickTrade.tsx
│       │   │
│       │   ├── analytics/                   # Analytics Components
│       │   │   ├── PerformanceChart.tsx
│       │   │   ├── RiskMetrics.tsx
│       │   │   ├── PortfolioAnalytics.tsx
│       │   │   ├── MarketInsights.tsx
│       │   │   ├── VWAPIndicator.tsx
│       │   │   └── AnalyticsDashboard.tsx
│       │   │
│       │   ├── community/                   # Community Components
│       │   │   ├── Leaderboard.tsx
│       │   │   ├── TraderProfile.tsx
│       │   │   ├── SocialFeed.tsx
│       │   │   ├── CommunityStats.tsx
│       │   │   ├── FollowButton.tsx
│       │   │   └── DiscussionBoard.tsx
│       │   │
│       │   └── wallet/                      # Wallet Components
│       │       ├── WalletConnect.tsx
│       │       ├── WalletInfo.tsx
│       │       ├── TransactionStatus.tsx
│       │       └── WalletSelector.tsx
│       │
│       ├── pages/                           # Next.js Pages
│       │   ├── _app.tsx                     # App wrapper
│       │   ├── _document.tsx                # Document wrapper
│       │   ├── index.tsx                    # Landing page
│       │   ├── dashboard.tsx                # Main dashboard
│       │   ├── trading.tsx                  # Trading interface
│       │   ├── analytics.tsx                # Analytics page
│       │   ├── community.tsx                # Community page
│       │   ├── profile.tsx                  # User profile
│       │   ├── settings.tsx                 # User settings
│       │   │
│       │   └── api/                         # API Routes (BFF)
│       │       ├── auth/
│       │       │   ├── connect-wallet.ts
│       │       │   ├── session.ts
│       │       │   └── logout.ts
│       │       ├── trading/
│       │       │   ├── execute.ts
│       │       │   ├── portfolio.ts
│       │       │   ├── orders.ts
│       │       │   └── risk-assessment.ts
│       │       ├── traders/
│       │       │   ├── top.ts
│       │       │   ├── [address].ts
│       │       │   ├── performance.ts
│       │       │   └── trades.ts
│       │       ├── market/
│       │       │   ├── prices.ts
│       │       │   ├── orderbook.ts
│       │       │   ├── candles.ts
│       │       │   └── volume.ts
│       │       ├── analytics/
│       │       │   ├── portfolio-analysis.ts
│       │       │   ├── risk-metrics.ts
│       │       │   ├── market-sentiment.ts
│       │       │   └── correlation-matrix.ts
│       │       └── community/
│       │           ├── leaderboard.ts
│       │           ├── follow-trader.ts
│       │           └── discussions.ts
│       │
│       ├── hooks/                           # Custom React Hooks
│       │   ├── useWallet.ts                 # Wallet connection hook
│       │   ├── useTrading.ts                # Trading operations hook
│       │   ├── useRealTimeData.ts           # Real-time data hook
│       │   ├── useAnalytics.ts              # Analytics hook
│       │   ├── useCommunity.ts              # Community features hook
│       │   ├── useLocalStorage.ts           # Local storage hook
│       │   └── useDebounce.ts               # Debounce hook
│       │
│       ├── context/                         # React Context
│       │   ├── WalletContext.tsx            # Wallet state management
│       │   ├── TradingContext.tsx           # Trading state management
│       │   ├── ThemeContext.tsx             # Theme management
│       │   └── NotificationContext.tsx      # Notification system
│       │
│       ├── lib/                             # Libraries & Configurations
│       │   ├── aptos.ts                     # Aptos SDK configuration
│       │   ├── chart-config.ts              # TradingView chart config
│       │   ├── api-client.ts                # API client configuration
│       │   ├── websocket.ts                 # WebSocket client
│       │   └── constants.ts                 # App constants
│       │
│       ├── utils/                           # Utility Functions
│       │   ├── formatters.ts                # Data formatting utilities
│       │   ├── validators.ts                # Validation functions
│       │   ├── calculations.ts              # Financial calculations
│       │   ├── date-helpers.ts              # Date utility functions
│       │   ├── error-handlers.ts            # Error handling utilities
│       │   └── storage.ts                   # Storage utilities
│       │
│       ├── types/                           # TypeScript Types
│       │   ├── auth.ts                      # Authentication types
│       │   ├── trading.ts                   # Trading-related types
│       │   ├── analytics.ts                 # Analytics types
│       │   ├── community.ts                 # Community types
│       │   ├── api.ts                       # API response types
│       │   └── global.ts                    # Global types
│       │
│       └── styles/                          # Styling
│           ├── globals.css                  # Global styles
│           ├── components.css               # Component styles
│           └── chart-themes.css             # Chart styling
│
├── backend/                                 # ⚙️ Backend Services
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── Dockerfile
│   │
│   ├── src/                                 # Source Code
│   │   ├── server.ts                        # Main server entry point
│   │   ├── app.ts                           # Express app configuration
│   │   │
│   │   ├── routes/                          # API Routes
│   │   │   ├── index.ts                     # Route aggregator
│   │   │   ├── auth.ts                      # Authentication routes
│   │   │   ├── trading.ts                   # Trading API routes
│   │   │   ├── traders.ts                   # Trader management routes
│   │   │   ├── market.ts                    # Market data routes
│   │   │   ├── analytics.ts                 # Analytics API routes
│   │   │   ├── community.ts                 # Community features routes
│   │   │   └── health.ts                    # Health check routes
│   │   │
│   │   ├── controllers/                     # Route Controllers
│   │   │   ├── AuthController.ts            # Authentication logic
│   │   │   ├── TradingController.ts         # Trading operations
│   │   │   ├── TraderController.ts          # Trader management
│   │   │   ├── MarketController.ts          # Market data handling
│   │   │   ├── AnalyticsController.ts       # Analytics processing
│   │   │   └── CommunityController.ts       # Community features
│   │   │
│   │   ├── services/                        # Business Logic Services
│   │   │   ├── AptosCh ainService.ts        # Aptos blockchain interaction
│   │   │   ├── TradingEngine.ts             # Core trading logic
│   │   │   ├── RiskManager.ts               # Risk management service
│   │   │   ├── AnalyticsEngine.ts           # Analytics computation
│   │   │   ├── DataPipeline.ts              # Data processing pipeline
│   │   │   ├── NotificationService.ts       # Notification handling
│   │   │   └── CacheService.ts              # Caching layer
│   │   │
│   │   ├── models/                          # Data Models
│   │   │   ├── User.ts                      # User data model
│   │   │   ├── Trader.ts                    # Trader data model
│   │   │   ├── Trade.ts                     # Trade data model
│   │   │   ├── Position.ts                  # Position data model
│   │   │   ├── Analytics.ts                 # Analytics data model
│   │   │   └── Community.ts                 # Community data model
│   │   │
│   │   ├── middleware/                      # Express Middleware
│   │   │   ├── auth.ts                      # Authentication middleware
│   │   │   ├── validation.ts                # Request validation
│   │   │   ├── rate-limiting.ts             # Rate limiting
│   │   │   ├── error-handler.ts             # Error handling
│   │   │   ├── cors.ts                      # CORS configuration
│   │   │   └── logging.ts                   # Request logging
│   │   │
│   │   ├── database/                        # Database Layer
│   │   │   ├── connection.ts                # Database connections
│   │   │   ├── migrations/                  # Database migrations
│   │   │   │   ├── 001_create_users.sql
│   │   │   │   ├── 002_create_traders.sql
│   │   │   │   ├── 003_create_trades.sql
│   │   │   │   └── 004_create_analytics.sql
│   │   │   ├── seeders/                     # Database seeders
│   │   │   │   ├── demo-users.ts
│   │   │   │   └── sample-traders.ts
│   │   │   └── queries/                     # Database queries
│   │   │       ├── user-queries.ts
│   │   │       ├── trading-queries.ts
│   │   │       └── analytics-queries.ts
│   │   │
│   │   ├── config/                          # Configuration
│   │   │   ├── database.ts                  # Database configuration
│   │   │   ├── redis.ts                     # Redis configuration
│   │   │   ├── aptos.ts                     # Aptos network config
│   │   │   ├── security.ts                  # Security settings
│   │   │   └── environment.ts               # Environment variables
│   │   │
│   │   ├── utils/                           # Utility Functions
│   │   │   ├── logger.ts                    # Logging utilities
│   │   │   ├── crypto.ts                    # Cryptographic utilities
│   │   │   ├── formatters.ts                # Data formatting
│   │   │   ├── validators.ts                # Input validation
│   │   │   ├── calculations.ts              # Financial calculations
│   │   │   └── helpers.ts                   # General helpers
│   │   │
│   │   └── types/                           # TypeScript Types
│   │       ├── api.ts                       # API types
│   │       ├── database.ts                  # Database types
│   │       ├── services.ts                  # Service types
│   │       ├── trading.ts                   # Trading types
│   │       └── analytics.ts                 # Analytics types
│   │
│   └── tests/                               # Test Suite
│       ├── unit/                            # Unit tests
│       │   ├── services/
│       │   ├── controllers/
│       │   └── utils/
│       ├── integration/                     # Integration tests
│       │   ├── api/
│       │   └── database/
│       └── e2e/                             # End-to-end tests
│           └── trading-flow.test.ts
│
├── smart-contracts/                         # 🔗 Smart Contracts (Move)
│   ├── Move.toml                            # Move configuration
│   ├── .aptos/                              # Aptos CLI config
│   │
│   ├── sources/                             # Move Source Files
│   │   ├── vault_manager.move               # Main vault contract
│   │   ├── trader_analytics.move            # Trader tracking
│   │   ├── risk_manager.move                # Risk management
│   │   ├── community_features.move          # Community functionality
│   │   ├── fee_manager.move                 # Fee calculations
│   │   └── governance.move                  # Governance features
│   │
│   ├── tests/                               # Move Tests
│   │   ├── vault_tests.move                 # Vault functionality tests
│   │   ├── trading_tests.move               # Trading logic tests
│   │   ├── risk_tests.move                  # Risk management tests
│   │   └── integration_tests.move           # Integration tests
│   │
│   └── scripts/                             # Deployment Scripts
│       ├── deploy.ts                        # Main deployment script
│       ├── initialize.ts                    # Contract initialization
│       ├── upgrade.ts                       # Contract upgrade scripts
│       └── verify.ts                        # Contract verification
│
└── docs/                                    # 📖 Documentation (Moved from root)
    ├── README.md                            # Project overview
    ├── GETTING_STARTED.md                   # Quick start guide
    ├── API_DOCUMENTATION.md                 # API documentation
    ├── SMART_CONTRACT_DOCS.md               # Smart contract docs
    ├── DEPLOYMENT_GUIDE.md                  # Deployment instructions
    ├── ARCHITECTURE_OVERVIEW.md             # System architecture
    ├── SECURITY_AUDIT.md                    # Security considerations
    ├── TROUBLESHOOTING.md                   # Common issues
    └── CONTRIBUTING.md                      # Contribution guidelines
```

## Key Structure Highlights

### 🎨 Frontend Architecture
- **Component-Based**: Organized by functionality (trading, analytics, community)
- **Next.js Framework**: Full-stack React with API routes for BFF pattern
- **TypeScript**: Complete type safety across the application
- **Modular Design**: Reusable components and custom hooks

### ⚙️ Backend Architecture
- **Service-Oriented**: Clear separation of concerns with dedicated services
- **API-First**: RESTful API design with comprehensive controllers
- **Database Layer**: Proper abstraction with models and queries
- **Scalable**: Microservice-ready architecture

### 🔗 Smart Contracts
- **Move Language**: Secure, resource-oriented programming
- **Modular Contracts**: Separate contracts for different functionalities
- **Testing**: Comprehensive test suite for contract logic
- **Deployment**: Automated deployment and upgrade scripts

### 📚 Documentation
- **Comprehensive**: Complete documentation for all aspects
- **Developer-Friendly**: Clear setup and contribution guides
- **Maintenance**: Troubleshooting and operational guides

## Development Workflow

### 1. Frontend Development
```bash
cd frontend
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

### 2. Backend Development
```bash
cd backend
npm install
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run test         # Run test suite
```

### 3. Smart Contract Development
```bash
cd smart-contracts
aptos move compile   # Compile contracts
aptos move test      # Run tests
aptos move publish   # Deploy to network
```

## File Naming Conventions

### Frontend
- **Components**: PascalCase (`TradingDashboard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useTrading.ts`)
- **Utilities**: camelCase (`formatters.ts`)
- **Pages**: kebab-case for files (`trading.tsx`)

### Backend
- **Services**: PascalCase (`TradingEngine.ts`)
- **Controllers**: PascalCase with 'Controller' suffix (`TradingController.ts`)
- **Models**: PascalCase (`User.ts`)
- **Routes**: kebab-case (`trading.ts`)

### Smart Contracts
- **Contracts**: snake_case (`vault_manager.move`)
- **Tests**: snake_case with '_tests' suffix (`vault_tests.move`)

This structure provides a clean, scalable, and maintainable foundation for the OneClick Copy-Trading platform development.
