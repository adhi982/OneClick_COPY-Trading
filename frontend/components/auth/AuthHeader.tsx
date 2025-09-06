"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"

export function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent z-10">
      <div className="container mx-auto px-6 py-4">
        <Link 
          href="/" 
          className="flex items-center space-x-2 w-fit hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">OneClick</span>
        </Link>
      </div>
    </header>
  )
}
