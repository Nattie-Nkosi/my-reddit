"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format-time";
import CommentCreateForm from "./comment-create-form";
import VoteButtons from "@/components/vote-buttons";

interface CommentShowProps {
  commentId: string;
  postId: string;
  content: string;
  authorName: string | null;
  createdAt: Date;
  userId: string;
  currentUserId?: string;
  initialScore: number;
  initialUserVote: number | null;
  children?: React.ReactNode;
}

export default function CommentShow({
  commentId,
  postId,
  content,
  authorName,
  createdAt,
  userId,
  currentUserId,
  initialScore,
  initialUserVote,
  children,
}: CommentShowProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  return (
    <div className="border-l-2 border-muted pl-4 py-2">
      <div className="flex gap-3">
        <div className="pt-1">
          <VoteButtons
            targetId={commentId}
            targetType="comment"
            initialScore={initialScore}
            initialUserVote={initialUserVote}
          />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{authorName || "Anonymous"}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-xs">
                  {formatRelativeTime(createdAt)}
                </span>
              </div>
              <p className="text-sm mt-1 whitespace-pre-wrap">{content}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="h-7 text-xs"
            >
              {showReplyForm ? "Cancel" : "Reply"}
            </Button>
          </div>

          {showReplyForm && (
            <div className="mt-2">
              <CommentCreateForm
                postId={postId}
                parentId={commentId}
                onSuccess={handleReplySuccess}
              />
            </div>
          )}

          {children && <div className="mt-4 space-y-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}
