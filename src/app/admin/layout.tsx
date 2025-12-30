import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-utils'
import AdminNavigation from '@/components/admin/admin-navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, content, and platform settings
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <AdminNavigation />
          </aside>
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  )
}
