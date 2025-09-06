import { CopySettings } from '../models/CopySettings';
import { AptosService } from './aptos.service';
import { logger } from '../utils/logger';

export interface TradeSignal {
   traderId: string;
   symbol: string;
   type: 'buy' | 'sell';
   amount: number;
   price: number;
   timestamp: Date;
}

export interface RiskAssessment {
   isAllowed: boolean;
   reason?: string;
   adjustedAmount?: number;
}

export class TradingService {
   static async processTradeSignal(signal: TradeSignal): Promise<void> {
      try {
         logger.info('Processing trade signal:', signal);

         // Get all followers of this trader
         const followers = await CopySettings.findByTrader(signal.traderId);

         for (const follower of followers) {
            // Assess risk for each follower
            const riskAssessment = await this.assessRisk(follower, signal);

            if (riskAssessment.isAllowed) {
               const amount = riskAssessment.adjustedAmount || signal.amount;

               // Execute the copy trade
               await this.executeCopyTrade(follower, signal, amount);
            } else {
               logger.info(`Trade blocked for user ${follower.userId}: ${riskAssessment.reason}`);
            }
         }
      } catch (error) {
         logger.error('Error processing trade signal:', error);
      }
   }

   static async assessRisk(copySettings: CopySettings, signal: TradeSignal): Promise<RiskAssessment> {
      try {
         const { settings, amount: totalAmount } = copySettings;

         // Check maximum trade size
         const maxTradeAmount = settings.maxTradeSize;
         if (signal.amount > maxTradeAmount) {
            const adjustedAmount = Math.min(signal.amount, maxTradeAmount);
            return {
               isAllowed: true,
               adjustedAmount,
               reason: `Amount adjusted to max trade size: ${maxTradeAmount}`
            };
         }

         // Check daily limits (mock implementation)
         const dailyUsed = await this.getDailyTradingAmount(copySettings.userId);
         const dailyLimit = settings.maxDailyLoss || totalAmount * 0.1; // 10% daily limit

         if (dailyUsed + signal.amount > dailyLimit) {
            return {
               isAllowed: false,
               reason: 'Daily trading limit exceeded'
            };
         }

         // Check stop-loss conditions
         if (await this.shouldTriggerStopLoss(copySettings, signal)) {
            return {
               isAllowed: false,
               reason: 'Stop-loss conditions met'
            };
         }

         return { isAllowed: true };

      } catch (error) {
         logger.error('Error assessing risk:', error);
         return {
            isAllowed: false,
            reason: 'Risk assessment failed'
         };
      }
   }

   static async executeCopyTrade(
      copySettings: CopySettings,
      signal: TradeSignal,
      amount: number
   ): Promise<void> {
      try {
         const tradeExecution = {
            traderId: signal.traderId,
            followerAddress: copySettings.userId, // In production, this would be the wallet address
            tokenPair: signal.symbol,
            amount,
            type: signal.type,
            price: signal.price,
            timestamp: new Date()
         };

         // Submit transaction to blockchain
         const txHash = await AptosService.submitCopyTrade(tradeExecution);

         logger.info(`Copy trade executed: ${txHash}`, {
            userId: copySettings.userId,
            traderId: signal.traderId,
            amount,
            txHash
         });

         // Store trade record (mock implementation)
         await this.recordTrade(copySettings.userId, signal, amount, txHash);

      } catch (error) {
         logger.error('Error executing copy trade:', error);
         throw error;
      }
   }

   static async getDailyTradingAmount(userId: string): Promise<number> {
      // Mock implementation - in production, query from database
      return Math.random() * 1000;
   }

   static async shouldTriggerStopLoss(copySettings: CopySettings, signal: TradeSignal): Promise<boolean> {
      // Mock implementation - in production, check current positions and P&L
      const stopLossPercent = copySettings.settings.stopLoss;

      // Simulate checking if current loss exceeds stop-loss threshold
      const currentLoss = Math.random() * 10; // 0-10%
      return currentLoss > stopLossPercent;
   }

   static async recordTrade(
      userId: string,
      signal: TradeSignal,
      amount: number,
      txHash: string
   ): Promise<void> {
      // Mock implementation - in production, save to database
      logger.info('Trade recorded:', {
         userId,
         signal,
         amount,
         txHash,
         timestamp: new Date()
      });
   }

   static async calculatePortfolioMetrics(userId: string): Promise<any> {
      try {
         // Mock portfolio calculations
         return {
            totalValue: 15750.25,
            totalInvested: 15000,
            totalReturn: 750.25,
            returnPercent: 5.0,
            dayChange: 2.5,
            positions: 3,
            activeTrades: 5
         };
      } catch (error) {
         logger.error('Error calculating portfolio metrics:', error);
         throw error;
      }
   }
}

// Extend CopySettings model with trader lookup
declare module '../models/CopySettings' {
   namespace CopySettings {
      function findByTrader(traderId: string): Promise<CopySettings[]>;
   }
}

// Add the method to CopySettings
Object.assign(CopySettings, {
   async findByTrader(traderId: string): Promise<CopySettings[]> {
      // Mock implementation
      return [];
   }
});
