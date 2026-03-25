"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { IReview } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientReviewsPage() {
  const { user } = useCurrentUser();
  const [received, setReceived] = useState<IReview[]>([]);
  const [given, setGiven] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"received" | "given">("received");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/reviews?revieweeId=${user.id}`).then((r) => r.json()),
      fetch(`/api/reviews?reviewerId=${user.id}`).then((r) => r.json()),
    ]).then(([rec, giv]) => {
      setReceived(rec.reviews || []);
      setGiven(giv.reviews || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const avg = received.length ? (received.reduce((s, r) => s + r.rating, 0) / received.length).toFixed(1) : "—";
  const reviews = tab === "received" ? received : given;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Your feedback from the community</p>
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
            <p className="text-sm text-gray-500 mt-1">{received.length} reviews received</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("received")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "received" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Received ({received.length})
        </button>
        <button
          onClick={() => setTab("given")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "given" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Given ({given.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Reviews will appear here after completing projects" />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}
    </div>
  );
}
