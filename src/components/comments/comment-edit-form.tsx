"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as actions from "@/actions";

interface CommentEditFormProps {
  postId: string;
  commentId: string;
  initialContent: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CommentEditForm({
  postId,
  commentId,
  initialContent,
  onSuccess,
  onCancel,
}: CommentEditFormProps) {
  const [formState, action, isPending] = useActionState(
    actions.editComment.bind(null, { postId, commentId }),
    { errors: {} }
  );

  useEffect(() => {
    if (formState.success) {
      onSuccess();
    }
  }, [formState.success, onSuccess]);

  return (
    <form action={action} className="space-y-3">
      <Textarea
        name="content"
        placeholder="What are your thoughts?"
        disabled={isPending}
        rows={3}
        defaultValue={initialContent}
      />
      {formState.errors.content && (
        <p className="text-sm text-destructive">
          {formState.errors.content.join(", ")}
        </p>
      )}
      {formState.errors._form && (
        <p className="text-sm text-destructive">
          {formState.errors._form.join(", ")}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
