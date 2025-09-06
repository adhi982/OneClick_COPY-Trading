# OneClick Copy-Trading Platform

A comprehensive copy-trading platform built on Aptos blockchain that enables users to automatically replicate successful trader strategies with sophisticated risk management and real-time analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for backend services)
- Aptos CLI
- PostgreSQL and Redis

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adhi982/OneClick_COPY-Trading.git
   cd OneClick_COPY-Trading
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Smart Contracts Setup**
   ```bash
   cd smart-contracts
   aptos move compile
   aptos move test
   ```

## 🏗️ Architecture

### Frontend (Next.js)
- **Component-based React architecture**
- **Real-time trading dashboard**
- **Advanced analytics and charting**
- **Community features and leaderboards**

### Backend (Node.js/Express)
- **RESTful API services**
- **Real-time data pipeline**
- **Risk management engine**
- **Analytics computation**

### Smart Contracts (Move)
- **Trustless vault management**
- **Automated trade replication**
- **Risk controls and limits**
- **Performance tracking**

## 🎯 Key Features

- ✅ **One-Click Copy Trading**: Instant trader following with automated execution
- ✅ **User-Defined Limits**: Complete control over trading parameters
- ✅ **Real-time Analytics**: Professional-grade trading tools and insights
- ✅ **Community Leaderboards**: Social trading with performance rankings
- ✅ **Risk Management**: Multi-layer protection and automated safeguards
- ✅ **Portfolio Analytics**: Advanced performance tracking and attribution

## 📁 Project Structure

```
OneClick_COPY-Trading/
├── frontend/           # Next.js frontend application
├── backend/            # Node.js backend services
├── smart-contracts/    # Move smart contracts
├── docs/              # Documentation
└── PROJECT_STRUCTURE.md
```

## 🔧 Development Commands

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run test        # Run tests
npm run lint        # Run linting
```

### Backend
```bash
npm run dev         # Start development server
npm run build       # Build TypeScript
npm run test        # Run test suite
npm run migrate     # Run database migrations
```

### Smart Contracts
```bash
aptos move compile  # Compile contracts
aptos move test     # Run tests
aptos move publish  # Deploy contracts
```

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Complete project organization
- [Frontend Plan](./FRONTEND_PLAN.md) - Frontend development strategy
- [Backend Architecture](./BACKEND_ARCHITECTURE_PLAN.md) - Backend system design
- [API Documentation](./API_ARCHITECTURE_PLAN.md) - API specifications
- [Database Design](./DATABASE_DESIGN_STRATEGY.md) - Database schema and strategy
- [Risk Management](./RISK_MANAGEMENT_PLAN.md) - Risk control framework
- [Analytics Engine](./ANALYTICS_ENGINE_PLAN.md) - Analytics and intelligence system

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Docker)
```bash
cd backend
docker build -t oneclick-backend .
docker run -p 3000:3000 oneclick-backend
```

### Smart Contracts (Aptos)
```bash
cd smart-contracts
aptos move publish --profile mainnet
```

## 🔐 Security

- **Smart Contract Security**: Formal verification with Move Prover
- **API Security**: JWT authentication, rate limiting, input validation
- **Data Protection**: Encryption at rest and in transit
- **Risk Controls**: Multi-layer risk management and automated safeguards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check the `/docs` folder for comprehensive guides
- **Issues**: Open an issue on GitHub
- **Discord**: Join our community Discord server
- **Email**: support@oneclick-trading.com

## 🎯 Roadmap

### Phase 1 (Current) - MVP
- ✅ Basic copy trading functionality
- ✅ User preferences and risk controls
- ✅ Real-time analytics dashboard
- ✅ Community leaderboards

### Phase 2 - Advanced Features
- 🔄 Advanced trading strategies
- 🔄 Cross-chain integration
- 🔄 Mobile application
- 🔄 Institutional features

### Phase 3 - Ecosystem
- 📋 Governance token
- 📋 Developer API platform
- 📋 Strategy marketplace
- 📋 Educational content hub

---

Built with ❤️ by the OneClick Trading Team on Aptos Blockchain
