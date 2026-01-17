"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  chats?: Chat[];
  activeChat?: string;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ChatSidebar({
  chats = [
    { id: "1", title: "Penang Budget Planning", timestamp: "2 hours ago" },
    { id: "2", title: "Melaka Crowd Check", timestamp: "3 hours ago" },
    { id: "3", title: "Cameron Highlands Weather", timestamp: "Yesterday" },
  ],
  activeChat,
  onSelectChat,
  onNewChat,
  isCollapsed = false,
  onToggle,
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-black/10 transition-all duration-300",
        isCollapsed ? "w-0 overflow-hidden" : "w-80"
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b border-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Image
              src="/logo.png"
              alt="Jalan-Jalan"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="font-semibold text-jj-terracotta">Jalan-Jalan</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-2">
          <div className="px-2 mb-2">
            <span className="text-sm font-medium text-slate-600">Chats</span>
          </div>

          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                activeChat === chat.id
                  ? "bg-slate-100"
                  : "hover:bg-slate-50 bg-neutral-200"
              )}
              onClick={() => onSelectChat?.(chat.id)}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {chat.title}
                </p>
              </div>
              {(hoveredChat === chat.id || activeChat === chat.id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
