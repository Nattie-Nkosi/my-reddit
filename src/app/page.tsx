import { Suspense } from "react";
import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topic-list";

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Topics</h1>
          <p className="text-muted-foreground">
            Browse topics or create your own
          </p>
        </div>
        <TopicCreateForm />
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        }
      >
        <TopicList />
      </Suspense>
    </div>
  );
}
