import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/db";
import { auth } from "@/auth";
import paths from "@/paths";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format-time";
import PostDeleteButton from "@/components/posts/post-delete-button";
import CommentCreateForm from "@/components/comments/comment-create-form";
import CommentList from "@/components/comments/comment-list";
import CommentListSkeleton from "@/components/comments/comment-list-skeleton";
import VoteButtons from "@/components/vote-buttons";
import type { Vote } from "@prisma/client";

interface PostShowPageProps {
  params: Promise<{
    slug: string;
    postid: string;
  }>;
}

export default async function PostShowPage(props: PostShowPageProps) {
  const { slug, postid } = await props.params;
  const session = await auth();

  const post = await db.post.findUnique({
    where: { id: postid },
    include: {
      user: true,
      topic: true,
      votes: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!post || post.topic.slug !== slug) {
    notFound();
  }

  const isOwner = session?.user?.id === post.userId;
  const score = (post.votes as Vote[]).reduce((sum, vote) => sum + vote.value, 0);
  const userVote = session?.user?.id
    ? (post.votes as Vote[]).find((v) => v.userId === session.user!.id)?.value || null
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <Link href={paths.topicShow(slug)}>
          <Button variant="ghost" size="sm">
            ← Back to {slug}
          </Button>
        </Link>
        {isOwner && <PostDeleteButton postId={post.id} topicSlug={slug} />}
      </div>

      <Card>
        <div className="flex gap-4">
          <div className="pl-6 pt-8">
            <VoteButtons
              targetId={post.id}
              targetType="post"
              initialScore={score}
              initialUserVote={userVote}
            />
          </div>
          <div className="flex-1">
            <CardHeader>
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <CardDescription>
                Posted by{" "}
                <Link
                  href={paths.userProfile(post.user.id)}
                  className="hover:underline font-medium"
                >
                  {post.user.name || "Anonymous"}
                </Link>{" "}
                •{" "}
                {formatRelativeTime(post.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-base leading-relaxed">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

          <div className="pt-6 border-t space-y-6">
            <h2 className="text-2xl font-semibold">
              Comments ({post._count.comments})
            </h2>

            {session?.user ? (
              <div className="bg-muted/50 p-4 rounded-lg">
                <CommentCreateForm postId={post.id} />
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed rounded-lg">
                <p className="text-muted-foreground text-sm">
                  Please sign in to leave a comment
                </p>
              </div>
            )}

            <Suspense fallback={<CommentListSkeleton />}>
              <CommentList postId={post.id} />
            </Suspense>
          </div>
        </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
