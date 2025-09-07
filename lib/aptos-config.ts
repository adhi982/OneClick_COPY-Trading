import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export interface AptosNetworkConfig {
  network: Network;
  nodeUrl: string;
  indexerUrl?: string;
  isMainnet: boolean;
}

export class AptosConfigService {
  private static instance: AptosConfigService;
  private currentConfig: AptosNetworkConfig;
  private aptos: Aptos;

  private constructor() {
    this.currentConfig = this.getNetworkConfig();
    this.aptos = this.createAptosInstance();
  }

  static getInstance(): AptosConfigService {
    if (!AptosConfigService.instance) {
      AptosConfigService.instance = new AptosConfigService();
    }
    return AptosConfigService.instance;
  }

  private getNetworkConfig(): AptosNetworkConfig {
    const networkType = process.env.APTOS_NETWORK || 'testnet';
    const useAnkr = process.env.APTOS_USE_ANKR === 'true';

    if (networkType === 'mainnet') {
      return {
        network: Network.MAINNET,
        nodeUrl: useAnkr 
          ? process.env.APTOS_ANKR_MAINNET_RPC! 
          : process.env.APTOS_MAINNET_RPC!,
        indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
        isMainnet: true
      };
    } else {
      return {
        network: Network.TESTNET,
        nodeUrl: useAnkr 
          ? process.env.APTOS_ANKR_TESTNET_RPC! 
          : process.env.APTOS_TESTNET_RPC!,
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

  getCurrentConfig(): AptosNetworkConfig {
    return this.currentConfig;
  }

  switchToMainnet(): void {
    if (!this.currentConfig.isMainnet) {
      console.log('🔄 Switching to Mainnet...');
      process.env.APTOS_NETWORK = 'mainnet';
      this.currentConfig = this.getNetworkConfig();
      this.aptos = this.createAptosInstance();
      console.log('✅ Switched to Mainnet successfully');
    }
  }

  switchToTestnet(): void {
    if (this.currentConfig.isMainnet) {
      console.log('🔄 Switching to Testnet...');
      process.env.APTOS_NETWORK = 'testnet';
      this.currentConfig = this.getNetworkConfig();
      this.aptos = this.createAptosInstance();
      console.log('✅ Switched to Testnet successfully');
    }
  }

  getNetworkInfo(): { network: string; url: string; isMainnet: boolean } {
    return {
      network: this.currentConfig.isMainnet ? 'mainnet' : 'testnet',
      url: this.currentConfig.nodeUrl,
      isMainnet: this.currentConfig.isMainnet
    };
  }

  // Contract addresses based on network
  getContractAddresses() {
    return {
      copyTrading: this.currentConfig.isMainnet 
        ? process.env.COPY_TRADING_CONTRACT_ADDRESS_MAINNET 
        : process.env.COPY_TRADING_CONTRACT_ADDRESS_TESTNET,
      userVault: this.currentConfig.isMainnet 
        ? process.env.USER_VAULT_CONTRACT_ADDRESS_MAINNET 
        : process.env.USER_VAULT_CONTRACT_ADDRESS_TESTNET,
      traderRegistry: this.currentConfig.isMainnet 
        ? process.env.TRADER_REGISTRY_CONTRACT_ADDRESS_MAINNET 
        : process.env.TRADER_REGISTRY_CONTRACT_ADDRESS_TESTNET,
      riskManager: this.currentConfig.isMainnet 
        ? process.env.RISK_MANAGER_CONTRACT_ADDRESS_MAINNET 
        : process.env.RISK_MANAGER_CONTRACT_ADDRESS_TESTNET,
    };
  }
}

// Export singleton instance
export const aptosConfig = AptosConfigService.getInstance();
