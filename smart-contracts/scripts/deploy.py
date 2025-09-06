#!/usr/bin/env python3
"""
Deployment script for OneClick Copy Trading smart contracts on Aptos
"""

import subprocess
import sys
import json
import time

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def check_prerequisites():
    """Check if required tools are installed"""
    print("🔍 Checking prerequisites...")
    
    # Check if Aptos CLI is installed
    try:
        result = subprocess.run("aptos --version", shell=True, capture_output=True, text=True)
        print(f"✅ Aptos CLI found: {result.stdout.strip()}")
    except:
        print("❌ Aptos CLI not found. Please install it first.")
        print("Run: curl -fsSL \"https://aptos.dev/scripts/install_cli.py\" | python3")
        sys.exit(1)

def initialize_account(profile_name="copy-trading-deploy"):
    """Initialize Aptos account for deployment"""
    print(f"\n🔧 Setting up deployment account with profile: {profile_name}")
    
    # Check if profile already exists
    try:
        result = subprocess.run(f"aptos config show-profiles --profile {profile_name}", 
                              shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Profile {profile_name} already exists")
            return profile_name
    except:
        pass
    
    # Initialize new account
    run_command(f"aptos init --profile {profile_name} --network devnet", 
                f"Initializing new account with profile {profile_name}")
    
    return profile_name

def fund_account(profile_name):
    """Fund the account with devnet APT"""
    print(f"\n💰 Funding account...")
    
    # Fund account with devnet faucet
    run_command(f"aptos account fund-with-faucet --profile {profile_name}", 
                "Funding account with devnet APT")
    
    # Check balance
    balance_output = run_command(f"aptos account list --profile {profile_name}", 
                                "Checking account balance")
    print(f"Account funded successfully")

def compile_contracts():
    """Compile Move contracts"""
    print(f"\n🏗️  Compiling smart contracts...")
    
    # Compile the contracts
    run_command("aptos move compile --package-dir .", 
                "Compiling Move contracts")

def run_tests():
    """Run contract tests"""
    print(f"\n🧪 Running tests...")
    
    # Run Move tests
    run_command("aptos move test --package-dir .", 
                "Running Move contract tests")

def deploy_contracts(profile_name):
    """Deploy contracts to Aptos devnet"""
    print(f"\n🚀 Deploying contracts to Aptos devnet...")
    
    # Deploy the contracts
    deploy_output = run_command(f"aptos move publish --package-dir . --profile {profile_name}", 
                               "Publishing contracts to devnet")
    
    # Extract transaction hash from output
    lines = deploy_output.split('\n')
    tx_hash = None
    for line in lines:
        if 'Transaction hash:' in line:
            tx_hash = line.split(':')[1].strip()
            break
    
    if tx_hash:
        print(f"✅ Contracts deployed successfully!")
        print(f"📋 Transaction hash: {tx_hash}")
        print(f"🔗 View on Aptos Explorer: https://explorer.aptoslabs.com/txn/{tx_hash}?network=devnet")
    
    return tx_hash

def get_contract_address(profile_name):
    """Get the deployed contract address"""
    try:
        result = subprocess.run(f"aptos config show-profiles --profile {profile_name}", 
                              shell=True, capture_output=True, text=True)
        
        # Parse the output to get the account address
        lines = result.stdout.split('\n')
        for line in lines:
            if 'account' in line and '0x' in line:
                address = line.split(':')[1].strip().strip('"')
                return address
    except:
        pass
    
    return None

def create_deployment_summary(profile_name, tx_hash):
    """Create a summary of the deployment"""
    contract_address = get_contract_address(profile_name)
    
    summary = {
        "deployment_time": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "network": "devnet",
        "profile": profile_name,
        "contract_address": contract_address,
        "transaction_hash": tx_hash,
        "contracts": [
            "copy_trading::main",
            "copy_trading::user_vault", 
            "copy_trading::trader_registry",
            "copy_trading::risk_manager"
        ],
        "explorer_links": {
            "transaction": f"https://explorer.aptoslabs.com/txn/{tx_hash}?network=devnet",
            "account": f"https://explorer.aptoslabs.com/account/{contract_address}?network=devnet" if contract_address else None
        }
    }
    
    # Write summary to file
    with open('deployment_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n📄 Deployment summary saved to deployment_summary.json")
    print(f"📍 Contract Address: {contract_address}")
    
    return summary

def main():
    """Main deployment flow"""
    print("🎯 OneClick Copy Trading - Smart Contract Deployment")
    print("=" * 50)
    
    try:
        # Step 1: Check prerequisites
        check_prerequisites()
        
        # Step 2: Initialize account
        profile_name = initialize_account()
        
        # Step 3: Fund account
        fund_account(profile_name)
        
        # Step 4: Compile contracts
        compile_contracts()
        
        # Step 5: Run tests
        run_tests()
        
        # Step 6: Deploy contracts
        tx_hash = deploy_contracts(profile_name)
        
        # Step 7: Create deployment summary
        summary = create_deployment_summary(profile_name, tx_hash)
        
        print("\n🎉 Deployment completed successfully!")
        print("=" * 50)
        print("📋 Next steps:")
        print("1. Update your frontend/backend with the new contract address")
        print("2. Test the deployment using the Aptos Explorer links")
        print("3. Configure your application to use the deployed contracts")
        print(f"4. Contract address: {summary['contract_address']}")
        
    except KeyboardInterrupt:
        print("\n❌ Deployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Deployment failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
