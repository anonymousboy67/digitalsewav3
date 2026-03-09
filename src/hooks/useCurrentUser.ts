"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: (session?.user ?? null) as ({ id: string; role: string; avatar?: string; name?: string | null; email?: string | null; image?: string | null }) | null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
