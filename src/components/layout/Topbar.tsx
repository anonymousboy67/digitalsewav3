"use client";

import { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import useStore from "@/store/useStore";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MobileNav } from "./MobileNav";

export function Topbar({ title }: { title?: string }) {
  const { notificationCount } = useStore();
  const { notifications, markAllRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <MobileNav />
        </SheetContent>
      </Sheet>

      {title && (
        <h1
          className="text-lg font-semibold text-gray-900 hidden md:block"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-9 w-52 h-9 bg-gray-50 border-gray-200 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={(open) => { setNotifOpen(open); if (open) markAllRead(); }}>
        <DropdownMenuTrigger className="relative inline-flex items-center justify-center rounded-md h-9 w-9 text-gray-600 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-teal-500 text-white rounded-full">
              {notificationCount > 9 ? "9+" : notificationCount}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
          <div className="px-3 py-2 border-b">
            <p className="font-semibold text-sm">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((n: { _id: string; read: boolean; link?: string; title: string; message: string; createdAt?: string }) => (
              <DropdownMenuItem
                key={n._id}
                className={`px-3 py-3 cursor-pointer flex-col items-start gap-1 ${!n.read ? "bg-teal-50/50" : ""}`}
                onClick={() => n.link && router.push(n.link)}
              >
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-gray-500">{n.message}</p>
                {n.createdAt && (
                  <p className="text-xs text-gray-400">{formatRelativeTime(n.createdAt)}</p>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
