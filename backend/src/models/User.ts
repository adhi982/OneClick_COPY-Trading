import { v4 as uuidv4 } from 'uuid';

export interface UserPreferences {
   maxTradeAmount?: number;
   dailyLimit?: number;
   stopLossPercent?: number;
   riskTolerance?: 'low' | 'medium' | 'high';
   allowedTokens?: string[];
}

export interface UserData {
   id: string;
   walletAddress: string;
   createdAt: Date;
   isActive: boolean;
   totalValue?: number;
   activePositions?: number;
   preferences?: UserPreferences;
}

export class User {
   id: string;
   walletAddress: string;
   createdAt: Date;
   isActive: boolean;
   totalValue?: number;
   activePositions?: number;
   preferences?: UserPreferences;

   constructor(data: UserData) {
      this.id = data.id;
      this.walletAddress = data.walletAddress;
      this.createdAt = data.createdAt;
      this.isActive = data.isActive;
      this.totalValue = data.totalValue;
      this.activePositions = data.activePositions;
      this.preferences = data.preferences;
   }

   static async findByWalletAddress(walletAddress: string): Promise<User | null> {
      // Simulate database query
      // In production, this would query PostgreSQL
      const userData = await this.mockDatabase.find(user =>
         user.walletAddress === walletAddress
      );

      return userData ? new User(userData) : null;
   }

   static async findById(id: string): Promise<User | null> {
      const userData = await this.mockDatabase.find(user => user.id === id);
      return userData ? new User(userData) : null;
   }

   static async create(data: Omit<UserData, 'id'>): Promise<User> {
      const newUser: UserData = {
         id: uuidv4(),
         ...data
      };

      this.mockDatabase.push(newUser);
      return new User(newUser);
   }

   static async updatePreferences(userId: string, preferences: UserPreferences): Promise<User | null> {
      const userIndex = this.mockDatabase.findIndex(user => user.id === userId);
      if (userIndex === -1) return null;

      this.mockDatabase[userIndex].preferences = {
         ...this.mockDatabase[userIndex].preferences,
         ...preferences
      };

      return new User(this.mockDatabase[userIndex]);
   }

   // Mock database for development
   private static mockDatabase: UserData[] = [];
}
