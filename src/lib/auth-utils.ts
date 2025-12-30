import { auth } from '@/auth'
import { Role } from '@prisma/client'

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in')
  }

  if (session.user.role !== Role.ADMIN) {
    throw new Error('Admin access required')
  }

  if (session.user.suspended) {
    throw new Error('Your account has been suspended')
  }

  return session
}

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in')
  }

  if (session.user.suspended) {
    throw new Error('Your account has been suspended')
  }

  return session
}

export async function checkAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === Role.ADMIN
}
