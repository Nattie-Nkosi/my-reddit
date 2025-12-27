'use server'

import { db } from '@/db'

export async function verifyEmail(token: string): Promise<{
  errors?: { _form?: string[] }
  success?: boolean
}> {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return { errors: { _form: ['Invalid or expired verification token'] } }
    }

    if (verificationToken.expires < new Date()) {
      await db.verificationToken.delete({ where: { token } })
      return { errors: { _form: ['Verification token has expired'] } }
    }

    await db.$transaction([
      db.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      }),
      db.verificationToken.delete({ where: { token } }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Email verification error:', error)
    return { errors: { _form: ['Verification failed. Please try again.'] } }
  }
}
