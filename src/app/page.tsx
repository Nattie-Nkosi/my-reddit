import { Suspense } from "react";
import Link from "next/link";
import { MessageSquare, TrendingUp, User, Shield, ArrowRight, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topic-list";
import TopicListSkeleton from "@/components/topics/topic-list-skeleton";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-28 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Join the conversation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Share Ideas,
              <br />
              Build Communities
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with people who share your interests. Create topics, spark discussions, and discover amazing content.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {session?.user ? (
                <>
                  <TopicCreateForm />
                  <Link href="#topics">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explore Topics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button size="lg" className="w-full sm:w-auto text-base px-8">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything you need to connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help you build and engage with communities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Rich Discussions</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base">
                  Engage in threaded conversations with nested comments and real-time updates
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Smart Voting</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base">
                  Upvote quality content and help the best discussions rise to the top
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <User className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Personal Profiles</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base">
                  Build your reputation with karma points and showcase your contributions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Secure Access</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base">
                  Multiple authentication options including GitHub OAuth and email/password
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 sm:mb-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Explore Topics</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Join communities that match your interests
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
        <section className="relative py-20 sm:py-24 md:py-28 border-t overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

          <div className="relative container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                Ready to get started?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users sharing ideas, building communities, and making connections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
