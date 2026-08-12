import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Users2,
    Filter,
    Loader2,
    SearchX,
    CheckCircle,
    XCircle,
    MapPin,
    Building2,
    Calendar,
    Clock,
    History,
    Search
} from 'lucide-react';

const ManageAttendance = () => {
    const [records, setRecords] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', teamId: '' });

    useEffect(() => {
        fetchTeams();
        fetchRecords();
    }, []);

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/teams');
            setTeams(data.data || []);
        } catch { /* ignore */ }
    };

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/attendance', { params: filters });
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
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${styles[status] || styles.PRESENT}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col gap-1 border-b border-border pb-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Attendance History
                    <History className="text-dim opacity-30" size={20} />
                </h1>
                <p className="text-[15px] text-dim font-medium">View and manage all employee attendance records</p>
            </div>

            <div className="card bg-secondary/10 p-4 border-border/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-6">
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-muted ml-1 flex items-center gap-2">
                            <Building2 size={12} /> Filter by Team
                        </label>
                        <select
                            className="form-select text-xs h-[42px] font-bold bg-background"
                            value={filters.teamId}
                            onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
                        >
                            <option value="">All Teams</option>
                            {teams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>
                    <button
                        className="flex items-center justify-center gap-3 h-[42px] px-8 bg-accent text-accent-fg text-xs font-semibold uppercase tracking-wide rounded-lg hover:bg-accent-hover transition-all active:scale-[0.98]"
                        onClick={fetchRecords}
                    >
                        <Search size={14} strokeWidth={3} />
                        Apply Filters
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-dim gap-6">
                    <div className="relative">
                        <Loader2 size={40} className="animate-spin text-muted opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase tracking-tighter">IO</div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Loading records...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-border/60">
                    <div className="p-6 rounded-full bg-secondary mb-6">
                        <SearchX size={40} className="text-muted" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight">No records found</h3>
                    <p className="text-[15px] text-dim mt-2 max-w-[300px] leading-relaxed">No attendance records found for the selected dates and team.</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden border-border/50 hover:border-border transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/40 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Employee</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle hidden md:table-cell">Team</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-center">In / Out</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-right">Duration</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-center hidden md:table-cell">Map</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {records.map((r) => (
                                    <tr key={r._id} className="hover:bg-raised transition-colors duration-200 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold group-hover:scale-110 transition-transform">
                                                    {r.userId?.name?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[15px] font-bold text-foreground">{r.userId?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-subtle font-medium">{r.workType}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/30 rounded border border-border/40 w-fit">
                                                <Building2 size={10} className="text-dim" />
                                                <span className="text-xs font-semibold text-foreground tracking-wide">{r.teamId?.name || 'Standby'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-dim flex items-center gap-1.5">
                                                {r.date}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/20 border border-border/30 group-hover:border-foreground/30 transition-colors">
                                                <span className="text-xs font-bold text-foreground">
                                                    {new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </span>
                                                <div className="w-full h-px bg-border my-1 opacity-40 shrink-0" />
                                                <span className="text-xs font-semibold text-subtle">
                                                    {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                                        <td className="px-6 py-4 text-sm font-black text-foreground tracking-tighter text-right">
                                            {r.totalWorkingMinutes ? `${Math.floor(r.totalWorkingMinutes / 60)}h ${r.totalWorkingMinutes % 60}m` : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center hidden md:table-cell">
                                            {r.locationValidated ? (
                                                <div className="w-8 h-8 rounded-full bg-foreground text-background inline-flex items-center justify-center group-hover:animate-bounce">
                                                    <MapPin size={14} strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-secondary text-muted inline-flex items-center justify-center border border-border opacity-40">
                                                    <XCircle size={14} />
                                                </div>
                                            )}
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

export default ManageAttendance;
