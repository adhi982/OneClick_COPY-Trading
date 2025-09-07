import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface MarketQuote {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  last_updated: string;
}

export interface CoinMarketCapData {
  symbol: string;
  name: string;
  quote: {
    USD: MarketQuote;
  };
}

export interface CoinPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

class CoinMarketCapService {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { data: CoinPrice; timestamp: number }> = new Map();
  private cacheTimeout = 60000; // 1 minute cache for real-time data

  constructor() {
    this.apiKey = process.env.COINMARKETCAP_API_KEY || '';
    this.baseUrl = process.env.COINMARKETCAP_BASE_URL || 'https://pro-api.coinmarketcap.com/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️ COINMARKETCAP_API_KEY not found in environment variables');
    }
  }

  /**
   * Get current price for a cryptocurrency from CoinMarketCap
   */
  async getCurrentPrice(symbol: string): Promise<CoinPrice | null> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`📈 Using cached CMC price for ${symbol}: $${cached.data.price}`);
        return cached.data;
      }

      console.log(`🚀 Fetching real-time price for ${symbol} from CoinMarketCap...`);

      const response = await axios.get(`${this.baseUrl}/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          'Accept': 'application/json'
        },
        params: {
          symbol: symbol.toUpperCase(),
          convert: 'USD'
        },
        timeout: 10000
      });

      if (response.data && response.data.data && response.data.data[symbol.toUpperCase()]) {
        const coinData: CoinMarketCapData = response.data.data[symbol.toUpperCase()];
        const quote = coinData.quote.USD;

        const priceData: CoinPrice = {
          symbol: symbol.toUpperCase(),
          price: parseFloat(quote.price.toFixed(6)),
          change24h: parseFloat(quote.percent_change_24h.toFixed(2)),
          volume24h: parseFloat(quote.volume_24h.toFixed(2)),
          marketCap: parseFloat(quote.market_cap.toFixed(2)),
          lastUpdated: quote.last_updated
        };

        // Cache the result
        this.cache.set(symbol, { data: priceData, timestamp: Date.now() });
        
        console.log(`✅ ${symbol} real-time price from CMC: $${priceData.price} (${priceData.change24h}% 24h)`);
        return priceData;
      }

      throw new Error('Invalid response format from CoinMarketCap');
    } catch (error) {
      console.error(`❌ Error fetching ${symbol} from CoinMarketCap:`, error);
      return null;
    }
  }

  /**
   * Get multiple cryptocurrency prices
   */
  async getMultiplePrices(symbols: string[]): Promise<{ [symbol: string]: CoinPrice }> {
    try {
      console.log(`🚀 Fetching multiple real-time prices from CoinMarketCap: ${symbols.join(', ')}`);

      const response = await axios.get(`${this.baseUrl}/cryptocurrency/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          'Accept': 'application/json'
        },
        params: {
          symbol: symbols.join(','),
          convert: 'USD'
        },
        timeout: 15000
      });

      const marketData: { [symbol: string]: CoinPrice } = {};

      if (response.data && response.data.data) {
        Object.entries(response.data.data).forEach(([symbol, coinData]: [string, any]) => {
          const quote = coinData.quote.USD;
          const priceData: CoinPrice = {
            symbol: symbol.toUpperCase(),
            price: parseFloat(quote.price.toFixed(6)),
            change24h: parseFloat(quote.percent_change_24h.toFixed(2)),
            volume24h: parseFloat(quote.volume_24h.toFixed(2)),
            marketCap: parseFloat(quote.market_cap.toFixed(2)),
            lastUpdated: quote.last_updated
          };

          marketData[symbol] = priceData;
          // Cache individual results
          this.cache.set(symbol, { data: priceData, timestamp: Date.now() });
        });

        console.log(`✅ Fetched ${Object.keys(marketData).length} real-time prices from CMC`);
        return marketData;
      }

      throw new Error('Invalid response format from CoinMarketCap');
    } catch (error) {
      console.error('❌ Error fetching multiple prices from CoinMarketCap:', error);
      return {};
    }
  }

  /**
   * Get APT price specifically
   */
  async getAPTPrice(): Promise<number | null> {
    try {
      const aptPrice = await this.getCurrentPrice('APT');
      return aptPrice?.price || null;
    } catch (error) {
      console.error('❌ Error fetching APT price from CoinMarketCap:', error);
      return null;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 CoinMarketCap cache cleared');
  }
}

export const coinMarketCapService = new CoinMarketCapService();
