import { Suspense } from 'react'
import DashboardStats from '@/components/admin/dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  )
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  )
}
