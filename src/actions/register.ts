'use server'

import { z } from 'zod'
import { hashSync, genSaltSync } from 'bcryptjs'
import { db } from '@/db'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be at most 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

interface RegisterFormState {
  errors: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function register(formState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  if (!rateLimit(`register:${ip}`, 3, 60 * 60 * 1000)) {
    return {
      errors: { _form: ['Too many registration attempts. Please try again later.'] },
    }
  }

  const result = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    const existing = await db.user.findUnique({
      where: { email: result.data.email },
    })

    if (existing) {
      return {
        errors: { _form: ['An account with this email already exists'] },
      }
    }

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(result.data.password, salt)

    const verificationToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await db.$transaction([
      db.user.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          password: hashedPassword,
        },
      }),
      db.verificationToken.create({
        data: {
          identifier: result.data.email,
          token: verificationToken,
          expires,
        },
      }),
    ])

    await sendVerificationEmail(result.data.email, verificationToken)

    return {
      errors: {},
      success: true,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } }
    }
    return { errors: { _form: ['Failed to create account. Please try again.'] } }
  }
}
