import { Suspense } from 'react'
import UserManagementTable from '@/components/admin/user-management-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Management</h2>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <UserManagementTable />
      </Suspense>
    </div>
  )
}
