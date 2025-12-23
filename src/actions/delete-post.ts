'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import paths from '@/paths'

export async function deletePost(topicSlug: string, postId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('You must be signed in to delete a post')
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    include: { topic: true },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  if (post.userId !== session.user.id) {
    throw new Error('You can only delete your own posts')
  }

  await db.post.delete({
    where: { id: postId },
  })

  revalidatePath(paths.topicShow(topicSlug))
  redirect(paths.topicShow(topicSlug))
}
