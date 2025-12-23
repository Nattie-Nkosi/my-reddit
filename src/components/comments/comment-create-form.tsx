"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as actions from "@/actions";

interface CommentCreateFormProps {
  postId: string;
  parentId?: string;
  startOpen?: boolean;
  onSuccess?: () => void;
}

export default function CommentCreateForm({
  postId,
  parentId,
  startOpen = false,
  onSuccess,
}: CommentCreateFormProps) {
  const [formState, action, isPending] = useActionState(
    actions.createComment.bind(null, { postId, parentId }),
    { errors: {} }
  );

  useEffect(() => {
    if (formState.success && onSuccess) {
      onSuccess();
    }
  }, [formState.success, onSuccess]);

  return (
    <form action={action} className="space-y-3">
      <Textarea
        name="content"
        placeholder={parentId ? "Write a reply..." : "What are your thoughts?"}
        disabled={isPending}
        rows={3}
        defaultValue={formState.success ? "" : undefined}
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
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? "Posting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
