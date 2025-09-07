const { io } = require('socket.io-client');

const socket = io('http://localhost:5001', {
  auth: {
    walletAddress: '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260'
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
  
  // Request portfolio data
  console.log('📊 Requesting portfolio data...');
  socket.emit('get_portfolio', { 
    walletAddress: '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260' 
  });
  
  // Subscribe to trader
  console.log('👤 Subscribing to trader...');
  socket.emit('subscribe_trader', { 
    traderWallet: '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260' 
  });
});

socket.on('portfolio_update', (data) => {
  console.log('💰 Portfolio update received:', data);
});

socket.on('trader_performance', (data) => {
  console.log('📈 Trader performance:', data);
});

socket.on('trader_performance_update', (data) => {
  console.log('📊 Trader performance update:', data);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});

console.log('🔗 Attempting to connect to http://localhost:5001...');
