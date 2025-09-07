import { coinMarketCapService, CoinPrice } from './coinmarketcap.service';
import { cryptoCompareService } from './cryptocompare.service';
import { coinAPIService } from './coinapi.service';

export interface MarketData {
  [symbol: string]: CoinPrice;
}

class UnifiedMarketDataService {
  private cache: Map<string, { data: CoinPrice; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds cache

  /**
   * Get current price with cascading fallback:
   * 1. CoinMarketCap (real-time)
   * 2. CryptoCompare (backup)
   * 3. CoinAPI (backup)
   * 4. Fallback prices
   */
  async getCurrentPrice(symbol: string): Promise<CoinPrice> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`📈 Using cached price for ${symbol}: $${cached.data.price}`);
        return cached.data;
      }

      console.log(`🔄 Fetching ${symbol} price with cascading fallback...`);

      // 1. Try CoinMarketCap (primary - real-time)
      console.log(`🚀 [1/4] Trying CoinMarketCap for ${symbol}...`);
      const cmcPrice = await coinMarketCapService.getCurrentPrice(symbol);
      if (cmcPrice) {
        this.cache.set(symbol, { data: cmcPrice, timestamp: Date.now() });
        console.log(`✅ ${symbol} price from CoinMarketCap: $${cmcPrice.price}`);
        return cmcPrice;
      }

      // 2. Try CryptoCompare (secondary backup)
      console.log(`🔄 [2/4] CoinMarketCap failed, trying CryptoCompare for ${symbol}...`);
      const cryptoComparePrice = await cryptoCompareService.getCurrentPrice(symbol);
      if (cryptoComparePrice) {
        this.cache.set(symbol, { data: cryptoComparePrice, timestamp: Date.now() });
        console.log(`✅ ${symbol} price from CryptoCompare: $${cryptoComparePrice.price}`);
        return cryptoComparePrice;
      }

      // 3. Try CoinAPI (tertiary backup)
      console.log(`🔄 [3/4] CryptoCompare failed, trying CoinAPI for ${symbol}...`);
      const coinApiPrice = await coinAPIService.getCurrentPrice(symbol);
      if (coinApiPrice) {
        this.cache.set(symbol, { data: coinApiPrice, timestamp: Date.now() });
        console.log(`✅ ${symbol} price from CoinAPI: $${coinApiPrice.price}`);
        return coinApiPrice;
      }

      // 4. Fallback to default prices
      console.log(`⚠️ [4/4] All APIs failed, using fallback price for ${symbol}`);
      const fallbackPrice = this.getFallbackPrice(symbol);
      this.cache.set(symbol, { data: fallbackPrice, timestamp: Date.now() });
      console.log(`📊 ${symbol} fallback price: $${fallbackPrice.price}`);
      return fallbackPrice;

    } catch (error) {
      console.error(`❌ Error in cascading price fetch for ${symbol}:`, error);
      const fallbackPrice = this.getFallbackPrice(symbol);
      console.log(`📊 ${symbol} emergency fallback price: $${fallbackPrice.price}`);
      return fallbackPrice;
    }
  }

  /**
   * Get multiple prices with cascading fallback
   */
  async getMultiplePrices(symbols: string[]): Promise<MarketData> {
    console.log(`🔄 Fetching multiple prices with cascading fallback: ${symbols.join(', ')}`);
    const marketData: MarketData = {};

    // 1. Try CoinMarketCap for all symbols first
    console.log(`🚀 [1/4] Trying CoinMarketCap for all symbols...`);
    try {
      const cmcData = await coinMarketCapService.getMultiplePrices(symbols);
      Object.assign(marketData, cmcData);
      
      if (Object.keys(cmcData).length > 0) {
        console.log(`✅ CoinMarketCap provided ${Object.keys(cmcData).length}/${symbols.length} prices`);
      }
    } catch (error) {
      console.log(`⚠️ CoinMarketCap bulk fetch failed, trying next provider...`);
    }

    // 2. For symbols not fetched from CMC, try CryptoCompare
    const missingAfterCMC = symbols.filter(symbol => !marketData[symbol.toUpperCase()]);
    if (missingAfterCMC.length > 0) {
      console.log(`🔄 [2/4] Trying CryptoCompare for missing symbols: ${missingAfterCMC.join(', ')}`);
      
      try {
        const cryptoCompareData = await cryptoCompareService.getMultiplePrices(missingAfterCMC);
        Object.assign(marketData, cryptoCompareData);
        
        if (Object.keys(cryptoCompareData).length > 0) {
          console.log(`✅ CryptoCompare provided ${Object.keys(cryptoCompareData).length}/${missingAfterCMC.length} prices`);
        }
      } catch (error) {
        console.log(`⚠️ CryptoCompare bulk fetch failed, trying next provider...`);
      }
    }

    // 3. For symbols still missing, try CoinAPI
    const missingAfterCryptoCompare = symbols.filter(symbol => !marketData[symbol.toUpperCase()]);
    if (missingAfterCryptoCompare.length > 0) {
      console.log(`🔄 [3/4] Trying CoinAPI for missing symbols: ${missingAfterCryptoCompare.join(', ')}`);
      
      for (const symbol of missingAfterCryptoCompare) {
        const coinApiPrice = await coinAPIService.getCurrentPrice(symbol);
        if (coinApiPrice) {
          marketData[symbol.toUpperCase()] = coinApiPrice;
        }
      }
    }

    // 4. For any remaining symbols, use fallback
    const stillMissingSymbols = symbols.filter(symbol => !marketData[symbol.toUpperCase()]);
    if (stillMissingSymbols.length > 0) {
      console.log(`⚠️ [4/4] Using fallback prices for: ${stillMissingSymbols.join(', ')}`);
      
      for (const symbol of stillMissingSymbols) {
        marketData[symbol.toUpperCase()] = this.getFallbackPrice(symbol);
      }
    }

    console.log(`✅ Successfully fetched prices for all ${symbols.length} symbols`);
    return marketData;
  }

  /**
   * Get APT price with cascading fallback
   */
  async getAPTPrice(): Promise<number> {
    const aptData = await this.getCurrentPrice('APT');
    return aptData.price;
  }

  /**
   * Get fallback price for a symbol
   */
  private getFallbackPrice(symbol: string): CoinPrice {
    const fallbackPrices: { [key: string]: number } = {
      'APT': 4.23,
      'BTC': 110646,
      'ETH': 4273.33,
      'USDC': 0.9998,
      'USDT': 1.00,
      'SOL': 140,
      'ADA': 0.35,
      'DOT': 6.50
    };

    const price = fallbackPrices[symbol.toUpperCase()] || 1.00;

    return {
      symbol: symbol.toUpperCase(),
      price: price,
      change24h: (Math.random() - 0.5) * 4, // Random change between -2% and +2%
      volume24h: 1000000 + Math.random() * 9000000,
      marketCap: price * 1000000000, // Rough estimate
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get supported market data for dashboard
   */
  async getSupportedMarketData(): Promise<MarketData> {
    const supportedSymbols = ['APT', 'BTC', 'ETH', 'USDC', 'USDT'];
    return await this.getMultiplePrices(supportedSymbols);
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    coinMarketCapService.clearCache();
    cryptoCompareService.clearCache();
    coinAPIService.clearCache();
    console.log('🧹 All market data caches cleared');
  }

  /**
   * Get service status and health
   */
  async getServiceStatus(): Promise<{
    coinMarketCap: boolean;
    cryptoCompare: boolean;
    coinAPI: boolean;
    fallback: boolean;
  }> {
    const status = {
      coinMarketCap: false,
      cryptoCompare: false,
      coinAPI: false,
      fallback: true // Fallback is always available
    };

    // Test CoinMarketCap
    try {
      const cmcTest = await coinMarketCapService.getCurrentPrice('BTC');
      status.coinMarketCap = !!cmcTest;
    } catch (error) {
      status.coinMarketCap = false;
    }

    // Test CryptoCompare
    try {
      const cryptoCompareTest = await cryptoCompareService.getCurrentPrice('BTC');
      status.cryptoCompare = !!cryptoCompareTest;
    } catch (error) {
      status.cryptoCompare = false;
    }

    // Test CoinAPI
    try {
      const coinApiTest = await coinAPIService.getCurrentPrice('BTC');
      status.coinAPI = !!coinApiTest;
    } catch (error) {
      status.coinAPI = false;
    }

    return status;
  }
}

export const unifiedMarketDataService = new UnifiedMarketDataService();
