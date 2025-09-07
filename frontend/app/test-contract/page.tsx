"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { contractService } from "@/lib/contract-service"

export default function TestContractPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [testAddress, setTestAddress] = useState("0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260")

  const testVaultExists = async () => {
    setLoading(true)
    try {
      const exists = await contractService.checkVaultExists(testAddress)
      setResult({ type: "vault_exists", result: exists })
    } catch (error) {
      setResult({ type: "error", result: error })
    } finally {
      setLoading(false)
    }
  }

  const testGetBalance = async () => {
    setLoading(true)
    try {
      const balance = await contractService.getAccountBalance(testAddress)
      setResult({ type: "balance", result: balance })
    } catch (error) {
      setResult({ type: "error", result: error })
    } finally {
      setLoading(false)
    }
  }

  const testGetVault = async () => {
    setLoading(true)
    try {
      const vault = await contractService.getUserVault(testAddress)
      setResult({ type: "vault", result: vault })
    } catch (error) {
      setResult({ type: "error", result: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Contract Integration Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Contract Functions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Address:</label>
            <Input 
              value={testAddress}
              onChange={(e) => setTestAddress(e.target.value)}
              placeholder="Enter address to test..."
            />
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={testVaultExists} disabled={loading}>
              Test Vault Exists
            </Button>
            <Button onClick={testGetBalance} disabled={loading}>
              Test Get Balance
            </Button>
            <Button onClick={testGetVault} disabled={loading}>
              Test Get Vault
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Testing contract...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Test Result: {result.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Contract Address:</strong> 0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260</p>
            <p><strong>Network:</strong> Aptos Testnet</p>
            <p><strong>Modules:</strong> main, user_vault, trader_registry, risk_manager</p>
            <p><strong>Status:</strong> Deployed and Active</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
