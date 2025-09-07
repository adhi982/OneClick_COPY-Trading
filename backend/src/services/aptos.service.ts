import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { logger } from '../utils/logger';
import { 
  CONTRACT_ADDRESS, 
  ENTRY_FUNCTIONS, 
  VIEW_FUNCTIONS
} from '../utils/contracts';

export interface TradeExecution {
   traderId: string;
   followerAddress: string;
   tokenPair: string;
   amount: number;
   type: 'buy' | 'sell';
   price: number;
   timestamp: Date;
}

export interface AptosNetworkConfig {
  network: Network;
  nodeUrl: string;
  indexerUrl?: string;
  isMainnet: boolean;
}

export class AptosService {
   private static aptos: Aptos;
   private static currentConfig: AptosNetworkConfig;

   static initialize() {
      this.currentConfig = this.getNetworkConfig();
      this.aptos = this.createAptosInstance();
      logger.info(`Aptos service initialized on ${this.currentConfig.isMainnet ? 'mainnet' : 'testnet'}`);
      logger.info(`Using RPC: ${this.currentConfig.nodeUrl}`);
   }

   private static getNetworkConfig(): AptosNetworkConfig {
      const networkType = process.env.APTOS_NETWORK || 'testnet';
      const useAnkr = process.env.APTOS_USE_ANKR === 'true';

      if (networkType === 'mainnet') {
         return {
            network: Network.MAINNET,
            nodeUrl: useAnkr 
               ? process.env.APTOS_ANKR_MAINNET_RPC! 
               : (process.env.APTOS_MAINNET_RPC || 'https://fullnode.mainnet.aptoslabs.com/v1'),
            indexerUrl: 'https://indexer.mainnet.aptoslabs.com/v1/graphql',
            isMainnet: true
         };
      } else {
         return {
            network: Network.TESTNET,
            nodeUrl: useAnkr 
               ? process.env.APTOS_ANKR_TESTNET_RPC! 
               : (process.env.APTOS_TESTNET_RPC || 'https://fullnode.testnet.aptoslabs.com/v1'),
            indexerUrl: 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
            isMainnet: false
         };
      }
   }

   private static createAptosInstance(): Aptos {
      const config = new AptosConfig({
         network: this.currentConfig.network,
         fullnode: this.currentConfig.nodeUrl,
         indexer: this.currentConfig.indexerUrl
      });
      return new Aptos(config);
   }

   static getAptos(): Aptos {
      if (!this.aptos) {
         this.initialize();
      }
      return this.aptos;
   }

   static getCurrentConfig(): AptosNetworkConfig {
      return this.currentConfig;
   }

   // Method to switch networks (for admin use)
   static switchToMainnet(): void {
      if (!this.currentConfig.isMainnet) {
         logger.info('🔄 Switching to Mainnet...');
         process.env.APTOS_NETWORK = 'mainnet';
         this.initialize();
         logger.info('✅ Switched to Mainnet successfully');
      }
   }

   static switchToTestnet(): void {
      if (this.currentConfig.isMainnet) {
         logger.info('🔄 Switching to Testnet...');
         process.env.APTOS_NETWORK = 'testnet';
         this.initialize();
         logger.info('✅ Switched to Testnet successfully');
      }
   }

   static async getAccountBalance(address: string): Promise<number> {
      try {
         logger.info(`🔍 Checking balance for: ${address}`);
         
         // Method 1: Try the view function approach (what CLI uses)
         try {
            const payload = {
               function: "0x1::coin::balance",
               type_arguments: ["0x1::aptos_coin::AptosCoin"],
               arguments: [address]
            };
            
            const response = await fetch(`${this.currentConfig.nodeUrl}/view`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(payload)
            });
            
            if (response.ok) {
               const result = await response.json();
               logger.info(`📊 View function response: ${JSON.stringify(result)}`);
               
               if (Array.isArray(result) && result.length > 0) {
                  const balanceOctas = parseInt(result[0]);
                  const balanceAPT = balanceOctas / 100000000; // Convert from octas to APT
                  logger.info(`✅ Found APT balance via view function: ${balanceAPT} APT (${balanceOctas} octas)`);
                  return balanceAPT;
               }
            } else {
               const errorText = await response.text();
               logger.warn(`❌ View function failed: ${response.status} - ${errorText}`);
            }
         } catch (viewError) {
            logger.warn(`⚠️ View function error: ${viewError}`);
         }

         // Method 2: Direct resource call
         try {
            const resourceUrl = `${this.currentConfig.nodeUrl}/accounts/${address}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`;
            logger.info(`🌐 Trying direct resource: ${resourceUrl}`);
            
            const response = await fetch(resourceUrl);
            if (response.ok) {
               const data: any = await response.json();
               logger.info(`📋 Resource response: ${JSON.stringify(data, null, 2)}`);
               
               if (data && data.data && data.data.coin && data.data.coin.value) {
                  const balanceOctas = parseInt(data.data.coin.value);
                  const balanceAPT = balanceOctas / 100000000; // Convert from octas to APT
                  logger.info(`✅ Found APT balance via resource call: ${balanceAPT} APT (${balanceOctas} octas)`);
                  return balanceAPT;
               }
            } else {
               const errorText = await response.text();
               logger.warn(`❌ Direct resource failed: ${response.status} - ${errorText}`);
            }
         } catch (resourceError) {
            logger.warn(`⚠️ Direct resource error: ${resourceError}`);
         }

         // Method 3: SDK fallback
         try {
            const resources = await this.getAptos().getAccountResources({ accountAddress: address });
            logger.info(`📊 SDK found ${resources.length} resources`);
            
            const aptResource = resources.find(
               (resource: any) => resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
            );

            if (aptResource) {
               const balanceOctas = parseInt((aptResource.data as any).coin.value);
               const balanceAPT = balanceOctas / 100000000; // Convert from octas to APT
               logger.info(`✅ Found APT balance via SDK: ${balanceAPT} APT (${balanceOctas} octas)`);
               return balanceAPT;
            }
         } catch (sdkError) {
            logger.warn(`⚠️ SDK error: ${sdkError}`);
         }

         // Check if account exists
         try {
            const account = await this.getAptos().getAccountInfo({ accountAddress: address });
            logger.warn(`⚠️ Account exists but no APT balance found via any method. Account sequence: ${account.sequence_number}`);
            logger.info('💡 The account may need to receive APT tokens to initialize the CoinStore');
            return 0;
         } catch (accountError) {
            logger.warn(`⚠️ Account does not exist: ${address}`);
            return 0;
         }

      } catch (error) {
         logger.error('Error fetching account balance:', error);
         throw new Error('Failed to fetch account balance');
      }
   }

   static async initializeAptCoinStore(privateKey: string): Promise<string> {
      try {
         const account = Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(privateKey) });
         
         const transaction = await this.getAptos().transaction.build.simple({
            sender: account.accountAddress,
            data: {
               function: "0x1::managed_coin::register",
               typeArguments: ["0x1::aptos_coin::AptosCoin"],
               functionArguments: []
            }
         });

         const committedTxn = await this.getAptos().signAndSubmitTransaction({
            signer: account,
            transaction
         });

         await this.getAptos().waitForTransaction({
            transactionHash: committedTxn.hash
         });

         logger.info(`✅ APT CoinStore initialized for account: ${account.accountAddress.toString()}`);
         logger.info(`📝 Transaction hash: ${committedTxn.hash}`);
         return committedTxn.hash;
      } catch (error) {
         logger.error('Error initializing APT CoinStore:', error);
         throw new Error('Failed to initialize APT CoinStore');
      }
   }

   static async getTransactionHistory(address: string, limit: number = 50): Promise<any[]> {
      try {
         const transactions = await this.getAptos().getAccountTransactions({
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
         return transaction.type === 'user_transaction' && transaction.success;
      } catch (error) {
         logger.error('Error validating transaction:', error);
         return false;
      }
   }

   // === Contract Interaction Methods ===

   /**
    * Create a new vault for a user
    */
   static async createVault(
      userAddress: string,
      initialDeposit: string,
      maxDailyLoss: string,
      maxPositionSize: string
   ): Promise<string> {
      try {
         logger.info(`Creating vault for user: ${userAddress}`);
         
         const transaction = await this.aptos.transaction.build.simple({
            sender: userAddress,
            data: {
               function: ENTRY_FUNCTIONS.CREATE_VAULT,
               functionArguments: [initialDeposit, maxDailyLoss, maxPositionSize]
            }
         });

         // Return the transaction for signing by the client
         return JSON.stringify(transaction);
      } catch (error) {
         logger.error('Error creating vault:', error);
         throw new Error('Failed to create vault');
      }
   }

   /**
    * Register a user as a trader
    */
   static async registerTrader(
      traderAddress: string,
      displayName: string,
      performanceFee: string,
      minFollowers: string
   ): Promise<string> {
      try {
         logger.info(`Registering trader: ${traderAddress}`);
         
         const transaction = await this.aptos.transaction.build.simple({
            sender: traderAddress,
            data: {
               function: ENTRY_FUNCTIONS.REGISTER_AS_TRADER,
               functionArguments: [displayName, performanceFee, minFollowers]
            }
         });

         return JSON.stringify(transaction);
      } catch (error) {
         logger.error('Error registering trader:', error);
         throw new Error('Failed to register trader');
      }
   }

   /**
    * Execute a copy trade
    */
   static async executeCopyTrade(
      traderAddress: string,
      symbol: string,
      amount: string,
      price: string,
      isLong: boolean
   ): Promise<string> {
      try {
         logger.info(`Executing copy trade: ${symbol} for ${amount}`);
         
         const transaction = await this.aptos.transaction.build.simple({
            sender: traderAddress,
            data: {
               function: ENTRY_FUNCTIONS.EXECUTE_COPY_TRADE,
               functionArguments: [traderAddress, symbol, amount, price, isLong]
            }
         });

         return JSON.stringify(transaction);
      } catch (error) {
         logger.error('Error executing copy trade:', error);
         throw new Error('Failed to execute copy trade');
      }
   }

   /**
    * Get vault balance for a user
    */
   static async getVaultBalance(userAddress: string): Promise<any> {
      try {
         const result = await this.aptos.view({
            payload: {
               function: VIEW_FUNCTIONS.GET_VAULT_BALANCE,
               functionArguments: [userAddress]
            }
         });

         return result;
      } catch (error) {
         logger.error('Error getting vault balance:', error);
         throw new Error('Failed to get vault balance');
      }
   }

   /**
    * Get trader profile
    */
   static async getTraderProfile(traderAddress: string): Promise<any> {
      try {
         const result = await this.aptos.view({
            payload: {
               function: VIEW_FUNCTIONS.GET_TRADER_PROFILE,
               functionArguments: [traderAddress]
            }
         });

         return result;
      } catch (error) {
         logger.error('Error getting trader profile:', error);
         throw new Error('Failed to get trader profile');
      }
   }

   /**
    * Deposit funds to vault
    */
   static async depositToVault(userAddress: string, amount: string): Promise<string> {
      try {
         logger.info(`Depositing ${amount} to vault for user: ${userAddress}`);
         
         const transaction = await this.aptos.transaction.build.simple({
            sender: userAddress,
            data: {
               function: ENTRY_FUNCTIONS.DEPOSIT,
               functionArguments: [amount]
            }
         });

         return JSON.stringify(transaction);
      } catch (error) {
         logger.error('Error depositing to vault:', error);
         throw new Error('Failed to deposit to vault');
      }
   }

   /**
    * Withdraw funds from vault
    */
   static async withdrawFromVault(userAddress: string, amount: string): Promise<string> {
      try {
         logger.info(`Withdrawing ${amount} from vault for user: ${userAddress}`);
         
         const transaction = await this.aptos.transaction.build.simple({
            sender: userAddress,
            data: {
               function: ENTRY_FUNCTIONS.WITHDRAW,
               functionArguments: [amount]
            }
         });

         return JSON.stringify(transaction);
      } catch (error) {
         logger.error('Error withdrawing from vault:', error);
         throw new Error('Failed to withdraw from vault');
      }
   }

   /**
    * Check if position is at risk
    */
   static async isPositionAtRisk(
      userAddress: string,
      positionValue: string,
      totalPnl: string,
      accountValueThreshold: string
   ): Promise<boolean> {
      try {
         const result = await this.aptos.view({
            payload: {
               function: VIEW_FUNCTIONS.IS_POSITION_AT_RISK,
               functionArguments: [userAddress, positionValue, totalPnl, accountValueThreshold]
            }
         });

         return result[0] as boolean;
      } catch (error) {
         logger.error('Error checking position risk:', error);
         throw new Error('Failed to check position risk');
      }
   }
}
