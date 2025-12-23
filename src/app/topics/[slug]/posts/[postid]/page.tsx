import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { auth } from "@/auth";
import paths from "@/paths";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format-time";
import PostDeleteButton from "@/components/posts/post-delete-button";

interface PostShowPageProps {
  params: Promise<{
    slug: string;
    postid: string;
  }>;
}

export default async function PostShowPage(props: PostShowPageProps) {
  const { slug, postid } = await props.params;
  const session = await auth();

  const post = await db.post.findUnique({
    where: { id: postid },
    include: {
      user: true,
      topic: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!post || post.topic.slug !== slug) {
    notFound();
  }

  const isOwner = session?.user?.id === post.userId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <Link href={paths.topicShow(slug)}>
          <Button variant="ghost" size="sm">
            ← Back to {slug}
          </Button>
        </Link>
        {isOwner && <PostDeleteButton postId={post.id} topicSlug={slug} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <CardDescription>
            Posted by {post.user.name || "Anonymous"} •{" "}
            {formatRelativeTime(post.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-base leading-relaxed">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-2xl font-semibold mb-4">
              Comments ({post._count.comments})
            </h2>
            <div className="text-center py-12 border border-dashed rounded-lg">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
