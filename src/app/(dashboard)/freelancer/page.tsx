"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, FileText, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/shared/StatsCard";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { StatsCardSkeleton, ProjectCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { IProject, IUser } from "@/types";
import { formatNPR } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const earningsData = [
  { month: "Aug", amount: 15000 },
  { month: "Sep", amount: 22000 },
  { month: "Oct", amount: 18000 },
  { month: "Nov", amount: 31000 },
  { month: "Dec", amount: 25000 },
  { month: "Jan", amount: 38000 },
];

export default function FreelancerDashboard() {
  const { user } = useCurrentUser();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [recommended, setRecommended] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/users/${user.id}`).then((r) => r.json()),
      fetch(`/api/projects?status=open&limit=3`).then((r) => r.json()),
    ]).then(([userData, projectData]) => {
      setProfile(userData.user);
      setRecommended(projectData.projects || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const stats = {
    active: 0,
    earned: profile?.totalEarnings || 0,
    proposals: 0,
    rating: profile?.rating?.average || 0,
  };

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
            Hey, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {profile?.availability === "available" ? "You're currently accepting new projects" : "Update your availability"}
          </p>
        </div>
        <Link href="/freelancer/browse-projects">
          <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
            <Briefcase className="h-4 w-4" /> Find Work
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Active Projects" value={stats.active} icon={Briefcase} color="teal" delay={0} />
            <StatsCard title="Total Earned" value={formatNPR(stats.earned)} icon={TrendingUp} color="emerald" delay={0.1} />
            <StatsCard title="Proposals Sent" value={stats.proposals} icon={FileText} color="blue" delay={0.2} />
            <StatsCard title="Avg. Rating" value={stats.rating > 0 ? stats.rating.toFixed(1) : "—"} icon={Star} color="orange" delay={0.3} />
          </>
        )}
      </div>

      {/* Charts + Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Monthly Earnings (NPR)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => [`Rs. ${Number(v).toLocaleString()}`, "Earnings"]} />
              <Bar dataKey="amount" fill="#0D9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-5 text-white">
          <h2 className="font-semibold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Browse New Projects", href: "/freelancer/browse-projects" },
              { label: "View My Proposals", href: "/freelancer/my-proposals" },
              { label: "Update Portfolio", href: "/freelancer/portfolio" },
              { label: "Update Profile", href: "/freelancer/settings" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm">{action.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
            Recommended Projects
          </h2>
          <Link href="/freelancer/browse-projects">
            <Button variant="ghost" size="sm" className="text-teal-600 gap-1">
              Browse all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : recommended.length === 0 ? (
          <EmptyState icon={Briefcase} title="No projects available" description="Check back soon for new opportunities" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.map((p) => (
              <ProjectCard key={p._id} project={p} href={`/freelancer/browse-projects/${p._id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
