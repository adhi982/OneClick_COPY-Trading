import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export interface NetworkConfig {
  network: Network;
  nodeUrl: string;
  indexerUrl?: string;
  isMainnet: boolean;
}

class AptosClientService {
  private static instance: AptosClientService;
  private aptos: Aptos;
  private currentConfig: NetworkConfig;

  private constructor() {
    this.currentConfig = this.getNetworkConfig();
    this.aptos = this.createAptosInstance();
    console.log(`🌐 Aptos client initialized on ${this.currentConfig.isMainnet ? 'mainnet' : 'testnet'}`);
  }

  static getInstance(): AptosClientService {
    if (!AptosClientService.instance) {
      AptosClientService.instance = new AptosClientService();
    }
    return AptosClientService.instance;
  }

  private getNetworkConfig(): NetworkConfig {
    const networkType = process.env.NEXT_PUBLIC_APTOS_NETWORK || 'testnet';
    
    if (networkType === 'mainnet') {
      return {
        network: Network.MAINNET,
        nodeUrl: process.env.NEXT_PUBLIC_APTOS_ANKR_MAINNET_RPC || 
                 'https://rpc.ankr.com/premium-http/aptos/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1',
        indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
        isMainnet: true
      };
    } else {
      return {
        network: Network.TESTNET,
        nodeUrl: process.env.NEXT_PUBLIC_APTOS_NODE_URL || 
                 'https://rpc.ankr.com/premium-http/aptos_testnet/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1',
        indexerUrl: 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
        isMainnet: false
      };
    }
  }

  private createAptosInstance(): Aptos {
    const config = new AptosConfig({
      network: this.currentConfig.network,
      fullnode: this.currentConfig.nodeUrl,
      indexer: this.currentConfig.indexerUrl
    });
    return new Aptos(config);
  }

  getAptos(): Aptos {
    return this.aptos;
  }

  getCurrentConfig(): NetworkConfig {
    return this.currentConfig;
  }

  // Switch to mainnet (admin function)
  switchToMainnet(): void {
    if (!this.currentConfig.isMainnet) {
      console.log('🔄 Switching to Mainnet...');
      this.currentConfig = {
        network: Network.MAINNET,
        nodeUrl: 'https://rpc.ankr.com/premium-http/aptos/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1',
        indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
        isMainnet: true
      };
      this.aptos = this.createAptosInstance();
      console.log('✅ Switched to Mainnet successfully');
    }
  }

  // Switch to testnet
  switchToTestnet(): void {
    if (this.currentConfig.isMainnet) {
      console.log('🔄 Switching to Testnet...');
      this.currentConfig = {
        network: Network.TESTNET,
        nodeUrl: 'https://rpc.ankr.com/premium-http/aptos_testnet/9b9551f4449042d4364225e589629c978d25996d13368142fb0dfc7bbd74c0ce/v1',
        indexerUrl: 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
        isMainnet: false
      };
      this.aptos = this.createAptosInstance();
      console.log('✅ Switched to Testnet successfully');
    }
  }

  getNetworkInfo() {
    return {
      network: this.currentConfig.isMainnet ? 'mainnet' : 'testnet',
      url: this.currentConfig.nodeUrl,
      isMainnet: this.currentConfig.isMainnet
    };
  }

  // Contract addresses getter
  getContractAddresses() {
    return {
      copyTrading: this.currentConfig.isMainnet 
        ? process.env.NEXT_PUBLIC_COPY_TRADING_CONTRACT_ADDRESS_MAINNET 
        : process.env.NEXT_PUBLIC_COPY_TRADING_CONTRACT_ADDRESS_TESTNET,
      userVault: this.currentConfig.isMainnet 
        ? process.env.NEXT_PUBLIC_USER_VAULT_CONTRACT_ADDRESS_MAINNET 
        : process.env.NEXT_PUBLIC_USER_VAULT_CONTRACT_ADDRESS_TESTNET,
      traderRegistry: this.currentConfig.isMainnet 
        ? process.env.NEXT_PUBLIC_TRADER_REGISTRY_CONTRACT_ADDRESS_MAINNET 
        : process.env.NEXT_PUBLIC_TRADER_REGISTRY_CONTRACT_ADDRESS_TESTNET,
      riskManager: this.currentConfig.isMainnet 
        ? process.env.NEXT_PUBLIC_RISK_MANAGER_CONTRACT_ADDRESS_MAINNET 
        : process.env.NEXT_PUBLIC_RISK_MANAGER_CONTRACT_ADDRESS_TESTNET,
    };
  }
}

// Export singleton instance
export const aptosClient = AptosClientService.getInstance();

// Export the class as well
export { AptosClientService };
