"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { IReview } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function FreelancerReviewsPage() {
  const { user } = useCurrentUser();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/reviews?revieweeId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .finally(() => setLoading(false));
  }, [user]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Client feedback on your work</p>
      </div>

      {/* Rating summary */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-teal-700" style={{ fontFamily: "var(--font-outfit)" }}>{avg}</div>
          <div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(avg)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{reviews.length} total reviews</p>
          </div>

          {/* Distribution */}
          <div className="ml-8 flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-4">{star}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Complete projects to start receiving reviews from clients" />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}
    </div>
  );
}
