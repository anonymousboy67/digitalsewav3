"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import useStore from "@/store/useStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <motion.div
        animate={{ marginLeft: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block min-h-screen"
      >
        <Topbar />
        <main className="p-6">{children}</main>
      </motion.div>
      {/* Mobile */}
      <div className="md:hidden min-h-screen">
        <Topbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
