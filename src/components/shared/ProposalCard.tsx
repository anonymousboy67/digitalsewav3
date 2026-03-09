"use client";

import { motion } from "framer-motion";
import { Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IProposal } from "@/types";
import { formatNPR, formatRelativeTime, getStatusColor, getInitials, cn } from "@/lib/utils";

interface ProposalCardProps {
  proposal: IProposal;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

export function ProposalCard({ proposal, onAccept, onReject, showActions }: ProposalCardProps) {
  const freelancer = proposal.freelancer as {
    name: string;
    avatar?: string;
    rating?: { average: number; count: number };
    skills?: string[];
    completedProjects?: number;
    hourlyRate?: number;
    location?: { district: string };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-gray-200 hover:border-teal-200 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={freelancer.avatar} />
              <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                {getInitials(freelancer.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{freelancer.name}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-600">
                        {freelancer.rating?.average?.toFixed(1) || "0.0"}
                        <span className="text-gray-400"> ({freelancer.rating?.count || 0})</span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {freelancer.completedProjects || 0} projects
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-teal-600">{formatNPR(proposal.bidAmount)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{proposal.estimatedDuration}</p>
                </div>
              </div>

              {/* Skills */}
              {freelancer.skills && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {freelancer.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Letter */}
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{proposal.coverLetter}</p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", getStatusColor(proposal.status))}>
                    {proposal.status}
                  </Badge>
                  {proposal.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(proposal.createdAt)}
                    </div>
                  )}
                </div>

                {showActions && proposal.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => onReject?.(proposal._id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-teal-600 hover:bg-teal-700"
                      onClick={() => onAccept?.(proposal._id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Accept
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
