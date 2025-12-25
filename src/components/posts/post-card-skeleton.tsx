import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <Card>
      <div className="flex gap-2 sm:gap-4">
        <div className="pl-2 sm:pl-4 pt-4 sm:pt-6">
          <Skeleton className="w-12 h-24" />
        </div>
        <div className="flex-1">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
              <div className="flex-1 space-y-2 w-full">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
