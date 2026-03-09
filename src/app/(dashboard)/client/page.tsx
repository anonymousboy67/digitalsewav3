"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, DollarSign, FileText, CheckCircle, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/shared/StatsCard";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { StatsCardSkeleton, ProjectCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { IProject } from "@/types";
import { formatNPR } from "@/lib/utils";

export default function ClientDashboard() {
  const { user } = useCurrentUser();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, spent: 0, proposals: 0, completed: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/projects?clientId=${user.id}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects);
          const active = data.projects.filter((p: IProject) => p.status === "in-progress").length;
          const completed = data.projects.filter((p: IProject) => p.status === "completed").length;
          const proposals = data.projects.reduce((sum: number, p: IProject) => sum + (Array.isArray(p.proposals) ? p.proposals.length : 0), 0);
          setStats({ active, spent: 0, proposals, completed });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your projects</p>
        </div>
        <Link href="/client/post-project">
          <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
            <PlusCircle className="h-4 w-4" /> Post Project
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Active Projects" value={stats.active} icon={FolderOpen} color="teal" delay={0} />
            <StatsCard title="Total Proposals" value={stats.proposals} icon={FileText} color="blue" delay={0.1} />
            <StatsCard title="Completed Projects" value={stats.completed} icon={CheckCircle} color="emerald" delay={0.2} />
            <StatsCard title="Total Spent" value={formatNPR(stats.spent)} icon={DollarSign} color="purple" delay={0.3} />
          </>
        )}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
            Recent Projects
          </h2>
          <Link href="/client/my-projects">
            <Button variant="ghost" size="sm" className="text-teal-600 gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Post your first project and start receiving proposals from talented local freelancers."
            action={{ label: "Post a Project", href: "/client/post-project" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                href={`/client/my-projects/${project._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
