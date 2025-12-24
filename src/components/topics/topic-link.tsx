"use client";

import Link from "next/link";
import paths from "@/paths";

interface TopicLinkProps {
  topicSlug: string;
}

export default function TopicLink({ topicSlug }: TopicLinkProps) {
  return (
    <Link
      href={paths.topicShow(topicSlug)}
      className="hover:underline font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      {topicSlug}
    </Link>
  );
}
