'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import paths from '@/paths'

const createCommentSchema = z.object({
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be at most 1000 characters'),
})

interface CreateCommentFormState {
  errors: {
    content?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function createComment(
  { postId, parentId }: { postId: string; parentId?: string },
  formState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      errors: {
        _form: ['You must be signed in to comment'],
      },
    }
  }

  const result = createCommentSchema.safeParse({
    content: formData.get('content'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await db.comment.create({
      data: {
        content: result.data.content,
        postId,
        userId: session.user.id,
        parentId: parentId || null,
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['Failed to create comment'],
        },
      }
    }
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    include: { topic: true },
  })

  if (!post) {
    return {
      errors: {
        _form: ['Post not found'],
      },
    }
  }

  revalidatePath(paths.postShow(post.topic.slug, postId))
  return { errors: {}, success: true }
}