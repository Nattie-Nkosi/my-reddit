'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-utils'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import paths from '@/paths'

const toggleSuspensionSchema = z.object({
  userId: z.string().min(1),
})

interface ToggleSuspensionFormState {
  errors: {
    userId?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function toggleUserSuspension(
  formState: ToggleSuspensionFormState,
  formData: FormData
): Promise<ToggleSuspensionFormState> {
  try {
    const session = await requireAdmin()

    const result = toggleSuspensionSchema.safeParse({
      userId: formData.get('userId'),
    })

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      }
    }

    const { userId } = result.data

    if (userId === session.user.id) {
      return {
        errors: {
          _form: ['You cannot suspend your own account'],
        },
      }
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { suspended: true },
    })

    if (!user) {
      return {
        errors: {
          _form: ['User not found'],
        },
      }
    }

    await db.user.update({
      where: { id: userId },
      data: { suspended: !user.suspended },
    })

    revalidatePath(paths.adminUsers())
    return { errors: {}, success: true }

  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      }
    }
    return {
      errors: {
        _form: ['Failed to toggle user suspension'],
      },
    }
  }
}
