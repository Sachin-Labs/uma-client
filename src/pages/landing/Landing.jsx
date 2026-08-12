import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import {
    Users,
    Calendar,
    ArrowRight,
    MapPin,
    ShieldCheck,
    Clock,
    BarChart3,
    CheckCircle2,
    Sparkles,
    ChevronRight
} from 'lucide-react';

const features = [
    {
        icon: MapPin,
        title: 'Location Rules',
        desc: 'Define office boundaries and verify presence automatically with geo-fenced, location-checked check-ins.',
    },
    {
        icon: Calendar,
        title: 'Leave Tracking',
        desc: 'Request, approve, and balance leaves in one clean flow. No spreadsheets, no back-and-forth emails.',
    },
    {
        icon: Users,
        title: 'Team Control',
        desc: 'Organize employees into teams and assign Admin, HR, or Employee roles with granular access.',
    },
    {
        icon: BarChart3,
        title: 'Reports & Insights',
        desc: 'Export attendance, leave, and working-hour reports your finance team will actually love.',
    },
    {
        icon: ShieldCheck,
        title: 'Role-Based Access',
        desc: 'The right people see the right data. Sensitive operations stay locked behind role permissions.',
    },
    {
        icon: Clock,
        title: 'Real-Time Check-In',
        desc: 'Self-declared WFH or geo-verified in-office check-ins, captured the moment it happens.',
    },
];

const steps = [
    {
        num: '01',
        title: 'Create your organisation',
        desc: 'Sign up, verify your email, and set up your company profile in under a minute.',
    },
    {
        num: '02',
        title: 'Add teams & location rules',
        desc: 'Invite employees, define office boundaries and radius, and set working hours per team.',
    },
    {
        num: '03',
        title: 'Track, approve, report',
        desc: 'Employees check in, managers approve leaves, and reports are always ready to export.',
    },
];

const stats = [
    { value: '1-click', label: 'Geo-verified check-in' },
    { value: '3 roles', label: 'Admin, HR & Employee' },
    { value: '100%', label: 'Paperless workflow' },
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-canvas font-sans text-bright">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <a href="#top" className="flex items-center gap-2">
                        <img src="/sina-people.svg" alt="SINA People" className="w-10 h-10 rounded-xl" />
                        <span className="text-xl font-bold tracking-tight">SINA People</span>
                    </a>
                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-subtle">
                        <a href="#features" className="hover:text-bright transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-bright transition-colors">How it works</a>
                        <a href="#product" className="hover:text-bright transition-colors">Product</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link to="/login" className="btn btn-outline btn-sm hidden sm:inline-flex">Sign In</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="top" className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-accent-soft rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-raised text-subtle text-xs font-semibold rounded-full border border-line mb-8">
                            <Sparkles size={14} className="text-accent" />
                            User Management & Attendance System
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Effortless attendance for your{' '}
                            <span className="text-accent">growing team</span>
                        </h1>
                        <p className="text-[17px] md:text-lg text-dim max-w-2xl mx-auto leading-relaxed mb-10">
                            Track attendance with geo-verified check-ins, manage leaves, and export
                            ready-to-share reports — all in one clean platform your team will actually use.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="btn btn-primary btn-lg w-full sm:w-auto px-10">
                                Start for Free <ArrowRight size={18} className="ml-2" />
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg w-full sm:w-auto px-10">
                                Sign In
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-extrabold tracking-tight text-accent">{stat.value}</div>
                                    <div className="text-xs text-muted font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product preview */}
                    <div id="product" className="relative max-w-4xl mx-auto mt-20">
                        <div className="absolute -inset-4 bg-accent-soft blur-3xl rounded-3xl pointer-events-none" />
                        <div className="relative card rounded-2xl p-0 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-accent/40" />
                                    <span className="w-3 h-3 rounded-full bg-accent/70" />
                                    <span className="w-3 h-3 rounded-full bg-accent" />
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-subtle">
                                    <span className="px-3 py-1 rounded-md bg-raised border border-line">Today</span>
                                    <span className="px-3 py-1 rounded-md">Weekly</span>
                                    <span className="px-3 py-1 rounded-md">Monthly</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
                                <div className="p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Present</div>
                                    <div className="text-3xl font-extrabold tracking-tight">34</div>
                                    <div className="text-xs text-subtle mt-1 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-accent" /> 28 office · 6 remote
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">On Leave</div>
                                    <div className="text-3xl font-extrabold tracking-tight">6</div>
                                    <div className="text-xs text-subtle mt-1 flex items-center gap-1.5">
                                        <Calendar size={14} className="text-accent" /> Approved
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Work From Home</div>
                                    <div className="text-3xl font-extrabold tracking-tight">12</div>
                                    <div className="text-xs text-subtle mt-1 flex items-center gap-1.5">
                                        <MapPin size={14} className="text-accent" /> Self-declared
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-line bg-surface flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium text-subtle">
                                    <ShieldCheck size={14} className="text-accent" />
                                    Location-verified check-ins across all teams
                                </div>
                                <a href="#features" className="inline-flex items-center gap-1 text-xs font-bold text-accent">
                                    Explore features <ChevronRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is SINA People */}
            <section className="py-24 bg-surface border-y border-line">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide mb-4">
                        <Sparkles size={14} /> What is SINA People?
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                        A complete workforce platform behind every check-in
                    </h2>
                    <p className="text-[16px] text-dim leading-relaxed mb-4">
                        SINA People centralizes attendance, leave, and team management so growing companies
                        can stop juggling spreadsheets and start focusing on the work that matters. Instead of
                        patching together tools, you get one place where presence is verified, requests are
                        approved, and reports are always accurate.
                    </p>
                    <p className="text-[16px] text-dim leading-relaxed">
                        Multi-tenant and role-based by design — each organisation gets its own teams, rules,
                        and data. Your employees see what they need; your HR and admins see everything.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide mb-4">
                            <Sparkles size={14} /> Features
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                            Everything you need to run attendance on autopilot
                        </h2>
                        <p className="text-[16px] text-dim">
                            Purpose-built for teams who want serious workforce logistics without the bloat.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="group card hover:border-accent-border transition-all duration-300">
                                    <div className="w-11 h-11 rounded-xl bg-accent-soft border border-accent-border flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight mb-2">{feature.title}</h3>
                                    <p className="text-[15px] text-subtle leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-24 bg-surface border-y border-line">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide mb-4">
                            <Sparkles size={14} /> How it works
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                            Live in minutes, not months
                        </h2>
                        <p className="text-[16px] text-dim">
                            Three simple steps from sign-up to your team's first check-in.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((step) => (
                            <div key={step.num} className="card relative">
                                <div className="text-accent text-sm font-extrabold tracking-[0.2em] mb-4">{step.num}</div>
                                <h3 className="text-lg font-bold tracking-tight mb-2">{step.title}</h3>
                                <p className="text-[15px] text-subtle leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="card rounded-3xl text-center px-6 py-16 relative overflow-hidden">
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent-soft rounded-full blur-3xl pointer-events-none" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                                Ready to run attendance on autopilot?
                            </h2>
                            <p className="text-[16px] text-dim max-w-xl mx-auto mb-10">
                                Create your organisation, invite your team, and start tracking check-ins today.
                                Free to start, no credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register" className="btn btn-primary btn-lg w-full sm:w-auto px-10">
                                    Start for Free <ArrowRight size={18} className="ml-2" />
                                </Link>
                                <Link to="/login" className="btn btn-outline btn-lg w-full sm:w-auto px-10">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-line py-16 bg-surface/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                        <div className="max-w-sm space-y-5">
                            <a href="#top" className="flex items-center gap-2">
                                <img src="/sina-people.svg" alt="SINA People" className="w-9 h-9 rounded-lg" />
                                <span className="text-lg font-bold tracking-tight">SINA People</span>
                            </a>
                            <p className="text-[15px] text-dim leading-relaxed">
                                The essential platform for modern team attendance and workforce logistics.
                                Built for speed, focus, and teams that move fast.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted mb-5">Product</h4>
                            <ul className="space-y-3.5 text-sm text-dim font-medium">
                                <li><a href="#features" className="hover:text-bright transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-bright transition-colors">How it works</a></li>
                                <li><Link to="/register" className="hover:text-bright transition-colors">Get Started</Link></li>
                                <li><Link to="/login" className="hover:text-bright transition-colors">Sign In</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-line/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted">
                            © {new Date().getFullYear()} SINA People. All rights reserved.
                        </p>
                        <span className="text-xs font-semibold text-muted uppercase tracking-wide">Version 1.0.0</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
