# OneClick Copy Trading - Quick Start Guide

## Smart Contract Structure

### Core Contracts
- `copy_trading.move` - Main copy trading logic and entry points
- `user_vault.move` - User fund management and position tracking  
- `trader_registry.move` - Trader verification and performance tracking
- `risk_manager.move` - Risk controls and position sizing

### Key Functions

#### For Users:
1. `create_user_vault(initial_deposit)` - Initialize trading vault
2. `follow_trader(trader_address, allocation, max_position, stop_loss)` - Start copying a trader
3. `unfollow_trader(trader_address)` - Stop copying a trader
4. `emergency_stop()` - Immediately stop all copy trading

#### For Traders:
1. `register_trader(performance_fee)` - Register as a trader
2. `execute_copy_trade(symbol, amount, is_buy)` - Execute trades that followers will copy

### Development Commands

```bash
# Compile contracts
aptos move compile --package-dir .

# Run tests
aptos move test --package-dir .

# Deploy to devnet
python scripts/deploy.py

# Or manually:
aptos move publish --package-dir . --profile your-profile
```

### Integration with Frontend/Backend

```typescript
// Example TypeScript integration
import { AptosClient, AptosAccount } from "aptos";

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

// Create user vault
const payload = {
    type: "entry_function_payload",
    function: "DEPLOYED_ADDRESS::copy_trading::create_user_vault",
    arguments: [100000], // initial deposit
    type_arguments: []
};

const txn = await client.generateTransaction(account.address(), payload);
const signedTxn = await client.signTransaction(account, txn);
await client.submitTransaction(signedTxn);
```

### Next Steps
1. Deploy contracts using `python scripts/deploy.py`
2. Update your frontend/backend with the deployed contract address
3. Test the integration using the Aptos Explorer
4. Implement the frontend UI components
5. Set up backend APIs for data aggregation

### Troubleshooting
- Make sure Aptos CLI is installed and updated
- Ensure you have sufficient devnet APT for deployment
- Check contract addresses match in your frontend/backend code
- Verify all dependencies are properly imported in Move files

### Resources
- [Aptos Documentation](https://aptos.dev/)
- [Move Language Guide](https://move-language.github.io/move/)
- [Aptos TypeScript SDK](https://aptos.dev/sdks/ts-sdk/)
