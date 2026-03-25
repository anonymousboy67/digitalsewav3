"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "teal" | "emerald" | "blue" | "purple" | "orange";
  delay?: number;
}

const colorMap = {
  teal: { bg: "bg-teal-50", icon: "text-teal-600", border: "border-teal-100" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-100" },
};

export function StatsCard({ title, value, icon: Icon, trend, color = "teal", delay = 0 }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn("border", colors.border, "hover:shadow-sm transition-shadow")}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: "var(--font-outfit)" }}>
                {value}
              </p>
              {trend && (
                <p className={cn("text-xs mt-1", trend.value >= 0 ? "text-emerald-600" : "text-red-500")}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
                </p>
              )}
            </div>
            <div className={cn("p-3 rounded-xl", colors.bg)}>
              <Icon className={cn("h-5 w-5", colors.icon)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
