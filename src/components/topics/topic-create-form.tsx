"use client";

import { useActionState, useState } from "react";
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
import { Loader2 } from "lucide-react";
import * as actions from "@/actions";

const SLUG_MIN = 3;
const SLUG_MAX = 30;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 500;

export default function TopicCreateForm() {
  const [formState, action, isPending] = useActionState(
    actions.createTopic,
    { errors: {} }
  );
  const [slugLength, setSlugLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

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
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <span
                className={`text-xs ${
                  slugLength < SLUG_MIN
                    ? "text-muted-foreground"
                    : slugLength > SLUG_MAX
                    ? "text-destructive"
                    : "text-green-600"
                }`}
              >
                {slugLength} / {SLUG_MAX}
              </span>
            </div>
            <Input
              id="slug"
              name="slug"
              placeholder="my-awesome-topic"
              disabled={isPending}
              maxLength={SLUG_MAX}
              onChange={(e) => setSlugLength(e.target.value.length)}
            />
            {formState.errors.slug && (
              <p className="text-sm text-destructive">
                {formState.errors.slug.join(", ")}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Use lowercase letters, numbers, and hyphens only (min {SLUG_MIN}{" "}
              characters)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <span
                className={`text-xs ${
                  descriptionLength < DESCRIPTION_MIN
                    ? "text-muted-foreground"
                    : descriptionLength > DESCRIPTION_MAX
                    ? "text-destructive"
                    : "text-green-600"
                }`}
              >
                {descriptionLength} / {DESCRIPTION_MAX}
              </span>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="What is this topic about? (min 10 characters)"
              rows={4}
              disabled={isPending}
              maxLength={DESCRIPTION_MAX}
              onChange={(e) => setDescriptionLength(e.target.value.length)}
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
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
