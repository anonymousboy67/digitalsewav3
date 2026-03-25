"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IProject } from "@/types";
import { formatNPR, formatRelativeTime, getCategoryLabel, getCategoryColor, getStatusColor, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: IProject;
  href?: string;
}

export function ProjectCard({ project, href }: ProjectCardProps) {
  const client = project.client as { name?: string; avatar?: string; verified?: boolean };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={href || "#"}>
        <Card className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-teal-200 overflow-hidden">
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1 text-sm">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("text-xs px-2 py-0", getCategoryColor(project.category))}>
                    {getCategoryLabel(project.category)}
                  </Badge>
                  {project.urgency === "urgent" && (
                    <Badge className="text-xs px-2 py-0 bg-red-100 text-red-700 gap-1">
                      <Zap className="h-2.5 w-2.5" /> Urgent
                    </Badge>
                  )}
                </div>
              </div>
              <Badge className={cn("text-xs whitespace-nowrap", getStatusColor(project.status))}>
                {project.status.replace("-", " ")}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="text-xs text-gray-400">+{project.skills.length - 3}</span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {/* Budget */}
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <DollarSign className="h-3.5 w-3.5 text-teal-500" />
                  <span className="font-medium">
                    {formatNPR(project.budget.min)} - {formatNPR(project.budget.max)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                {/* Location */}
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {project.location.remote ? "Remote" : project.location.district}
                </div>
                {/* Time */}
                {project.createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(project.createdAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Client info */}
            {client && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
                    {client.name ? getInitials(client.name) : "C"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-500">{client.name}</span>
                {client.verified && (
                  <Badge className="text-xs px-1.5 py-0 bg-teal-50 text-teal-600">Verified</Badge>
                )}
                {project.proposals && (
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                    <Users className="h-3 w-3" />
                    {Array.isArray(project.proposals) ? project.proposals.length : 0} proposals
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
