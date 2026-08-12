import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/axios';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, BarElement, Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Building2,
    Home,
    Clock,
    Umbrella,
    Users,
    ChevronRight,
    Loader2,
    TrendingUp,
    FileDown,
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const toISODate = (d) => new Date(d).toISOString().split('T')[0];
const lastNDays = (n) => {
    const arr = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        arr.push(d);
    }
    return arr;
};
const shortDate = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};
const initials = (name) => (name || 'U').split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const statusColor = (status) => status === 'PRESENT' ? '#10B981' : status === 'LATE' ? '#FBBF24' : '#a1a1aa';

const Dashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isEmployee = user?.role === 'EMPLOYEE';

    const [records, setRecords] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [activeUsers, setActiveUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const today = toISODate(new Date());
            const rangeStart = toISODate(lastNDays(7)[0]);
            const monthStart = today.substring(0, 7) + '-01';

            if (isEmployee) {
                const [att, lv] = await Promise.all([
                    api.get('/attendance/my', { params: { startDate: monthStart, endDate: today } }),
                    api.get('/leaves/my'),
                ]);
                setRecords(att.data.data.records || []);
                setLeaves(lv.data.data.leaves || []);
            } else {
                const [att, usr] = await Promise.all([
                    api.get('/attendance', { params: { startDate: rangeStart, endDate: today } }),
                    api.get('/users', { params: { limit: 10000 } }),
                ]);
                setRecords(att.data.data.records || []);
                setActiveUsers((usr.data.data.users || []).filter((u) => u.isActive).length);
            }
        } catch { /* ignore */ }
        setLoading(false);
    };

    const todayIso = toISODate(new Date());
    const days = lastNDays(7);
    const monthStart = todayIso.substring(0, 7) + '-01';

    const dayMap = {};
    days.forEach((d) => { dayMap[toISODate(d)] = { present: 0, late: 0, wfh: 0, total: 0 }; });
    records.forEach((r) => {
        const b = dayMap[r.date];
        if (b) {
            b.total++;
            if (r.status === 'PRESENT') b.present++;
            if (r.status === 'LATE') b.late++;
            if (r.workType === 'WFH') b.wfh++;
        }
    });
    const week = days.map((d) => dayMap[toISODate(d)]);

    const todayRecs = records.filter((r) => r.date === todayIso);
    const monthRecs = records.filter((r) => r.date >= monthStart);
    const present = isEmployee
        ? monthRecs.filter((r) => r.status === 'PRESENT').length
        : todayRecs.filter((r) => r.status === 'PRESENT').length;
    const late = isEmployee
        ? monthRecs.filter((r) => r.status === 'LATE').length
        : todayRecs.filter((r) => r.status === 'LATE').length;
    const wfh = isEmployee
        ? monthRecs.filter((r) => r.workType === 'WFH').length
        : todayRecs.filter((r) => r.workType === 'WFH').length;
    const onLeaveToday = leaves.filter(
        (l) => l.status === 'APPROVED' && l.startDate <= todayIso && l.endDate >= todayIso
    ).length;
    const approvedThisMonth = leaves.filter(
        (l) => l.status === 'APPROVED' && l.startDate >= monthStart && l.startDate <= todayIso
    ).length;
    const todayRecord = isEmployee ? records.find((r) => r.date === todayIso) : null;

    const recent = !isEmployee
        ? todayRecs
            .filter((r) => r.checkIn)
            .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
            .slice(0, 4)
        : [];

    const isDark = theme === 'dark';
    const accentColor = '#FF8A5B';
    const successColor = '#10B981';
    const warningColor = '#FBBF24';
    const secondaryColor = isDark ? '#a1a1aa' : '#71717a';
    const borderColor = isDark ? '#3f3f46' : '#e4e4e7';

    const kpis = isEmployee
        ? [
            { label: 'Present', value: present, icon: Building2, tint: 'bg-accent/10 text-accent', foot: 'days in office this month' },
            { label: 'Work From Home', value: wfh, icon: Home, tint: 'bg-success/10 text-success', foot: 'remote days this month' },
            { label: 'Late Arrivals', value: late, icon: Clock, tint: 'bg-warning/10 text-warning', foot: 'late check-ins this month' },
            { label: 'On Leave Today', value: onLeaveToday, icon: Umbrella, tint: 'bg-foreground/10 text-foreground', foot: approvedThisMonth + ' approved this month' },
        ]
        : [
            { label: 'Present Now', value: present, icon: Building2, tint: 'bg-accent/10 text-accent', foot: 'checked in today' },
            { label: 'Work From Home', value: wfh, icon: Home, tint: 'bg-success/10 text-success', foot: 'remote today' },
            { label: 'Late Arrivals', value: late, icon: Clock, tint: 'bg-warning/10 text-warning', foot: 'arrived late today' },
            { label: 'Active Employees', value: activeUsers, icon: Users, tint: 'bg-foreground/10 text-foreground', foot: 'across all teams' },
        ];

    const trendData = {
        labels: days.map((d) => shortDate(toISODate(d))),
        datasets: [
            {
                label: 'Present',
                data: week.map((d) => d.present),
                backgroundColor: accentColor,
                borderRadius: 6,
                maxBarThickness: 22,
            },
            {
                label: 'WFH',
                data: week.map((d) => d.wfh),
                backgroundColor: successColor,
                borderRadius: 6,
                maxBarThickness: 22,
            },
        ],
    };

    const trendOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#000000' : '#ffffff',
                titleColor: accentColor,
                bodyColor: secondaryColor,
                borderColor: borderColor,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 10,
                titleFont: { family: 'Figtree, system-ui, sans-serif', size: 12, weight: '600' },
                bodyFont: { family: 'Figtree, system-ui, sans-serif', size: 11 },
            },
        },
        scales: {
            x: {
                stacked: false,
                ticks: { color: secondaryColor, font: { family: 'Figtree, system-ui, sans-serif', size: 10, weight: '500' } },
                grid: { display: false },
                border: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: { color: secondaryColor, font: { family: 'Figtree, system-ui, sans-serif', size: 10 }, stepSize: 1 },
                grid: { color: borderColor, borderDash: [4, 4] },
                border: { display: false },
            },
        },
    };

    const splitData = {
        labels: ['Present', 'Late', 'WFH'],
        datasets: [{
            data: [present, late, wfh],
            backgroundColor: [accentColor, warningColor, successColor],
            borderColor: isDark ? '#090B0A' : '#ffffff',
            borderWidth: 2,
            hoverOffset: 5,
            cutout: '78%',
        }],
    };

    const splitOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#000000' : '#ffffff',
                titleColor: accentColor,
                bodyColor: secondaryColor,
                borderColor: borderColor,
                borderWidth: 1,
                padding: 10,
                cornerRadius: 10,
                titleFont: { family: 'Figtree, system-ui, sans-serif', size: 12, weight: '600' },
                bodyFont: { family: 'Figtree, system-ui, sans-serif', size: 11 },
                displayColors: false,
            },
        },
    };

    const legendRows = [
        { label: 'Present', value: present, color: accentColor },
        { label: 'Late Arrivals', value: late, color: warningColor },
        { label: 'Work From Home', value: wfh, color: successColor },
    ];

    const quickLinks = [
        { to: '/app/reports', label: 'Reports', icon: FileDown },
        { to: '/app/teams', label: 'Teams', icon: Building2 },
        { to: '/app/users', label: 'Employees', icon: Users },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-[15px] text-dim font-medium tracking-wide">
                        {isEmployee ? 'Your attendance at a glance' : 'Live overview of your team today'}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-subtle w-fit">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {kpis.map((k) => {
                    const Icon = k.icon;
                    return (
                        <div key={k.label} className="card p-4 md:p-5 border-border/60 transition-all hover:border-foreground/20">
                            <div className="flex items-center justify-between gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.tint}`}>
                                    <Icon size={17} strokeWidth={2.2} />
                                </div>
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-subtle text-right leading-tight">{k.label}</span>
                            </div>
                            <h3 className="mt-4 text-3xl font-bold tracking-tighter text-foreground leading-none">
                                {loading ? '—' : (k.value ?? '—')}
                            </h3>
                            <p className="mt-2 text-xs text-dim font-medium">{k.foot}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 card min-w-0 overflow-hidden p-4 sm:p-6 border-border/60">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                                Attendance Trend
                                <TrendingUp size={15} className="text-muted" />
                            </h3>
                            <p className="text-xs text-muted font-semibold tracking-wide">Last 7 days · office vs remote</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-subtle">
                                <span className="w-2 h-2 rounded-full bg-accent" /> Present
                            </span>
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-subtle">
                                <span className="w-2 h-2 rounded-full bg-success" /> WFH
                            </span>
                        </div>
                    </div>
                    <div className="h-[280px] sm:h-[330px] relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={30} className="animate-spin text-muted opacity-30" />
                            </div>
                        ) : (
                            <Bar data={trendData} options={trendOptions} />
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 min-w-0 space-y-6">
                    <div className="card min-w-0 overflow-hidden p-4 sm:p-6 border-border/60 h-full flex flex-col">
                        <div className="space-y-1 mb-4">
                            <h3 className="text-base font-bold tracking-tight">Snapshot</h3>
                            <p className="text-xs text-muted font-semibold tracking-wide">{isEmployee ? 'Your month so far' : 'Live today'}</p>
                        </div>

                        <div className="relative h-[190px] sm:h-[220px] shrink-0">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-border animate-spin" />
                                </div>
                            ) : (
                                <Doughnut data={splitData} options={splitOptions} />
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold tracking-tighter text-foreground leading-none">{loading ? '—' : present}</span>
                                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{isEmployee ? 'this month' : 'today'}</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2.5 flex-1">
                            {legendRows.map((row) => (
                                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
                                    <span className="flex items-center gap-2 text-sm text-subtle font-medium">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
                                        {row.label}
                                    </span>
                                    <span className="text-sm font-bold text-foreground">{loading ? '—' : row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isEmployee ? (
                        <div className="space-y-6">
                            <Link
                                to="/app/attendance/mark"
                                className="block p-5 rounded-2xl bg-accent text-accent-fg hover:bg-accent-hover transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold tracking-tight">{todayRecord && !todayRecord.checkOut ? 'Update check-out' : "Mark today's attendance"}</p>
                                        <p className="text-xs mt-1 opacity-80 font-medium">
                                            {todayRecord
                                                ? `Checked in at ${fmtTime(todayRecord.checkIn)} · tap to update`
                                                : 'Tap to check in from anywhere'}
                                        </p>
                                    </div>
                                    <ChevronRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>

                            <Link to="/app/leaves/my" className="block card p-5 border-border/60 transition-all hover:border-foreground/20 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-foreground/10 text-foreground flex items-center justify-center">
                                            <Umbrella size={17} strokeWidth={2.2} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground leading-tight">{approvedThisMonth} approved</p>
                                            <p className="text-xs text-muted font-medium mt-0.5">leave days this month</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-muted group-hover:text-foreground transition-colors shrink-0" />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="card p-4 sm:p-5 border-border/60">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold tracking-tight text-foreground">Latest Check-ins</h3>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{recent.length} today</span>
                            </div>
                            {recent.length === 0 ? (
                                <p className="text-sm text-muted italic py-4 text-center">No check-ins yet today</p>
                            ) : (
                                <div className="space-y-3">
                                    {recent.map((r) => (
                                        <div key={r._id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold">
                                                {initials(r.userId?.name)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-foreground truncate">{r.userId?.name || 'Employee'}</p>
                                                <p className="text-xs text-muted font-medium">{r.workType === 'WFH' ? 'Remote' : 'In office'}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor(r.status) }} />
                                                <span className="text-xs font-mono font-bold text-foreground">{fmtTime(r.checkIn)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 pt-4 border-t border-border/50 grid grid-cols-3 gap-2">
                                {quickLinks.map((q) => {
                                    const Icon = q.icon;
                                    return (
                                        <Link
                                            key={q.to}
                                            to={q.to}
                                            className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-muted hover:text-foreground hover:bg-raised transition-colors"
                                        >
                                            <Icon size={16} />
                                            <span className="text-[11px] font-semibold tracking-wide">{q.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;