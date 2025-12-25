'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import paths from '@/paths'

export async function votePost(
  postId: string,
  value: 1 | -1
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in to vote' }
  }

  const post = await db.post.findUnique({
    where: { id: postId },
    include: { topic: true },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  try {
    const existingVote = await db.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.value === value) {
        await db.vote.delete({
          where: { id: existingVote.id },
        })
      } else {
        await db.vote.update({
          where: { id: existingVote.id },
          data: { value },
        })
      }
    } else {
      await db.vote.create({
        data: {
          userId: session.user.id,
          postId,
          value,
        },
      })
    }

    revalidatePath(paths.postShow(post.topic.slug, postId))
    revalidatePath(paths.topicShow(post.topic.slug))

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to vote',
    }
  }
}

export async function voteComment(
  commentId: string,
  value: 1 | -1
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in to vote' }
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        include: { topic: true },
      },
    },
  })

  if (!comment) {
    return { success: false, error: 'Comment not found' }
  }

  try {
    const existingVote = await db.vote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.value === value) {
        await db.vote.delete({
          where: { id: existingVote.id },
        })
      } else {
        await db.vote.update({
          where: { id: existingVote.id },
          data: { value },
        })
      }
    } else {
      await db.vote.create({
        data: {
          userId: session.user.id,
          commentId,
          value,
        },
      })
    }

    revalidatePath(paths.postShow(comment.post.topic.slug, comment.postId))

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to vote',
    }
  }
}
