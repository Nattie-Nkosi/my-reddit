"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-destructive">Oops!</h1>
            <h2 className="text-3xl font-semibold">Something went wrong</h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-md">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-left max-w-2xl">
              <p className="font-mono text-sm text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center pt-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => reset()}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = "/"}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
