"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format-time";
import paths from "@/paths";
import CommentCreateForm from "./comment-create-form";
import CommentEditForm from "./comment-edit-form";
import CommentDeleteButton from "./comment-delete-button";
import VoteButtons from "@/components/vote-buttons";

interface CommentShowProps {
  commentId: string;
  postId: string;
  content: string;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  updatedAt,
  userId,
  currentUserId,
  initialScore,
  initialUserVote,
  children,
}: CommentShowProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const isOwner = currentUserId === userId;
  const isEdited = updatedAt.getTime() > createdAt.getTime();

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
                <Link
                  href={paths.userProfile(userId)}
                  className="font-semibold hover:underline"
                >
                  {authorName || "Anonymous"}
                </Link>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-xs">
                  {formatRelativeTime(createdAt)}
                </span>
                {isEdited && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-xs">
                      (edited {formatRelativeTime(updatedAt)})
                    </span>
                  </>
                )}
              </div>
              {isEditing && isOwner ? (
                <div className="mt-2">
                  <CommentEditForm
                    postId={postId}
                    commentId={commentId}
                    initialContent={content}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              ) : (
                <p className="text-sm mt-1 whitespace-pre-wrap">{content}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && !isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 text-xs"
                >
                  Edit
                </Button>
                <CommentDeleteButton postId={postId} commentId={commentId} />
              </>
            )}
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-7 text-xs"
              >
                {showReplyForm ? "Cancel" : "Reply"}
              </Button>
            )}
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
