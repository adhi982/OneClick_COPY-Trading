import { AptosClientService } from './aptos-client';
import { CONTRACT_ADDRESS, MODULE_ADDRESSES, VIEW_FUNCTIONS } from '../../lib/contracts';
import { AccountAddress } from '@aptos-labs/ts-sdk';

export interface UserVault {
  exists: boolean;
  balance: number;
  totalValue: number;
  positions: number;
  totalPnL: number;
  followingTraders: number;
}

export interface TraderProfile {
  exists: boolean;
  name: string;
  totalCopiers: number;
  totalVolume: number;
  winRate: number;
  totalPnL: number;
  verified: boolean;
}

class ContractService {
  private static instance: ContractService;
  private aptosClient: AptosClientService;

  private constructor() {
    this.aptosClient = AptosClientService.getInstance();
  }

  static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  /**
   * Check if a user vault exists for the given address
   */
  async checkVaultExists(userAddress: string): Promise<boolean> {
    try {
      const aptos = this.aptosClient.getAptos();
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESSES.MAIN}::vault_exists`,
          functionArguments: [userAddress]
        }
      });
      return result[0] as boolean;
    } catch (error) {
      console.error('Error checking vault existence:', error);
      return false;
    }
  }

  /**
   * Get user vault details
   */
  async getUserVault(userAddress: string): Promise<UserVault> {
    try {
      const aptos = this.aptosClient.getAptos();
      
      // Check if vault exists first
      const vaultExists = await this.checkVaultExists(userAddress);
      
      if (!vaultExists) {
        return {
          exists: false,
          balance: 0,
          totalValue: 0,
          positions: 0,
          totalPnL: 0,
          followingTraders: 0
        };
      }

      // Get vault data
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESSES.MAIN}::get_user_vault`,
          functionArguments: [userAddress]
        }
      });

      // Parse the vault data from the contract
      const vaultData = result[0] as any;
      
      return {
        exists: true,
        balance: parseFloat(vaultData.balance || '0') / 100000000, // Convert from octas to APT
        totalValue: parseFloat(vaultData.total_value || '0') / 100000000,
        positions: parseInt(vaultData.active_positions || '0'),
        totalPnL: parseFloat(vaultData.total_pnl || '0') / 100000000,
        followingTraders: parseInt(vaultData.following_traders || '0')
      };
    } catch (error) {
      console.error('Error getting user vault:', error);
      return {
        exists: false,
        balance: 0,
        totalValue: 0,
        positions: 0,
        totalPnL: 0,
        followingTraders: 0
      };
    }
  }

  /**
   * Get trader profile
   */
  async getTraderProfile(traderAddress: string): Promise<TraderProfile> {
    try {
      const aptos = this.aptosClient.getAptos();
      
      const result = await aptos.view({
        payload: {
          function: `${MODULE_ADDRESSES.MAIN}::get_trader_profile`,
          functionArguments: [traderAddress]
        }
      });

      const profileData = result[0] as any;
      
      return {
        exists: true,
        name: profileData.name || `Trader ${traderAddress.slice(0, 8)}...`,
        totalCopiers: parseInt(profileData.total_copiers || '0'),
        totalVolume: parseFloat(profileData.total_volume || '0') / 100000000,
        winRate: parseFloat(profileData.win_rate || '0'),
        totalPnL: parseFloat(profileData.total_pnl || '0') / 100000000,
        verified: profileData.verified || false
      };
    } catch (error) {
      console.error('Error getting trader profile:', error);
      return {
        exists: false,
        name: 'Unknown Trader',
        totalCopiers: 0,
        totalVolume: 0,
        winRate: 0,
        totalPnL: 0,
        verified: false
      };
    }
  }

  /**
   * Get account balance in APT
   */
  async getAccountBalance(address: string): Promise<number> {
    try {
      const aptos = this.aptosClient.getAptos();
      const accountAddress = AccountAddress.fromString(address);
      const resources = await aptos.getAccountCoinsData({
        accountAddress: accountAddress
      });
      
      // Find APT coin resource
      const aptCoin = resources.find((coin: any) => 
        coin.asset_type === '0x1::aptos_coin::AptosCoin'
      );
      
      if (aptCoin) {
        return parseInt(aptCoin.amount) / 100000000; // Convert from octas to APT
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting account balance:', error);
      return 0;
    }
  }

  /**
   * Create a new user vault
   */
  async createUserVault(userAddress: string): Promise<boolean> {
    try {
      // This would be called through a wallet transaction
      // For now, just return false to indicate vault doesn't exist
      console.log('Create vault function would be called for:', userAddress);
      return false;
    } catch (error) {
      console.error('Error creating user vault:', error);
      return false;
    }
  }
}

export const contractService = ContractService.getInstance();
