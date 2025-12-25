import { Skeleton } from "@/components/ui/skeleton";

interface CommentSkeletonProps {
  nested?: boolean;
}

export default function CommentSkeleton({ nested = false }: CommentSkeletonProps) {
  return (
    <div className="border-l-2 border-muted pl-4 py-2">
      <div className="flex gap-3">
        <div className="pt-1">
          <Skeleton className="w-8 h-20" />
        </div>
        <div className="flex-1 space-y-3 min-w-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-7 w-12" />
          </div>
          {nested && (
            <div className="mt-4 space-y-4">
              <div className="border-l-2 border-muted pl-4 py-2">
                <div className="flex gap-3">
                  <div className="pt-1">
                    <Skeleton className="w-8 h-20" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-2/3" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
