import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
    Download, 
    Calendar, 
    Users, 
    Building, 
    Loader2, 
    FileDown, 
    FileSpreadsheet,
    LineChart,
    ChevronRight,
    Search
} from 'lucide-react';

const Reports = () => {
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', teamId: '', userId: '' });
    const [downloading, setDownloading] = useState(false);

    useEffect(() => { fetchTeams(); fetchUsers(); }, []);

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/teams');
            setTeams(data.data || []);
        } catch { /* ignore */ }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data.data.users || []);
        } catch { /* ignore */ }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await api.get('/reports/attendance', {
                params: filters,
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch { /* ignore */ }
        setDownloading(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1 border-b border-border pb-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Reports
                    <LineChart className="text-dim opacity-40 shrink-0" size={20} />
                </h1>
                <p className="text-[15px] text-dim font-medium">Download and analyze attendance reports</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="card p-4 sm:p-8 border-border/60">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-foreground text-background rounded-xl">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold tracking-tight">Attendance Report</h3>
                            <p className="text-xs text-muted font-bold tracking-wider">Format: Microsoft Excel (.xlsx)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-8">
                            <h4 className="text-xs font-semibold text-foreground tracking-wide flex items-center gap-2 border-b border-border pb-3">
                                <Calendar size={12} className="text-muted" />
                                Date Range
                            </h4>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted tracking-wide ml-1 uppercase">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="form-input text-sm h-[46px] font-medium" 
                                        value={filters.startDate}
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted tracking-wide ml-1 uppercase">End Date</label>
                                    <input 
                                        type="date" 
                                        className="form-input text-sm h-[46px] font-medium" 
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xs font-semibold text-foreground tracking-wide flex items-center gap-2 border-b border-border pb-3">
                                <Search size={12} className="text-muted" />
                                Advanced Filters
                            </h4>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted tracking-wide ml-1 flex items-center gap-1.5 uppercase">
                                        <Building size={10} /> Select Team
                                    </label>
                                    <select 
                                        className="form-select text-sm h-[46px] font-medium" 
                                        value={filters.teamId}
                                        onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
                                    >
                                        <option value="">All Teams (Global)</option>
                                        {teams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted tracking-wide ml-1 flex items-center gap-1.5 uppercase">
                                        <Users size={10} /> Select Employee
                                    </label>
                                    <select 
                                        className="form-select text-sm h-[46px] font-medium" 
                                        value={filters.userId}
                                        onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                                    >
                                        <option value="">All Employees (Global)</option>
                                        {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col gap-5">
                        <button 
                            className="group relative w-full h-[60px] bg-accent text-accent-fg text-xs font-bold tracking-[0.2em] uppercase rounded-xl overflow-hidden transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
                            onClick={handleDownload} 
                            disabled={downloading}
                        >
                            {downloading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    PREPARING ANALYTICS...
                                </>
                            ) : (
                                <>
                                    <Download size={20} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
                                    GENERATE REPORT
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-dim font-semibold tracking-wide opacity-40 uppercase">
                            Secure data export with encrypted timestamp verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
