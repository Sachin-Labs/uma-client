import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LocationPicker from '../../components/LocationPicker';
import {
    Building2,
    ShieldCheck,
    Clock,
    CreditCard,
    Calendar,
    MapPin,
    Save,
    Loader2,
    Info,
    ArrowRight,
    Check,
    AlertCircle
} from 'lucide-react';

const Settings = () => {
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', officeHours: { startTime: '09:00', endTime: '18:00' } });
    const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { fetchOrg(); }, []);

    const fetchOrg = async () => {
        try {
            const { data } = await api.get('/organisation');
            setOrg(data.data);
            setForm({
                name: data.data.name,
                officeHours: data.data.officeHours || { startTime: '09:00', endTime: '18:00' }
            });
            if (data.data.officeLocation) {
                setLocation({
                    lat: data.data.officeLocation.lat,
                    lng: data.data.officeLocation.lng,
                    address: data.data.officeLocation.address || '',
                });
            }
        } catch { /* ignore */ }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.put('/organisation', form);
            setSuccess('Protocol updated successfully.');
            fetchOrg();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    const handleLocationSave = async () => {
        setError('');
        setSuccess('');
        if (!location.lat || !location.lng) {
            setError('Geographic coordinates not detected.');
            return;
        }
        try {
            await api.put('/organisation', {
                officeLocation: { lat: location.lat, lng: location.lng, address: location.address },
            });
            setSuccess('Geographic anchor updated.');
            fetchOrg();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Navigation failure');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 size={32} className="animate-spin text-muted" />
                <p className="text-xs font-medium tracking-wide text-dim">Loading protocols...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1 border-b border-border pb-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Settings
                    <ShieldCheck className="text-dim opacity-40 shrink-0" size={20} />
                </h1>
                <p className="text-[15px] text-dim font-medium">Configure company settings and office hours</p>
            </div>

            {(success || error) && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-xs font-semibold tracking-wide ${success ? 'bg-success/10 text-success' : 'bg-secondary/20 text-foreground border border-border'
                    }`}>
                    {success ? <Check size={16} /> : <AlertCircle size={16} />}
                    {success || error}
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-10">
                {/* General Settings Section */}
                <section className="space-y-4">
                    <div className="flex flex-col gap-1 px-1">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground flex items-center gap-2">
                            <Building2 size={16} className="text-muted" />
                            General Information
                        </h2>
                        <p className="text-xs text-muted font-medium">Basic organizational details and operational hours</p>
                    </div>
                    
                    <div className="card p-4 sm:p-8 border-border/60">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted tracking-wide ml-1 uppercase">Company Name</label>
                                <input
                                    className="form-input text-sm h-[46px] font-medium"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted tracking-wide ml-1 flex items-center gap-1.5 uppercase">
                                        <Clock size={10} /> Office opens
                                    </label>
                                    <input
                                        type="time"
                                        className="form-input text-sm h-[46px] font-bold"
                                        value={form.officeHours.startTime}
                                        onChange={(e) => setForm({ ...form, officeHours: { ...form.officeHours, startTime: e.target.value } })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted tracking-wide ml-1 flex items-center gap-1.5 uppercase">
                                        <Clock size={10} /> Office closes
                                    </label>
                                    <input
                                        type="time"
                                        className="form-input text-sm h-[46px] font-bold"
                                        value={form.officeHours.endTime}
                                        onChange={(e) => setForm({ ...form, officeHours: { ...form.officeHours, endTime: e.target.value } })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button
                                    type="submit"
                                    className="px-8 h-[52px] bg-accent text-accent-fg text-xs font-bold tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-3 hover:bg-accent-hover active:scale-[0.98] transition-all"
                                >
                                    <Save size={18} />
                                    Update Organization
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Office Location Section */}
                <section className="space-y-4">
                    <div className="flex flex-col gap-1 px-1">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground flex items-center gap-2">
                            <MapPin size={16} className="text-muted" />
                            Office Location
                        </h2>
                        <p className="text-xs text-muted font-medium">Manage the geographic coordinates for attendance tracking</p>
                    </div>

                    <div className="card p-4 sm:p-8 border-border/60">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border pb-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">Geographic Anchor</h3>
                                <p className="text-xs text-dim font-semibold tracking-wide opacity-60">
                                    Set the primary coordinates for your main office
                                </p>
                            </div>
                            <button
                                className="px-8 h-[46px] bg-accent text-accent-fg text-xs font-semibold tracking-wide uppercase rounded-xl hover:bg-accent-hover active:scale-95 transition-all"
                                onClick={handleLocationSave}
                            >
                                Save Location
                            </button>
                        </div>

                        <div className="rounded-2xl overflow-hidden border-2 border-border shadow-inner group">
                            <LocationPicker
                                lat={location.lat}
                                lng={location.lng}
                                address={location.address}
                                onLocationChange={(loc) => setLocation(loc)}
                                height="450px"
                            />
                        </div>

                        {location.address && (
                            <div className="mt-8 p-6 rounded-xl bg-raised border border-border flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-background border border-border">
                                    <Info size={20} className="text-dim" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted tracking-wide uppercase">Verified Office Address</p>
                                    <p className="text-sm font-bold text-foreground leading-relaxed">{location.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
