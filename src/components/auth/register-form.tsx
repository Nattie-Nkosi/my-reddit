"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import * as actions from "@/actions"

const PASSWORD_MIN = 8
const PASSWORD_MAX = 100

export function RegisterForm() {
  const [formState, action, isPending] = useActionState(
    actions.register,
    { errors: {} }
  )
  const [passwordLength, setPasswordLength] = useState(0)

  if (formState.success) {
    return (
      <div className="text-center space-y-4 py-6">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
        <h3 className="text-xl font-semibold">Check your email!</h3>
        <p className="text-muted-foreground">
          We've sent a verification link to your email address.
          Click the link to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          disabled={isPending}
          required
        />
        {formState.errors.name && (
          <p className="text-sm text-destructive">
            {formState.errors.name.join(", ")}
          </p>
        )}
      </div>

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <span className={`text-xs ${
            passwordLength < PASSWORD_MIN
              ? "text-muted-foreground"
              : passwordLength > PASSWORD_MAX
              ? "text-destructive"
              : "text-green-600"
          }`}>
            {passwordLength} / {PASSWORD_MAX}
          </span>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          disabled={isPending}
          maxLength={PASSWORD_MAX}
          onChange={(e) => setPasswordLength(e.target.value.length)}
          required
        />
        {formState.errors.password && (
          <p className="text-sm text-destructive">
            {formState.errors.password.join(", ")}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Min {PASSWORD_MIN} characters, with uppercase, lowercase, and number
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          disabled={isPending}
          required
        />
        {formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {formState.errors.confirmPassword.join(", ")}
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
        {isPending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  )
}
