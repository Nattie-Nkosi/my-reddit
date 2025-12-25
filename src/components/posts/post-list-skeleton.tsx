import PostCardSkeleton from "./post-card-skeleton";

export default function PostListSkeleton() {
  return (
    <div className="space-y-4">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
