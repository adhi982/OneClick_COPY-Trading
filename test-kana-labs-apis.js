/**
 * 🧪 KANA LABS API TESTING SCRIPT
 * Test all essential APIs for copy trading platform
 */

const axios = require('axios');
const WebSocket = require('ws');

class KanaLabsApiTester {
  constructor() {
    this.config = {
      apiKey: process.env.KANA_LABS_API_KEY || 'your_api_key_here',
      perpsBaseUrl: process.env.KANA_PERPS_BASE_URL || 'https://perps-sdk.kanalabs.io',
      websocketUrl: process.env.KANA_LABS_WS_URL || 'wss://perps-sdk-ws.kanalabs.io/wsOrderBook',
      testWallet: '0x1234567890123456789012345678901234567890' // Replace with test wallet
    };
    
    this.headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * 🔹 Test Market Order API
   */
  async testPlaceMarketOrder() {
    console.log('\n🎯 Testing Place Market Order API...');
    try {
      const response = await axios.post(
        `${this.config.perpsBaseUrl}/api/v1/orders/market`,
        {
          marketId: 'APT-USDC',
          side: 'buy',
          size: 0.1,
          leverage: 1,
          reduceOnly: false
        },
        { headers: this.headers }
      );
      
      console.log('✅ Market Order API - SUCCESS');
      console.log('Order ID:', response.data.orderId);
      return response.data;
    } catch (error) {
      console.log('❌ Market Order API - FAILED');
      console.log('Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 🔹 Test Get Positions API
   */
  async testGetPositions() {
    console.log('\n📊 Testing Get Positions API...');
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/positions`,
        {
          headers: this.headers,
          params: { walletAddress: this.config.testWallet }
        }
      );
      
      console.log('✅ Get Positions API - SUCCESS');
      console.log('Positions Count:', response.data.positions?.length || 0);
      return response.data;
    } catch (error) {
      console.log('❌ Get Positions API - FAILED');
      console.log('Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 🔹 Test Trading Account Balance API
   */
  async testGetTradingBalance() {
    console.log('\n💰 Testing Trading Account Balance API...');
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/account/balance`,
        {
          headers: this.headers,
          params: { walletAddress: this.config.testWallet }
        }
      );
      
      console.log('✅ Trading Balance API - SUCCESS');
      console.log('Available Balance:', response.data.availableBalance);
      return response.data;
    } catch (error) {
      console.log('❌ Trading Balance API - FAILED');
      console.log('Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 🔹 Test Market Info API
   */
  async testGetMarketInfo() {
    console.log('\n📈 Testing Market Info API...');
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/markets/APT-USDC`,
        { headers: this.headers }
      );
      
      console.log('✅ Market Info API - SUCCESS');
      console.log('Market ID:', response.data.marketId);
      console.log('Base Asset:', response.data.baseAsset);
      return response.data;
    } catch (error) {
      console.log('❌ Market Info API - FAILED');
      console.log('Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 🔹 Test Market Price API
   */
  async testGetMarketPrice() {
    console.log('\n💲 Testing Market Price API...');
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/markets/APT-USDC/price`,
        { headers: this.headers }
      );
      
      console.log('✅ Market Price API - SUCCESS');
      console.log('Current Price:', response.data.price);
      return response.data;
    } catch (error) {
      console.log('❌ Market Price API - FAILED');
      console.log('Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 🔹 Test Get All Trades API
   */
  async testGetAllTrades() {
    console.log('\n📋 Testing Get All Trades API...');
    try {
      const response = await axios.get(
        `${this.config.perpsBaseUrl}/api/v1/trades`,
        {
          headers: this.headers,
          params: { 
            walletAddress: this.config.testWallet,
            limit: 10
          }
        }
      );
      
      console.log('✅ Get All Trades API - SUCCESS');
      console.log('Trades Count:', response.data.trades?.length || 0);
      return response.data;
    } catch (error) {
      console.log('❌ Get All Trades API - FAILED');
      console.log('Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * 🔹 Test WebSocket Connection
   */
  async testWebSocketConnection() {
    console.log('\n📡 Testing WebSocket Connection...');
    return new Promise((resolve) => {
      try {
        const wsUrl = `${this.config.websocketUrl}?marketId=APT-USDC`;
        const ws = new WebSocket(wsUrl, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        });

        let messageReceived = false;

        ws.on('open', () => {
          console.log('✅ WebSocket Connection - OPENED');
        });

        ws.on('message', (data) => {
          if (!messageReceived) {
            messageReceived = true;
            console.log('✅ WebSocket Message - RECEIVED');
            console.log('Sample Data:', JSON.parse(data.toString()));
            ws.close();
            resolve(true);
          }
        });

        ws.on('error', (error) => {
          console.log('❌ WebSocket Connection - FAILED');
          console.log('Error:', error.message);
          resolve(false);
        });

        ws.on('close', () => {
          if (!messageReceived) {
            console.log('❌ WebSocket Connection - CLOSED WITHOUT DATA');
            resolve(false);
          }
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!messageReceived) {
            console.log('⏰ WebSocket Connection - TIMEOUT');
            ws.close();
            resolve(false);
          }
        }, 10000);

      } catch (error) {
        console.log('❌ WebSocket Connection - ERROR');
        console.log('Error:', error.message);
        resolve(false);
      }
    });
  }

  /**
   * 🚀 Run All API Tests
   */
  async runAllTests() {
    console.log('🔬 KANA LABS API TESTING SUITE');
    console.log('===============================');
    console.log(`🔗 Base URL: ${this.config.perpsBaseUrl}`);
    console.log(`🔑 API Key: ${this.config.apiKey ? '***configured***' : '❌ NOT SET'}`);
    console.log(`👛 Test Wallet: ${this.config.testWallet}`);

    if (!this.config.apiKey || this.config.apiKey === 'your_api_key_here') {
      console.log('\n❌ ERROR: Please set KANA_LABS_API_KEY in your .env file');
      return;
    }

    const results = {
      marketInfo: await this.testGetMarketInfo(),
      marketPrice: await this.testGetMarketPrice(),
      tradingBalance: await this.testGetTradingBalance(),
      positions: await this.testGetPositions(),
      trades: await this.testGetAllTrades(),
      websocket: await this.testWebSocketConnection()
    };

    // Skip order placement in test mode to avoid real trades
    console.log('\n⚠️  Market Order API - SKIPPED (to avoid real trades)');

    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    Object.entries(results).forEach(([test, result]) => {
      const status = result ? '✅ PASS' : '❌ FAIL';
      console.log(`${test.padEnd(15)}: ${status}`);
    });

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Score: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! Kana Labs integration is ready.');
    } else {
      console.log('⚠️  Some tests failed. Check your API configuration.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new KanaLabsApiTester();
  tester.runAllTests().catch(console.error);
}

module.exports = KanaLabsApiTester;
