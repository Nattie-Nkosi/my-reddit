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
import TopicLink from "@/components/topics/topic-link";
import type { Post, Vote } from "@prisma/client";

interface UserPostsListProps {
  userId: string;
}

type UserPostWithDetails = Post & {
  topic: {
    slug: string;
  };
  votes: Vote[];
  _count: {
    comments: number;
  };
};

export default async function UserPostsList({ userId }: UserPostsListProps) {
  const session = await auth();

  const posts: UserPostWithDetails[] = await db.post.findMany({
    where: { userId },
    include: {
      topic: {
        select: {
          slug: true,
        },
      },
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
            <div className="text-5xl">📝</div>
            <h3 className="font-semibold text-lg">No posts yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              This user hasn't created any posts yet.
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
          ? post.votes.find((v) => v.userId === session.user!.id)?.value ||
            null
          : null;

        return (
          <Card
            key={post.id}
            className="hover:bg-accent transition-colors"
          >
            <div className="flex gap-4">
              <div className="pl-4 pt-6">
                <VoteButtons
                  targetId={post.id}
                  targetType="post"
                  initialScore={score}
                  initialUserVote={userVote}
                />
              </div>
              <Link
                href={paths.postShow(post.topic.slug, post.id)}
                className="flex-1"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription>
                        in <TopicLink topicSlug={post.topic.slug} /> •{" "}
                        {formatRelativeTime(post.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {post._count.comments}{" "}
                      {post._count.comments === 1 ? "comment" : "comments"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
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
