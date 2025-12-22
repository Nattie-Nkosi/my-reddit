import Link from "next/link";
import { Button } from "@/components/ui/button";
import paths from "@/paths";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-md">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href={paths.home()}>
              <Button variant="default" size="lg">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
