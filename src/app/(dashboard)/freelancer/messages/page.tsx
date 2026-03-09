"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { ChatInterface } from "@/components/shared/ChatInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { IConversation, IUser } from "@/types";
import { getInitials, formatRelativeTime, cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function FreelancerMessagesPage() {
  const { user } = useCurrentUser();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selected, setSelected] = useState<IConversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((d) => {
        setConversations(d.conversations || []);
        if (d.conversations?.length > 0) setSelected(d.conversations[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getOther = (conv: IConversation) => {
    const participants = conv.participants as IUser[];
    return participants.find((p) => p._id !== user?.id);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-0 bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No conversations yet</div>
          ) : (
            conversations.map((conv) => {
              const other = getOther(conv);
              return (
                <button
                  key={conv._id}
                  onClick={() => setSelected(conv)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b",
                    selected?._id === conv._id && "bg-teal-50 border-l-2 border-l-teal-500"
                  )}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={other?.avatar} />
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                      {other?.name ? getInitials(other.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{other?.name}</p>
                    {conv.lastMessage && (
                      <p className="text-xs text-gray-400 truncate">{conv.lastMessage.content}</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatInterface conversation={selected} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState icon={MessageSquare} title="Select a conversation" description="Choose a conversation to start chatting" />
          </div>
        )}
      </div>
    </div>
  );
}
