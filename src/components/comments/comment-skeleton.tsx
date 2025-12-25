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
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-4 w-24" />
          {nested && (
            <div className="mt-4">
              <div className="border-l-2 border-muted pl-4 py-2">
                <div className="flex gap-3">
                  <div className="pt-1">
                    <Skeleton className="w-8 h-20" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-20" />
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
