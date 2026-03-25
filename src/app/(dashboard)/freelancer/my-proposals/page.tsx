"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { IProposal, IProject } from "@/types";
import { formatNPR, formatRelativeTime, getStatusColor, cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUSES = ["all", "pending", "accepted", "rejected", "withdrawn"];

export default function MyProposalsPage() {
  const { user } = useCurrentUser();
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
<<<<<<< HEAD
    setLoading(true);
    fetch(`/api/proposals?freelancerId=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        setProposals(d.proposals || []);
      })
      .catch(() => setProposals([]))
=======
    // Fetch proposals by getting all projects with the user's proposals
    // We'll use a simpler approach - get all projects and filter
    // For now fetch active projects to get proposal data
    setLoading(true);
    // Use a custom endpoint pattern - GET proposals by freelancer
    fetch(`/api/projects?limit=50`)
      .then((r) => r.json())
      .then(async (d) => {
        // Then for each open project, check proposals for this user
        // Better: fetch all proposals for this freelancer from projects
        const allProposals: IProposal[] = [];
        // Simplified - this would ideally be a dedicated endpoint
        setProposals(allProposals);
      })
>>>>>>> c6d027e42bb6312f912e09cf388d23755169bb84
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>My Proposals</h1>
        <p className="text-gray-500 text-sm mt-1">{proposals.length} proposals submitted</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
              filter === s ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {s.replace("-", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No proposals found"
          description="Browse projects and submit proposals to get started"
          action={{ label: "Browse Projects", href: "/freelancer/browse-projects" }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((proposal) => {
            const project = proposal.project as IProject;
            const StatusIcon = proposal.status === "accepted" ? CheckCircle : proposal.status === "rejected" ? XCircle : Clock;
            return (
              <motion.div key={proposal._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-gray-200 hover:border-teal-200 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/freelancer/browse-projects/${typeof project === "string" ? project : project._id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                            {typeof project === "string" ? "Project" : project.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{proposal.coverLetter}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="font-medium text-teal-600">{formatNPR(proposal.bidAmount)}</span>
                          <span>{proposal.estimatedDuration}</span>
                          {proposal.createdAt && <span>{formatRelativeTime(proposal.createdAt)}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={cn("text-xs gap-1", getStatusColor(proposal.status))}>
                          <StatusIcon className="h-3 w-3" />
                          {proposal.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
