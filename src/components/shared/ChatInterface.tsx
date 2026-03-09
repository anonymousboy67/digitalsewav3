"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMessage, IConversation } from "@/types";
import { getInitials, formatRelativeTime, cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

interface ChatInterfaceProps {
  conversation: IConversation;
}

export function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { user } = useCurrentUser();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = (conversation.participants as Array<{ _id: string; name: string; avatar?: string }>)
    .find((p) => p._id !== user?.id);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversation._id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversation._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${conversation._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
        <Avatar className="h-9 w-9">
          <AvatarImage src={otherParticipant?.avatar} />
          <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
            {otherParticipant ? getInitials(otherParticipant.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{otherParticipant?.name || "Unknown"}</p>
          {conversation.project && (
            <p className="text-xs text-gray-400">
              re: {(conversation.project as { title?: string }).title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const sender = msg.sender as { _id?: string; name?: string; avatar?: string };
            const isOwn = sender._id === user?.id || msg.sender === user?.id;

            return (
              <div key={msg._id} className={cn("flex gap-2", isOwn && "flex-row-reverse")}>
                {!isOwn && (
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage src={sender.avatar} />
                    <AvatarFallback className="text-xs bg-gray-200">
                      {sender.name ? getInitials(sender.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-xs lg:max-w-md", isOwn && "items-end flex flex-col")}>
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm",
                    isOwn
                      ? "bg-teal-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 rounded-tl-sm shadow-sm border"
                  )}>
                    {msg.content}
                  </div>
                  {msg.createdAt && (
                    <p className="text-xs text-gray-400 mt-1 px-1">
                      {formatRelativeTime(msg.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-3 border-t bg-white">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border-gray-200"
        />
        <Button
          type="submit"
          disabled={sending || !input.trim()}
          size="icon"
          className="bg-teal-600 hover:bg-teal-700 h-9 w-9"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
