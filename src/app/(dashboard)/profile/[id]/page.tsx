"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Star, Calendar, Briefcase, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { IUser, IReview } from "@/types";
import { formatNPR, formatDate, getInitials, getStatusColor, cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${id}`).then((r) => r.json()),
      fetch(`/api/reviews?revieweeId=${id}`).then((r) => r.json()),
    ]).then(([userData, reviewData]) => {
      setProfile(userData.user);
      setReviews(reviewData.reviews || []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleContact = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: id }),
    });
    if (res.ok) {
      const data = await res.json();
      const role = currentUser.role;
      router.push(`/${role}/messages`);
    } else {
      toast.error("Failed to start conversation");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return <EmptyState icon={ArrowLeft} title="User not found" description="" action={{ label: "Go Back", onClick: () => router.back() }} />;
  }

  const isFreelancer = profile.role === "freelancer";

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 mb-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* Cover/Header */}
      <Card className="border-gray-200 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-teal-600 to-emerald-600" />
        <CardContent className="p-6 -mt-12">
          <div className="flex items-end gap-4">
            <Avatar className="h-24 w-24 ring-4 ring-white">
              <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-3xl font-bold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
                {profile.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <Badge className="bg-teal-50 text-teal-700 capitalize">{profile.role}</Badge>
                {profile.verified && <Badge className="bg-emerald-50 text-emerald-700">✓ Verified</Badge>}
                {isFreelancer && profile.availability && (
                  <Badge className={cn("text-xs", getStatusColor(profile.availability))}>{profile.availability}</Badge>
                )}
              </div>
            </div>
            {currentUser && currentUser.id !== id && (
              <Button onClick={handleContact} className="bg-teal-600 hover:bg-teal-700 gap-2">
                <MessageSquare className="h-4 w-4" /> Contact
              </Button>
            )}
          </div>

          {/* Details row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-teal-500" />
                {profile.location.city}, {profile.location.district}
              </div>
            )}
            {profile.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-teal-500" />
                Joined {formatDate(profile.createdAt)}
              </div>
            )}
            {isFreelancer && profile.hourlyRate && (
              <div className="flex items-center gap-1 font-medium text-teal-600">
                {formatNPR(profile.hourlyRate)}/hr
              </div>
            )}
            {profile.rating && profile.rating.count > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{profile.rating.average.toFixed(1)}</span>
                <span className="text-gray-400">({profile.rating.count} reviews)</span>
              </div>
            )}
          </div>

          {profile.bio && <p className="text-sm text-gray-600 mt-4 leading-relaxed">{profile.bio}</p>}
        </CardContent>
      </Card>

      {/* Content tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isFreelancer && <TabsTrigger value="portfolio">Portfolio ({profile.portfolio?.length || 0})</TabsTrigger>}
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {isFreelancer && profile.skills && profile.skills.length > 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <h2 className="font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} className="bg-teal-50 text-teal-700">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-gray-200">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {profile.completedProjects || 0}
                  </p>
                  <p className="text-xs text-gray-500">Projects Done</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {profile.rating?.average?.toFixed(1) || "—"}
                  </p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {reviews.length}
                  </p>
                  <p className="text-xs text-gray-500">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isFreelancer && (
          <TabsContent value="portfolio" className="mt-4">
            {!profile.portfolio || profile.portfolio.length === 0 ? (
              <EmptyState icon={Briefcase} title="No portfolio items" description="This freelancer hasn't added portfolio items yet" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolio.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="h-12 w-12 text-teal-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-teal-500" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      {item.skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.skills.map((s) => (
                            <span key={s} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="reviews" className="mt-4">
          {reviews.length === 0 ? (
            <EmptyState icon={Star} title="No reviews yet" description="This user hasn't received reviews yet" />
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
