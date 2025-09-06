"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { WalletProvider } from "@/components/wallet/WalletProvider"

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <WalletProvider>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-6 py-8">{children}</div>
          </main>
        </div>

        {sidebar && <div className="w-80 bg-card border-l border-border">{sidebar}</div>}
      </div>
    </WalletProvider>
  )
}
