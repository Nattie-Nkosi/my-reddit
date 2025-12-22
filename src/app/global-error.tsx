"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
          <div className="space-y-6 text-center max-w-md">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-red-500">Error</h1>
              <h2 className="text-3xl font-semibold">Critical Error</h2>
            </div>

            <p className="text-lg text-gray-600">
              A critical error occurred. Please refresh the page or contact support.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <p className="font-mono text-sm text-red-600 break-all">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => reset()}
              >
                Try Again
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => window.location.href = "/"}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
