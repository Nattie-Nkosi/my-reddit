"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import * as actions from "@/actions";

const TITLE_MIN = 3;
const TITLE_MAX = 100;
const CONTENT_MIN = 10;
const CONTENT_MAX = 5000;

interface PostCreateFormProps {
  topicSlug: string;
}

export default function PostCreateForm({ topicSlug }: PostCreateFormProps) {
  const [formState, action, isPending] = useActionState(
    actions.createPost.bind(null, topicSlug),
    { errors: {} }
  );
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Title</Label>
          <span
            className={`text-xs ${
              titleLength < TITLE_MIN
                ? "text-muted-foreground"
                : titleLength > TITLE_MAX
                ? "text-destructive"
                : "text-green-600"
            }`}
          >
            {titleLength} / {TITLE_MAX}
          </span>
        </div>
        <Input
          id="title"
          name="title"
          placeholder="Enter your post title (min 3 characters)"
          disabled={isPending}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitleLength(e.target.value.length)}
        />
        {formState.errors.title && (
          <p className="text-sm text-destructive">
            {formState.errors.title.join(", ")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content</Label>
          <span
            className={`text-xs ${
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
          placeholder="What's on your mind? (min 10 characters)"
          rows={10}
          disabled={isPending}
          maxLength={CONTENT_MAX}
          onChange={(e) => setContentLength(e.target.value.length)}
        />
        {formState.errors.content && (
          <p className="text-sm text-destructive">
            {formState.errors.content.join(", ")}
          </p>
        )}
      </div>

      {formState.errors._form && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive">
            {formState.errors._form.join(", ")}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
