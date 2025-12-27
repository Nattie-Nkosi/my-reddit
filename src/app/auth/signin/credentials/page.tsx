import Link from "next/link"
import { CredentialsSignInForm } from "@/components/auth/credentials-signin-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CredentialsSignInPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in with Email</CardTitle>
          <CardDescription>
            Enter your email and password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialsSignInForm />
          <div className="mt-4 text-center text-sm">
            <Link href="/auth/signin" className="text-muted-foreground hover:text-primary">
              ← Back to sign in options
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
