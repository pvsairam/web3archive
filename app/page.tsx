"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CalendarGrid } from "@/components/archive/calendar-grid";
import { ProjectDrawer } from "@/components/archive/project-drawer";
import { ViewToggle, type ViewMode } from "@/components/archive/view-toggle";
import { type Project } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, Pencil, Trash2 } from "lucide-react";
import { PROJECTS as INITIAL_PROJECTS } from "@/lib/data";
import { TimelineView } from "@/components/archive/timeline-view";
import { ListView } from "@/components/archive/list-view";
import { useSearchParams } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";

import { useArchive } from "@/context/archive-context";
import { format } from "date-fns";

function ArchiveContent() {
  // Sync view from URL or default to calendar
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view") as ViewMode;
  const [view, setView] = useState<ViewMode>(viewParam || "calendar");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { viewedDate, setViewedDate } = useArchive();
  const searchQuery = searchParams.get("q") || "";

  // Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminLogin = () => {
    if (adminPassword === SITE_CONFIG.admin.password) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect Password");
      setAdminPassword("");
    }
  };

  // Update URL when view changes via Toggle
  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  // Sync internal state when URL changes (e.g. Back button)
  React.useEffect(() => {
    // If viewParam is present, use it. If not, default to "calendar" (Registry).
    // This fixes the bug where clicking "Archive" (which has no params) didn't reset the view.
    if (viewParam !== view) {
      setView(viewParam || "calendar");
    }
  }, [viewParam, view]);

  // Client-side hydration
  const [isClient, setIsClient] = useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // -- Admin State Logic --
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", symbol: "", network: "", category: "", status: "Active", date: "", github: "", medium: "", farcaster: "", base: ""
  });

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      symbol: project.logo,
      network: project.network,
      category: project.category,
      status: project.status || "Active",
      date: project.launchDate ? format(new Date(project.launchDate), "yyyy-MM-dd") : "",
      github: project.githubUrl || "",
      medium: project.mediumUrl || "",
      farcaster: project.farcasterUrl || "",
      base: project.baseUrl || ""
    });
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this archive entry?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", symbol: "", network: "", category: "", status: "Active", date: "", github: "", medium: "", farcaster: "", base: "" });
  };

  const handleCommit = () => {
    if (!formData.name || !formData.symbol) return alert("Project Name and Symbol are required.");

    const newEntry: Project = {
      id: editingId || `manual-${Date.now()}`,
      name: formData.name,
      logo: formData.symbol,
      category: formData.category || "Infrastructure", // Use manual category
      launchDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      network: formData.network || "Ethereum",
      notes: "Manual Entry",
      verificationStatus: "Verified",
      status: (formData.status as "Active" | "Rugged" | "Hacked" | "Scam" | "Inactive") || "Active",
      githubUrl: formData.github || "#",
      mediumUrl: formData.medium || "#",
      farcasterUrl: formData.farcaster || "#",
      baseUrl: formData.base || "#"
    };

    if (editingId) {
      setProjects(prev => prev.map(p => p.id === editingId ? { ...newEntry, id: editingId } : p));
    } else {
      setProjects(prev => [newEntry, ...prev]);
    }

    resetForm();
    alert(editingId ? "Entry Updated Successfully" : "Entry Added to Archive");
  };

  // Filter projects logic (using local state projects instead of initial)
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.logo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, projects]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleDayClick = (projects: Project[], date: Date) => {
    setSelectedDate(date);
    // Logic: if multiple projects, maybe show list? For now just log or no-op if handled by calendar grid's internal list
    // Actually CalendarGrid handles click on individual projects.
    // Clicking empty space on a day could maybe create new entry if admin?
  };

  return (
    <div className="max-w-[1500px] mx-auto px-8 md:px-16 py-16 space-y-24">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* View Controls & Header */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-16">
        <div className="space-y-8 flex-1">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-[0.4em] bg-muted/30 px-3 h-6 border-border/40 text-muted-foreground italic">
              Temporal Registry
            </Badge>
            <div className="h-[1px] w-12 bg-border" />
            <span className="text-[10px] text-muted-foreground font-mono tracking-[0.2em] uppercase italic font-bold">
              Node {format(viewedDate, "yyyy")}/HISTORIC.ALPHA
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-[-0.04em] leading-[0.9] text-foreground italic">
              Historical <span className="text-muted-foreground">Archive</span>
            </h1>
            <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed font-medium tracking-tight">
              The authoritative record of cryptographic innovation. Every entry validated against blockdata and protocol genesis events across the multi-chain ecosystem.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <span className="text-[9px] font-black tracking-[0.3em] text-muted-foreground uppercase">Temporal Epoch Control</span>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min="2020"
                max="2040"
                value={viewedDate.getFullYear()}
                onChange={(e) => setViewedDate(new Date(parseInt(e.target.value), viewedDate.getMonth(), viewedDate.getDate()))}
                className="w-48 h-1 bg-muted-foreground rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
              />
              <span className="text-2xl font-black italic text-foreground min-w-[80px] text-center tracking-tighter">
                {format(viewedDate, "yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 xl:pb-2">
          <ViewToggle currentView={view} onViewChange={handleViewChange} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >

        {/* Main Content Area */}
        {view === "calendar" && (
          <CalendarGrid
            projects={filteredProjects}
            onDayClick={handleDayClick}
            selectedDate={selectedDate}
            onProjectClick={handleProjectClick}
          />
        )}

        {view === "timeline" && (
          <TimelineView
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        )}
        {view === "list" && (
          <ListView
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        )}
        {view === "contact" && (
          <div className="flex flex-col items-center justify-center py-20 space-y-12 text-center">
            <div className="space-y-4 max-w-lg">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-foreground">Get In Touch</h2>
              <p className="text-muted-foreground font-medium text-lg">
                Have a question or want to list your project? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
              <Button
                variant="outline"
                className="flex-1 h-16 text-lg rounded-2xl border-border bg-muted/30 font-black uppercase tracking-widest hover:bg-[#1DA1F2] hover:text-white hover:border-transparent transition-all gap-3 italic text-muted-foreground"
                onClick={() => window.open(SITE_CONFIG.socials.twitter, "_blank")}
              >
                <Twitter className="h-5 w-5" /> Twitter
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-16 text-lg rounded-2xl border-border bg-muted/30 font-black uppercase tracking-widest hover:bg-[#229ED9] hover:text-white hover:border-transparent transition-all gap-3 italic text-muted-foreground"
                onClick={() => window.open(SITE_CONFIG.socials.telegram, "_blank")}
              >
                <Globe className="h-5 w-5" /> Telegram
              </Button>
            </div>
          </div>
        )}
        {view === "admin" && (
          <div className="flex flex-col items-center justify-center py-12 w-full max-w-2xl mx-auto">
            {!isAuthenticated ? (
              <div
                className="w-full space-y-8 p-12 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-2xl"
                style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic text-zinc-900 dark:text-white">Admin Login</h2>
                  <p className="text-zinc-600 dark:text-zinc-300 font-mono text-xs tracking-widest uppercase">Please verify your credentials</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300 ml-2">Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full h-14 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-2xl px-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-center tracking-widest text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all font-bold"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <Button
                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] shadow-lg"
                    onClick={handleAdminLogin}
                  >
                    Log In
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic text-foreground">Registry Control <span className="text-xs text-muted-foreground not-italic border border-border px-2 py-1 rounded-md ml-2">v4.2.0</span></h2>
                    <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Administrative Override / Temporal Data Curation</p>
                  </div>
                  <div className="h-8 px-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Authorized
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  {/* Data Entry Form - Redesigned */}
                  <div
                    className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                  >

                    {/* Form Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                          {editingId ? "Update Entry" : "New Entry"}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-1">
                          {editingId ? "Modify existing project details" : "Add a new project to the archive"}
                        </p>
                      </div>
                      {editingId && (
                        <Button
                          variant="ghost"
                          onClick={resetForm}
                          className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>

                    {/* Section: Project Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
                          Project Information
                        </span>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Project Name */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                            Project Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            style={{
                              backgroundColor: 'hsl(var(--muted))',
                              color: 'hsl(var(--foreground))'
                            }}
                            placeholder="e.g. Nexus Protocol"
                          />
                        </div>

                        {/* Symbol */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Symbol <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="e.g. NX"
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Category
                          </label>
                          <input
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="e.g. DeFi, AI, RWA"
                          />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all appearance-none
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                          >
                            <option value="Active">Active</option>
                            <option value="Rugged">Rugged</option>
                            <option value="Hacked">Hacked</option>
                            <option value="Scam">Scam</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        {/* Network */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Network
                          </label>
                          <input
                            value={formData.network}
                            onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="Ethereum"
                          />
                        </div>

                        {/* Launch Date */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Launch Date
                          </label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Social Links */}
                    <div className="space-y-6 mt-8">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
                          Social Links
                        </span>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* GitHub */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            GitHub
                          </label>
                          <input
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="https://github.com/..."
                          />
                        </div>

                        {/* Medium */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Medium
                          </label>
                          <input
                            value={formData.medium}
                            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="https://medium.com/@..."
                          />
                        </div>

                        {/* Farcaster */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Farcaster
                          </label>
                          <input
                            value={formData.farcaster}
                            onChange={(e) => setFormData({ ...formData, farcaster: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="@username"
                          />
                        </div>

                        {/* Base Profile */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Base Profile
                          </label>
                          <input
                            value={formData.base}
                            onChange={(e) => setFormData({ ...formData, base: e.target.value })}
                            className="w-full h-11 rounded-lg px-4 text-sm font-medium transition-all
                              bg-zinc-50 dark:bg-zinc-900 
                              text-zinc-900 dark:text-zinc-100
                              border border-zinc-300 dark:border-zinc-600
                              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            placeholder="base.org/name/..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <Button
                        className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl"
                        onClick={handleCommit}
                      >
                        {editingId ? "Update Project" : "Add to Archive"}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Records List */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-muted-foreground/60 italic pl-4">Existing Records</h3>
                    <div className="grid gap-4">
                      {projects.map((project) => (
                        <div key={project.id} className="group flex items-center justify-between p-6 rounded-[24px] bg-white dark:bg-card border border-zinc-200 dark:border-border/40 hover:border-primary/50 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-secondary flex items-center justify-center font-black italic text-sm text-black dark:text-foreground">
                              {project.logo}
                            </div>
                            <div>
                              <div className="font-black italic text-lg text-black dark:text-foreground">
                                {project.name}
                                {project.status && project.status !== "Active" && (
                                  <span className="ml-2 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                    {project.status}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono tracking-widest text-zinc-600 dark:text-muted-foreground uppercase">{project.launchDate ? format(new Date(project.launchDate), "MMM dd, yyyy") : "TBA"} • {project.category} • {project.network}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-zinc-500 hover:text-primary rounded-xl" onClick={() => handleEdit(project)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-zinc-500 hover:text-destructive rounded-xl" onClick={() => handleDelete(project.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <ProjectDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Simple Footer */}
      <div className="pt-16 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
              Archive Registry v4.0.0
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href={SITE_CONFIG.socials.twitter} className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href={SITE_CONFIG.socials.telegram} className="text-muted-foreground hover:text-primary transition-colors"><Globe className="h-4 w-4" /></a> {/* Using Globe as placeholder for Telegram if generic icon not avail, or just text? Lucide has no Telegram. Using generic. */}
          </div>
        </div>

        <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.1em]">
          <span>
            Last Sync: {isClient ? format(new Date(), "yyyy.MM.dd HH:mm") : "----.--.-- --:--"} UTC
          </span>
        </div>
      </div>
    </div >
  );
}

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading Registry...</div>}>
      <ArchiveContent />
    </Suspense>
  );
}
