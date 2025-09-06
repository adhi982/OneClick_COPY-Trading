# OneClick Copy Trading - Smart Contracts

This directory contains the Aptos Move smart contracts for the OneClick Copy Trading platform.

## 📁 Project Structure

```
smart-contracts/
├── sources/
│   ├── copy_trading.move      # Main copy trading logic
│   ├── user_vault.move        # User fund management
│   ├── trader_registry.move   # Trader verification
│   └── risk_manager.move      # Risk controls
├── tests/
│   └── copy_trading_tests.move # Comprehensive tests
├── scripts/
│   ├── deploy.py              # Deployment script
│   └── setup.py               # Development setup
├── Move.toml                  # Move project configuration
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Setup Development Environment
```bash
# Run the setup script to install dependencies and verify environment
python scripts/setup.py
```

### 2. Compile Contracts
```bash
aptos move compile --package-dir .
```

### 3. Run Tests
```bash
aptos move test --package-dir .
```

### 4. Deploy to Devnet
```bash
python scripts/deploy.py
```

## 📋 Smart Contract Overview

### Core Contracts

#### 1. `copy_trading.move` - Main Contract
- **Purpose**: Central hub for copy trading operations
- **Key Functions**:
  - `create_user_vault(initial_deposit)` - Initialize user trading vault
  - `register_trader(performance_fee)` - Register as a trader
  - `follow_trader(trader_address, allocation, max_position, stop_loss)` - Start copying
  - `execute_copy_trade(symbol, amount, is_buy)` - Execute trades
  - `emergency_stop()` - Stop all trading immediately

#### 2. `user_vault.move` - Vault Management
- **Purpose**: Manage user funds and positions
- **Key Features**:
  - Secure fund storage and withdrawal
  - Position tracking and P&L calculation
  - Automated position management
  - Risk-based fund allocation

#### 3. `trader_registry.move` - Trader Management
- **Purpose**: Handle trader verification and performance tracking
- **Key Features**:
  - Trader registration and verification
  - Performance metrics calculation
  - Follower management
  - Risk scoring system

#### 4. `risk_manager.move` - Risk Controls
- **Purpose**: Implement comprehensive risk management
- **Key Features**:
  - Position size validation
  - Daily loss limits
  - Stop-loss automation
  - Emergency circuit breakers

## 🔧 Development Commands

### Basic Operations
```bash
# Install Aptos CLI (if not installed)
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Initialize Aptos account
aptos init --profile copy-trading

# Fund account with devnet APT
aptos account fund-with-faucet --profile copy-trading

# Compile contracts
aptos move compile --package-dir .

# Run all tests
aptos move test --package-dir .

# Deploy to devnet
aptos move publish --package-dir . --profile copy-trading
```

### Advanced Testing
```bash
# Run specific test
aptos move test --package-dir . --filter test_create_user_vault

# Run tests with coverage
aptos move test --package-dir . --coverage

# Run tests with gas profiling
aptos move test --package-dir . --gas-profiler
```

## 📊 Contract Interactions

### Frontend Integration Example (TypeScript)

```typescript
import { AptosClient, AptosAccount } from "aptos";

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

class CopyTradingService {
    // Create user vault
    async createVault(account: AptosAccount, initialDeposit: number) {
        const payload = {
            type: "entry_function_payload",
            function: `${CONTRACT_ADDRESS}::copy_trading::create_user_vault`,
            arguments: [initialDeposit],
            type_arguments: []
        };
        
        const txn = await client.generateTransaction(account.address(), payload);
        const signedTxn = await client.signTransaction(account, txn);
        return await client.submitTransaction(signedTxn);
    }
    
    // Follow a trader
    async followTrader(
        account: AptosAccount,
        traderAddress: string,
        allocation: number,
        maxPosition: number,
        stopLoss: number
    ) {
        const payload = {
            type: "entry_function_payload",
            function: `${CONTRACT_ADDRESS}::copy_trading::follow_trader`,
            arguments: [traderAddress, allocation, maxPosition, stopLoss],
            type_arguments: []
        };
        
        const txn = await client.generateTransaction(account.address(), payload);
        const signedTxn = await client.signTransaction(account, txn);
        return await client.submitTransaction(signedTxn);
    }
    
    // Get user vault info
    async getUserVault(userAddress: string) {
        return await client.view({
            function: `${CONTRACT_ADDRESS}::copy_trading::get_user_vault`,
            arguments: [userAddress],
            type_arguments: []
        });
    }
}
```

### Backend Integration Example (Node.js)

```javascript
const { AptosClient, AptosAccount } = require("aptos");

class AptosService {
    constructor() {
        this.client = new AptosClient("https://fullnode.devnet.aptoslabs.com");
        this.contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    }
    
    async getTraderProfile(traderAddress) {
        return await this.client.view({
            function: `${this.contractAddress}::copy_trading::get_trader_profile`,
            arguments: [traderAddress],
            type_arguments: []
        });
    }
    
    async getVerifiedTraders() {
        return await this.client.view({
            function: `${this.contractAddress}::trader_registry::get_verified_traders`,
            arguments: [],
            type_arguments: []
        });
    }
}
```

## 🧪 Testing

The contracts include comprehensive tests covering:

- **Vault Operations**: Creation, deposits, withdrawals
- **Trader Management**: Registration, verification, following
- **Risk Management**: Position limits, stop losses, emergency stops
- **Edge Cases**: Error conditions, boundary values, security scenarios

### Running Specific Test Categories

```bash
# Test vault operations
aptos move test --package-dir . --filter vault

# Test trader functionality  
aptos move test --package-dir . --filter trader

# Test risk management
aptos move test --package-dir . --filter risk

# Test error conditions
aptos move test --package-dir . --filter failure
```

## 🔒 Security Considerations

### Implemented Security Features
1. **Access Controls**: Proper permission checks for all operations
2. **Input Validation**: Comprehensive parameter validation
3. **Reentrancy Protection**: Safe use of Move's resource model
4. **Integer Safety**: Overflow protection in calculations
5. **Emergency Controls**: Circuit breakers for crisis situations

### Security Best Practices
- All user funds are stored in secure Move resources
- Trader verification prevents unauthorized operations
- Risk limits protect against excessive losses
- Emergency stop functionality for immediate threat response

## 📈 Gas Optimization

The contracts are optimized for gas efficiency:
- Minimal storage operations
- Efficient data structures
- Batched operations where possible
- Lazy evaluation for complex calculations

## 🔄 Upgrade Strategy

The contracts use Move's upgrade system:
- Compatible upgrades for bug fixes
- Immutable core logic for security
- Migration scripts for major updates
- Versioning for client compatibility

## 📚 Additional Resources

- [Aptos Move Documentation](https://aptos.dev/move/move-on-aptos)
- [Move Language Reference](https://move-language.github.io/move/)
- [Aptos TypeScript SDK](https://aptos.dev/sdks/ts-sdk/)
- [Aptos CLI Reference](https://aptos.dev/cli-tools/aptos-cli-tool/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write comprehensive tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the troubleshooting section in QUICK_START.md
2. Review the test cases for usage examples
3. Consult the Aptos documentation
4. Open an issue on GitHub

---

**Happy Trading! 🚀**
