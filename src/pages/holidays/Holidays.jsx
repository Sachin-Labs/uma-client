import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Loader2, CalendarDays } from 'lucide-react';

const Holidays = () => {
    const currentYear = new Date().getFullYear();
    const [holidays, setHolidays] = useState([]);
    const [year, setYear] = useState(currentYear);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchHolidays(); }, [year]);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/holidays', { params: { year } });
            setHolidays(data.data || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const todayIso = new Date().toISOString().split('T')[0];
    const upcoming = holidays
        .filter((h) => h.date >= todayIso)
        .sort((a, b) => a.date.localeCompare(b.date));
    const past = holidays
        .filter((h) => h.date < todayIso)
        .sort((a, b) => b.date.localeCompare(a.date));

    const years = Array.from({ length: 3 }, (_, i) => currentYear + i);

    const renderHoliday = (h) => (
        <li key={h._id} className="flex items-center gap-4 py-4">
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
        </li>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        Holidays
                        <CalendarDays className="text-dim opacity-40 shrink-0" size={20} />
                    </h1>
                    <p className="text-[15px] text-dim font-medium">Company-wide off days — no check-in required</p>
                </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
                    {upcoming.length > 0 && (
                        <div className="card p-6 border-border/60">
                            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase mb-2">Upcoming</h3>
                            <ul className="divide-y divide-border/60">
                                {upcoming.map(renderHoliday)}
                            </ul>
                        </div>
                    )}
                    {past.length > 0 && (
                        <div className="card p-6 border-border/60">
                            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase mb-2">Past</h3>
                            <ul className="divide-y divide-border/60">
                                {past.map(renderHoliday)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Holidays;
