import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import paths from "@/paths";
import { Button } from "@/components/ui/button";

interface TopicShowPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TopicShowPage(props: TopicShowPageProps) {
  const { slug } = await props.params;

  const topic = await db.topic.findUnique({
    where: { slug },
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{topic.slug}</h1>
            <p className="text-lg text-muted-foreground">{topic.description}</p>
          </div>
          <Link href={paths.postCreate(topic.slug)}>
            <Button variant="default">Create Post</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No posts yet. Be the first to create one!
          </p>
        </div>
      </div>
    </div>
  );
}
