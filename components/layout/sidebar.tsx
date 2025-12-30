"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Archive,
    Clock,
    Star,
    Landmark,
    Globe
} from "lucide-react";

export function Sidebar() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const [collapsed] = useState(false);

    const sidebarItems = [
        { name: "Archive", href: "/", icon: Archive, view: null },
        { name: "Timeline", href: "/?view=timeline", icon: Clock, view: "timeline" },
        { name: "Curated", href: "/?view=list", icon: Star, view: "list" },
        { name: "Contact", href: "/?view=contact", icon: Globe, view: "contact" },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen transition-all duration-500 ease-in-out border-r border-border/40 glass-premium",
                collapsed ? "w-24" : "w-64"
            )}
        >
            <div className="flex h-full flex-col p-6">
                <div className="mb-12 flex items-center gap-4 px-2">
                    <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl">
                            <Landmark className="h-5 w-5" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="text-[13px] font-black tracking-tighter text-foreground italic">WEB3 ARCHIVE</span>
                                <span className="text-[9px] font-mono tracking-widest text-muted-foreground font-bold uppercase">v2025.Ledger</span>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    {sidebarItems.map((item) => {
                        // Logic: Active if currentView matches item.view.
                        // Special case for "Archive" (view: null) -> active only if no view param is present OR if view is effectively Home?
                        // Actually, purely based on the item list:
                        // If url has ?view=timeline, match timeline.
                        // If url has no view, match Archive (href="/").
                        // If url has view=calendar, match Registry.
                        const isActive = item.view
                            ? currentView === item.view
                            : !currentView || currentView === ""; // Archive matches if no view param

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center h-12 gap-4 rounded-2xl px-4 transition-all duration-300",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "")} />
                                {!collapsed && <span className="text-[11px] font-black uppercase tracking-widest italic">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-6 pt-6"></div>
            </div>
        </aside>
    );
}
