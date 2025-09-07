"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useWalletConnection } from './use-wallet-connection'

export const useRealTimeData = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    authenticated: false,
    lastPing: null as number | null,
    reconnectAttempts: 0
  })

  // Real-time data states
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [tradeUpdates, setTradeUpdates] = useState<any[]>([])
  const [traderPerformance, setTraderPerformance] = useState<Map<string, any>>(new Map())
  const [marketData, setMarketData] = useState<Map<string, any>>(new Map())
  const [positionUpdates, setPositionUpdates] = useState<any[]>([])

  /**
   * Initialize socket connection
   */
  const initializeSocket = useCallback(() => {
    console.log('🚀 Initializing WebSocket connection...')
    
    if (socket?.connected) {
      console.log('🟢 Socket already connected')
      return
    }

    const serverUrl = 'http://localhost:5001'
    const walletAddress = '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260'
    
    console.log('🔗 Connecting to:', serverUrl, 'with wallet:', walletAddress)
    
    const newSocket = io(serverUrl, {
      auth: {
        walletAddress: walletAddress
      },
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('✅ Connected to server:', newSocket.id)
      setSocket(newSocket)
      setConnectionStatus({
        connected: true,
        authenticated: true,
        lastPing: Date.now(),
        reconnectAttempts: 0
      })
    })

    newSocket.on('disconnect', (reason: string) => {
      console.log('🔌 Disconnected:', reason)
      setConnectionStatus(prev => ({
        ...prev,
        connected: false
      }))
    })

    newSocket.on('connect_error', (error: any) => {
      console.error('❌ Connection error:', error)
    })

    // Portfolio updates
    newSocket.on('portfolio_update', (data: any) => {
      console.log('💰 Portfolio update received:', data)
      setPortfolioData(data)
    })

    // Market data updates
    newSocket.on('market_data_update', (data: any) => {
      console.log('📈 Market data update received:', data)
      if (data.data) {
        // Convert the market data object to a Map
        const newMarketData = new Map()
        Object.entries(data.data).forEach(([symbol, priceData]) => {
          newMarketData.set(symbol, priceData)
        })
        setMarketData(newMarketData)
      }
    })

    // Trader performance updates  
    newSocket.on('trader_performance', (data: any) => {
      console.log('📊 Trader performance:', data)
    })

    newSocket.on('trader_performance_update', (data: any) => {
      console.log('📈 Trader performance update:', data)
    })

    console.log('📡 Socket event listeners set up')
  }, [socket])

  /**
   * Subscribe to trader updates
   */
  const subscribeToTrader = useCallback((traderId: string) => {
    console.log('🔔 Subscribing to trader:', traderId)
    if (!socket?.connected) {
      console.warn('Socket not connected, cannot subscribe')
      return
    }
    socket.emit('subscribe_trader', { traderWallet: traderId })
  }, [socket])

  /**
   * Subscribe to market data
   */
  const subscribeToMarketData = useCallback((symbols: string[]) => {
    console.log('📈 Subscribing to market data:', symbols)
  }, [])

  /**
   * Refresh portfolio data
   */
  const refreshPortfolio = useCallback(() => {
    console.log('🔄 Refreshing portfolio data...')
    if (!socket?.connected) {
      console.warn('Socket not connected, cannot refresh portfolio')
      return
    }
    
    const walletAddress = '0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260'
    socket.emit('get_portfolio', { walletAddress })
  }, [socket])

  /**
   * Get latest price for a symbol
   */
  const getLatestPrice = useCallback((symbol: string) => {
    const data = marketData.get(symbol)
    return data?.price || null
  }, [marketData])

  // Initialize socket when component mounts
  useEffect(() => {
    console.log('🚀 Mounting useRealTimeData hook')
    initializeSocket()

    return () => {
      console.log('🧹 Cleaning up socket connection')
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return {
    connectionStatus,
    portfolioData,
    tradeUpdates,
    traderPerformance,
    marketData,
    positionUpdates,
    subscribeToTrader,
    subscribeToMarketData,
    refreshPortfolio,
    getLatestPrice
  }
}
