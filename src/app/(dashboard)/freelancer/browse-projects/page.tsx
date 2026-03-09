"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-wrapper";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { ProjectCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { IProject } from "@/types";
import { CATEGORIES, DISTRICTS } from "@/lib/constants";
import { useDebounce } from "@/hooks/useProjects";

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [urgency, setUrgency] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ status: "open", limit: "12", sort });
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (category && category !== "all") params.append("category", category);
    if (district && district !== "all") params.append("district", district);
    if (urgency && urgency !== "all") params.append("urgency", urgency);

    fetch(`/api/projects?${params}`)
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, district, urgency, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Browse Projects</h1>
        <p className="text-gray-500 text-sm mt-1">{projects.length} open projects available</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {DISTRICTS.slice(0, 10).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger><SelectValue placeholder="Urgency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState icon={Briefcase} title="No projects found" description="Try adjusting your filters to find more projects" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} href={`/freelancer/browse-projects/${p._id}`} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
