"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { ProjectCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { IProject } from "@/types";

const STATUSES = ["all", "open", "in-progress", "completed", "cancelled"];

export default function MyProjectsPage() {
  const { user } = useCurrentUser();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const params = new URLSearchParams({ clientId: user.id, limit: "20" });
    if (status !== "all") params.append("status", status);

    fetch(`/api/projects?${params}`)
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, [user, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>My Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} projects total</p>
        </div>
        <Link href="/client/post-project">
          <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
            <PlusCircle className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList className="bg-gray-100 flex-wrap h-auto gap-1 p-1">
          {STATUSES.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              {s.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects found"
          description={status === "all" ? "Post your first project to start hiring" : `No ${status} projects`}
          action={status === "all" ? { label: "Post a Project", href: "/client/post-project" } : undefined}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} href={`/client/my-projects/${p._id}`} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
