"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { ProjectCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { IProject } from "@/types";

export default function ActiveProjectsPage() {
  const { user } = useCurrentUser();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/projects?freelancerId=${user.id}&status=in-progress`)
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Active Projects</h1>
        <p className="text-gray-500 text-sm mt-1">{projects.length} in-progress projects</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No active projects"
          description="When a client accepts your proposal, the project will appear here."
          action={{ label: "Browse Projects", href: "/freelancer/browse-projects" }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} href={`/freelancer/active-projects/${p._id}`} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
