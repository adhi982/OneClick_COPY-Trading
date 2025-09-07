#!/usr/bin/env python3
"""
Network switching utility for OneClick Copy Trading
Allows easy switching between testnet and mainnet
"""

import os
import sys
from pathlib import Path

def load_env_file():
    """Load current .env file"""
    env_path = Path(__file__).parent / '.env'
    env_vars = {}
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#') and '=' in line:
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    
    return env_vars, env_path

def save_env_file(env_vars, env_path):
    """Save updated .env file"""
    with open(env_path, 'w') as f:
        f.write("# ================================================\n")
        f.write("# ONECLICK COPY TRADING - ENVIRONMENT VARIABLES\n")
        f.write("# ================================================\n\n")
        
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")

def switch_to_mainnet():
    """Switch configuration to mainnet"""
    print("🔄 Switching to Mainnet...")
    
    env_vars, env_path = load_env_file()
    
    # Update network settings
    env_vars['APTOS_NETWORK'] = 'mainnet'
    env_vars['NEXT_PUBLIC_APTOS_NETWORK'] = 'mainnet'
    env_vars['NEXT_PUBLIC_APTOS_NODE_URL'] = env_vars.get(
        'APTOS_ANKR_MAINNET_RPC', 
        'https://rpc.ankr.com/premium-http/aptos/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1'
    )
    
    save_env_file(env_vars, env_path)
    print("✅ Successfully switched to Mainnet")
    print("⚠️  IMPORTANT: Make sure you have APT in your mainnet wallet for transactions!")

def switch_to_testnet():
    """Switch configuration to testnet"""
    print("🔄 Switching to Testnet...")
    
    env_vars, env_path = load_env_file()
    
    # Update network settings
    env_vars['APTOS_NETWORK'] = 'testnet'
    env_vars['NEXT_PUBLIC_APTOS_NETWORK'] = 'testnet'
    env_vars['NEXT_PUBLIC_APTOS_NODE_URL'] = env_vars.get(
        'APTOS_ANKR_TESTNET_RPC',
        'https://rpc.ankr.com/premium-http/aptos_testnet/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1'
    )
    
    save_env_file(env_vars, env_path)
    print("✅ Successfully switched to Testnet")
    print("💰 You can use the faucet to get testnet APT")

def show_current_network():
    """Show current network configuration"""
    env_vars, _ = load_env_file()
    
    current_network = env_vars.get('APTOS_NETWORK', 'testnet')
    current_rpc = env_vars.get('NEXT_PUBLIC_APTOS_NODE_URL', 'Not set')
    
    print(f"🌐 Current Network: {current_network}")
    print(f"🔗 Current RPC: {current_rpc}")
    print(f"⚡ Using Ankr: {'Yes' if 'ankr.com' in current_rpc else 'No'}")

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("OneClick Copy Trading - Network Switcher")
        print("=" * 40)
        print("Usage:")
        print("  python switch_network.py mainnet   # Switch to mainnet")
        print("  python switch_network.py testnet   # Switch to testnet")
        print("  python switch_network.py status    # Show current network")
        print("")
        show_current_network()
        return
    
    command = sys.argv[1].lower()
    
    if command == 'mainnet':
        switch_to_mainnet()
    elif command == 'testnet':
        switch_to_testnet()
    elif command == 'status':
        show_current_network()
    else:
        print(f"❌ Unknown command: {command}")
        print("Valid commands: mainnet, testnet, status")

if __name__ == "__main__":
    main()
