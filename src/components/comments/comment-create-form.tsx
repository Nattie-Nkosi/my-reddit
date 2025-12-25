"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as actions from "@/actions";

const CONTENT_MIN = 3;
const CONTENT_MAX = 1000;

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
  const [contentLength, setContentLength] = useState(0);

  useEffect(() => {
    if (formState.success) {
      setContentLength(0);
      toast.success(parentId ? "Reply posted successfully!" : "Comment posted successfully!");
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [formState.success, onSuccess, parentId]);

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content" className="sr-only">
            {parentId ? "Reply" : "Comment"}
          </Label>
          <span
            className={`text-xs ml-auto ${
              contentLength < CONTENT_MIN
                ? "text-muted-foreground"
                : contentLength > CONTENT_MAX
                ? "text-destructive"
                : "text-green-600"
            }`}
          >
            {contentLength} / {CONTENT_MAX}
          </span>
        </div>
        <Textarea
          id="content"
          name="content"
          placeholder={
            parentId
              ? "Write a reply... (min 3 characters)"
              : "What are your thoughts? (min 3 characters)"
          }
          disabled={isPending}
          rows={3}
          defaultValue={formState.success ? "" : undefined}
          maxLength={CONTENT_MAX}
          onChange={(e) => setContentLength(e.target.value.length)}
        />
      </div>
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
          {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          {isPending ? "Posting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
