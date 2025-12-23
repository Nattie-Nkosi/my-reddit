import { notFound } from "next/navigation";
import { db } from "@/db";
import PostCreateForm from "@/components/posts/post-create-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PostCreatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostCreatePage(props: PostCreatePageProps) {
  const { slug } = await props.params;

  const topic = await db.topic.findUnique({
    where: { slug },
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
          <CardDescription>
            Create a new post in <span className="font-semibold">{topic.slug}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostCreateForm topicSlug={slug} />
        </CardContent>
      </Card>
    </div>
  );
}
