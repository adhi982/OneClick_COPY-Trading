# SETUP INSTRUCTIONS FOR ONECLICK COPY TRADING PLATFORM
================================================================

## Overview
This guide will help you set up the OneClick Copy Trading platform with Supabase as the backend database, Firebase for authentication, and Redis for caching.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- A Supabase account (https://supabase.com)
- A Firebase account (https://console.firebase.google.com)
- Redis instance (local or cloud)

### 2. Project Setup

#### Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/adhi982/OneClick_COPY-Trading.git
cd OneClick_COPY-Trading

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install smart contract dependencies
cd ../smart-contracts
npm install
```

#### Environment Variables Setup
```bash
# Copy the environment template
cp ENV_VARIABLES_COMPLETE.txt .env

# Edit the .env file and fill in your actual values
# You'll get these values from the services below
```

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project name: "oneclick-copy-trading"
5. Create a strong database password
6. Select region closest to your users
7. Click "Create new project"

### Step 2: Get Supabase Credentials
1. Go to Project Settings → API
2. Copy the following values to your .env file:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role secret key

### Step 3: Set Up Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Copy the SQL from `MD pland/database` file
3. Execute the SQL to create all tables
4. Enable Row Level Security (RLS) on all tables
5. The policies are already included in the SQL

### Step 4: Configure Storage (Optional)
1. Go to Storage in Supabase dashboard
2. Create bucket named "avatars" for user profile pictures
3. Create bucket named "media" for post attachments
4. Set appropriate policies for file access

## 🔐 Authentication Setup (Firebase)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Enter project name: "oneclick-copy-trading"
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable the following providers:
   - Email/Password
   - Google
   - Apple (optional)
3. Configure authorized domains (add your domain)

### Step 3: Get Firebase Configuration
1. Go to Project Settings → General
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app with nickname: "oneclick-trading-web"
5. Copy the config object values to your .env file:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

### Step 4: Generate Service Account Key
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Add the following to your .env file:
   ```
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@yourproject.iam.gserviceaccount.com
   FIREBASE_PROJECT_ID=your-project-id
   ```

## 💾 Redis Setup

### Option 1: Local Redis (Development)
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:alpine

# Or install locally
# Windows: Download from https://redis.io/download
# macOS: brew install redis
# Linux: sudo apt-get install redis-server

# Add to .env:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Option 2: Redis Cloud (Production)
1. Go to https://redis.com/try-free/
2. Create a free account and database
3. Get connection details and add to .env:
   ```
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
   REDIS_PASSWORD=your-redis-password
   ```

## 💳 Payment Setup (Stripe)

### Step 1: Create Stripe Account
1. Go to https://stripe.com and create account
2. Complete account verification
3. Go to Developers → API keys

### Step 2: Get API Keys
1. Copy keys to .env file:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### Step 3: Set Up Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourapp.com/api/webhooks/stripe`
3. Select events: `invoice.payment_succeeded`, `customer.subscription.updated`, etc.
4. Copy webhook secret to .env:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 📊 Market Data APIs

### CoinGecko (Free Tier)
1. Go to https://coingecko.com/api
2. Sign up for free API
3. Add to .env:
   ```
   COINGECKO_API_KEY=your-api-key
   ```

### Binance API (Optional)
1. Create Binance account
2. Go to API Management
3. Create new API key
4. Add to .env:
   ```
   BINANCE_API_KEY=your-api-key
   BINANCE_SECRET_KEY=your-secret-key
   ```

## ⛓️ Blockchain Setup (Aptos)

### Step 1: Install Aptos CLI
```bash
# Install Aptos CLI
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Initialize Aptos account
aptos init --network devnet
```

### Step 2: Deploy Smart Contracts
```bash
cd smart-contracts

# Compile contracts
aptos move compile

# Test contracts
aptos move test

# Deploy contracts
aptos move publish --named-addresses copy_trading=default

# Update .env with deployed addresses
```

## 📧 Communication Services

### SendGrid (Email)
1. Create account at https://sendgrid.com
2. Create API key
3. Add to .env:
   ```
   SENDGRID_API_KEY=SG.your-api-key
   SENDGRID_FROM_EMAIL=noreply@yourapp.com
   ```

### Twilio (SMS - Optional)
1. Create account at https://twilio.com
2. Get Account SID and Auth Token
3. Add to .env:
   ```
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1: Start Redis (if local)
redis-server

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev

# Terminal 4: Start Aptos Local Network (optional)
aptos node run-local-testnet
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
npm start
```

## 🧪 Testing Setup

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests
```bash
# Set up test database
cp .env .env.test
# Update TEST_DATABASE_URL in .env.test

# Run integration tests
npm run test:integration
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check Supabase connection
curl -H "apikey: YOUR_ANON_KEY" "YOUR_SUPABASE_URL/rest/v1/users"

# Check Redis connection
redis-cli ping
```

#### Firebase Auth Issues
```bash
# Check Firebase config
npm run firebase:debug

# Clear Firebase cache
rm -rf node_modules/.cache
```

#### Build Issues
```bash
# Clear all caches
rm -rf node_modules
rm -rf .next
npm install
```

### Environment Variables Checklist
- [ ] Supabase URL and keys
- [ ] Firebase configuration
- [ ] Redis connection details
- [ ] Stripe API keys
- [ ] Market data API keys
- [ ] Email service API key
- [ ] Aptos network configuration

### Security Checklist
- [ ] Enable RLS on all Supabase tables
- [ ] Configure Firebase security rules
- [ ] Set up CORS properly
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure helmet.js for security headers

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Aptos Documentation](https://aptos.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error logs in your terminal
3. Check the browser console for frontend issues
4. Verify all environment variables are set correctly
5. Ensure all services (Supabase, Firebase, Redis) are running

## 🎉 Success!

Once everything is set up, you should be able to:
- Register and login users with Firebase Auth
- Store data in Supabase
- Cache data with Redis
- Process payments with Stripe
- Fetch market data
- Send notifications
- Deploy smart contracts on Aptos

Your OneClick Copy Trading platform is now ready for development! 🚀
