"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, PlusCircle, FolderOpen, Users, MessageSquare,
  CreditCard, Star, Settings, Briefcase, FileText, TrendingUp, Image, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const links = user?.role === "client" ? clientLinks : freelancerLinks;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <span className="text-white font-bold text-sm">DS</span>
        </div>
        <span className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-outfit)" }}>
          DigitalSewa
        </span>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 px-4 py-4 border-b bg-gray-50">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-teal-100 text-teal-700">
            {user?.name ? getInitials(user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/client" && link.href !== "/freelancer" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                )}>
                  <link.icon className={cn("h-5 w-5", isActive ? "text-teal-600" : "text-gray-400")} />
                  <span className="text-sm">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full gap-2 text-red-500 border-red-200 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
