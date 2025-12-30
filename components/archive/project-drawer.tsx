"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Twitter, Clock, Fingerprint } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Project } from "@/lib/data";

interface ProjectDrawerProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] border-l border-border/40 glass-premium shadow-2xl overflow-hidden"
                    >
                        <div className="flex h-full flex-col">
                            <div className="flex items-center justify-between p-10 border-b border-border/20">
                                <div className="flex items-center gap-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted border border-border/40 text-[18px] font-black text-foreground shadow-2xl">
                                        {project.logo}
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black tracking-tighter text-foreground italic">{project.name}</h2>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-3 italic">
                                                Registry Valid
                                            </Badge>
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">v2.0.ARCHIVE</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="h-12 w-12 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-16">
                                <div className="space-y-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Temporal Metadata</h3>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-3 p-6 rounded-3xl bg-muted/30 border border-border">
                                            <p className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                                                <Clock className="h-3.5 w-3.5" /> Launch Date
                                            </p>
                                            <p className="text-[15px] font-black text-foreground italic">
                                                {format(new Date(project.launchDate), "MMMM dd, yyyy")}
                                            </p>
                                        </div>
                                        <div className="space-y-3 p-6 rounded-3xl bg-muted/30 border border-border">
                                            <p className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                                                <Fingerprint className="h-3.5 w-3.5" /> Network
                                            </p>
                                            <p className="text-[15px] font-black text-foreground italic">{project.network}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Protocol Notes</h3>
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />
                                        <p className="text-[16px] leading-[1.8] text-muted-foreground italic font-medium">
                                            &quot;{project.notes}&quot;
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Official Links</h3>
                                    <div className="flex gap-4">
                                        {project.twitterUrl && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl border-border bg-muted/30 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all gap-3 italic text-muted-foreground"
                                                onClick={() => window.open(project.twitterUrl, "_blank")}
                                            >
                                                <Twitter className="h-4 w-4" /> Twitter
                                            </Button>
                                        )}
                                        {project.telegramUrl && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl border-border bg-muted/30 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all gap-3 italic text-muted-foreground"
                                                onClick={() => window.open(project.telegramUrl, "_blank")}
                                            >
                                                <Globe className="h-4 w-4" /> Telegram
                                            </Button>
                                        )}
                                        {/* Fallback or specific Website button if needed, but reusing Globe for Telegram per user request or standard Website? User asked for Twitter/Telegram icon on bottom. Here it's for the project. Keeping it generic if no specific fields, but assuming we want to use the fields we just added. */}
                                        {project.websiteUrl && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl border-border bg-muted/30 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all gap-3 italic text-muted-foreground"
                                                onClick={() => window.open(project.websiteUrl, "_blank")}
                                            >
                                                <Globe className="h-4 w-4" /> Website
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-t border-border">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic line-clamp-1">Archive ID: {project.id}</span>
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase mt-1 font-bold">Status: DEEP_STORAGE_STABLE</span>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
