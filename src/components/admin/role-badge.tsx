'use client'

import { Badge } from '@/components/ui/badge'
import { Role } from '@prisma/client'
import { Shield, User } from 'lucide-react'

interface RoleBadgeProps {
  role: Role
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  if (role === Role.ADMIN) {
    return (
      <Badge variant="default" className="gap-1">
        <Shield className="h-3 w-3" />
        Admin
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <User className="h-3 w-3" />
      User
    </Badge>
  )
}
