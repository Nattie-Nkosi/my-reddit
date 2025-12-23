'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import paths from '@/paths'

export async function deleteTopic(topicSlug: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('You must be signed in to delete a topic')
  }

  const topic = await db.topic.findUnique({
    where: { slug: topicSlug },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  if (!topic) {
    throw new Error('Topic not found')
  }

  if (topic._count.posts > 0) {
    throw new Error('Cannot delete topic with existing posts')
  }

  await db.topic.delete({
    where: { slug: topicSlug },
  })

  revalidatePath(paths.home())
  redirect(paths.home())
}
