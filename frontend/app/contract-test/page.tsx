"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { contractService } from "@/lib/contract-service"

export default function ContractTestPage() {
  const [contractData, setContractData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testAddress] = useState("0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260")

  const testContractConnection = async () => {
    setLoading(true)
    try {
      console.log("Testing contract connection...")
      
      // Test vault existence
      const vaultExists = await contractService.checkVaultExists(testAddress)
      console.log("Vault exists:", vaultExists)
      
      // Test get vault data
      const vaultData = await contractService.getUserVault(testAddress)
      console.log("Vault data:", vaultData)
      
      // Test account balance
      const balance = await contractService.getAccountBalance(testAddress)
      console.log("Account balance:", balance)
      
      setContractData({
        vaultExists,
        vaultData,
        accountBalance: balance,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      console.error("Contract test error:", error)
      setContractData({
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contract Integration Test</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Aptos Smart Contract Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Test Address:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{testAddress}</p>
          </div>
          
          <Button onClick={testContractConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Contract Connection"}
          </Button>
          
          {contractData && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Results:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(contractData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
