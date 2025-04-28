"use client";

import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <h2 className="text-xl font-semibold">{session.user.name} Signed In</h2>
        <p className="text-gray-600">{session.user.email}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-600">You are not logged in.</p>
    </div>
  );
}
