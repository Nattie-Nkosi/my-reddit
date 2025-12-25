"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as actions from "@/actions";

export default function TopicCreateForm() {
  const [formState, action, isPending] = useActionState(
    actions.createTopic,
    { errors: {} }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Topic</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create a Topic</DialogTitle>
          <DialogDescription className="text-sm">
            Topics are used to organize posts. Choose a unique name!
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="my-awesome-topic"
              disabled={isPending}
            />
            {formState.errors.slug && (
              <p className="text-sm text-destructive">
                {formState.errors.slug.join(", ")}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Use lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What is this topic about?"
              rows={4}
              disabled={isPending}
            />
            {formState.errors.description && (
              <p className="text-sm text-destructive">
                {formState.errors.description.join(", ")}
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
              {isPending ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
