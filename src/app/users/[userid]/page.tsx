import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatRelativeTime } from "@/lib/format-time";
import UserPostsList from "@/components/users/user-posts-list";
import UserCommentsList from "@/components/users/user-comments-list";
import PostListSkeleton from "@/components/posts/post-list-skeleton";
import CommentListSkeleton from "@/components/comments/comment-list-skeleton";

interface UserProfilePageProps {
  params: Promise<{
    userid: string;
  }>;
}

export default async function UserProfilePage(props: UserProfilePageProps) {
  const { userid } = await props.params;

  const user = await db.user.findUnique({
    where: { id: userid },
    include: {
      _count: {
        select: {
          Post: true,
          Comment: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const postVotes = await db.vote.findMany({
    where: {
      post: {
        userId: userid,
      },
    },
    select: {
      value: true,
    },
  });

  const commentVotes = await db.vote.findMany({
    where: {
      comment: {
        userId: userid,
      },
    },
    select: {
      value: true,
    },
  });

  const karma =
    postVotes.reduce((sum, vote) => sum + vote.value, 0) +
    commentVotes.reduce((sum, vote) => sum + vote.value, 0);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="text-2xl sm:text-3xl">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 min-w-0">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl break-words">
                {user.name || "Anonymous User"}
              </CardTitle>
              {user.email && (
                <CardDescription className="text-sm sm:text-base break-words">
                  {user.email}
                </CardDescription>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 pt-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {karma} karma
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {user._count.Post}{" "}
                  {user._count.Post === 1 ? "post" : "posts"}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {user._count.Comment}{" "}
                  {user._count.Comment === 1 ? "comment" : "comments"}
                </Badge>
              </div>

              {user.emailVerified && (
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Joined {formatRelativeTime(user.emailVerified)}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts" className="text-sm">Posts</TabsTrigger>
          <TabsTrigger value="comments" className="text-sm">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Suspense fallback={<PostListSkeleton />}>
            <UserPostsList userId={userid} />
          </Suspense>
        </TabsContent>

        <TabsContent value="comments">
          <Suspense fallback={<CommentListSkeleton />}>
            <UserCommentsList userId={userid} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
