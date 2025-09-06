import { v4 as uuidv4 } from 'uuid';

export interface CopySettingsData {
   id: string;
   userId: string;
   traderId: string;
   amount: number;
   settings: {
      maxTradeSize: number;
      stopLoss: number;
      takeProfit: number;
      maxDailyLoss?: number;
      diversificationLimit?: number;
   };
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;
}

export class CopySettings {
   id: string;
   userId: string;
   traderId: string;
   amount: number;
   settings: {
      maxTradeSize: number;
      stopLoss: number;
      takeProfit: number;
      maxDailyLoss?: number;
      diversificationLimit?: number;
   };
   isActive: boolean;
   createdAt: Date;
   updatedAt: Date;

   constructor(data: CopySettingsData) {
      this.id = data.id;
      this.userId = data.userId;
      this.traderId = data.traderId;
      this.amount = data.amount;
      this.settings = data.settings;
      this.isActive = data.isActive;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
   }

   static async findByUserAndTrader(userId: string, traderId: string): Promise<CopySettings | null> {
      const data = this.mockDatabase.find(
         copy => copy.userId === userId && copy.traderId === traderId && copy.isActive
      );
      return data ? new CopySettings(data) : null;
   }

   static async findByUser(userId: string): Promise<CopySettings[]> {
      const data = this.mockDatabase.filter(
         copy => copy.userId === userId && copy.isActive
      );
      return data.map(copy => new CopySettings(copy));
   }

   static async create(data: Omit<CopySettingsData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CopySettings> {
      const newCopySettings: CopySettingsData = {
         id: uuidv4(),
         createdAt: new Date(),
         updatedAt: new Date(),
         ...data
      };

      this.mockDatabase.push(newCopySettings);
      return new CopySettings(newCopySettings);
   }

   static async deactivate(id: string): Promise<boolean> {
      const index = this.mockDatabase.findIndex(copy => copy.id === id);
      if (index !== -1) {
         this.mockDatabase[index].isActive = false;
         this.mockDatabase[index].updatedAt = new Date();
         return true;
      }
      return false;
   }

   static async updateSettings(id: string, settings: any): Promise<CopySettings | null> {
      const index = this.mockDatabase.findIndex(copy => copy.id === id);
      if (index !== -1) {
         this.mockDatabase[index].settings = { ...this.mockDatabase[index].settings, ...settings };
         this.mockDatabase[index].updatedAt = new Date();
         return new CopySettings(this.mockDatabase[index]);
      }
      return null;
   }

   // Mock database
   private static mockDatabase: CopySettingsData[] = [];
}
