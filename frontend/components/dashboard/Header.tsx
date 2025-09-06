"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell, Settings, User } from "lucide-react"
import { WalletButton } from "@/components/wallet/WalletButton"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!pathname?.startsWith("/dashboard") && (
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="lg:block">
            <h1 className="text-2xl font-bold text-foreground">OneClick Trading</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>

          <WalletButton />

          <div className="relative group">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <User className="h-5 w-5" />
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
              <Link href="/auth/signin" className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
