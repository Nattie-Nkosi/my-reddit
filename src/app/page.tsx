import { Suspense } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topic-list";
import TopicListSkeleton from "@/components/topics/topic-list-skeleton";
import * as actions from "@/actions";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Welcome to MyReddit
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              A community-driven platform where you can create topics, share posts,
              engage in discussions, and connect with others.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
              {session?.user ? (
                <TopicCreateForm />
              ) : (
                <form action={actions.signIn}>
                  <Button size="lg" type="submit" className="text-sm sm:text-base gap-2">
                    <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                    Get Started with GitHub
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">💬</div>
                <CardTitle>Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create topics and engage in meaningful conversations with nested comments
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">⬆️</div>
                <CardTitle>Voting System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upvote or downvote posts and comments to surface the best content
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">👤</div>
                <CardTitle>User Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your karma, view post history, and build your reputation
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-4xl mb-2">🔒</div>
                <CardTitle>Secure Auth</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sign in securely with GitHub OAuth for a seamless experience
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Explore Topics</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Browse communities or create your own
              </p>
            </div>
            {session?.user && (
              <div className="w-full sm:w-auto">
                <TopicCreateForm />
              </div>
            )}
          </div>

          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<TopicListSkeleton />}>
              <TopicList />
            </Suspense>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session?.user && (
        <section className="py-12 sm:py-16 border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Ready to Join?</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Sign in with GitHub to start creating topics, posting content, and
                participating in discussions.
              </p>
              <form action={actions.signIn}>
                <Button size="lg" type="submit" className="text-sm sm:text-base gap-2">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  Sign In with GitHub
                </Button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
