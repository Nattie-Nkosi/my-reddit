import { Role } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
      suspended?: boolean
    } & DefaultSession['user']
  }

  interface User {
    role: Role
    suspended?: boolean
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: Role
    suspended?: boolean
  }
}
