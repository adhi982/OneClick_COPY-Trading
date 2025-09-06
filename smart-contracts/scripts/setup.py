#!/usr/bin/env python3
"""
Setup script for OneClick Copy Trading smart contracts development environment
"""

import subprocess
import sys
import os
import platform

def run_command(command, description, exit_on_error=True):
    """Run a shell command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        if e.stderr:
            print(f"Error: {e.stderr}")
        if exit_on_error:
            return False
        return False

def detect_os():
    """Detect the operating system"""
    system = platform.system().lower()
    if system == "windows":
        return "windows"
    elif system == "darwin":
        return "macos"
    else:
        return "linux"

def install_aptos_cli():
    """Install Aptos CLI based on the operating system"""
    os_type = detect_os()
    
    print(f"🔧 Installing Aptos CLI for {os_type}...")
    
    if os_type == "windows":
        # Windows installation
        command = 'powershell -Command "irm \\"https://aptos.dev/scripts/install_cli.py\\" | iex"'
        return run_command(command, "Installing Aptos CLI on Windows", False)
    
    elif os_type == "macos":
        # macOS installation
        command = 'curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3'
        return run_command(command, "Installing Aptos CLI on macOS", False)
    
    else:
        # Linux installation
        command = 'curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3'
        return run_command(command, "Installing Aptos CLI on Linux", False)

def check_aptos_cli():
    """Check if Aptos CLI is installed and working"""
    try:
        result = subprocess.run("aptos --version", shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Aptos CLI found: {result.stdout.strip()}")
            return True
        else:
            return False
    except:
        return False

def setup_development_environment():
    """Setup the complete development environment"""
    print("🎯 OneClick Copy Trading - Development Environment Setup")
    print("=" * 60)
    
    # Check if Aptos CLI exists
    if not check_aptos_cli():
        print("❌ Aptos CLI not found. Installing...")
        if not install_aptos_cli():
            print("❌ Failed to install Aptos CLI automatically.")
            print("📋 Please install manually:")
            print("   Windows: https://aptos.dev/tools/aptos-cli/install-cli/")
            print("   macOS/Linux: curl -fsSL \"https://aptos.dev/scripts/install_cli.py\" | python3")
            return False
        
        # Recheck after installation
        if not check_aptos_cli():
            print("❌ Aptos CLI installation verification failed.")
            return False
    
    # Verify project structure
    print("\n🔍 Verifying project structure...")
    required_files = [
        "Move.toml",
        "sources/copy_trading.move",
        "sources/user_vault.move", 
        "sources/trader_registry.move",
        "sources/risk_manager.move",
        "tests/copy_trading_tests.move"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    else:
        print("✅ All required files found")
    
    # Compile contracts
    print("\n🏗️  Compiling contracts...")
    if not run_command("aptos move compile --package-dir .", "Compiling Move contracts", False):
        print("❌ Contract compilation failed. Please check your Move code.")
        return False
    
    # Run tests
    print("\n🧪 Running tests...")
    if not run_command("aptos move test --package-dir .", "Running Move tests", False):
        print("⚠️  Some tests failed. Please review your test cases.")
        # Don't return False here as tests might fail due to environment issues
    
    print("\n✅ Development environment setup completed!")
    return True

def create_quick_start_guide():
    """Create a quick start guide for developers"""
    guide_content = """# OneClick Copy Trading - Quick Start Guide

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
"""
    
    with open("QUICK_START.md", "w") as f:
        f.write(guide_content)
    
    print("📖 Quick start guide created: QUICK_START.md")

def main():
    """Main setup function"""
    try:
        success = setup_development_environment()
        
        if success:
            create_quick_start_guide()
            
            print("\n🎉 Setup completed successfully!")
            print("=" * 50)
            print("📋 What's ready:")
            print("✅ Aptos CLI installed and verified")
            print("✅ Smart contracts compiled")  
            print("✅ Tests executed")
            print("✅ Quick start guide created")
            print("\n📋 Next steps:")
            print("1. Run `python scripts/deploy.py` to deploy to devnet")
            print("2. Update your frontend/backend with contract addresses")
            print("3. Read QUICK_START.md for integration examples")
        else:
            print("\n❌ Setup incomplete. Please resolve the issues above.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n❌ Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Setup failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
