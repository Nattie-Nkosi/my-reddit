"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import * as actions from "@/actions"

export function CredentialsSignInForm() {
  const [formState, action, isPending] = useActionState(
    actions.signInWithCredentials,
    { errors: {} }
  )

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          disabled={isPending}
          required
        />
        {formState.errors.email && (
          <p className="text-sm text-destructive">
            {formState.errors.email.join(", ")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          disabled={isPending}
          required
        />
        {formState.errors.password && (
          <p className="text-sm text-destructive">
            {formState.errors.password.join(", ")}
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

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
