"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineViewProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export function TimelineView({ projects, onProjectClick }: TimelineViewProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const sortedProjects = [...projects].sort((a, b) =>
        new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime()
    );

    const paginatedProjects = sortedProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(projects.length / itemsPerPage);

    return (
        <div className="flex flex-col">
            <div className="relative py-24 px-8 max-w-5xl mx-auto w-full">
                {/* Central Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border/40 to-transparent -translate-x-1/2 hidden md:block" />

                <div className="space-y-32">
                    {paginatedProjects.map((project, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                className={cn(
                                    "relative flex flex-col md:flex-row items-center gap-16",
                                    isEven ? "md:flex-row-reverse" : ""
                                )}
                            >
                                {/* Date Column */}
                                <div className={cn(
                                    "flex-1 text-center md:text-left",
                                    isEven ? "md:text-left" : "md:text-right"
                                )}>
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-3 italic">
                                        {format(new Date(project.launchDate), "MMM dd, yyyy")}
                                    </p>
                                    <p className="text-5xl font-black tracking-[-0.05em] text-foreground italic leading-none">
                                        {format(new Date(project.launchDate), "HH:mm")} <span className="text-xl font-mono tracking-normal not-italic ml-2 text-muted-foreground">UTC</span>
                                    </p>
                                </div>

                                {/* Central Point */}
                                <button
                                    onClick={() => onProjectClick(project)}
                                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[28px] bg-muted/40 border border-border shadow-xl glass-premium group transition-all duration-700 hover:scale-110"
                                >
                                    <div className="text-xl font-black text-foreground italic">{project.logo}</div>
                                    {/* Connector to line */}
                                    <div className="absolute top-1/2 -z-10 h-[1px] w-16 bg-border hidden md:block"
                                        style={{ [isEven ? 'left' : 'right']: '100%' }}
                                    />
                                </button>

                                {/* Content Column */}
                                <div className={cn(
                                    "flex-1 space-y-6",
                                    isEven ? "md:text-right" : "md:text-left"
                                )}>
                                    <div className={cn(
                                        "flex flex-wrap items-center gap-4",
                                        isEven ? "md:justify-end" : "md:justify-start"
                                    )}>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-[0.3em] font-black bg-muted/20 border-border text-muted-foreground italic px-2">
                                            {project.network}
                                        </Badge>
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground italic">{project.category}</span>
                                    </div>
                                    <h3
                                        className="text-3xl font-black tracking-[-0.03em] text-foreground italic cursor-pointer hover:text-primary transition-all duration-500"
                                        onClick={() => onProjectClick(project)}
                                    >
                                        {project.name}
                                    </h3>
                                    <p className={cn(
                                        "text-[14px] leading-relaxed text-muted-foreground max-w-sm line-clamp-2 italic font-medium",
                                        isEven ? "md:ml-auto" : "md:mr-auto"
                                    )}>
                                        &quot;{project.notes}&quot;
                                    </p>
                                    <div className={cn(
                                        "flex items-center gap-4 text-[10px] font-mono tracking-[0.3em] text-muted-foreground",
                                        isEven ? "md:justify-end" : "md:justify-start"
                                    )}>
                                        X-HASH: {project.id.toUpperCase()}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 py-12 border-t border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/5 border border-white/5 disabled:opacity-5 transition-all italic"
                    >
                        Rewind
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Seq</span>
                        <span className="text-xl font-black italic text-white leading-none">{currentPage}</span>
                        <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.2em]">/ {totalPages}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/5 border border-white/5 disabled:opacity-5 transition-all italic"
                    >
                        Forward
                    </Button>
                </div>
            )}
        </div>
    );
}
