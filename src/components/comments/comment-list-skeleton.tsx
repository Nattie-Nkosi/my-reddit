import CommentSkeleton from "./comment-skeleton";

export default function CommentListSkeleton() {
  return (
    <div className="space-y-4">
      <CommentSkeleton nested={true} />
      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  );
}
