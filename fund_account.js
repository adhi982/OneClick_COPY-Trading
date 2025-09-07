const { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } = require('@aptos-labs/ts-sdk');

async function fundAccount() {
    try {
        // Initialize Aptos client for testnet
        const config = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(config);
        
        const walletAddress = "0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260";
        
        console.log("🔍 Checking account resources...");
        
        // Check current resources
        const resources = await aptos.getAccountResources({ accountAddress: walletAddress });
        console.log("📋 Current resources:");
        resources.forEach(resource => {
            console.log(`   - ${resource.type}`);
        });
        
        // Check if APT CoinStore exists
        const aptResource = resources.find(
            resource => resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
        );
        
        if (aptResource) {
            const balance = parseInt(aptResource.data.coin.value) / 100000000;
            console.log(`💰 Current APT balance: ${balance} APT`);
        } else {
            console.log("⚠️  No APT CoinStore found!");
            console.log("");
            console.log("📝 To fix this, you need to:");
            console.log("1. Use your private key to initialize the APT CoinStore");
            console.log("2. Fund the account using the testnet faucet");
            console.log("");
            console.log("🔗 Testnet faucet: https://aptoslabs.com/testnet-faucet");
            console.log(`📋 Your address: ${walletAddress}`);
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

fundAccount();
