
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ArchiveContextType {
    viewedDate: Date;
    setViewedDate: (date: Date) => void;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export function ArchiveProvider({ children }: { children: ReactNode }) {
    // Default to January 2026 as the starting point of the archive
    const [viewedDate, setViewedDate] = useState<Date>(new Date(2026, 0, 1));

    const value = React.useMemo(() => ({ viewedDate, setViewedDate }), [viewedDate, setViewedDate]);

    return (
        <ArchiveContext.Provider value={value}>
            {children}
        </ArchiveContext.Provider>
    );
}

export function useArchive() {
    const context = useContext(ArchiveContext);
    if (context === undefined) {
        throw new Error("useArchive must be used within an ArchiveProvider");
    }
    return context;
}
