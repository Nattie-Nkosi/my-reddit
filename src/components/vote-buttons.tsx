"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import * as actions from "@/actions";

interface VoteButtonsProps {
  targetId: string;
  targetType: "post" | "comment";
  initialScore: number;
  initialUserVote: number | null;
}

export default function VoteButtons({
  targetId,
  targetType,
  initialScore,
  initialUserVote,
}: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticScore, setOptimisticScore] = useState(initialScore);
  const [optimisticUserVote, setOptimisticUserVote] = useState(initialUserVote);

  const handleVote = (value: 1 | -1) => {
    const currentVote = optimisticUserVote;
    let newScore = optimisticScore;
    let newVote: number | null = value;

    if (currentVote === value) {
      newScore -= value;
      newVote = null;
    } else if (currentVote === null) {
      newScore += value;
    } else {
      newScore += value * 2;
    }

    setOptimisticScore(newScore);
    setOptimisticUserVote(newVote);

    startTransition(async () => {
      try {
        if (targetType === "post") {
          await actions.votePost(targetId, value);
        } else {
          await actions.voteComment(targetId, value);
        }
      } catch (error) {
        setOptimisticScore(optimisticScore);
        setOptimisticUserVote(currentVote);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${
          optimisticUserVote === 1 ? "text-orange-500" : "text-muted-foreground"
        }`}
        onClick={() => handleVote(1)}
        disabled={isPending}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
      <span className={`text-sm font-semibold ${
        optimisticScore > 0
          ? "text-orange-500"
          : optimisticScore < 0
          ? "text-blue-500"
          : "text-muted-foreground"
      }`}>
        {optimisticScore}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${
          optimisticUserVote === -1 ? "text-blue-500" : "text-muted-foreground"
        }`}
        onClick={() => handleVote(-1)}
        disabled={isPending}
      >
        <ArrowDown className="h-5 w-5" />
      </Button>
    </div>
  );
}
