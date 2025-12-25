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
  const [contentLength, setContentLength] = useState(initialContent.length);

  useEffect(() => {
    if (formState.success) {
      toast.success("Comment updated successfully!");
      onSuccess();
    }
  }, [formState.success, onSuccess]);

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content" className="sr-only">
            Edit comment
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
          placeholder="What are your thoughts? (min 3 characters)"
          disabled={isPending}
          rows={3}
          defaultValue={initialContent}
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
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} size="sm">
          {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
