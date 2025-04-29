import { Button } from "@/components/ui/button";
import * as actions from "@/actions";
import { auth } from "@/auth";
import Profile from "@/components/profile";

export default async function Home() {
  // In Next.js 15, we need to properly await the auth function
  // which internally uses headers() API
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <form action={actions.signIn}>
        <Button type="submit" variant="default">
          Sign in with GitHub
        </Button>
      </form>

      <form action={actions.signOut}>
        <Button type="submit" variant="destructive">
          Sign out
        </Button>
      </form>

      {session?.user ? (
        <div>{JSON.stringify(session.user)}</div>
      ) : (
        <div>Signed Out</div>
      )}

      <Profile />
    </div>
  );
}
