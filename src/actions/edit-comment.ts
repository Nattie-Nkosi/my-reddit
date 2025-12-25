'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import paths from '@/paths'

const editCommentSchema = z.object({
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be at most 1000 characters'),
})

interface EditCommentFormState {
  errors: {
    content?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function editComment(
  { postId, commentId }: { postId: string; commentId: string },
  formState: EditCommentFormState,
  formData: FormData
): Promise<EditCommentFormState> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      errors: {
        _form: ['You must be signed in to edit a comment'],
      },
    }
  }

  const result = editCommentSchema.safeParse({
    content: formData.get('content'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: { post: { include: { topic: true } } },
    })

    if (!comment) {
      return {
        errors: {
          _form: ['Comment not found'],
        },
      }
    }

    if (comment.userId !== session.user.id) {
      return {
        errors: {
          _form: ['You can only edit your own comments'],
        },
      }
    }

    await db.comment.update({
      where: { id: commentId },
      data: { content: result.data.content },
    })

    revalidatePath(paths.postShow(comment.post.topic.slug, postId))
    return { errors: {}, success: true }
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
          _form: ['Failed to edit comment'],
        },
      }
    }
  }
}
