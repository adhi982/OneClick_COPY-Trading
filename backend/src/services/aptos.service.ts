import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { logger } from '../utils/logger';

export interface TradeExecution {
   traderId: string;
   followerAddress: string;
   tokenPair: string;
   amount: number;
   type: 'buy' | 'sell';
   price: number;
   timestamp: Date;
}

export class AptosService {
   private static aptos: Aptos;

   static initialize() {
      const config = new AptosConfig({
         network: (process.env.APTOS_NETWORK as Network) || Network.DEVNET
      });
      this.aptos = new Aptos(config);
      logger.info(`Aptos service initialized on ${process.env.APTOS_NETWORK || 'devnet'}`);
   }

   static getAptos(): Aptos {
      if (!this.aptos) {
         this.initialize();
      }
      return this.aptos;
   }

   static async getAccountBalance(address: string): Promise<number> {
      try {
         const resources = await this.aptos.getAccountResources({ accountAddress: address });
         const aptResource = resources.find(
            (resource) => resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
         );

         if (aptResource) {
            const balance = (aptResource.data as any).coin.value;
            return parseInt(balance) / 100000000; // Convert from octas to APT
         }

         return 0;
      } catch (error) {
         logger.error('Error fetching account balance:', error);
         throw new Error('Failed to fetch account balance');
      }
   }

   static async getTransactionHistory(address: string, limit: number = 50): Promise<any[]> {
      try {
         const transactions = await this.aptos.getAccountTransactions({
            accountAddress: address,
            options: { limit }
         });

         return transactions;
      } catch (error) {
         logger.error('Error fetching transaction history:', error);
         throw new Error('Failed to fetch transaction history');
      }
   }

   static async submitCopyTrade(tradeExecution: TradeExecution): Promise<string> {
      try {
         // Mock transaction submission
         // In production, this would submit actual transactions to the blockchain
         logger.info('Submitting copy trade:', tradeExecution);

         // Simulate transaction hash
         const txHash = '0x' + Math.random().toString(16).substr(2, 64);

         return txHash;
      } catch (error) {
         logger.error('Error submitting copy trade:', error);
         throw new Error('Failed to submit copy trade');
      }
   }

   static async monitorTraderTransactions(traderAddress: string): Promise<any[]> {
      try {
         const recentTxs = await this.getTransactionHistory(traderAddress, 10);

         // Filter for trading-related transactions
         const tradingTxs = recentTxs.filter(tx => {
            // Mock filtering logic - in production, check for specific event types
            return tx.type === 'user_transaction';
         });

         return tradingTxs;
      } catch (error) {
         logger.error('Error monitoring trader transactions:', error);
         throw new Error('Failed to monitor trader transactions');
      }
   }

   static async getTokenPrice(tokenAddress: string): Promise<number> {
      try {
         // Mock token price - in production, fetch from DEX or oracle
         const mockPrices: Record<string, number> = {
            '0x1::aptos_coin::AptosCoin': 8.93,
            'default': 1.0
         };

         return mockPrices[tokenAddress] || mockPrices.default;
      } catch (error) {
         logger.error('Error fetching token price:', error);
         throw new Error('Failed to fetch token price');
      }
   }

   static async validateTransaction(txHash: string): Promise<boolean> {
      try {
         const transaction = await this.aptos.getTransactionByHash({ transactionHash: txHash });
         return transaction.success === true;
      } catch (error) {
         logger.error('Error validating transaction:', error);
         return false;
      }
   }
}
