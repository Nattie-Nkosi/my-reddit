"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import * as actions from "@/actions"
import paths from "@/paths"

export function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error')
        setErrorMessage('No verification token provided')
        return
      }

      const result = await actions.verifyEmail(token)

      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(result.errors?._form?.[0] || 'Verification failed')
      }
    }

    verify()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="text-center py-6 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-4 py-6">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
        <h3 className="text-xl font-semibold">Email verified!</h3>
        <p className="text-muted-foreground">
          Your account is now active. You can sign in.
        </p>
        <Button onClick={() => router.push('/auth/signin')} className="w-full">
          Go to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4 py-6">
      <XCircle className="h-16 w-16 text-destructive mx-auto" />
      <h3 className="text-xl font-semibold">Verification failed</h3>
      <p className="text-muted-foreground">{errorMessage}</p>
      <Button onClick={() => router.push(paths.home())} variant="outline" className="w-full">
        Back to Home
      </Button>
    </div>
  )
}
