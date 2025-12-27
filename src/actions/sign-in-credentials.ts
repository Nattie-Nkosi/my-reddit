'use server'

import { z } from 'zod'
import * as auth from '@/auth'
import { redirect } from 'next/navigation'
import paths from '@/paths'
import { AuthError } from 'next-auth'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

interface SignInFormState {
  errors: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
}

export async function signInWithCredentials(
  formState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const result = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  try {
    await auth.signIn('credentials', {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: {
          _form: ['Invalid email or password. Please verify your email before signing in.'],
        },
      }
    }
    return {
      errors: {
        _form: ['An error occurred. Please try again.'],
      },
    }
  }

  redirect(paths.home())
}
