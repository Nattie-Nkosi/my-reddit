'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import paths from '@/paths'

const createTopicSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be at most 30 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
})

interface CreateTopicFormState {
  errors: {
    slug?: string[]
    description?: string[]
    _form?: string[]
  }
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const session = await auth()

  if (!session?.user) {
    return {
      errors: {
        _form: ['You must be signed in to create a topic'],
      },
    }
  }

  const result = createTopicSchema.safeParse({
    slug: formData.get('slug'),
    description: formData.get('description'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  let topic
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.slug,
        description: result.data.description,
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
          _form: ['Failed to create topic'],
        },
      }
    }
  }

  revalidatePath('/')
  redirect(paths.topicShow(topic.slug))
}