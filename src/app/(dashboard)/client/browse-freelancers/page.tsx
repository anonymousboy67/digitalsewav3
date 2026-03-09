"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-wrapper";
import { FreelancerCard } from "@/components/shared/FreelancerCard";
import { FreelancerCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { IUser } from "@/types";
import { DISTRICTS, SKILLS } from "@/lib/constants";
import { useDebounce } from "@/hooks/useProjects";

export default function BrowseFreelancersPage() {
  const [freelancers, setFreelancers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [district, setDistrict] = useState("");
  const [availability, setAvailability] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ role: "freelancer", limit: "12" });
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (skill && skill !== "all") params.append("skill", skill);
    if (district && district !== "all") params.append("district", district);
    if (availability && availability !== "all") params.append("availability", availability);

    fetch(`/api/users?${params}`)
      .then((r) => r.json())
      .then((d) => setFreelancers(d.users || []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, skill, district, availability]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Browse Freelancers</h1>
        <p className="text-gray-500 text-sm mt-1">Find verified local talent for your projects</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, skill..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={skill} onValueChange={setSkill}>
            <SelectTrigger><SelectValue placeholder="Filter by skill" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {SKILLS.slice(0, 20).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {DISTRICTS.slice(0, 10).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <FreelancerCardSkeleton key={i} />)}
        </div>
      ) : freelancers.length === 0 ? (
        <EmptyState icon={Users} title="No freelancers found" description="Try adjusting your filters to find more talent" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {freelancers.map((f) => (
            <FreelancerCard key={f._id} freelancer={f} showContact />
          ))}
        </motion.div>
      )}
    </div>
  );
}
