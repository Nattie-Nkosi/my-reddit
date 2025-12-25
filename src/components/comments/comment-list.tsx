import { db } from "@/db";
import { auth } from "@/auth";
import CommentShow from "./comment-show";
import type { Comment, User, Vote } from "@prisma/client";

interface CommentListProps {
  postId: string;
}

type CommentWithIncludes = Comment & {
  user: {
    name: string | null;
  };
  votes: Vote[];
};

export default async function CommentList({ postId }: CommentListProps) {
  const session = await auth();

  const comments: CommentWithIncludes[] = await db.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: { name: true },
      },
      votes: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const topLevelComments = comments.filter((comment) => !comment.parentId);

  const renderComments = (
    parentId: string | null,
    depth: number = 0
  ): React.ReactNode => {
    const commentsToRender = comments.filter(
      (comment) => comment.parentId === parentId
    );

    if (commentsToRender.length === 0) return null;

    return commentsToRender.map((comment) => {
      const score = comment.votes.reduce((sum, vote) => sum + vote.value, 0);
      const userVote = session?.user?.id
        ? comment.votes.find((v) => v.userId === session.user!.id)?.value || null
        : null;

      return (
        <CommentShow
          key={comment.id}
          commentId={comment.id}
          postId={postId}
          content={comment.content}
          authorName={comment.user.name}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt}
          userId={comment.userId}
          currentUserId={session?.user?.id}
          initialScore={score}
          initialUserVote={userVote}
          isAuthenticated={!!session?.user}
        >
          {renderComments(comment.id, depth + 1)}
        </CommentShow>
      );
    });
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return <div className="space-y-4">{renderComments(null)}</div>;
}
