"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Plus, Trash2 } from "lucide-react";
import { PROJECTS as MOCK_PROJECTS, type Project } from "@/lib/data";

export default function AdminPage() {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [newProject, setNewProject] = useState<Partial<Project>>({
        name: "",
        logo: "",
        network: "Ethereum",
        category: "DeFi",
        launchDate: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const handleAdd = () => {
        if (!newProject.name || !newProject.logo) return;
        const project: Project = {
            ...newProject as Project,
            id: `proj-${Date.now()}`,
        };
        setProjects([project, ...projects]);
        setNewProject({
            name: "",
            logo: "",
            network: "Ethereum",
            category: "DeFi",
            launchDate: new Date().toISOString().split("T")[0],
            notes: "",
        });
    };

    const handleDelete = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h1 className="text-2xl font-black italic uppercase tracking-wider text-white">Registry Control</h1>
                    </div>
                    <p className="text-xs font-mono text-white/30 uppercase tracking-tight">Administrative override / Temporal data curation</p>
                </div>
                <Badge variant="outline" className="h-6 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest italic px-3">
                    Authorized Access
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form */}
                <div className="lg:col-span-1 space-y-6 glass-premium p-8 rounded-[32px] border border-white/5">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
                        <Plus className="h-3 w-3" /> New Entry
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Project Name</label>
                            <Input
                                value={newProject.name}
                                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                placeholder="e.g. Nexus Protocol"
                                className="h-10 text-[11px] bg-white/[0.02] border-white/5 rounded-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Symbol (Logo)</label>
                            <Input
                                value={newProject.logo}
                                onChange={e => setNewProject({ ...newProject, logo: e.target.value })}
                                placeholder="e.g. NX"
                                className="h-10 text-[11px] bg-white/[0.02] border-white/5 rounded-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Network</label>
                            <Input
                                value={newProject.network}
                                onChange={e => setNewProject({ ...newProject, network: e.target.value })}
                                placeholder="e.g. Ethereum"
                                className="h-10 text-[11px] bg-white/[0.02] border-white/5 rounded-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Launch date</label>
                            <Input
                                type="date"
                                value={newProject.launchDate}
                                onChange={e => setNewProject({ ...newProject, launchDate: e.target.value })}
                                className="h-10 text-[11px] bg-white/[0.02] border-white/5 rounded-xl"
                            />
                        </div>
                        <Button
                            onClick={handleAdd}
                            className="w-full h-11 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90 transition-all mt-4"
                        >
                            Commit to Archive
                        </Button>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-4 px-2">Active Registry</h2>
                    <div className="space-y-2">
                        {projects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-white/60">
                                        {project.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black text-white uppercase tracking-wider">{project.name}</h3>
                                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-tight">{project.network} • {project.category}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(project.id)}
                                    className="h-9 w-9 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
