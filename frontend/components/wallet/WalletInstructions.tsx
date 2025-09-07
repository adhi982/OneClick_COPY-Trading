"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ExternalLink, Download } from "lucide-react"
import Link from "next/link"

export function WalletInstructions() {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-900">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Wallet Setup Instructions
        </CardTitle>
        <CardDescription className="text-blue-700">
          To use OneClick Copy Trading, you need an Aptos wallet installed in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-blue-900">Step 1: Install Petra Wallet</h4>
          <p className="text-sm text-blue-700">
            Petra is the most popular Aptos wallet. Install it as a browser extension.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="https://petra.app/" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Install Petra Wallet
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-blue-900">Step 2: Set up Testnet</h4>
          <p className="text-sm text-blue-700">
            Make sure your wallet is connected to Aptos Testnet (not Mainnet) to interact with our deployed contract.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-blue-900">Step 3: Get Test APT</h4>
          <p className="text-sm text-blue-700">
            Get free test APT tokens from the faucet to interact with the platform.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="https://aptoslabs.com/testnet-faucet" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Aptos Testnet Faucet
            </Link>
          </Button>
        </div>

        <div className="bg-white/50 p-3 rounded border border-blue-200">
          <p className="text-xs text-blue-600">
            <strong>Contract Address:</strong> 0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
