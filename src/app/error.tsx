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
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-destructive">Oops!</h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Something went wrong</h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md px-4">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 sm:p-4 bg-muted rounded-lg text-left max-w-2xl mx-4">
              <p className="font-mono text-xs sm:text-sm text-destructive break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => reset()}
              className="text-sm sm:text-base w-full sm:w-auto"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = "/"}
              className="text-sm sm:text-base w-full sm:w-auto"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
