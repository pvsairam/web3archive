"use client";

import React from "react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useArchive } from "@/context/archive-context";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
    const { viewedDate } = useArchive();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = React.useState(searchParams.get("q") || "");

    React.useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const currentQ = params.get("q") || "";

            if (searchTerm === currentQ) return;

            if (searchTerm) {
                params.set("q", searchTerm);
            } else {
                params.delete("q");
            }

            const queryString = params.toString();
            const query = queryString ? `?${queryString}` : "/";
            router.replace(query, { scroll: false });
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm, router]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/40 px-12 transition-all glass-premium">
            <div className="flex flex-1 items-center">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
                    <Input
                        type="search"
                        placeholder={`Query the ${format(viewedDate, "yyyy")} temporal ledger...`}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="h-11 w-full rounded-2xl border-border bg-muted/20 pl-12 pr-6 text-[11px] font-medium tracking-tight transition-all focus-visible:bg-muted/30 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <ModeToggle />
                <div className="flex items-center gap-3">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] italic font-bold">Archive Active</span>
                </div>
            </div>
        </header>
    );
}
