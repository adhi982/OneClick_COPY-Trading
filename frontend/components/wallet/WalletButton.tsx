"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "./WalletProvider"
import { Wallet } from "lucide-react"

export function WalletButton() {
  const { connected, account, disconnect, connect } = useWallet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet. Please make sure Petra wallet is installed and try again.")
    }
  }

  if (connected && account) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <div className="font-medium">Connected</div>
          <div className="text-muted-foreground text-xs">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} size="sm">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
