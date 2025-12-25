import Link from "next/link";
import { db } from "@/db";
import paths from "@/paths";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TopicList() {
  const topics = await db.topic.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (topics.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="text-5xl" role="img" aria-label="Books">
              📚
            </div>
            <h3 className="font-semibold text-lg">No topics yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Be the first to create a topic! Topics help organize posts by subject. Click the "Create Topic" button above to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <Link key={topic.id} href={paths.topicShow(topic.slug)}>
          <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{topic.slug}</CardTitle>
              <CardDescription className="line-clamp-2">
                {topic.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="secondary">
                {topic._count.posts} {topic._count.posts === 1 ? "post" : "posts"}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
