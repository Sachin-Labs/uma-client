import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    UserCheck,
    Calendar,
    Umbrella,
    Users,
    ClipboardList,
    Building,
    User,
    FileDown,
    Settings as SettingsIcon,
    CalendarDays,
    History,
    X
} from 'lucide-react';

const Sidebar = ({ open, onClose }) => {
    const { user } = useAuth();
    const role = user?.role;

    const navItems = [
        { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
        { to: '/app/attendance/mark', label: 'Mark Attendance', icon: UserCheck, roles: ['EMPLOYEE'] },
        { to: '/app/attendance/my', label: 'My Attendance', icon: Calendar, roles: ['EMPLOYEE'] },
        { to: '/app/leaves/my', label: 'My Leaves', icon: Umbrella, roles: ['EMPLOYEE'] },
        { to: '/app/attendance/manage', label: 'Attendance', icon: Users, roles: ['ADMIN', 'HR'] },
        { to: '/app/leaves/manage', label: 'Manage Leaves', icon: ClipboardList, roles: ['ADMIN', 'HR'] },
        { to: '/app/holidays', label: 'Holidays', icon: CalendarDays, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
        { to: '/app/holidays/manage', label: 'Manage Holidays', icon: CalendarDays, roles: ['ADMIN'] },
        { to: '/app/teams', label: 'Teams', icon: Building, roles: ['ADMIN', 'HR'] },
        { to: '/app/users', label: 'Users', icon: User, roles: ['ADMIN', 'HR'] },
        { to: '/app/reports', label: 'Reports', icon: FileDown, roles: ['ADMIN', 'HR'] },
        { to: '/app/audit-logs', label: 'Audit Logs', icon: History, roles: ['ADMIN'] },
        { to: '/app/settings', label: 'Settings', icon: SettingsIcon, roles: ['ADMIN'] },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-dvh w-64 bg-surface border-r border-line flex flex-col z-[100] overflow-hidden
                transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:translate-x-0
                ${open ? 'translate-x-0 shadow-2xl shadow-foreground/10' : '-translate-x-full'}
                lg:shadow-none`}
        >
            <div className="p-8 border-b border-line flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <img src="/sina-people.svg" alt="SINA People" className="w-10 h-10 rounded-xl" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tighter text-bright leading-none">SINA People</h1>
                        <p className="text-xs text-muted font-semibold tracking-wide mt-0.5">Core System</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close menu"
                    className="lg:hidden -mr-2 p-2 rounded-lg text-subtle hover:text-bright hover:bg-raised transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                {navItems
                    .filter((item) => item.roles.includes(role))
                    .map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-xl text-sm font-medium transition-all group touch-manipulation active:scale-[0.98]
                                    ${isActive
                                        ? 'bg-overlay text-bright font-bold'
                                        : 'text-subtle hover:bg-raised hover:text-bright'}
                                `}
                            >
                                <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                {item.label}
                            </NavLink>
                        );
                    })}
            </nav>

            <div className="p-4 border-t border-line">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/10 border border-border/60 group/user">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center text-sm font-bold group-hover/user:scale-105 transition-transform">
                        {(user?.name || 'U').split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-bright truncate leading-tight">{user?.name}</p>
                        <span className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-semibold tracking-wide text-accent uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            {role}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
