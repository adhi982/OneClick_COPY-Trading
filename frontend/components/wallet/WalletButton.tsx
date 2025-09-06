"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "./WalletProvider"
import { Wallet } from "lucide-react"

export function WalletButton() {
  const { isConnected, address, balance, connect, disconnect } = useWallet()

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <div className="font-medium">${balance.toFixed(2)}</div>
          <div className="text-muted-foreground text-xs">{address}</div>
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect} size="sm">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
