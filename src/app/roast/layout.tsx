'use client';

import { RoastProvider } from "@/context/roast-context";
import { ReactNode } from "react";

export default function RoastLayout({ children }: { children: ReactNode }) {
    return (
        <RoastProvider>
            <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
                {children}
            </div>
        </RoastProvider>
    );
}
