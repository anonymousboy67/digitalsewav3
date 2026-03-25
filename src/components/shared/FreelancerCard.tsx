"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types";
import { formatNPR, getInitials, getStatusColor, cn } from "@/lib/utils";
import { toast } from "sonner";

interface FreelancerCardProps {
  freelancer: IUser;
  showContact?: boolean;
  redirectTo?: string; // where to go after starting conversation
}

export function FreelancerCard({ freelancer, showContact = false, redirectTo = "/client/messages" }: FreelancerCardProps) {
  const router = useRouter();
  const [messaging, setMessaging] = useState(false);

  const handleMessage = async () => {
    setMessaging(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: freelancer._id }),
      });
      if (res.ok) {
        router.push(redirectTo);
      } else {
        toast.error("Could not start conversation");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setMessaging(false);
    }
  };
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-teal-200 overflow-hidden">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <Link href={`/profile/${freelancer._id}`}>
              <Avatar className="h-14 w-14 ring-2 ring-gray-100 group-hover:ring-teal-100 transition-all">
                <AvatarImage src={freelancer.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-lg font-semibold">
                  {getInitials(freelancer.name)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${freelancer._id}`} className="hover:text-teal-600">
                <h3 className="font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                  {freelancer.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {freelancer.location?.district || "Nepal"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">
                    {freelancer.rating?.average?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-gray-400">({freelancer.rating?.count || 0})</span>
                </div>
                {/* Rate */}
                {freelancer.hourlyRate && (
                  <span className="text-xs text-teal-600 font-medium">
                    {formatNPR(freelancer.hourlyRate)}/hr
                  </span>
                )}
              </div>
            </div>
            {/* Availability */}
            <Badge className={cn("text-xs whitespace-nowrap", getStatusColor(freelancer.availability || "unavailable"))}>
              {freelancer.availability || "unavailable"}
            </Badge>
          </div>

          {/* Bio */}
          {freelancer.bio && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-3">{freelancer.bio}</p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {freelancer.skills?.slice(0, 4).map((skill) => (
              <span key={skill} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                {skill}
              </span>
            ))}
            {(freelancer.skills?.length || 0) > 4 && (
              <span className="text-xs text-gray-400">+{(freelancer.skills?.length || 0) - 4}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{freelancer.completedProjects || 0} projects done</span>
            </div>
            {showContact ? (
              <Button size="sm" className="h-7 text-xs bg-teal-600 hover:bg-teal-700 gap-1" onClick={handleMessage} disabled={messaging}>
                {messaging ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
                Message
              </Button>
            ) : (
              <Link href={`/profile/${freelancer._id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs border-teal-200 text-teal-600 hover:bg-teal-50">
                  View Profile
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
