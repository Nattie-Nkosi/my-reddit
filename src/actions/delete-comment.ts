'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import paths from '@/paths'

export async function deleteComment(postId: string, commentId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('You must be signed in to delete a comment')
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: { post: { include: { topic: true } } },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  if (comment.userId !== session.user.id) {
    throw new Error('You can only delete your own comments')
  }

  await db.comment.delete({
    where: { id: commentId },
  })

  revalidatePath(paths.postShow(comment.post.topic.slug, postId))
}
