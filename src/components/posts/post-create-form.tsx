"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as actions from "@/actions";

interface PostCreateFormProps {
  topicSlug: string;
}

export default function PostCreateForm({ topicSlug }: PostCreateFormProps) {
  const [formState, action, isPending] = useActionState(
    actions.createPost.bind(null, topicSlug),
    { errors: {} }
  );

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter your post title"
          disabled={isPending}
        />
        {formState.errors.title && (
          <p className="text-sm text-destructive">
            {formState.errors.title.join(", ")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="What's on your mind?"
          rows={10}
          disabled={isPending}
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
          {isPending ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
