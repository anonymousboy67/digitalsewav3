"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IProject } from "@/types";
import { formatNPR, formatDate, getCategoryLabel, getStatusColor, getInitials, cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ProjectDetailFreelancerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useCurrentUser();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [proposal, setProposal] = useState({ coverLetter: "", bidAmount: "", estimatedDuration: "" });

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project);
        // Check if already applied
        if (d.project?.proposals && user) {
          const proposals = d.project.proposals;
          const applied = proposals.some((p: { freelancer?: { _id?: string } | string }) => {
            const freelancer = p.freelancer;
            if (typeof freelancer === "string") return freelancer === user.id;
            return freelancer?._id === user.id;
          });
          setAlreadyApplied(applied);
        }
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async () => {
    if (!proposal.coverLetter || !proposal.bidAmount || !proposal.estimatedDuration) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: proposal.coverLetter,
          bidAmount: Number(proposal.bidAmount),
          estimatedDuration: proposal.estimatedDuration,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Proposal submitted successfully!");
        setAlreadyApplied(true);
      } else {
        toast.error(data.error || "Failed to submit proposal");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return <EmptyState icon={ArrowLeft} title="Project not found" description="" action={{ label: "Go Back", href: "/freelancer/browse-projects" }} />;
  }

  const client = project.client as { name?: string; avatar?: string; rating?: { average: number }; verified?: boolean; location?: { district: string } };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
            {project.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn("text-xs", getStatusColor(project.status))}>{project.status}</Badge>
            <Badge className="text-xs bg-gray-100 text-gray-600">{getCategoryLabel(project.category)}</Badge>
            {project.urgency === "urgent" && <Badge className="text-xs bg-red-100 text-red-700">Urgent</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-3">Project Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>

              {project.skills.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((s) => (
                      <Badge key={s} className="bg-teal-50 text-teal-700 text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Budget</p>
                  <p className="font-semibold text-teal-600">{formatNPR(project.budget.min)} – {formatNPR(project.budget.max)}</p>
                  <p className="text-xs text-gray-400">{project.budget.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Deadline</p>
                  <p className="font-semibold">{formatDate(project.deadline)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="font-semibold">{project.location.remote ? "Remote" : `${project.location.city}, ${project.location.district}`}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Proposals</p>
                  <p className="font-semibold">{Array.isArray(project.proposals) ? project.proposals.length : 0} bids</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Proposal */}
          {project.status === "open" && (
            <Card className="border-teal-200 bg-teal-50/30">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">
                  {alreadyApplied ? "✓ Proposal Submitted" : "Submit a Proposal"}
                </h2>
                {alreadyApplied ? (
                  <p className="text-sm text-gray-600">You have already submitted a proposal for this project. Check your proposals page for updates.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Your Bid (NPR) *</Label>
                        <Input
                          type="number"
                          placeholder="Enter bid amount"
                          value={proposal.bidAmount}
                          onChange={(e) => setProposal((p) => ({ ...p, bidAmount: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Estimated Duration *</Label>
                        <Input
                          placeholder="e.g., 2 weeks, 5 days"
                          value={proposal.estimatedDuration}
                          onChange={(e) => setProposal((p) => ({ ...p, estimatedDuration: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cover Letter *</Label>
                      <Textarea
                        placeholder="Explain why you're the best fit. Describe your experience with similar projects, your approach, and why you're excited about this work..."
                        value={proposal.coverLetter}
                        onChange={(e) => setProposal((p) => ({ ...p, coverLetter: e.target.value }))}
                        rows={5}
                      />
                      <p className="text-xs text-gray-400">{proposal.coverLetter.length} chars (min. 100)</p>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 gap-2"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Submit Proposal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Client info */}
        <div className="space-y-4">
          {client && (
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 text-sm">About the Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                      {client.name ? getInitials(client.name) : "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{client.name}</p>
                    {client.verified && <Badge className="text-xs bg-teal-50 text-teal-600 mt-0.5">Verified</Badge>}
                  </div>
                </div>
                {client.location && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {client.location.district}
                  </div>
                )}
                {client.rating && (
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{client.rating.average?.toFixed(1)}</span>
                    <span className="text-gray-400">rating</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
