"use client"

import { Search, Filter, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import OnboardClientDialog from "./OnboardClientButton"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DashboardHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight  bg-clip-text">
            Client Workspaces
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and onboard new organizations to the platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <OnboardClientDialog />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workspaces by name, owner email, or company..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Workspaces"
          value="24"
          trend="+3 this month"
          trendUp={true}
        />
        <StatCard
          label="Active"
          value="18"
          trend="75% of total"
          trendUp={true}
        />
        <StatCard
          label="Pending Setup"
          value="4"
          trend="2 need attention"
          trendUp={false}
        />
        <StatCard
          label="Companies"
          value="22"
          trend="92% completion"
          trendUp={true}
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
}

function StatCard({ label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className={`text-xs mt-2 ${trendUp ? 'text-green-600' : 'text-amber-600'}`}>
        {trend}
      </p>
    </div>
  )
}