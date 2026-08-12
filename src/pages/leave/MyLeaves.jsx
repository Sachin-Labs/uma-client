import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Calendar, AlertCircle, CheckCircle2, X, Loader2, ClipboardList, Info } from 'lucide-react';

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/leaves/my');
            setLeaves(data.data.leaves || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/leaves', form);
            setSuccess('Leave applied successfully!');
            setShowForm(false);
            setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply');
        }
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">My Leaves</h1>
                    <p className="text-[15px] text-dim font-medium">View your leave history or apply for time-off</p>
                </div>
                <button 
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-accent-fg text-sm font-bold rounded-md hover:bg-accent-hover transition-all active:scale-95" 
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} strokeWidth={3} />
                    Apply Leave
                </button>
            </div>

            {success && (
                <div className="flex items-center gap-3 p-4 bg-success/10 text-success rounded-lg text-sm font-bold animate-in slide-in-from-top-2">
                    <CheckCircle2 size={18} />
                    <span className="tracking-wide text-xs">{success}</span>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="card w-full max-w-md animate-in zoom-in-95 duration-300 relative max-h-[92vh] overflow-y-auto">
                        <button 
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary text-dim hover:text-foreground transition-colors"
                            onClick={() => setShowForm(false)}
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="space-y-1 mb-8">
                            <h3 className="text-xl font-bold tracking-tight">Apply for Leave</h3>
                            <p className="text-xs text-dim italic">Provide your leave details and reason</p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-lg text-xs text-foreground mb-6">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold tracking-wide text-muted ml-1">Leave Type</label>
                                <select 
                                    className="form-select text-sm h-[42px]" 
                                    value={form.leaveType}
                                    onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                                >
                                    <option value="CASUAL">Casual Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="PAID">Paid Leave</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wide text-subtle ml-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="form-input text-sm h-[42px]" 
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wide text-subtle ml-1">End Date</label>
                                    <input 
                                        type="date" 
                                        className="form-input text-sm h-[42px]" 
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold tracking-wide text-muted ml-1">Reason</label>
                                <textarea 
                                    className="form-input text-sm min-h-[100px] py-3" 
                                    placeholder="Briefly explain your reason for leave..."
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })} 
                                    required 
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-border/50">
                                <button 
                                    type="button" 
                                    className="flex-1 py-3 px-4 border border-border text-sm font-semibold tracking-wide text-dim hover:text-foreground hover:bg-secondary rounded-lg transition-all" 
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 px-4 bg-accent text-accent-fg text-sm font-semibold tracking-wide rounded-lg hover:bg-accent-hover transition-all"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-dim gap-4">
                    <Loader2 size={32} className="animate-spin opacity-50" />
                    <p className="text-[15px] font-medium animate-pulse">Loading your leaves...</p>
                </div>
            ) : leaves.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 border-border/60">
                    <div className="p-4 rounded-full bg-secondary mb-4">
                        <ClipboardList size={32} className="text-muted" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight">No leave records found</h3>
                    <p className="text-[15px] text-dim mt-2 max-w-[300px] leading-relaxed">You haven't applied for any leave yet. Your history will appear here once you make a request.</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/30 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Dates</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle hidden md:table-cell">Reason</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {leaves.map((l) => (
                                    <tr key={l._id} className="hover:bg-raised transition-colors duration-200 group">
                                        <td className="px-6 py-4">
                                            <span className="text-[15px] font-bold text-foreground flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                                                {l.leaveType?.charAt(0) + l.leaveType?.slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-medium text-foreground">{l.startDate}</span>
                                                <span className="text-xs text-muted font-semibold tracking-wide">to {l.endDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-[15px] text-dim max-w-xs truncate" title={l.reason}>
                                                {l.reason}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(l.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2.5 text-muted hover:text-foreground hover:bg-raised rounded-lg transition-colors touch-manipulation opacity-100 md:opacity-0 md:group-hover:opacity-100" aria-label={`View ${l.leaveType} details`}>
                                                <Info size={16} />
                                            </button>
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

export default MyLeaves;
