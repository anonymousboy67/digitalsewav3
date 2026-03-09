"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, PlusCircle, FolderOpen, Users, MessageSquare,
  CreditCard, Star, Settings, Briefcase, FileText, TrendingUp,
  Image, ChevronLeft, LogOut, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getInitials } from "@/lib/utils";

const clientLinks = [
  { href: "/client", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/client/post-project", icon: PlusCircle, label: "Post Project" },
  { href: "/client/my-projects", icon: FolderOpen, label: "My Projects" },
  { href: "/client/browse-freelancers", icon: Users, label: "Browse Freelancers" },
  { href: "/client/messages", icon: MessageSquare, label: "Messages" },
  { href: "/client/payments", icon: CreditCard, label: "Payments" },
  { href: "/client/reviews", icon: Star, label: "Reviews" },
  { href: "/client/settings", icon: Settings, label: "Settings" },
];

const freelancerLinks = [
  { href: "/freelancer", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/freelancer/browse-projects", icon: Briefcase, label: "Browse Projects" },
  { href: "/freelancer/my-proposals", icon: FileText, label: "My Proposals" },
  { href: "/freelancer/active-projects", icon: FolderOpen, label: "Active Projects" },
  { href: "/freelancer/messages", icon: MessageSquare, label: "Messages" },
  { href: "/freelancer/earnings", icon: TrendingUp, label: "Earnings" },
  { href: "/freelancer/portfolio", icon: Image, label: "Portfolio" },
  { href: "/freelancer/reviews", icon: Star, label: "Reviews" },
  { href: "/freelancer/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const { sidebarOpen, toggleSidebar } = useStore();
  const unreadMessages = useStore((s) => s.unreadMessages);

  const links = user?.role === "client" ? clientLinks : freelancerLinks;

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-40 shadow-sm"
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">DS</span>
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-bold text-gray-900 text-lg whitespace-nowrap"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              DigitalSewa
            </motion.span>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("ml-auto h-8 w-8 text-gray-500", !sidebarOpen && "ml-0 mt-0")}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/client" && link.href !== "/freelancer" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                    isActive
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <link.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-teal-600" : "text-gray-400 group-hover:text-gray-600")} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm whitespace-nowrap flex items-center gap-2"
                      >
                        {link.label}
                        {link.label === "Messages" && unreadMessages > 0 && (
                          <Badge className="bg-teal-500 text-white h-4 w-4 flex items-center justify-center p-0 text-xs rounded-full">
                            {unreadMessages > 9 ? "9+" : unreadMessages}
                          </Badge>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-6 bg-teal-500 rounded-r-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-gray-100 p-3">
        <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-medium">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
