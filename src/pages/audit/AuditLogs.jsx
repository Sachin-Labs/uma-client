import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Loader2,
    History,
    AlertCircle
} from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const pageSize = 25;

    useEffect(() => { fetchLogs(); }, [page, action]);

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const params = { page, limit: pageSize };
            if (action) params.action = action;
            const { data } = await api.get('/audit-logs', { params });
            setLogs(data.data.logs || []);
            setTotal(data.data.total || 0);
            setTotalPages(data.data.totalPages || 1);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load audit logs');
        }
        setLoading(false);
    };

    const actions = [...new Set(logs.map((l) => l.action))].sort();

    const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        Audit Logs
                        <History className="text-dim opacity-40 shrink-0" size={20} />
                    </h1>
                    <p className="text-[15px] text-dim font-medium">A trail of all actions taken across the organisation</p>
                </div>
                <select
                    className="form-select text-sm h-[42px] w-fit"
                    value={action}
                    onChange={(e) => { setAction(e.target.value); setPage(1); }}
                >
                    <option value="">All actions</option>
                    {actions.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>

            {(error) && (
                <div className="p-4 rounded-lg flex items-center gap-3 text-xs font-semibold tracking-wide bg-secondary/20 text-foreground border border-border">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="card p-0 overflow-hidden border-border/60">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 size={28} className="animate-spin text-muted" />
                        <p className="text-xs font-medium tracking-wide text-dim">Loading audit logs...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-24 text-center">
                        <History size={36} className="mx-auto mb-4 text-muted opacity-30" />
                        <p className="text-sm text-muted font-medium">No audit logs found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border/60 text-[11px] font-bold uppercase tracking-wide text-muted">
                                    <th className="px-5 py-3">Timestamp</th>
                                    <th className="px-5 py-3">Action</th>
                                    <th className="px-5 py-3">Entity</th>
                                    <th className="px-5 py-3">Performed By</th>
                                    <th className="px-5 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-raised/50 transition-colors">
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <p className="font-semibold text-foreground">{fmtTime(log.timestamp)}</p>
                                            <p className="text-xs text-muted font-medium">{fmtDate(log.timestamp)}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="badge">{log.action}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-semibold text-foreground">{log.entityType}</p>
                                            {log.entityId && (
                                                <p className="text-xs text-muted font-mono">{String(log.entityId).slice(-6)}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-semibold text-foreground">{log.performedBy?.name || 'Unknown'}</p>
                                            <p className="text-xs text-muted font-medium">{log.performedBy?.email || ''}</p>
                                        </td>
                                        <td className="px-5 py-3 max-w-[320px]">
                                            <p className="text-xs text-dim font-medium break-words">
                                                {Object.keys(log.metadata || {}).length ? JSON.stringify(log.metadata) : '—'}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted font-medium">{total} log entries</p>
                    <div className="flex items-center gap-2">
                        <button
                            className="btn btn-ghost text-xs px-3 py-2"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </button>
                        <span className="text-xs font-semibold text-dim">Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-ghost text-xs px-3 py-2"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
