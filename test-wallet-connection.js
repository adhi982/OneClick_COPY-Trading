/**
 * 🧪 REAL-TIME WALLET CONNECTION TEST
 * Test WebSocket connection with the correct wallet address
 */

const io = require('socket.io-client');

const WALLET_ADDRESS = '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260';
const SERVER_URL = 'http://localhost:3001';

console.log('🔗 Testing Real-Time Connection for Wallet:', WALLET_ADDRESS);
console.log('🌐 Server:', SERVER_URL);
console.log('=' .repeat(60));

const socket = io(SERVER_URL, {
  auth: {
    walletAddress: WALLET_ADDRESS
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected! Socket ID:', socket.id);
  console.log('📊 Testing trader subscription...');
  
  // Subscribe to trader data
  socket.emit('subscribe_trader', { 
    traderWallet: WALLET_ADDRESS 
  });
  
  // Request portfolio data
  setTimeout(() => {
    console.log('💰 Requesting portfolio data...');
    socket.emit('get_portfolio', { 
      walletAddress: WALLET_ADDRESS 
    });
  }, 1000);
});

socket.on('trader_performance', (data) => {
  console.log('📈 Trader Performance Update:');
  console.log('  - Total PnL:', data.data.totalPnL);
  console.log('  - Win Rate:', data.data.winRate + '%');
  console.log('  - Total Trades:', data.data.totalTrades);
  console.log('  - Risk Score:', data.data.riskScore);
});

socket.on('portfolio_update', (data) => {
  console.log('💰 Portfolio Update:');
  console.log('  - Total Value:', data.totalValue);
  console.log('  - Total PnL:', data.totalPnL);
  console.log('  - Daily Change:', data.dailyChange + '%');
  console.log('  - Active Positions:', data.activePositions);
  console.log('  - Positions:');
  data.positions.forEach((pos, index) => {
    console.log(`    ${index + 1}. ${pos.symbol}: ${pos.pnl >= 0 ? '+' : ''}${pos.pnl} (${pos.pnlPercentage}%)`);
  });
});

socket.on('trade_update', (data) => {
  console.log('📊 Trade Update:');
  console.log('  - Symbol:', data.data.symbol);
  console.log('  - Side:', data.data.side.toUpperCase());
  console.log('  - Amount:', data.data.amount);
  console.log('  - Price:', data.data.price);
  console.log('  - PnL:', data.data.pnl);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.log('❌ Connection Error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔌 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});

console.log('⏳ Connecting to real-time server...');
console.log('Press Ctrl+C to disconnect');
