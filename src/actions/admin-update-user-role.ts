'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth-utils'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import paths from '@/paths'
import { Role } from '@prisma/client'

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(Role),
})

interface UpdateUserRoleFormState {
  errors: {
    userId?: string[]
    role?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function updateUserRole(
  formState: UpdateUserRoleFormState,
  formData: FormData
): Promise<UpdateUserRoleFormState> {
  try {
    const session = await requireAdmin()

    const result = updateRoleSchema.safeParse({
      userId: formData.get('userId'),
      role: formData.get('role'),
    })

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      }
    }

    const { userId, role } = result.data

    if (userId === session.user.id) {
      return {
        errors: {
          _form: ['You cannot change your own role'],
        },
      }
    }

    await db.user.update({
      where: { id: userId },
      data: { role },
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
        _form: ['Failed to update user role'],
      },
    }
  }
}
