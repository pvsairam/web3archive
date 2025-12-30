"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "calendar" | "timeline" | "list" | "contact" | "admin";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const views = [
    { id: "calendar", icon: Calendar, label: "Registry" },
    { id: "timeline", icon: Clock, label: "Stream" },
    { id: "list", icon: List, label: "Ledger" },
  ] as const;

  return (
    <div className="flex items-center p-1.5 rounded-[22px] bg-muted/30 border border-border/40 glass-surface relative shadow-xl">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={cn(
            "relative flex items-center h-10 gap-3 px-6 rounded-2xl transition-all duration-500 group",
            currentView === view.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {currentView === view.id && (
            <motion.div
              layoutId="active-view"
              className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <view.icon className={cn("h-4 w-4 relative z-10 transition-transform group-hover:scale-110", currentView === view.id ? "" : "text-muted-foreground")} />
          <span className="text-[10px] font-black uppercase tracking-widest italic relative z-10">{view.label}</span>
        </button>
      ))}
    </div>
  );
}
