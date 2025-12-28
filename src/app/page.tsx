import { Suspense } from "react";
import Link from "next/link";
import { TrendingUp, Users, Plus, Home as HomeIcon } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topic-list";
import TopicListSkeleton from "@/components/topics/topic-list-skeleton";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold">
              Dive into anything
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join communities, share posts, and connect with people who share your interests
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/auth/signin">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Communities
              </CardTitle>
              <CardDescription>
                Explore trending topics and discussions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TopicListSkeleton />}>
                <TopicList />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-4">
            {/* Create Post Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <HomeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <TopicCreateForm />
                </div>
              </CardContent>
            </Card>

            {/* Topics Feed */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Popular Communities</h2>
              </div>
              <Suspense fallback={<TopicListSkeleton />}>
                <TopicList />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            {/* User Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <CardTitle className="text-base">{session.user.name}</CardTitle>
                    <CardDescription className="text-sm">{session.user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Home Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  Home
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your personal MyReddit frontpage. Come here to check in with your favorite communities.
                </p>
                <Link href="#create" className="block">
                  <Button className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
                <TopicCreateForm />
              </CardContent>
            </Card>

            {/* About Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  About MyReddit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  A community-driven platform where you can create topics, share posts, and engage in discussions.
                </p>
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Communities</span>
                    <span className="font-semibold text-foreground">Growing</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posts</span>
                    <span className="font-semibold text-foreground">Daily</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                  <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Help
                  </Link>
                  <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                  </Link>
                  <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  MyReddit © 2024
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
