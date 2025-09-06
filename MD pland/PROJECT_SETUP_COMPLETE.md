# Project Structure Summary
*OneClick Copy-Trading Platform - Complete Development Environment*

## ✅ Project Structure Created Successfully

The project has been organized into the following structure:

### 📁 Root Level
- `README.md` - Project overview and quick start guide
- `package.json` - Root package configuration with workspaces
- `.gitignore` - Git ignore rules for all project files
- `.env.example` - Environment variables template

### 🎨 Frontend (`/frontend`)
**Technology**: Next.js 14 + React 18 + TypeScript + Tailwind CSS

**Key Features**:
- Component-based architecture organized by functionality
- TypeScript for type safety
- Tailwind CSS for styling
- Next.js API routes for Backend-for-Frontend pattern
- Real-time data integration hooks
- Advanced trading chart integration (TradingView)

**Structure**:
```
frontend/
├── package.json           # Frontend dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── public/                # Static assets
└── src/
    ├── components/        # React components by domain
    │   ├── ui/           # Base UI components
    │   ├── layout/       # Layout components
    │   ├── trading/      # Trading interface components
    │   ├── analytics/    # Analytics components
    │   ├── community/    # Community features
    │   └── wallet/       # Wallet integration
    ├── pages/            # Next.js pages and API routes
    │   ├── api/          # Backend-for-Frontend API
    │   └── *.tsx         # Page components
    ├── hooks/            # Custom React hooks
    ├── context/          # React context providers
    ├── lib/              # External library configurations
    ├── utils/            # Utility functions
    ├── types/            # TypeScript type definitions
    └── styles/           # Global styles
```

### ⚙️ Backend (`/backend`)
**Technology**: Node.js + Express + TypeScript + PostgreSQL + Redis

**Key Features**:
- RESTful API architecture
- Service-oriented design
- Real-time data pipeline
- Risk management engine
- Analytics computation
- Database layer with migrations

**Structure**:
```
backend/
├── package.json          # Backend dependencies
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── server.ts         # Main server entry
│   ├── app.ts           # Express app configuration
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic services
│   ├── models/          # Data models
│   ├── middleware/      # Express middleware
│   ├── database/        # Database layer
│   │   ├── migrations/  # Database migrations
│   │   ├── seeders/     # Database seed data
│   │   └── queries/     # Database queries
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
└── tests/               # Test suites
    ├── unit/           # Unit tests
    ├── integration/    # Integration tests
    └── e2e/            # End-to-end tests
```

### 🔗 Smart Contracts (`/smart-contracts`)
**Technology**: Move Language on Aptos

**Key Features**:
- Vault management contracts
- Automated trade replication
- Risk management logic
- Community features
- Fee management

**Structure**:
```
smart-contracts/
├── Move.toml            # Move configuration
├── sources/             # Move source files
│   ├── vault_manager.move
│   ├── trader_analytics.move
│   ├── risk_manager.move
│   ├── community_features.move
│   ├── fee_manager.move
│   └── governance.move
├── tests/               # Move tests
└── scripts/             # Deployment scripts
```

### 📚 Documentation (`/docs`)
**Content**: Comprehensive project documentation

**Structure**:
```
docs/
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Project overview
└── [Planning documents will be moved here]
```

## 🚀 Getting Started

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Setup All Components
```bash
npm run setup
```

### 3. Start Development
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

### 4. Smart Contracts
```bash
cd smart-contracts
aptos move compile
aptos move test
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build all components
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run setup` - Setup all components

### Frontend Specific
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests

### Backend Specific
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend TypeScript
- `npm run test:backend` - Run backend tests

### Smart Contracts
- `npm run test:contracts` - Run Move tests
- `npm run deploy:contracts` - Deploy contracts

## 📦 Dependencies Overview

### Frontend Key Dependencies
- **Next.js 14** - React framework
- **@aptos-labs/ts-sdk** - Aptos blockchain integration
- **lightweight-charts** - TradingView charts
- **@tanstack/react-query** - Data fetching
- **framer-motion** - Animations
- **zustand** - State management

### Backend Key Dependencies
- **Express** - Web framework
- **@aptos-labs/ts-sdk** - Aptos integration
- **pg** + **knex** - PostgreSQL database
- **ioredis** - Redis caching
- **socket.io** - Real-time communication
- **bull** - Job queue processing

## 🎯 Next Steps

1. **Install Dependencies**: Run `npm run setup` to install all dependencies
2. **Environment Setup**: Copy `.env.example` to `.env` and configure
3. **Database Setup**: Configure PostgreSQL and Redis connections
4. **Smart Contract Deployment**: Deploy contracts to Aptos Devnet
5. **Start Development**: Begin building components following the structure

## 📁 File Organization Principles

### Frontend
- **Components**: Organized by domain (trading, analytics, community)
- **Pages**: Next.js routing with API routes for BFF
- **Hooks**: Custom React hooks for reusable logic
- **Utils**: Pure utility functions

### Backend
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external integrations
- **Models**: Data structure definitions
- **Routes**: API endpoint definitions

### Smart Contracts
- **Modular Design**: Separate contracts by functionality
- **Testing**: Comprehensive test coverage
- **Scripts**: Deployment and maintenance automation

This structure provides a solid foundation for building the OneClick Copy-Trading platform with clear separation of concerns, scalability, and maintainability.
