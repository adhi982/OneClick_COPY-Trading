import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, TrendingUp, BarChart3, Users, DollarSign, Activity } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">OneClick</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/traders"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Traders
            </Link>
            <Link
              href="/community"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Community
            </Link>
            <Link
              href="/analytics"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Analytics
            </Link>
            <Link
              href="/test-contract"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Test Contract
            </Link>
          </nav>
          <Button asChild>
            <Link href="/dashboard">Connect Wallet & Start Trading</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            Copy Trading Made Simple on <span className="text-blue-600">Aptos</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
            Follow top performers, automate your trading, maximize returns with our advanced copy trading platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/dashboard">
                Connect Wallet & Start Trading
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent" asChild>
              <Link href="/traders">Browse Top Traders</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white dark:bg-gray-800 py-12 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
              <div className="text-gray-600 dark:text-gray-300">Active Traders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">$12.4M</div>
              <div className="text-gray-600 dark:text-gray-300">24h Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">+18.7%</div>
              <div className="text-gray-600 dark:text-gray-300">Avg Returns</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">1,234</div>
              <div className="text-gray-600 dark:text-gray-300">Copies Today</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose OneClick?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Advanced features designed for successful copy trading
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Automated Copy Trading</CardTitle>
              <CardDescription>Set once, profit always</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced algorithms automatically replicate successful traders' strategies in real-time, ensuring
                you never miss profitable opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>Your safety, our priority</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive risk controls including stop-losses, position limits, and portfolio diversification to
                protect your investments.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Real-time Analytics</CardTitle>
              <CardDescription>Data-driven decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced analytics dashboard with performance metrics, risk analysis, and detailed reporting to optimize
                your trading strategy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Start copy trading in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                description: "Connect your Aptos wallet securely to get started",
                icon: <DollarSign className="w-8 h-8" />,
              },
              {
                step: "2",
                title: "Browse Traders",
                description: "Explore top-performing traders and their strategies",
                icon: <Users className="w-8 h-8" />,
              },
              {
                step: "3",
                title: "Set Preferences",
                description: "Configure your risk tolerance and allocation amounts",
                icon: <Shield className="w-8 h-8" />,
              },
              {
                step: "4",
                title: "Start Copying",
                description: "Automatically copy trades and monitor performance",
                icon: <TrendingUp className="w-8 h-8" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performers Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Top Performers This Month</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Join thousands following these successful traders</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {[
            { name: "CryptoKing", return: "+24.5%", followers: "2.1K", risk: "Medium" },
            { name: "DeFiMaster", return: "+19.8%", followers: "1.8K", risk: "Low" },
            { name: "AptosWhale", return: "+31.2%", followers: "3.2K", risk: "High" },
            { name: "SafeTrader", return: "+15.6%", followers: "1.5K", risk: "Low" },
            { name: "MoonShot", return: "+28.9%", followers: "2.7K", risk: "High" },
          ].map((trader, index) => (
            <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  {trader.name[0]}
                </div>
                <CardTitle className="text-lg">{trader.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-green-600">{trader.return}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{trader.followers} followers</div>
                <Badge
                  variant={trader.risk === "Low" ? "secondary" : trader.risk === "Medium" ? "default" : "destructive"}
                >
                  {trader.risk} Risk
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/traders">
              View All Traders
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">OneClick</span>
              </div>
              <p className="text-gray-400">The leading copy trading platform on Aptos blockchain.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/traders" className="hover:text-white">
                    Browse Traders
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Risk Disclosure
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OneClick Copy Trading Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
