import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LocationPicker from '../../components/LocationPicker';
import {
    Plus,
    MapPin,
    Clock,
    Edit,
    Trash2,
    Home,
    Building2,
    Loader2,
    X,
    Users,
    Check,
    AlertCircle,
    Map
} from 'lucide-react';

const ManageTeams = () => {
    const [teams, setTeams] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: '', lat: null, lng: null, address: '', radius: 200, workMode: 'ONSITE', maxWFHDaysPerMonth: 0,
        officeHours: { startTime: '09:00', endTime: '18:00' }
    });
    const [orgData, setOrgData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTeams();
        fetchOrgLocation();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/teams');
            setTeams(data.data || []);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const fetchOrgLocation = async () => {
        try {
            const { data } = await api.get('/organisation');
            setOrgData(data.data);
        } catch { /* ignore */ }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.lat || !form.lng) {
            setError('Geographic coordinates required. Please pin the location.');
            return;
        }
        const payload = {
            name: form.name,
            location: {
                lat: Number(form.lat),
                lng: Number(form.lng),
                address: form.address
            },
            radius: Number(form.radius),
            workMode: form.workMode,
            maxWFHDaysPerMonth: Number(form.maxWFHDaysPerMonth),
            officeHours: form.officeHours,
        };
        try {
            if (editId) {
                await api.put(`/teams/${editId}`, payload);
            } else {
                await api.post('/teams', payload);
            }
            resetForm();
            fetchTeams();
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed');
        }
    };

    const handleEdit = (team) => {
        setEditId(team._id);
        setForm({
            name: team.name,
            lat: team.location.lat,
            lng: team.location.lng,
            address: team.location.address || '',
            radius: team.radius,
            workMode: team.workMode,
            maxWFHDaysPerMonth: team.maxWFHDaysPerMonth,
            officeHours: team.officeHours || { startTime: '09:00', endTime: '18:00' },
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Confirm team decommissioning? This action is irreversible.')) return;
        try {
            await api.delete(`/teams/${id}`);
            fetchTeams();
        } catch { /* ignore */ }
    };

    const handleAddTeam = () => {
        const defaultLoc = orgData?.officeLocation || {};
        const defaultHours = orgData?.officeHours || { startTime: '09:00', endTime: '18:00' };

        setForm({
            name: '', lat: defaultLoc.lat || null, lng: defaultLoc.lng || null,
            address: defaultLoc.address || '', radius: 200, workMode: 'ONSITE', maxWFHDaysPerMonth: 0,
            officeHours: defaultHours
        });
        setEditId(null);
        setShowForm(true);
        setError('');
    };

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setForm({
            name: '', lat: null, lng: null, address: '', radius: 200, workMode: 'ONSITE', maxWFHDaysPerMonth: 0,
            officeHours: { startTime: '09:00', endTime: '18:00' }
        });
        setError('');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Teams</h1>
                    <p className="text-[15px] text-dim font-medium">Create and manage your office teams and their locations</p>
                </div>
                <button
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-accent-fg text-sm rounded-md hover:bg-accent-hover transition-all active:scale-95"
                    onClick={handleAddTeam}
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Team
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 relative">
                        <button
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary text-dim hover:text-foreground transition-colors"
                            onClick={resetForm}
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-xl font-bold tracking-tight">{editId ? 'Edit Team' : 'Add New Team'}</h3>
                            <p className="text-xs text-dim italic">Set team location, radius, and working hours</p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-lg text-xs text-foreground mb-6 font-medium tracking-wide">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wide text-muted ml-1">Team Name</label>
                                    <input
                                        className="form-input text-sm h-[42px]"
                                        placeholder="e.g. Engineering South, Global Operations"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold tracking-wide text-muted ml-1 flex items-center gap-2">
                                        Team Location <Map size={12} />
                                    </label>
                                    <div className="rounded-xl overflow-hidden border border-border bg-secondary/20">
                                        <LocationPicker
                                            lat={form.lat}
                                            lng={form.lng}
                                            radius={Number(form.radius)}
                                            address={form.address || ''}
                                            onLocationChange={(loc) => setForm((prev) => ({ ...prev, lat: loc.lat, lng: loc.lng, address: loc.address }))}
                                            showRadius={true}
                                            height="250px"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold tracking-wide text-muted ml-1">Location Radius (meters)</label>
                                        <input
                                            type="number"
                                            className="form-input text-sm h-[42px]"
                                            value={form.radius}
                                            onChange={(e) => setForm({ ...form, radius: e.target.value })}
                                            required
                                            min={50}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold tracking-wide text-muted ml-1">Work Style</label>
                                        <select
                                            className="form-select text-sm h-[42px]"
                                            value={form.workMode}
                                            onChange={(e) => setForm({ ...form, workMode: e.target.value })}
                                        >
                                            <option value="ONSITE">At Office</option>
                                            <option value="WFH">Work from Home</option>
                                            <option value="HYBRID">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                {(form.workMode === 'HYBRID' || form.workMode === 'WFH') && (
                                    <div className="space-y-2 animate-in slide-in-from-left-2">
                                        <label className="text-xs font-semibold tracking-wide text-muted ml-1">Max WFH Quota (Days/Month)</label>
                                        <input
                                            type="number"
                                            className="form-input text-sm h-[42px]"
                                            value={form.maxWFHDaysPerMonth}
                                            onChange={(e) => setForm({ ...form, maxWFHDaysPerMonth: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold tracking-wide text-muted ml-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="form-input text-sm h-[42px]"
                                            value={form.officeHours.startTime}
                                            onChange={(e) => setForm({ ...form, officeHours: { ...form.officeHours, startTime: e.target.value } })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold tracking-wide text-muted ml-1">End Time</label>
                                        <input
                                            type="time"
                                            className="form-input text-sm h-[42px]"
                                            value={form.officeHours.endTime}
                                            onChange={(e) => setForm({ ...form, officeHours: { ...form.officeHours, endTime: e.target.value } })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-border/50">
                                <button
                                    type="button"
                                    className="flex-1 py-3 px-4 border border-border text-sm font-semibold tracking-wide text-dim hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                    onClick={resetForm}
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-accent text-accent-fg text-sm font-semibold tracking-wide rounded-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={18} />
                                    {editId ? 'Save Changes' : 'Add Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-dim gap-4">
                    <Loader2 size={32} className="animate-spin opacity-50" />
                    <p className="text-[15px] font-medium animate-pulse">Loading teams...</p>
                </div>
            ) : teams.length === 0 ? (
                <div className="card flex flex-col items-center justify-center py-32 text-center border-dashed border-2 border-border/60">
                    <div className="p-5 rounded-full bg-secondary mb-6">
                        <Users size={40} className="text-muted" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight">No teams found</h3>
                    <p className="text-[15px] text-dim mt-2 max-w-[300px] leading-relaxed">Please add a team to start tracking attendance.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {teams.map((t) => (
                        <div key={t._id} className="card group transition-all duration-500 border-border/60">
                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-foreground" />
                                        <h3 className="text-sm font-bold tracking-tight text-foreground">{t.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted font-semibold tracking-wide px-2">
                                        <Building2 size={10} /> {t.workMode?.charAt(0) + t.workMode?.slice(1).toLowerCase()}
                                    </div>
                                </div>
                                <div className="flex gap-1.5 translate-x-1">
                                    <button
                                        className="p-2.5 rounded-lg hover:bg-secondary text-dim hover:text-foreground transition-all touch-manipulation active:scale-95"
                                        onClick={() => handleEdit(t)}
                                        title="Configure"
                                        aria-label={`Configure ${t.name}`}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="p-2.5 rounded-lg hover:bg-error/10 text-subtle hover:text-error transition-all touch-manipulation active:scale-95"
                                        onClick={() => handleDelete(t._id)}
                                        title="Decommission"
                                        aria-label={`Decommission ${t.name}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 rounded-lg bg-secondary/20 border border-border/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted tracking-wide">Location</span>
                                        <span className="text-xs font-black text-foreground">{t.radius}m Radius</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-dim font-medium">
                                        <MapPin size={12} className="shrink-0" />
                                        <span className="truncate">{t.location.address || `${t.location.lat.toFixed(4)}, ${t.location.lng.toFixed(4)}`}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                        <Clock size={14} className="text-dim" />
                                        {t.officeHours?.startTime} <span className="text-muted text-xs">–</span> {t.officeHours?.endTime}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {t.workMode === 'HYBRID' ? <Home size={12} className="text-dim" /> : <Building2 size={12} className="text-dim" />}
                                        <span className="text-xs font-semibold text-muted tracking-wide">{t.workMode?.charAt(0) + t.workMode?.slice(1).toLowerCase()}</span>
                                    </div>
                                </div>

                                {t.maxWFHDaysPerMonth > 0 && (
                                    <div className="pt-3 border-t border-border/50">
                                        <p className="text-xs text-dim font-medium italic">
                                            Hybrid quota: {t.maxWFHDaysPerMonth} sessions / cycle
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageTeams;
