"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Project } from "@/lib/data";

interface ListViewProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export function ListView({ projects, onProjectClick }: ListViewProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(projects.length / itemsPerPage);

    const paginatedProjects = projects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border/40">
                            <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Project</th>
                            <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                            <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network</th>
                            <th className="text-right py-6 px-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Launch Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {paginatedProjects.map((project) => (
                            <tr
                                key={project.id}
                                onClick={() => onProjectClick(project)}
                                className="group cursor-pointer hover:bg-muted/30 transition-all duration-500"
                            >
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-5">
                                        <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-muted border border-border/40 text-[11px] font-black text-foreground shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50">
                                            {project.logo}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{project.name}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mt-0.5">{project.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4">
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.3em] bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-3 py-1 italic">
                                        Valid
                                    </Badge>
                                </td>
                                <td className="py-6 px-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground italic">{project.network}</span>
                                </td>
                                <td className="py-6 px-4 text-right">
                                    <p className="text-[12px] font-black text-foreground italic">{format(new Date(project.launchDate), "MMM dd, yyyy")}</p>
                                    <p className="text-[9px] font-mono text-muted-foreground/20 uppercase tracking-tighter mt-1">{project.id.slice(0, 16).toUpperCase()}...</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-12 border-t border-border/20">
                    <p className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, projects.length)} of {projects.length}
                    </p>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="h-10 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground hover:bg-muted border border-border/40 disabled:opacity-5 transition-all italic"
                        >
                            Prev Phase
                        </Button>
                        <div className="flex items-center gap-3 px-4">
                            <span className="text-lg font-black italic text-foreground">{currentPage}</span>
                            <span className="text-[9px] font-mono text-muted-foreground/20 uppercase">/ {totalPages}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="h-10 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground hover:bg-muted border border-border/40 disabled:opacity-5 transition-all italic"
                        >
                            Next Phase
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
