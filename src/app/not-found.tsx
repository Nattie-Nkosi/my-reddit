import Link from "next/link";
import { Button } from "@/components/ui/button";
import paths from "@/paths";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-primary">404</h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Page Not Found</h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md px-4">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <div className="flex gap-4 justify-center pt-2 sm:pt-4">
            <Link href={paths.home()}>
              <Button variant="default" size="lg" className="text-sm sm:text-base">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
