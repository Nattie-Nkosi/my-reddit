import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/db";
import paths from "@/paths";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PostList from "@/components/posts/post-list";
import PostListSkeleton from "@/components/posts/post-list-skeleton";

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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={paths.home()}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{topic.slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 break-words">{topic.slug}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{topic.description}</p>
          </div>
          <Link href={paths.postCreate(topic.slug)} className="w-full sm:w-auto">
            <Button variant="default" className="w-full sm:w-auto">Create Post</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Posts</h2>
        <Suspense fallback={<PostListSkeleton />}>
          <PostList topicSlug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
