'use server'

import { z } from 'zod'
import { requireAuth } from '@/lib/auth-utils'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import paths from '@/paths'

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be at most 5000 characters'),
})

interface CreatePostFormState {
  errors: {
    title?: string[]
    content?: string[]
    _form?: string[]
  }
}

export async function createPost(
  topicSlug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  let session
  try {
    session = await requireAuth()
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Authentication required'],
      },
    }
  }

  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const topic = await db.topic.findUnique({
    where: { slug: topicSlug },
  })

  if (!topic) {
    return {
      errors: {
        _form: ['Topic not found'],
      },
    }
  }

  let post
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
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
          _form: ['Failed to create post'],
        },
      }
    }
  }

  revalidatePath(paths.topicShow(topicSlug))
  redirect(paths.postShow(topicSlug, post.id))
}