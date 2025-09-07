# 🚀 Smart Contract Setup Guide - OneClick Copy Trading

## Overview
This guide will help you deploy the OneClick Copy Trading smart contracts to Aptos blockchain using Ankr RPC endpoints.

## 📋 Prerequisites

### 1. Install Required Tools
```bash
# Install Aptos CLI
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
aptos --version
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
# The Ankr RPC endpoints are already configured!
```

## 🌐 Network Configuration

### Current Setup (Testnet)
- **Network**: Testnet (Safe for development)
- **RPC**: Ankr Premium Testnet Endpoint
- **URL**: `https://rpc.ankr.com/premium-http/aptos_testnet/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1`

### Available Networks
- **Testnet**: For development and testing
- **Mainnet**: For production deployment (use with caution)

## 🔧 Step-by-Step Deployment

### Step 1: Setup Environment
```bash
# Navigate to project root
cd OneClick_COPY-Trading

# Copy environment file
cp .env.example .env
```

### Step 2: Configure Aptos Account
```bash
# Navigate to smart contracts directory
cd smart-contracts

# Initialize Aptos account (will use testnet by default)
python scripts/setup.py
```

### Step 3: Deploy Smart Contracts
```bash
# Deploy all contracts
python scripts/deploy.py
```

### Step 4: Verify Deployment
The deployment script will output:
- ✅ Transaction hash
- 📝 Contract address
- 🔗 Explorer links

## 🔄 Network Switching

### Switch to Mainnet (When Ready)
```bash
# Switch to mainnet
python switch_network.py mainnet

# Deploy to mainnet
cd smart-contracts
python scripts/deploy.py
```

### Switch Back to Testnet
```bash
# Switch to testnet
python switch_network.py testnet
```

### Check Current Network
```bash
# Show current configuration
python switch_network.py status
```

## 📁 Project Structure

```
smart-contracts/
├── sources/
│   ├── copy_trading.move      # Main copy trading logic
│   ├── user_vault.move        # User vault management
│   ├── trader_registry.move   # Trader profiles & rankings
│   └── risk_manager.move      # Risk management system
├── scripts/
│   ├── deploy.py              # Deployment automation
│   └── setup.py               # Environment setup
├── tests/
│   └── copy_trading_tests.move # Contract tests
└── Move.toml                   # Package configuration
```

## 🔗 RPC Endpoints

### Ankr Testnet (Current)
```
https://rpc.ankr.com/premium-http/aptos_testnet/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1
```

### Ankr Mainnet (Production)
```
https://rpc.ankr.com/premium-http/aptos/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1
```

## 📊 Smart Contract Features

### Copy Trading Contract (`copy_trading.move`)
- ✅ User vault creation and management
- ✅ Copy settings configuration
- ✅ Trader profile registration
- ✅ Trade execution automation
- ✅ Event emission for frontend integration

### User Vault Contract (`user_vault.move`)
- ✅ Individual vault management
- ✅ Position tracking
- ✅ P&L calculation
- ✅ Balance updates
- ✅ Risk settings

### Trader Registry (`trader_registry.move`)
- ✅ Trader registration and verification
- ✅ Performance metrics tracking
- ✅ Follower management
- ✅ Rating system
- ✅ Statistics aggregation

### Risk Manager (`risk_manager.move`)
- ✅ Position size limits
- ✅ Daily loss limits
- ✅ Risk level assessment
- ✅ Trader blacklisting
- ✅ Custom risk profiles

## 🧪 Testing

### Run Contract Tests
```bash
cd smart-contracts
aptos move test
```

### Test Deployment
```bash
# Deploy to testnet first
python scripts/deploy.py

# Verify in Aptos Explorer
# Links will be provided after deployment
```

## 🚨 Important Notes

### Security
- ⚠️ **Always test on testnet first**
- ⚠️ **Verify contract addresses before mainnet**
- ⚠️ **Keep private keys secure**
- ⚠️ **Use hardware wallets for mainnet**

### Costs
- 💰 **Testnet**: Free (use faucet)
- 💰 **Mainnet**: Real APT required for gas fees

### Monitoring
- 📊 Use Aptos Explorer to monitor transactions
- 📊 Check contract events for debugging
- 📊 Monitor gas usage and optimization

## 🆘 Troubleshooting

### Common Issues

1. **Aptos CLI not found**
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. **Insufficient funds**
   ```bash
   # Testnet: Use faucet
   aptos account fund-with-faucet --profile your-profile
   
   # Mainnet: Ensure wallet has APT
   ```

3. **Compilation errors**
   ```bash
   cd smart-contracts
   aptos move compile --package-dir .
   ```

4. **Network connection issues**
   - Check internet connection
   - Verify RPC endpoint is accessible
   - Try switching between Ankr and default endpoints

## 📞 Support

If you encounter issues:
1. Check the error messages carefully
2. Verify your environment configuration
3. Ensure you're on the correct network
4. Check Aptos Explorer for transaction status

## 🎯 Next Steps

After successful deployment:
1. ✅ Update frontend with contract addresses
2. ✅ Update backend API with contract addresses
3. ✅ Test integration end-to-end
4. ✅ Deploy to production when ready

---

**🎉 You're ready to deploy your first smart contract!**

Run `python scripts/deploy.py` in the `smart-contracts` directory to get started.
