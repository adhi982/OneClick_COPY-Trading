"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  TrendingUp,
  Users,
  BarChart3,
  X,
  Wallet,
  MessageSquare,
  Crown,
  Radio
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Copy Trading", href: "/copy-trading", icon: TrendingUp },
  { name: "Top Traders", href: "/traders", icon: Users },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Community", href: "/community", icon: MessageSquare },
  { name: "My Channels", href: "/community/my-channels", icon: Radio },
  { name: "Subscriptions", href: "/subscriptions", icon: Crown }
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <>
      {/* Mobile overlay for non-dashboard pages */}
      {!isDashboard && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={cn(
          "bg-card border-r border-border overflow-hidden",
          isDashboard 
            ? "w-64 static" // Static sidebar for dashboard
            : cn(
                "fixed inset-y-0 left-0 z-50", // Animated sidebar for other pages
                isOpen ? "w-64" : "w-0"
              )
        )}
        initial={false}
        animate={isDashboard ? { width: "256px" } : { width: isOpen ? "256px" : "0px" }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">OneClick</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </motion.div>
    </>
  )
}
