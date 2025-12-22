export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyReddit</h1>
        <p className="text-lg text-muted-foreground">
          A Reddit-like community application built with Next.js
        </p>
      </div>
    </div>
  );
}
