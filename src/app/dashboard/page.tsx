import { Suspense } from "react"
import { getWorkspacesOverview } from "./actions"
import WorkspaceGrid from "@/components/dashboard/WorkspaceGrid"
import OnboardClientButton from "@/components/dashboard/OnboardClientButton"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const workspaces = await getWorkspacesOverview()

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold  bg-clip-text">
                Client Workspaces
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and onboard new organizations to the platform
              </p>
            </div>

            <OnboardClientButton />
          </div>

          <Suspense fallback={<DashboardSkeleton />}>
            <WorkspaceGrid workspaces={workspaces} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}