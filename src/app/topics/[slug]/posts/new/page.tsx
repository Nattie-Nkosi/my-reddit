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
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Create a Post</CardTitle>
          <CardDescription className="text-sm">
            Create a new post in <span className="font-semibold break-words">{topic.slug}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <PostCreateForm topicSlug={slug} />
        </CardContent>
      </Card>
    </div>
  );
}
