"use client";

import Link from "next/link";
import paths from "@/paths";

interface PostUserLinkProps {
  userId: string;
  userName: string | null;
}

export default function PostUserLink({ userId, userName }: PostUserLinkProps) {
  return (
    <Link
      href={paths.userProfile(userId)}
      className="hover:underline font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      {userName || "Anonymous"}
    </Link>
  );
}
