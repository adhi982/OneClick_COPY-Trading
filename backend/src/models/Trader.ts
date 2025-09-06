import { v4 as uuidv4 } from 'uuid';

export interface TraderData {
   id: string;
   walletAddress: string;
   name: string;
   username: string;
   avatar?: string;
   riskLevel: 'low' | 'medium' | 'high';
   monthlyReturn: number;
   followers: number;
   winRate: number;
   avgHoldTime: string;
   sharpeRatio: number;
   totalTrades: number;
   totalVolume: number;
   createdAt: Date;
   isActive: boolean;
}

export class Trader {
   id: string;
   walletAddress: string;
   name: string;
   username: string;
   avatar?: string;
   riskLevel: 'low' | 'medium' | 'high';
   monthlyReturn: number;
   followers: number;
   winRate: number;
   avgHoldTime: string;
   sharpeRatio: number;
   totalTrades: number;
   totalVolume: number;
   createdAt: Date;
   isActive: boolean;

   constructor(data: TraderData) {
      this.id = data.id;
      this.walletAddress = data.walletAddress;
      this.name = data.name;
      this.username = data.username;
      this.avatar = data.avatar;
      this.riskLevel = data.riskLevel;
      this.monthlyReturn = data.monthlyReturn;
      this.followers = data.followers;
      this.winRate = data.winRate;
      this.avgHoldTime = data.avgHoldTime;
      this.sharpeRatio = data.sharpeRatio;
      this.totalTrades = data.totalTrades;
      this.totalVolume = data.totalVolume;
      this.createdAt = data.createdAt;
      this.isActive = data.isActive;
   }

   static async findAll(filters?: any): Promise<Trader[]> {
      let traders = this.mockDatabase.filter(trader => trader.isActive);

      if (filters?.riskLevel && filters.riskLevel !== 'all') {
         traders = traders.filter(trader => trader.riskLevel === filters.riskLevel);
      }

      if (filters?.minReturn) {
         traders = traders.filter(trader => trader.monthlyReturn >= filters.minReturn);
      }

      // Sort by monthly return descending
      traders.sort((a, b) => b.monthlyReturn - a.monthlyReturn);

      return traders.map(trader => new Trader(trader));
   }

   static async findById(id: string): Promise<Trader | null> {
      const traderData = this.mockDatabase.find(trader => trader.id === id);
      return traderData ? new Trader(traderData) : null;
   }

   static async getTopTraders(limit: number = 10): Promise<Trader[]> {
      const traders = this.mockDatabase
         .filter(trader => trader.isActive)
         .sort((a, b) => b.monthlyReturn - a.monthlyReturn)
         .slice(0, limit);

      return traders.map(trader => new Trader(trader));
   }

   static async updateFollowerCount(traderId: string, increment: boolean): Promise<void> {
      const traderIndex = this.mockDatabase.findIndex(trader => trader.id === traderId);
      if (traderIndex !== -1) {
         this.mockDatabase[traderIndex].followers += increment ? 1 : -1;
         this.mockDatabase[traderIndex].followers = Math.max(0, this.mockDatabase[traderIndex].followers);
      }
   }

   // Mock database with sample traders
   private static mockDatabase: TraderData[] = [
      {
         id: uuidv4(),
         walletAddress: '0x1234567890abcdef',
         name: 'Alpha Trader',
         username: 'alphatrader',
         avatar: '/avatars/1.jpg',
         riskLevel: 'medium',
         monthlyReturn: 25.5,
         followers: 1250,
         winRate: 75,
         avgHoldTime: '2.5d',
         sharpeRatio: 1.8,
         totalTrades: 450,
         totalVolume: 2500000,
         createdAt: new Date('2024-01-01'),
         isActive: true
      },
      {
         id: uuidv4(),
         walletAddress: '0xabcdef1234567890',
         name: 'Steady Eddie',
         username: 'steadyeddie',
         avatar: '/avatars/2.jpg',
         riskLevel: 'low',
         monthlyReturn: 12.3,
         followers: 890,
         winRate: 85,
         avgHoldTime: '5.2d',
         sharpeRatio: 2.1,
         totalTrades: 320,
         totalVolume: 1800000,
         createdAt: new Date('2024-01-15'),
         isActive: true
      },
      {
         id: uuidv4(),
         walletAddress: '0x9876543210fedcba',
         name: 'Risk Taker',
         username: 'risktaker',
         avatar: '/avatars/3.jpg',
         riskLevel: 'high',
         monthlyReturn: 45.7,
         followers: 2100,
         winRate: 65,
         avgHoldTime: '1.2d',
         sharpeRatio: 1.5,
         totalTrades: 780,
         totalVolume: 4200000,
         createdAt: new Date('2024-02-01'),
         isActive: true
      }
   ];
}
