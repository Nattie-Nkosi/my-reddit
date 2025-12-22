import Link from "next/link";
import { db } from "@/db";
import paths from "@/paths";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TopicList() {
  const topics = await db.topic.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No topics yet. Be the first to create one!
        </p>
      </div>
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
          </Card>
        </Link>
      ))}
    </div>
  );
}
