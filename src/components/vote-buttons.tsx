"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUp, ArrowDown } from "lucide-react";
import * as actions from "@/actions";

interface VoteButtonsProps {
  targetId: string;
  targetType: "post" | "comment";
  initialScore: number;
  initialUserVote: number | null;
  isAuthenticated?: boolean;
}

export default function VoteButtons({
  targetId,
  targetType,
  initialScore,
  initialUserVote,
  isAuthenticated = true,
}: VoteButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticScore, setOptimisticScore] = useState(initialScore);
  const [optimisticUserVote, setOptimisticUserVote] = useState(initialUserVote);
  const [error, setError] = useState<string | null>(null);

  const handleVote = (value: 1 | -1) => {
    if (!isAuthenticated) {
      setError("Sign in to vote");
      setTimeout(() => setError(null), 3000);
      return;
    }
    const currentVote = optimisticUserVote;
    const currentScore = optimisticScore;
    let newScore = currentScore;
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
    setError(null);

    startTransition(async () => {
      const result =
        targetType === "post"
          ? await actions.votePost(targetId, value)
          : await actions.voteComment(targetId, value);

      if (!result.success) {
        setOptimisticScore(currentScore);
        setOptimisticUserVote(currentVote);
        setError(result.error || "Failed to vote");
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  const buttonContent = (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 sm:h-10 sm:w-10 p-0 transition-colors ${
          optimisticUserVote === 1
            ? "text-orange-500 hover:text-orange-600"
            : "text-muted-foreground hover:text-foreground"
        } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={() => handleVote(1)}
        disabled={isPending || !isAuthenticated}
        aria-label="Upvote"
      >
        <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
      <span
        className={`text-sm font-semibold ${
          optimisticScore > 0
            ? "text-orange-500"
            : optimisticScore < 0
            ? "text-blue-500"
            : "text-muted-foreground"
        }`}
      >
        {optimisticScore}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 sm:h-10 sm:w-10 p-0 transition-colors ${
          optimisticUserVote === -1
            ? "text-blue-500 hover:text-blue-600"
            : "text-muted-foreground hover:text-foreground"
        } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={() => handleVote(-1)}
        disabled={isPending || !isAuthenticated}
        aria-label="Downvote"
      >
        <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-1 relative">
      {!isAuthenticated ? (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                {buttonContent}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign in to vote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonContent
      )}
      {error && (
        <div className="absolute top-full mt-2 bg-destructive text-destructive-foreground text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap z-10 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}
    </div>
  );
}
