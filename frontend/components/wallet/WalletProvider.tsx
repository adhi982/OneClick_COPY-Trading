"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface WalletContextType {
  connected: boolean
  account: { address: string } | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState<{ address: string } | null>(null)

  const connect = async () => {
    try {
      // Force use of specific contract address for demo purposes
      const demoAddress = "0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260"
      setAccount({ address: demoAddress })
      setConnected(true)
      console.log("Demo wallet connected:", demoAddress)
      
      // Uncomment below to use real Petra wallet
      /*
      if (typeof window !== 'undefined' && (window as any).aptos) {
        // Petra wallet is available
        const response = await (window as any).aptos.connect()
        setAccount({ address: response.address })
        setConnected(true)
        console.log("Wallet connected:", response.address)
      } else {
        throw new Error("No Aptos wallet found. Please install Petra wallet.")
      }
      */
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAccount(null)
    console.log("Wallet disconnected")
  }

  // Check if wallet is already connected on load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Force use of specific contract address for demo purposes
        const demoAddress = "0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260"
        setAccount({ address: demoAddress })
        setConnected(true)
        console.log("Demo wallet auto-connected:", demoAddress)
        
        // Uncomment below to use real Petra wallet
        /*
        if (typeof window !== 'undefined' && (window as any).aptos) {
          const isConnected = await (window as any).aptos.isConnected()
          if (isConnected) {
            const account = await (window as any).aptos.account()
            setAccount({ address: account.address })
            setConnected(true)
            console.log("Wallet auto-connected:", account.address)
          }
        }
        */
      } catch (error) {
        console.log("No wallet connection found")
      }
    }

    checkConnection()
  }, [])

  return (
    <WalletContext.Provider value={{ connected, account, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}
