"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IReview } from "@/types";
import { getInitials, formatRelativeTime } from "@/lib/utils";

interface ReviewCardProps {
  review: IReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const reviewer = review.reviewer as { name: string; avatar?: string; role?: string };
  const project = review.project as { title?: string };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={reviewer.avatar} />
          <AvatarFallback className="bg-teal-100 text-teal-700">
            {getInitials(reviewer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-gray-900">{reviewer.name}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                />
              ))}
            </div>
          </div>
          {project?.title && (
            <p className="text-xs text-gray-400 mt-0.5">for "{project.title}"</p>
          )}
          <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
          {review.createdAt && (
            <p className="text-xs text-gray-400 mt-2">{formatRelativeTime(review.createdAt)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
