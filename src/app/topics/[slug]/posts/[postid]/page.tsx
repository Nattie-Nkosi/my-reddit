import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/db";
import { auth } from "@/auth";
import paths from "@/paths";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={paths.home()}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={paths.topicShow(slug)}>
                {slug}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] sm:max-w-md truncate">
                {post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
        {isOwner && <PostDeleteButton postId={post.id} topicSlug={slug} />}
      </div>

      <Card>
        <div className="flex gap-2 sm:gap-4">
          <div className="pl-2 sm:pl-4 md:pl-6 pt-4 sm:pt-6 md:pt-8">
            <VoteButtons
              targetId={post.id}
              targetType="post"
              initialScore={score}
              initialUserVote={userVote}
              isAuthenticated={!!session?.user}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl break-words">{post.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
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
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="text-sm sm:text-base leading-relaxed">
                <p className="whitespace-pre-wrap break-words">{post.content}</p>
              </div>

          <div className="pt-4 sm:pt-6 border-t space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
              Comments ({post._count.comments})
            </h2>

            {session?.user ? (
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <CommentCreateForm postId={post.id} />
              </div>
            ) : (
              <div className="text-center py-3 sm:py-4 border border-dashed rounded-lg">
                <p className="text-muted-foreground text-xs sm:text-sm">
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
