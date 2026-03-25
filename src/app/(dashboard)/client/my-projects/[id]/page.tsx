"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProposalCard } from "@/components/shared/ProposalCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { IProject, IProposal } from "@/types";
import { formatNPR, formatDate, getCategoryLabel, getStatusColor, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProject(data.project);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleProposalAction = async (proposalId: string, status: "accepted" | "rejected") => {
    const res = await fetch(`/api/proposals/${proposalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Proposal ${status}`);
      fetchProject();
    } else {
      toast.error("Failed to update proposal");
    }
  };

  const handleReleasePayment = async () => {
    if (!project?.assignedFreelancer) return;
    const freelancer = project.assignedFreelancer as { _id: string };
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project._id,
        toId: freelancer._id,
        amount: project.budget.max,
        type: "escrow_release",
        paymentMethod: "khalti",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Demo: Payment released to freelancer!");
      fetchProject();
    } else {
      toast.error(data.error || "Failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState icon={ArrowLeft} title="Project not found" description="This project doesn't exist or has been removed." action={{ label: "Go Back", href: "/client/my-projects" }} />
    );
  }

  const proposals = (project.proposals || []) as IProposal[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
            {project.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn("text-xs", getStatusColor(project.status))}>{project.status.replace("-", " ")}</Badge>
            <Badge className="text-xs bg-gray-100 text-gray-600">{getCategoryLabel(project.category)}</Badge>
            {project.urgency === "urgent" && <Badge className="text-xs bg-red-100 text-red-700">Urgent</Badge>}
          </div>
        </div>
        {project.status === "in-progress" && (
          <Button onClick={handleReleasePayment} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <DollarSign className="h-4 w-4" /> Release Payment (Demo)
          </Button>
        )}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DollarSign className="h-4 w-4 text-teal-500" />
              <span className="text-xs">Budget</span>
            </div>
            <p className="font-semibold text-sm">{formatNPR(project.budget.min)} – {formatNPR(project.budget.max)}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="h-4 w-4 text-teal-500" />
              <span className="text-xs">Deadline</span>
            </div>
            <p className="font-semibold text-sm">{formatDate(project.deadline)}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <MapPin className="h-4 w-4 text-teal-500" />
              <span className="text-xs">Location</span>
            </div>
            <p className="font-semibold text-sm">{project.location.remote ? "Remote" : project.location.district}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="h-4 w-4 text-teal-500" />
              <span className="text-xs">Proposals</span>
            </div>
            <p className="font-semibold text-sm">{proposals.length} bids</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proposals">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="proposals">Proposals ({proposals.length})</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-3 mt-4">
          {proposals.length === 0 ? (
            <EmptyState icon={Users} title="No proposals yet" description="Proposals from freelancers will appear here" />
          ) : (
            proposals.map((proposal) => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                showActions={project.status === "open"}
                onAccept={(id) => handleProposalAction(id, "accepted")}
                onReject={(id) => handleProposalAction(id, "rejected")}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-3 mt-4">
          {(!project.milestones || project.milestones.length === 0) ? (
            <EmptyState icon={CheckCircle} title="No milestones" description="Milestones will be added when a proposal is accepted" />
          ) : (
            <div className="space-y-3">
              {project.milestones.map((m, i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{m.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{m.dueDate && formatDate(m.dueDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-teal-600">{formatNPR(m.amount)}</p>
                        <Badge className={cn("text-xs mt-1", getStatusColor(m.status))}>{m.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Project Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              {project.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((s) => (
                      <Badge key={s} className="bg-teal-50 text-teal-700 text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
