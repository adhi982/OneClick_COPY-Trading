import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface CoinPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface MarketData {
  [symbol: string]: CoinPrice;
}

class CoinAPIService {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { data: CoinPrice; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache

  constructor() {
    this.apiKey = process.env.COINAPI_KEY || '';
    this.baseUrl = process.env.COINAPI_URL || 'https://rest.coinapi.io/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️ COINAPI_KEY not found in environment variables');
    }
  }

  /**
   * Get current price for a cryptocurrency
   */
  async getCurrentPrice(symbol: string): Promise<CoinPrice | null> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`📈 Using cached price for ${symbol}: $${cached.data.price}`);
        return cached.data;
      }

      // Map common symbols to CoinAPI format
      const symbolMap: { [key: string]: string } = {
        'APT': 'APT-USD',
        'BTC': 'BTC-USD',
        'ETH': 'ETH-USD',
        'USDC': 'USDC-USD',
        'USDT': 'USDT-USD'
      };

      const coinApiSymbol = symbolMap[symbol.toUpperCase()] || `${symbol.toUpperCase()}-USD`;
      
      console.log(`📊 Fetching current price for ${symbol} (${coinApiSymbol}) from CoinAPI...`);

      const response = await axios.get(`${this.baseUrl}/exchangerate/${coinApiSymbol}`, {
        headers: {
          'X-CoinAPI-Key': this.apiKey,
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      if (response.data && response.data.rate) {
        const priceData: CoinPrice = {
          symbol: symbol.toUpperCase(),
          price: parseFloat(response.data.rate.toFixed(6)),
          change24h: 0, // CoinAPI doesn't provide 24h change in this endpoint
          volume24h: 0,
          marketCap: 0,
          lastUpdated: new Date().toISOString()
        };

        // Cache the result
        this.cache.set(symbol, { data: priceData, timestamp: Date.now() });
        
        console.log(`✅ ${symbol} price fetched: $${priceData.price}`);
        return priceData;
      }

      throw new Error('Invalid response format from CoinAPI');
    } catch (error) {
      console.error(`❌ Error fetching price for ${symbol}:`, error);
      
      // Return fallback prices if API fails
      const fallbackPrices: { [key: string]: number } = {
        'APT': 8.50,
        'BTC': 45000,
        'ETH': 2500,
        'USDC': 1.00,
        'USDT': 1.00
      };

      if (fallbackPrices[symbol.toUpperCase()]) {
        console.log(`📊 Using fallback price for ${symbol}: $${fallbackPrices[symbol.toUpperCase()]}`);
        return {
          symbol: symbol.toUpperCase(),
          price: fallbackPrices[symbol.toUpperCase()],
          change24h: 0,
          volume24h: 0,
          marketCap: 0,
          lastUpdated: new Date().toISOString()
        };
      }

      return null;
    }
  }

  /**
   * Get multiple cryptocurrency prices
   */
  async getMultiplePrices(symbols: string[]): Promise<MarketData> {
    const marketData: MarketData = {};
    
    console.log(`📈 Fetching prices for multiple symbols: ${symbols.join(', ')}`);
    
    const pricePromises = symbols.map(async (symbol) => {
      const price = await this.getCurrentPrice(symbol);
      if (price) {
        marketData[symbol.toUpperCase()] = price;
      }
    });

    await Promise.all(pricePromises);
    
    console.log(`✅ Fetched ${Object.keys(marketData).length} prices successfully`);
    return marketData;
  }

  /**
   * Get APT price specifically (most commonly used)
   */
  async getAPTPrice(): Promise<number> {
    try {
      const aptPrice = await this.getCurrentPrice('APT');
      return aptPrice?.price || 8.50; // Fallback to 8.50 if fetch fails
    } catch (error) {
      console.error('❌ Error fetching APT price:', error);
      return 8.50; // Fallback price
    }
  }

  /**
   * Get market data for supported trading pairs
   */
  async getSupportedMarketData(): Promise<MarketData> {
    const supportedSymbols = ['APT', 'BTC', 'ETH', 'USDC', 'USDT'];
    return await this.getMultiplePrices(supportedSymbols);
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 CoinAPI cache cleared');
  }
}

export const coinAPIService = new CoinAPIService();
