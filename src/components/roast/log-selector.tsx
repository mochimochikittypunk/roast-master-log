'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRoast } from '@/context/roast-context';
import { FileClock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface LogSummary {
    id: number;
    date: string;
    title: string;
    weight: string;
    duration: string;
    dtr: string;
}

export const LogSelector = ({ compact = false }: { compact?: boolean }) => {
    const { setReferenceData } = useRoast();
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<LogSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Fetch list when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchLogs();
        }
    }, [isOpen]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/roast/list');
            const data = await res.json();
            if (data.logs) {
                // Sort by date desc
                setLogs(data.logs.reverse());
            }
        } catch (e) {
            console.error("Failed to list logs", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (id: number) => {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/roast/get?index=${id}`);
            const data = await res.json();

            if (data.dataPoints) {
                setReferenceData(data.dataPoints);
                setIsOpen(false);
            }
        } catch (e) {
            console.error("Failed to load roast", e);
            alert("Failed to load roast data");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size={compact ? "sm" : "default"}
                    className={`border-slate-700 hover:bg-slate-800 text-slate-400 ${compact ? 'h-8 text-xs px-2 w-full justify-center' : ''}`}
                >
                    <FileClock className={`${compact ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} /> Compare
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-800">
                <DialogHeader>
                    <DialogTitle>Load Reference Log</DialogTitle>
                </DialogHeader>

                {loading && <div className="text-center py-4"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>}

                <div className="space-y-2 mt-4">
                    {logs.map(log => (
                        <div key={log.id} className="flex items-center justify-between p-3 rounded bg-slate-950 border border-slate-800 hover:bg-slate-900 transition-colors">
                            <div>
                                <div className="font-bold text-slate-200">{log.title || 'Untitled'}</div>
                                <div className="text-xs text-slate-500">
                                    {format(new Date(log.date), 'yyyy-MM-dd HH:mm')} | {log.weight}g | {Math.floor(Number(log.duration) / 60)}:{String(Number(log.duration) % 60).padStart(2, '0')} | DTR {Number(log.dtr).toFixed(1)}%
                                </div>
                            </div>
                            <Button
                                onClick={() => handleSelect(log.id)}
                                variant="secondary"
                                disabled={loadingId === log.id}
                                className="bg-slate-800 text-slate-200 hover:bg-slate-700"
                            >
                                {loadingId === log.id ? <Loader2 className="animate-spin h-4 w-4" /> : 'Load'}
                            </Button>
                        </div>
                    ))}
                    {!loading && logs.length === 0 && (
                        <div className="text-center text-slate-500 py-8">No saved logs found.</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
