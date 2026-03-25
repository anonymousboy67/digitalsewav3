"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { IProject } from "@/types";
import { formatNPR, formatDate, getStatusColor, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ActiveProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => setProject(d.project))
      .finally(() => setLoading(false));
  }, [id]);

  const completedMilestones = project?.milestones?.filter((m) => m.status === "completed" || m.status === "paid").length || 0;
  const totalMilestones = project?.milestones?.length || 0;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (!project) {
    return <EmptyState icon={ArrowLeft} title="Project not found" description="" action={{ label: "Go Back", href: "/freelancer/active-projects" }} />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>{project.title}</h1>
          <Badge className={cn("text-xs mt-1", getStatusColor(project.status))}>{project.status}</Badge>
        </div>
      </div>

      {/* Progress */}
      <Card className="border-teal-200 bg-teal-50/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-teal-800">Project Progress</h2>
            <span className="text-sm font-medium text-teal-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-teal-100" />
          <p className="text-sm text-teal-700 mt-2">{completedMilestones} of {totalMilestones} milestones completed</p>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h2 className="font-semibold mb-4">Milestones</h2>
          {!project.milestones || project.milestones.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No milestones defined for this project</p>
          ) : (
            <div className="space-y-3">
              {project.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    m.status === "completed" || m.status === "paid" ? "bg-green-100" : "bg-gray-100"
                  )}>
                    {m.status === "completed" || m.status === "paid" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{m.title}</p>
                    {m.dueDate && <p className="text-xs text-gray-400">Due: {formatDate(m.dueDate)}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-teal-600 text-sm">{formatNPR(m.amount)}</p>
                    <Badge className={cn("text-xs", getStatusColor(m.status))}>{m.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Project Budget</p>
              <p className="font-bold text-teal-600">{formatNPR(project.budget.max)}</p>
            </div>
            <Button
              className="bg-teal-600 hover:bg-teal-700 gap-2"
              onClick={() => toast.success("Deliverable submitted! Client will review soon.")}
            >
              <CheckCircle className="h-4 w-4" /> Submit Deliverable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project details */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h2 className="font-semibold mb-3">Project Details</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.skills.map((s) => (
              <Badge key={s} className="bg-teal-50 text-teal-700 text-xs">{s}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
