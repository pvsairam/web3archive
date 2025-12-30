"use client";

import React from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    parseISO
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Project } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useArchive } from "@/context/archive-context";

interface CalendarGridProps {
    onProjectClick: (project: Project) => void;
    onDayClick: (projects: Project[], date: Date) => void;
    selectedDate?: Date | null;
    projects: Project[];
}

export function CalendarGrid({ onDayClick, onProjectClick, selectedDate, projects }: CalendarGridProps) {
    const { viewedDate, setViewedDate } = useArchive();

    const monthStart = startOfMonth(viewedDate);
    const monthEnd = endOfMonth(monthStart);
    const currentMonth = monthStart;
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    // Strategy: group projects by STRICT UTC date string to avoid timezone shifts
    const projectsByDate = React.useMemo(() => {
        const map = new Map<string, Project[]>();
        projects.forEach(p => {
            try {
                // p.launchDate is e.g. "2026-01-14T02:00:00Z"
                // strict match on the date part, ignore local time
                const dateStr = p.launchDate.split("T")[0]; // "2026-01-14"
                if (!map.has(dateStr)) map.set(dateStr, []);
                map.get(dateStr)!.push(p);
            } catch (err) {
                console.error("Invalid project date:", p.launchDate, err);
            }
        });
        return map;
    }, [projects]);

    const nextMonth = () => setViewedDate(addMonths(viewedDate, 1));
    const prevMonth = () => setViewedDate(subMonths(viewedDate, 1));
    const resetToToday = () => setViewedDate(new Date());

    return (
        <div className="flex flex-col gap-12">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-4">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black tracking-[0.3em] text-foreground uppercase italic">
                        {format(currentMonth, "MMMM")}
                    </h2>
                    <span className="text-[10px] font-mono tracking-[0.4em] text-muted-foreground uppercase mt-2 font-bold">Temporal Slice · {format(currentMonth, "yyyy")}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-10 w-10 rounded-2xl hover:bg-muted border border-transparent hover:border-border/40 transition-all">
                        <ChevronLeft className="h-4 w-4 text-muted-foreground/60" />
                    </Button>
                    <Button variant="ghost" onClick={resetToToday} className="h-10 px-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground hover:bg-muted border border-border/40 transition-all italic">
                        Now
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-10 w-10 rounded-2xl hover:bg-muted border border-transparent hover:border-border/40 transition-all">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border border-border rounded-[32px] overflow-hidden bg-background glass-surface ring-1 ring-border">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                    <div
                        key={dayName}
                        className="border-r border-b border-border py-5 text-center text-[9px] font-black uppercase tracking-[0.4em] text-foreground bg-muted/30"
                    >
                        {dayName}
                    </div>
                ))}
                {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayProjects = projectsByDate.get(dateKey) || [];
                    const isCurrentMonth = format(day, "M") === format(currentMonth, "M");
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <motion.div
                            key={day.toString()}
                            onClick={() => onDayClick(dayProjects, day)}
                            whileHover={{ backgroundColor: "var(--accent)", y: -1 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className={cn(
                                "group relative h-44 cursor-pointer border-r border-b border-border p-6 transition-all duration-700 hover:bg-muted/10",
                                !isCurrentMonth && "opacity-[0.5] grayscale bg-muted/10", // Removed pointer-events-none
                                isSelected ? "bg-accent/40 z-10" : "bg-transparent",
                                isToday && "ring-1 ring-primary/50 inset-0 bg-primary/5" // Added Today highlight
                            )}
                        >
                            {/* Day Number */}
                            <span className={cn(
                                "text-[12px] font-mono tracking-tighter transition-colors duration-700 absolute top-4 left-5",
                                isToday ? "text-primary font-black" : "text-foreground font-bold"
                            )}>
                                {format(day, "dd")}
                            </span>

                            {dayProjects.length > 0 && (
                                <div className="mt-8 flex flex-col gap-2 h-full">
                                    {dayProjects.slice(0, 3).map((project, idx) => (
                                        <div
                                            key={project.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onProjectClick(project);
                                            }}
                                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-background/80 transition-all border border-transparent hover:border-border/20"
                                        >
                                            <div className="h-5 w-5 flex items-center justify-center rounded-md bg-muted border border-border/40 text-[8px] font-black text-foreground shadow-sm shrink-0">
                                                {project.logo}
                                            </div>
                                            <span className="text-[10px] font-bold text-foreground/80 truncate italic tracking-tight leading-none group-hover/item:text-primary">
                                                {project.name}
                                            </span>
                                        </div>
                                    ))}

                                    {dayProjects.length > 3 && (
                                        <div className="pl-1.5 pt-1">
                                            <span className="text-[9px] font-mono text-muted-foreground/80 font-bold hover:text-foreground">
                                                +{dayProjects.length - 3} more...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
