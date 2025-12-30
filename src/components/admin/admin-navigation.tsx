'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import paths from '@/paths'

const navItems = [
  {
    title: 'Dashboard',
    href: paths.admin(),
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: paths.adminUsers(),
    icon: Users,
  },
]

export default function AdminNavigation() {
  const pathname = usePathname()

  return (
    <Card>
      <CardContent className="p-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}
