import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@prisma/client'

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', request.url))
    }

    if (session.user.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }

    if (session.user.suspended) {
      return NextResponse.redirect(new URL('/?error=suspended', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
