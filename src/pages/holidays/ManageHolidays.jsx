import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Plus,
    Trash2,
    Loader2,
    CalendarDays,
    Check,
    AlertCircle
} from 'lucide-react';

const toISODate = (d) => new Date(d).toISOString().split('T')[0];

const ManageHolidays = () => {
    const currentYear = new Date().getFullYear();
    const [holidays, setHolidays] = useState([]);
    const [year, setYear] = useState(currentYear);
    const [form, setForm] = useState({ date: '', title: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchHolidays(); }, [year]);

    const fetchHolidays = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/holidays', { params: { year } });
            setHolidays(data.data || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/holidays', form);
            setForm({ date: '', title: '' });
            setSuccess('Holiday added.');
            fetchHolidays();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add holiday');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this holiday?')) return;
        setError('');
        setSuccess('');
        try {
            await api.delete(`/holidays/${id}`);
            setSuccess('Holiday removed.');
            fetchHolidays();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove holiday');
        }
    };

    const years = Array.from({ length: 3 }, (_, i) => currentYear + i);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        Company Holidays
                        <CalendarDays className="text-dim opacity-40 shrink-0" size={20} />
                    </h1>
                    <p className="text-[15px] text-dim font-medium">Manage company-wide off days. No check-in is required on holidays.</p>
                </div>
            </div>

            {(success || error) && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-xs font-semibold tracking-wide ${success ? 'bg-success/10 text-success' : 'bg-secondary/20 text-foreground border border-border'}`}>
                    {success ? <Check size={16} /> : <AlertCircle size={16} />}
                    {success || error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add holiday */}
                <div className="lg:col-span-1 card h-fit p-6 border-border/60">
                    <h3 className="text-sm font-bold tracking-tight text-foreground uppercase mb-6">Add Holiday</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted tracking-wide ml-1 uppercase">Date</label>
                            <input
                                type="date"
                                className="form-input text-sm h-[46px] font-medium"
                                value={form.date}
                                min={toISODate(new Date(currentYear, 0, 1))}
                                max={toISODate(new Date(currentYear + 2, 11, 31))}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted tracking-wide ml-1 uppercase">Title</label>
                            <input
                                className="form-input text-sm h-[46px] font-medium"
                                placeholder="e.g. Independence Day"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                maxLength={200}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-[48px] bg-accent text-accent-fg text-xs font-bold tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-[0.98] transition-all"
                        >
                            <Plus size={18} />
                            Add Holiday
                        </button>
                    </form>
                </div>

                {/* Holiday list */}
                <div className="lg:col-span-2 card p-6 border-border/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">Holidays</h3>
                        <select
                            className="form-select text-sm h-[42px] w-fit"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <Loader2 size={28} className="animate-spin text-muted" />
                            <p className="text-xs font-medium tracking-wide text-dim">Loading holidays...</p>
                        </div>
                    ) : holidays.length === 0 ? (
                        <div className="py-24 text-center">
                            <CalendarDays size={36} className="mx-auto mb-4 text-muted opacity-30" />
                            <p className="text-sm text-muted font-medium">No holidays in {year}</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-border/60">
                            {holidays.map((h) => (
                                <li key={h._id} className="flex items-center justify-between gap-4 py-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-raised border border-border flex flex-col items-center justify-center">
                                            <span className="text-sm font-bold text-foreground leading-none">
                                                {new Date(h.date + 'T00:00:00').getDate()}
                                            </span>
                                            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted mt-0.5">
                                                {new Date(h.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{h.title}</p>
                                            <p className="text-xs text-muted font-medium">
                                                {new Date(h.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(h._id)}
                                        className="p-2 rounded-lg text-subtle hover:text-error hover:bg-error/10 transition-colors shrink-0"
                                        aria-label={`Delete ${h.title}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageHolidays;
