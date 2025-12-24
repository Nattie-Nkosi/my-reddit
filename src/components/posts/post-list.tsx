import Link from "next/link";
import { db } from "@/db";
import { auth } from "@/auth";
import paths from "@/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format-time";
import VoteButtons from "@/components/vote-buttons";
import PostUserLink from "@/components/posts/post-user-link";
import type { Post, User, Vote } from "@prisma/client";

interface PostListProps {
  topicSlug: string;
}

type PostWithIncludes = Post & {
  user: User;
  votes: Vote[];
  _count: {
    comments: number;
  };
};

export default async function PostList({ topicSlug }: PostListProps) {
  const session = await auth();

  const posts: PostWithIncludes[] = await db.post.findMany({
    where: {
      topic: {
        slug: topicSlug,
      },
    },
    include: {
      user: true,
      votes: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (posts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="text-5xl">✍️</div>
            <h3 className="font-semibold text-lg">No posts yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Be the first to create a post! Click the "Create Post" button
              above to share your thoughts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const score = post.votes.reduce((sum, vote) => sum + vote.value, 0);
        const userVote = session?.user?.id
          ? post.votes.find((v) => v.userId === session.user!.id)?.value || null
          : null;

        return (
          <Card key={post.id} className="hover:bg-accent transition-colors">
            <div className="flex gap-2 sm:gap-4">
              <div className="pl-2 sm:pl-4 pt-4 sm:pt-6">
                <VoteButtons
                  targetId={post.id}
                  targetType="post"
                  initialScore={score}
                  initialUserVote={userVote}
                />
              </div>
              <Link
                href={paths.postShow(topicSlug, post.id)}
                className="flex-1 min-w-0"
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 space-y-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg md:text-xl line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Posted by{" "}
                        <PostUserLink
                          userId={post.user.id}
                          userName={post.user.name}
                        />{" "}
                        •{" "}
                        {formatRelativeTime(post.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {post._count.comments}{" "}
                      <span className="hidden sm:inline">
                        {post._count.comments === 1 ? "comment" : "comments"}
                      </span>
                      <span className="sm:hidden">💬</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
                    {post.content}
                  </p>
                </CardContent>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
