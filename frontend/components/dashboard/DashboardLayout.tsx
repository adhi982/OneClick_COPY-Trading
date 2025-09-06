"use client"

import type React from "react"

import { Sidebar } from "./Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>

      {sidebar && <div className="w-80 bg-card border-l border-border">{sidebar}</div>}
    </div>
  )
}
