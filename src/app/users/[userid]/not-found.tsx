import Link from "next/link";
import { Button } from "@/components/ui/button";
import paths from "@/paths";

export default function UserNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-4xl font-bold">User Not Found</h1>
        <p className="text-muted-foreground text-lg">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <div className="pt-4">
          <Link href={paths.home()}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
