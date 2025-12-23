import Link from "next/link";
import { db } from "@/db";
import paths from "@/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format-time";

interface PostListProps {
  topicSlug: string;
}

export default async function PostList({ topicSlug }: PostListProps) {
  const posts = await db.post.findMany({
    where: {
      topic: {
        slug: topicSlug,
      },
    },
    include: {
      user: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (posts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="text-5xl">✍️</div>
            <h3 className="font-semibold text-lg">No posts yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Be the first to create a post! Click the "Create Post" button above to share your thoughts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.id} href={paths.postShow(topicSlug, post.id)}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>
                    Posted by {post.user.name || "Anonymous"} •{" "}
                    {formatRelativeTime(post.createdAt)}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {post.content}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
