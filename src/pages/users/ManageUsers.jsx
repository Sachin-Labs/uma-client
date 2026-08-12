import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    UserPlus,
    Search,
    Mail,
    UserCheck,
    UserX,
    Loader2,
    Shield,
    Users,
    X,
    Check,
    AlertCircle,
    ArrowRightCircle,
    RotateCcw
} from 'lucide-react';

const ManageUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', role: 'EMPLOYEE', teamId: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUsers(); fetchTeams(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users', { params: { search } });
            setUsers(data.data.users || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/teams');
            setTeams(data.data || []);
        } catch { /* ignore */ }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/users', form);
            setShowForm(false);
            setForm({ name: '', email: '', role: 'EMPLOYEE', teamId: '' });
            setSuccess('Provisioning successful. Dispatching invitation...');
            fetchUsers();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction aborted');
        }
    };

    const handleToggleActive = async (user) => {
        setError('');
        setSuccess('');
        try {
            if (user.isActive) {
                if (!confirm(`Deactivate access for ${user.name}? This will revoke system privileges immediately.`)) return;
                await api.patch(`/users/${user._id}/deactivate`);
                setSuccess('Access revoked.');
            } else {
                await api.patch(`/users/${user._id}/reactivate`);
                setSuccess('Access restored.');
            }
            fetchUsers();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    const handleResendInvite = async (userId) => {
        setError('');
        setSuccess('');
        try {
            await api.post(`/users/${userId}/resend-invite`);
            setSuccess('Invitation resent to operator.');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Communication failure');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Employees</h1>
                    <p className="text-[15px] text-dim font-medium">Add and manage employees, roles, and teams</p>
                </div>
                <button
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-accent-fg text-sm rounded-md hover:bg-accent-hover transition-all active:scale-95"
                    onClick={() => setShowForm(true)}
                >
                    <UserPlus size={18} strokeWidth={3} />
                    Add Employee
                </button>
            </div>

            {(success || error) && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-xs font-semibold tracking-wide ${success ? 'bg-success/10 text-success' : 'bg-secondary/50 border border-border text-foreground'}`}>
                    {success ? <Check size={16} /> : <AlertCircle size={16} />}
                    {success || error}
                </div>
            )}

            <div className="flex gap-2 max-w-md">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-foreground transition-colors" size={16} />
                    <input
                        className="form-input text-sm h-[40px] pl-10"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                    />
                </div>
                <button
                    className="px-6 h-[40px] bg-secondary text-foreground text-xs font-semibold tracking-wide rounded-md border border-border hover:bg-overlay transition-all"
                    onClick={fetchUsers}
                >
                    Apply Filter
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="card w-full max-w-md relative border-2 border-border/50 max-h-[92vh] overflow-y-auto">
                        <button
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary text-dim hover:text-foreground transition-colors"
                            onClick={() => setShowForm(false)}
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-xl font-bold tracking-tight text-foreground">Add Employee</h3>
                            <p className="text-xs text-dim italic">Enter employee details and assign to a team</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold tracking-wide text-muted ml-1">Full Name</label>
                                <input
                                    className="form-input text-sm h-[42px]"
                                    placeholder="Operator Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold tracking-wide text-muted ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                                    <input
                                        type="email"
                                        className="form-input text-sm h-[42px] pl-9"
                                        placeholder="employee@company.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wide text-muted ml-1">Role</label>
                                    <select
                                        className="form-select text-sm h-[42px]"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="HR">HR</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wide text-muted ml-1">Team</label>
                                    <select
                                        className="form-select text-sm h-[42px]"
                                        value={form.teamId}
                                        onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                                    >
                                        <option value="">Unassigned</option>
                                        {teams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-border/50">
                                <button
                                    type="button"
                                    className="flex-1 py-3 px-4 border border-border text-xs font-semibold tracking-wide text-dim hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-accent text-accent-fg text-xs font-semibold tracking-wide rounded-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2"
                                >
                                    Send Invite
                                    <ArrowRightCircle size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-dim gap-4">
                    <Loader2 size={32} className="animate-spin opacity-50" />
                    <p className="text-[15px] font-medium">Loading employees...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-border/60">
                    <div className="p-5 rounded-full bg-secondary mb-6">
                        <Users size={40} className="text-muted" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">No employees found</h3>
                    <p className="text-[15px] text-dim mt-2 max-w-[300px]">We couldn't find any employees matching your search.</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden border-border/50 transition-all hover:border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/30 border-b border-border">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Employee</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle hidden md:table-cell">Team</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-subtle text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {users.map((u) => {
                                    const isSelf = u._id === currentUser?.userId;
                                    const isHRPerformer = currentUser?.role === 'HR';
                                    const isAdminTarget = u.role === 'ADMIN';
                                    const canDeactivate = !isSelf && !(isHRPerformer && isAdminTarget);

                                    return (
                                        <tr key={u._id} className="hover:bg-raised transition-colors duration-200 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
                                                        {u.name?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[15px] font-bold text-foreground flex items-center gap-2">
                                                            {u.name}
                                                            {isSelf && (
                                                                <span className="px-1.5 py-0.5 rounded text-xs bg-secondary text-subtle font-semibold border border-border">Local</span>
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-muted font-medium">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 rounded-md border border-border/50 w-fit">
                                                    <Shield size={10} className="text-dim" />
                                                    <span className="text-xs font-semibold text-foreground tracking-wide">{u.role?.charAt(0) + u.role?.slice(1).toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-xs font-semibold text-subtle tracking-wide border-b border-border/30 pb-0.5">
                                                    {u.teamId?.name || 'Standby'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${u.isActive ? 'bg-success/10 text-success' : 'bg-raised text-subtle'}`}>
                                                    <div className={`w-1 h-1 rounded-full ${u.isActive ? 'bg-success' : 'bg-subtle'}`} />
                                                    {u.isActive ? 'Active' : 'Inactive'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!u.password && u.isActive && (
                                                        <button
                                                            className="p-2.5 bg-secondary text-foreground rounded-lg hover:bg-overlay transition-all border border-border touch-manipulation active:scale-95"
                                                            onClick={() => handleResendInvite(u._id)}
                                                            title="Resend Access Link"
                                                            aria-label="Resend access link"
                                                        >
                                                            <RotateCcw size={15} />
                                                        </button>
                                                    )}
                                                    {u.isActive ? (
                                                        <button
                                                            className="px-3.5 py-2 min-h-[40px] bg-raised text-subtle text-xs font-semibold tracking-wide rounded-lg hover:bg-error/10 hover:text-error transition-all disabled:opacity-30 touch-manipulation"
                                                            onClick={() => handleToggleActive(u)}
                                                            disabled={!canDeactivate}
                                                            title={isSelf ? "You cannot deactivate yourself" : "Admin protection active"}
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="px-3.5 py-2 min-h-[40px] bg-accent text-accent-fg text-xs font-semibold tracking-wide rounded-lg hover:bg-accent-hover transition-all touch-manipulation"
                                                            onClick={() => handleToggleActive(u)}
                                                        >
                                                            Reactivate
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
