import axios from 'axios';
import { CoinPrice } from './coinmarketcap.service';

class CryptoCompareService {
  private apiKey: string;
  private baseURL = 'https://min-api.cryptocompare.com/data';
  private cache: Map<string, { data: CoinPrice; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache

  constructor() {
    this.apiKey = process.env.CRYPTOCOMPARE_API_KEY || '';
    
    if (!this.apiKey) {
      console.log('⚠️ CryptoCompare API key not found in environment variables');
    } else {
      console.log('✅ CryptoCompare API key configured');
    }
  }

  /**
   * Get current price for a single cryptocurrency
   */
  async getCurrentPrice(symbol: string): Promise<CoinPrice | null> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol.toUpperCase());
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`📈 CryptoCompare cached price for ${symbol}: $${cached.data.price}`);
        return cached.data;
      }

      if (!this.apiKey) {
        console.log('⚠️ CryptoCompare API key not available');
        return null;
      }

      console.log(`🔍 CryptoCompare fetching ${symbol} price...`);

      const response = await axios.get(`${this.baseURL}/pricemultifull`, {
        params: {
          fsyms: symbol.toUpperCase(),
          tsyms: 'USD',
          api_key: this.apiKey
        },
        timeout: 5000
      });

      const data = response.data;
      
      if (!data.RAW || !data.RAW[symbol.toUpperCase()] || !data.RAW[symbol.toUpperCase()].USD) {
        console.log(`⚠️ CryptoCompare: No data found for ${symbol}`);
        return null;
      }

      const coinData = data.RAW[symbol.toUpperCase()].USD;

      const coinPrice: CoinPrice = {
        symbol: symbol.toUpperCase(),
        price: parseFloat(coinData.PRICE) || 0,
        change24h: parseFloat(coinData.CHANGEPCT24HOUR) || 0,
        volume24h: parseFloat(coinData.VOLUME24HOURTO) || 0,
        marketCap: parseFloat(coinData.MKTCAP) || 0,
        lastUpdated: new Date(coinData.LASTUPDATE * 1000).toISOString()
      };

      // Cache the result
      this.cache.set(symbol.toUpperCase(), { 
        data: coinPrice, 
        timestamp: Date.now() 
      });

      console.log(`✅ CryptoCompare ${symbol} price: $${coinPrice.price} (${coinPrice.change24h > 0 ? '+' : ''}${coinPrice.change24h.toFixed(2)}%)`);
      return coinPrice;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          console.log('⚠️ CryptoCompare API rate limit exceeded');
        } else if (error.response?.status === 401) {
          console.log('⚠️ CryptoCompare API key unauthorized');
        } else {
          console.log(`⚠️ CryptoCompare API error: ${error.response?.status}`);
        }
      } else {
        console.log(`⚠️ CryptoCompare network error:`, error instanceof Error ? error.message : 'Unknown error');
      }
      return null;
    }
  }

  /**
   * Get prices for multiple cryptocurrencies
   */
  async getMultiplePrices(symbols: string[]): Promise<{ [symbol: string]: CoinPrice }> {
    const marketData: { [symbol: string]: CoinPrice } = {};

    if (!this.apiKey) {
      console.log('⚠️ CryptoCompare API key not available for bulk fetch');
      return marketData;
    }

    try {
      console.log(`🔍 CryptoCompare fetching multiple prices: ${symbols.join(', ')}`);

      const response = await axios.get(`${this.baseURL}/pricemultifull`, {
        params: {
          fsyms: symbols.map(s => s.toUpperCase()).join(','),
          tsyms: 'USD',
          api_key: this.apiKey
        },
        timeout: 10000
      });

      const data = response.data;

      if (!data.RAW) {
        console.log('⚠️ CryptoCompare: No raw data in response');
        return marketData;
      }

      for (const symbol of symbols) {
        const upperSymbol = symbol.toUpperCase();
        
        if (data.RAW[upperSymbol] && data.RAW[upperSymbol].USD) {
          const coinData = data.RAW[upperSymbol].USD;

          const coinPrice: CoinPrice = {
            symbol: upperSymbol,
            price: parseFloat(coinData.PRICE) || 0,
            change24h: parseFloat(coinData.CHANGEPCT24HOUR) || 0,
            volume24h: parseFloat(coinData.VOLUME24HOURTO) || 0,
            marketCap: parseFloat(coinData.MKTCAP) || 0,
            lastUpdated: new Date(coinData.LASTUPDATE * 1000).toISOString()
          };

          marketData[upperSymbol] = coinPrice;

          // Cache individual results
          this.cache.set(upperSymbol, { 
            data: coinPrice, 
            timestamp: Date.now() 
          });
        }
      }

      console.log(`✅ CryptoCompare provided ${Object.keys(marketData).length}/${symbols.length} prices`);
      return marketData;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          console.log('⚠️ CryptoCompare bulk API rate limit exceeded');
        } else if (error.response?.status === 401) {
          console.log('⚠️ CryptoCompare bulk API key unauthorized');
        } else {
          console.log(`⚠️ CryptoCompare bulk API error: ${error.response?.status}`);
        }
      } else {
        console.log(`⚠️ CryptoCompare bulk network error:`, error instanceof Error ? error.message : 'Unknown error');
      }
      return marketData;
    }
  }

  /**
   * Get APT specific price
   */
  async getAPTPrice(): Promise<number | null> {
    const aptData = await this.getCurrentPrice('APT');
    return aptData ? aptData.price : null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 CryptoCompare cache cleared');
  }

  /**
   * Check if service is available
   */
  async isServiceAvailable(): Promise<boolean> {
    try {
      if (!this.apiKey) return false;
      
      const testPrice = await this.getCurrentPrice('BTC');
      return testPrice !== null;
    } catch (error) {
      return false;
    }
  }
}

export const cryptoCompareService = new CryptoCompareService();
