import Link from "next/link";
import { db } from "@/db";
import { auth } from "@/auth";
import paths from "@/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format-time";
import VoteButtons from "@/components/vote-buttons";
import type { Comment, Vote } from "@prisma/client";

interface UserCommentsListProps {
  userId: string;
}

type UserCommentWithDetails = Comment & {
  post: {
    id: string;
    title: string;
    topic: {
      slug: string;
    };
  };
  votes: Vote[];
};

export default async function UserCommentsList({
  userId,
}: UserCommentsListProps) {
  const session = await auth();

  const comments: UserCommentWithDetails[] = await db.comment.findMany({
    where: { userId },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          topic: {
            select: {
              slug: true,
            },
          },
        },
      },
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (comments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="text-5xl">💬</div>
            <h3 className="font-semibold text-lg">No comments yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              This user hasn't made any comments yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const score = comment.votes.reduce(
          (sum, vote) => sum + vote.value,
          0
        );
        const userVote = session?.user?.id
          ? comment.votes.find((v) => v.userId === session.user!.id)?.value ||
            null
          : null;

        return (
          <Card key={comment.id} className="hover:bg-accent transition-colors">
            <div className="flex gap-4">
              <div className="pl-4 pt-6">
                <VoteButtons
                  targetId={comment.id}
                  targetType="comment"
                  initialScore={score}
                  initialUserVote={userVote}
                />
              </div>
              <div className="flex-1">
                <CardHeader>
                  <CardDescription className="mb-1">
                    Comment on{" "}
                    <Link
                      href={paths.postShow(
                        comment.post.topic.slug,
                        comment.post.id
                      )}
                      className="hover:underline font-medium"
                    >
                      {comment.post.title}
                    </Link>{" "}
                    in{" "}
                    <Link
                      href={paths.topicShow(comment.post.topic.slug)}
                      className="hover:underline font-medium"
                    >
                      {comment.post.topic.slug}
                    </Link>{" "}
                    • {formatRelativeTime(comment.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap line-clamp-4">
                    {comment.content}
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
