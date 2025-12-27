import { Suspense } from "react"
import { VerifyEmailContent } from "@/components/auth/verify-email-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="text-center py-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            </div>
          }>
            <VerifyEmailContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
