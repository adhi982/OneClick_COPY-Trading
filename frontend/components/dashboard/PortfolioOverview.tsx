"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { contractService, UserVault } from "@/lib/contract-service"
import { useWalletConnection } from "@/hooks/use-wallet-connection"
import { WalletInstructions } from "@/components/wallet/WalletInstructions"

export function PortfolioOverview() {
  const { connected, address } = useWalletConnection()
  const [vaultData, setVaultData] = useState<UserVault | null>(null)
  const [loading, setLoading] = useState(false)
  const [accountBalance, setAccountBalance] = useState(0)

  useEffect(() => {
    async function loadVaultData() {
      if (!connected || !address) {
        setVaultData(null)
        return
      }

      setLoading(true)
      try {
        const [vault, balance] = await Promise.all([
          contractService.getUserVault(address),
          contractService.getAccountBalance(address)
        ])
        setVaultData(vault)
        setAccountBalance(balance)
      } catch (error) {
        console.error('Error loading vault data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVaultData()
  }, [connected, address])

  // Default stats for non-connected state
  const defaultStats = [
    {
      title: "Connect Wallet",
      value: "Not Connected",
      change: "Connect to view",
      changeType: "neutral" as const,
      icon: DollarSign,
    },
    {
      title: "Total P&L",
      value: "--",
      change: "--",
      changeType: "neutral" as const,
      icon: TrendingUp,
    },
    {
      title: "Active Positions",
      value: "--",
      change: "--",
      changeType: "neutral" as const,
      icon: Activity,
    },
    {
      title: "Following Traders",
      value: "--",
      change: "--",
      changeType: "neutral" as const,
      icon: TrendingUp,
    },
  ]

  // Real stats from contract data
  const realStats = vaultData ? [
    {
      title: "Account Balance",
      value: `${accountBalance.toFixed(4)} APT`,
      change: vaultData.exists ? "Vault Active" : "No Vault",
      changeType: vaultData.exists ? "positive" : "neutral" as const,
      icon: DollarSign,
    },
    {
      title: "Vault Value",
      value: vaultData.exists ? `${vaultData.totalValue.toFixed(4)} APT` : "No Vault",
      change: vaultData.exists ? `${vaultData.totalPnL >= 0 ? '+' : ''}${vaultData.totalPnL.toFixed(4)} APT` : "Create vault to start",
      changeType: vaultData.totalPnL >= 0 ? "positive" : "negative" as const,
      icon: TrendingUp,
    },
    {
      title: "Active Positions",
      value: vaultData.exists ? vaultData.positions.toString() : "0",
      change: vaultData.exists ? `${vaultData.positions} open` : "No positions",
      changeType: vaultData.positions > 0 ? "positive" : "neutral" as const,
      icon: Activity,
    },
    {
      title: "Following Traders",
      value: vaultData.exists ? vaultData.followingTraders.toString() : "0",
      change: vaultData.exists ? `${vaultData.followingTraders} active` : "Start following",
      changeType: vaultData.followingTraders > 0 ? "positive" : "neutral" as const,
      icon: TrendingUp,
    },
  ] : defaultStats

  const stats = connected && address ? realStats : defaultStats

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      {connected && address && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <span className="font-medium">Connected:</span> {address.slice(0, 6)}...{address.slice(-4)}
            {vaultData?.exists ? " (Vault Active)" : " (No Vault Created)"}
          </p>
        </div>
      )}

      {!connected && (
        <WalletInstructions />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div
                className={`text-xs flex items-center ${
                  stat.changeType === "positive" 
                    ? "text-green-600" 
                    : stat.changeType === "negative" 
                    ? "text-red-600" 
                    : "text-gray-500"
                }`}
              >
                {stat.changeType === "positive" && <TrendingUp className="h-3 w-3 mr-1" />}
                {stat.changeType === "negative" && <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
