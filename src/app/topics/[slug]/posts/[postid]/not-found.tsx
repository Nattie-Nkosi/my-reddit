import Link from "next/link";
import { Button } from "@/components/ui/button";
import paths from "@/paths";

export default function PostNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">Post Not Found</h1>
            <h2 className="text-2xl font-semibold">This post doesn't exist</h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-md">
            The post you're looking for doesn't exist or may have been deleted.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href={paths.home()}>
              <Button variant="default" size="lg">
                Browse Topics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
