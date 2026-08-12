import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Check, X, Filter, Loader2, ClipboardX, User, SearchX } from 'lucide-react';

const ManageLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');

    useEffect(() => { fetchLeaves(); }, [filter]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const params = filter ? { status: filter } : {};
            const { data } = await api.get('/leaves', { params });
            setLeaves(data.data.leaves || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const handleAction = async (id, action) => {
        try {
            await api.patch(`/leaves/${id}/${action}`);
            fetchLeaves();
        } catch { /* ignore */ }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-warning/10 text-warning border border-border',
            APPROVED: 'bg-success/10 text-success',
            REJECTED: 'bg-error/10 text-error border border-border/50'
        };
        return (
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${styles[status] || styles.PENDING}`}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Manage Leaves</h1>
                <p className="text-[15px] text-dim">Review and respond to team leave requests</p>
            </div>

            <div className="card flex flex-wrap items-center gap-2 p-2">
                {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
                    <button 
                        key={s} 
                        className={`
                            px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold tracking-wide transition-all touch-manipulation
                            ${filter === s 
                                ? 'bg-accent text-accent-fg' 
                                : 'text-dim hover:text-foreground hover:bg-secondary'}
                        `}
                        onClick={() => setFilter(s)}
                    >
                        {s ? s.charAt(0) + s.slice(1).toLowerCase() : 'All'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-dim gap-4">
                    <Loader2 size={32} className="animate-spin opacity-50" />
                    <p className="text-[15px] font-medium animate-pulse">Loading requests...</p>
                </div>
            ) : leaves.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-border/60">
                    <div className="p-4 rounded-full bg-secondary mb-4">
                        <SearchX size={32} className="text-muted" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight">No leave requests</h3>
                    <p className="text-[15px] text-dim mt-2 max-w-[300px] leading-relaxed">There are no leave requests to review at this time.</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/30 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Employee</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle hidden md:table-cell">Leave Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Dates</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle hidden md:table-cell">Reason</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {leaves.map((l) => (
                                    <tr key={l._id} className="hover:bg-raised transition-colors duration-200 group">
                                        <td className="px-6 py-4 text-[15px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-dim">
                                                    {l.userId?.name?.substring(0, 2) || '—'}
                                                </div>
                                                <span className="font-medium text-foreground">{l.userId?.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-xs font-semibold text-subtle tracking-wide">{l.leaveType?.charAt(0) + l.leaveType?.slice(1).toLowerCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-medium text-foreground">{l.startDate}</span>
                                                <span className="text-xs text-muted font-bold">to {l.endDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-[15px] text-dim max-w-[200px] truncate" title={l.reason}>
                                                {l.reason}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(l.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {l.status === 'PENDING' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        className="p-2.5 bg-accent text-accent-fg rounded-lg hover:bg-accent-hover transition-all touch-manipulation active:scale-95" 
                                                        onClick={() => handleAction(l._id, 'approve')}
                                                        title="Approve"
                                                        aria-label="Approve leave"
                                                    >
                                                        <Check size={15} strokeWidth={3} />
                                                    </button>
                                                    <button 
                                                        className="p-2.5 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-all border border-error/20 touch-manipulation active:scale-95" 
                                                        onClick={() => handleAction(l._id, 'reject')}
                                                        title="Reject"
                                                        aria-label="Reject leave"
                                                    >
                                                        <X size={15} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted font-bold opacity-50">Done</span>
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

export default ManageLeaves;
