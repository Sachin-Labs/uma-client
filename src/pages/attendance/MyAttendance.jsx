import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
    Filter, 
    Search, 
    CalendarOff, 
    Loader2,
    Calendar,
    Clock,
    UserCheck,
    SearchX,
    ArrowRightCircle
} from 'lucide-react';

const MyAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });

    useEffect(() => { fetchRecords(); }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/attendance/my', { params: filters });
            setRecords(data.data.records || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const getStatusBadge = (status) => {
        const styles = {
            PRESENT: 'bg-success/10 text-success',
            LATE: 'bg-warning/10 text-warning border border-border',
            ABSENT: 'bg-error/10 text-error',
            HALF_DAY: 'bg-warning/10 text-warning border border-warning/30 border-dashed'
        };
        return (
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${styles[status] || styles.PRESENT}`}>
                {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1 border-b border-border pb-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Personal Attendance
                    <UserCheck className="text-dim opacity-30" size={20} />
                </h1>
                <p className="text-[15px] text-dim font-medium">View and filter your history</p>
            </div>

            <div className="card bg-secondary/10 border-border/40 p-4">
                <div className="flex flex-wrap items-end gap-6">
                    <div className="flex-1 min-w-[160px] space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-muted ml-1 flex items-center gap-2">
                            <Calendar size={12} /> Start Date
                        </label>
                        <input 
                            type="date" 
                            className="form-input text-xs h-[42px] bg-background" 
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} 
                        />
                    </div>
                    <div className="flex-1 min-w-[160px] space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-muted ml-1 flex items-center gap-2">
                            <Calendar size={12} /> End Date
                        </label>
                        <input 
                            type="date" 
                            className="form-input text-xs h-[42px] bg-background" 
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} 
                        />
                    </div>
                    <button 
                        className="flex items-center justify-center gap-3 h-[42px] px-8 bg-accent text-accent-fg text-xs font-semibold tracking-wide rounded-lg hover:bg-accent-hover transition-all active:scale-[0.98]" 
                        onClick={fetchRecords}
                    >
                        <Filter size={14} strokeWidth={3} />
                        Filter Data
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-dim gap-6">
                    <Loader2 size={40} className="animate-spin text-muted opacity-40" />
                    <p className="text-xs font-semibold tracking-wide animate-pulse text-center">Loading records...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-border/60">
                    <div className="p-6 rounded-full bg-secondary mb-6">
                        <CalendarOff size={40} className="text-muted opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">No Records Found</h3>
                    <p className="text-sm text-dim mt-2 max-w-[300px] italic">You haven't marked attendance for these dates.</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/40 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Check In</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Check Out</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle hidden md:table-cell">Location</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-right">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {records.map((r) => (
                                    <tr key={r._id} className="hover:bg-raised transition-colors duration-200 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-foreground opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                                                <span className="text-sm font-bold text-foreground">{r.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="px-3 py-1.5 rounded bg-secondary/20 border border-border/40 text-xs font-mono font-bold text-foreground w-fit">
                                                {new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-mono font-bold text-dim">
                                                {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold border border-border text-subtle transition-all tracking-wide">
                                                {r.workType?.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                                        <td className="px-6 py-4 text-sm font-black text-foreground tracking-tighter text-right">
                                            {r.totalWorkingMinutes ? `${Math.floor(r.totalWorkingMinutes / 60)}h ${r.totalWorkingMinutes % 60}m` : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAttendance;
