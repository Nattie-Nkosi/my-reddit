"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestErrors() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error triggered by the user");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Error Pages Testing</h1>
          <p className="text-muted-foreground">
            Use the buttons below to test different error scenarios
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg space-y-3">
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p className="text-sm text-muted-foreground">
              Test the custom 404 page by navigating to a non-existent route
            </p>
            <Link href="/this-page-does-not-exist">
              <Button variant="outline">
                Go to Non-Existent Page
              </Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg space-y-3">
            <h2 className="text-xl font-semibold">Runtime Error</h2>
            <p className="text-sm text-muted-foreground">
              Test the error boundary by throwing a runtime error
            </p>
            <Button
              variant="destructive"
              onClick={() => setShouldError(true)}
            >
              Trigger Error
            </Button>
          </div>

          <div className="p-6 border rounded-lg space-y-3">
            <h2 className="text-xl font-semibold">Back to Home</h2>
            <p className="text-sm text-muted-foreground">
              Return to the home page
            </p>
            <Link href="/">
              <Button variant="default">
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This page is for testing purposes only. Remove it before deploying to production.
          </p>
        </div>
      </div>
    </div>
  );
}
