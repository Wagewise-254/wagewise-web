"use client"

import { useState, useMemo } from "react"
import WorkspaceCard from "./WorkspaceCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Grid3x3, LayoutList } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Workspace } from "./WorkspaceCard"
import { cn } from "@/lib/utils"

interface WorkspaceGridProps {
  workspaces: Workspace[]
}

export default function WorkspaceGrid({ workspaces }: WorkspaceGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) => {
      const matchesSearch = 
        ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ws.workspace_users?.[0]?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ws.companies?.[0]?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || ws.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [workspaces, searchTerm, statusFilter])

  const stats = {
    total: workspaces.length,
    active: workspaces.filter(w => w.status === "ACTIVE").length,
    pending: workspaces.filter(w => w.status === "PENDING").length,
    suspended: workspaces.filter(w => w.status === "SUSPENDED").length,
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="ACTIVE" className="data-[state=active]:bg-white">
              Active ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="data-[state=active]:bg-white">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="SUSPENDED" className="data-[state=active]:bg-white">
              Suspended ({stats.suspended})
            </TabsTrigger>
          </TabsList>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-8 w-8",
                viewMode === "grid" 
                  ? "bg-white text-[#1F3A8A] shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-8 w-8",
                viewMode === "list" 
                  ? "bg-white text-[#1F3A8A] shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Tabs>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search workspaces by name, owner email, or company..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A8A]/20 focus:border-[#1F3A8A]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-slate-900">{filteredWorkspaces.length}</span> of {workspaces.length} workspaces
        </p>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="h-auto px-2 text-xs"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Workspace Grid/List */}
      <AnimatePresence mode="wait">
        {filteredWorkspaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16 bg-white rounded-xl border border-slate-200"
          >
            <div className="h-12 w-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No workspaces found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchTerm 
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Get started by onboarding your first client."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <WorkspaceCard 
                  workspace={workspace} 
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}