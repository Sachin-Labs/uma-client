import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { 
    MapPin, 
    Home, 
    Building, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    RefreshCw, 
    Loader2, 
    Check, 
    ArrowRight,
    LogOut,
    Clock,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

// Haversine distance (same formula as backend)
const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
};

const MarkAttendance = () => {
    const [todayRecord, setTodayRecord] = useState(null);
    const [workType, setWorkType] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [locating, setLocating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        checkToday();
        fetchTeam();
        getLocation();
    }, []);

    const checkToday = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await api.get('/attendance/my', { params: { startDate: today, endDate: today } });
            const records = data.data.records || [];
            if (records.length > 0) setTodayRecord(records[0]);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const fetchTeam = async () => {
        try {
            const { data } = await api.get('/teams/my');
            setTeamData(data.data);
        } catch { /* ignore */ }
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocating(false);
                    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setUserLocation(loc);
                    resolve(loc);
                },
                (err) => {
                    setLocating(false);
                    reject(err);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    };

    const handleCheckIn = async () => {
        setError('');
        setSuccess('');
        try {
            let loc = userLocation;
            if (!loc) loc = await getLocation();
            const { data } = await api.post('/attendance/check-in', {
                lat: loc?.lat,
                lng: loc?.lng,
                workType: workType || undefined,
            });
            setTodayRecord(data.data);
            setSuccess('Attendance registered successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Check-in failed');
        }
    };

    const handleCheckOut = async () => {
        setError('');
        setSuccess('');
        try {
            const { data } = await api.patch('/attendance/check-out');
            setTodayRecord(data.data);
            setSuccess('Checkout complete. Have a great day!');
        } catch (err) {
            setError(err.response?.data?.message || 'Check-out failed');
        }
    };

    const distance = userLocation && teamData?.location
        ? haversineDistance(userLocation.lat, userLocation.lng, teamData.location.lat, teamData.location.lng)
        : null;
    const isWithinRadius = distance !== null && teamData ? distance <= teamData.radius : false;
    const distanceToTravel = distance !== null && teamData ? Math.max(0, distance - teamData.radius) : null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-dim gap-4">
                <Loader2 size={32} className="animate-spin opacity-50" />
                <p className="text-xs font-semibold tracking-wide animate-pulse text-center">Initializing system...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-8">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Attendance
                    </h1>
                    <p className="text-xs text-dim font-semibold tracking-wide opacity-60">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                {todayRecord && !todayRecord.checkOut && (
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-success/10 text-success rounded-full text-xs font-semibold tracking-wide">
                        <Activity size={12} className="animate-pulse" />
                        Currently checked in
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                <div className="lg:col-span-3 space-y-8">
                    {/* Status Alerts */}
                    {error && (
                        <div className="flex items-center gap-4 p-5 bg-secondary/5 border-2 border-border/40 rounded-2xl text-[15px] text-foreground">
                            <AlertTriangle size={20} className="text-foreground shrink-0" />
                            <p className="font-bold tracking-wide">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-4 p-5 bg-success/10 text-success rounded-2xl text-[15px]">
                            <CheckCircle2 size={20} className="shrink-0" />
                            <p className="font-semibold tracking-wide">{success}</p>
                        </div>
                    )}

                    {!todayRecord ? (
                        <div className="card space-y-10 p-4 sm:p-8 border-border/60 relative overflow-hidden backdrop-blur-sm bg-background/50">
                            {/* Work Type Selection */}
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-[13px] font-bold tracking-tight text-foreground/80">Select work mode</h3>
                                    <p className="text-xs text-dim italic opacity-60 font-medium">Where are you working from today?</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: 'OFFICE', label: 'In Office', icon: Building, desc: 'Location verified' },
                                        { id: 'WFH', label: 'Remote', icon: Home, desc: 'Self-declaration' },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setWorkType(type.id)}
                                            className={`
                                                flex flex-col items-start gap-4 p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden
                                                ${workType === type.id 
                                                    ? 'bg-foreground border-foreground text-background' 
                                                    : 'bg-secondary/5 border-border hover:border-foreground/30 text-dim'}
                                            `}
                                        >
                                            <div className={`p-2 rounded-xl ${workType === type.id ? 'bg-background/20 text-background' : 'bg-surface border border-line text-foreground'}`}>
                                                <type.icon size={20} />
                                            </div>
                                            <div className="text-left">
                                                <span className="text-[13px] font-bold block">{type.label}</span>
                                                <span className={`text-xs font-semibold tracking-wide uppercase opacity-50 ${workType === type.id ? 'text-background' : 'text-dim'}`}>
                                                    {type.desc}
                                                </span>
                                            </div>
                                            {workType === type.id && (
                                                <div className="absolute top-4 right-4 bg-background text-foreground rounded-full p-0.5">
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Location UI */}
                            {workType === 'OFFICE' && (
                                <div className="space-y-6 pt-6 border-t border-border/40">
                                    <div className="space-y-1">
                                        <h3 className="text-[13px] font-bold tracking-tight text-foreground/80">Location verification</h3>
                                        <p className="text-xs text-dim italic opacity-60 font-medium">Automatic GPS presence check</p>
                                    </div>

                                    {locating ? (
                                        <div className="p-8 rounded-2xl bg-secondary/5 border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="animate-spin text-foreground opacity-40" size={24} />
                                            <p className="text-xs font-semibold tracking-wide text-dim uppercase">Finding your coordinates...</p>
                                        </div>
                                    ) : userLocation ? (
                                        <div className={`
                                            p-6 rounded-2xl border transition-all duration-500
                                            ${isWithinRadius 
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'}
                                        `}>
                                            <div className="flex items-center gap-5">
                                                <div className={`
                                                    p-2.5 rounded-xl border
                                                    ${isWithinRadius ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-amber-500 text-white border-amber-500'}
                                                `}>
                                                    {isWithinRadius ? <ShieldCheck size={20} /> : <MapPin size={20} />}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[13px] font-bold">
                                                        {isWithinRadius 
                                                            ? 'Location Verified' 
                                                            : `Distance: ${formatDistance(distance)}`}
                                                    </p>
                                                    <p className="text-xs font-semibold opacity-70 tracking-wide">
                                                        {isWithinRadius 
                                                            ? `You are ${formatDistance(distance)} from headquarters` 
                                                            : `Move ${formatDistance(distanceToTravel)} closer to designated zone`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-2xl bg-secondary/5 border border-border flex flex-col items-center justify-center gap-4">
                                            <MapPin className="text-muted opacity-30" size={32} />
                                            <button 
                                                onClick={getLocation}
                                                className="btn btn-outline btn-sm px-6"
                                            >
                                                Authorize GPS Access
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="pt-6">
                                <button
                                    onClick={handleCheckIn}
                                    disabled={locating || !workType || (workType === 'OFFICE' && !userLocation)}
                                    className="btn btn-primary btn-lg btn-block flex items-center justify-center gap-3 py-4"
                                >
                                    {locating ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>Check-in System <ArrowRight size={18} strokeWidth={3} /></>
                                    )}
                                </button>
                                
                                {userLocation && !locating && workType === 'OFFICE' && (
                                    <button 
                                        onClick={getLocation}
                                        className="w-full text-xs font-semibold text-dim text-center hover:text-foreground transition-colors tracking-wide mt-4 uppercase opacity-50"
                                    >
                                        <RefreshCw size={10} className="inline mr-2" /> 
                                        Refresh location hex-code
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card p-0 border-border/60 relative overflow-hidden backdrop-blur-md bg-background/50">
                            {/* Status Header */}
                            <div className="bg-foreground text-background p-10 text-center relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-background/10 backdrop-blur-md border border-background/20 flex items-center justify-center">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold tracking-tight">System Active</h3>
                                        <p className="text-xs font-semibold tracking-wide uppercase opacity-60">
                                            Authenticated at {new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </p>
                                    </div>
                                </div>
                                {/* Subtle background pattern/glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                            </div>
                            
                            {/* Summary Grid */}
                            <div className="p-4 sm:p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-secondary/5 border border-border/40">
                                        <p className="text-xs text-muted font-semibold tracking-wide uppercase mb-1">Status</p>
                                        <span className="text-[13px] font-bold text-foreground">
                                            {todayRecord.status?.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-secondary/5 border border-border/40">
                                        <p className="text-xs text-muted font-semibold tracking-wide uppercase mb-1">Work Mode</p>
                                        <span className="text-[13px] font-bold text-foreground">
                                            {todayRecord.workType === 'OFFICE' ? 'In Office' : 'Remote Work'}
                                        </span>
                                    </div>
                                </div>

                                {!todayRecord.checkOut ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleCheckOut}
                                            className="btn btn-outline btn-lg btn-block py-4 flex items-center justify-center gap-3 group border-2 border-border/60"
                                        >
                                            Terminate Session <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-center text-xs font-semibold text-muted uppercase tracking-wide opacity-60">
                                            Last sync: Just now
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-8 pt-8 border-t border-line">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted font-semibold tracking-wide uppercase">Total Duration</p>
                                                <p className="text-2xl font-bold tracking-tight text-foreground">
                                                    {Math.floor(todayRecord.totalWorkingMinutes / 60)}h <span className="text-sm font-medium opacity-40">{todayRecord.totalWorkingMinutes % 60}m</span>
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-xs text-muted font-semibold tracking-wide uppercase">Checkout</p>
                                                <p className="text-sm font-bold text-foreground italic">
                                                    {new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {workType === 'OFFICE' && (
                        <div className="card !p-0 overflow-hidden border-border/60 group bg-background/50 backdrop-blur-sm">
                            <div className="p-5 border-b border-border/40 flex items-center justify-between">
                                <h3 className="text-xs font-semibold tracking-wide text-dim uppercase">Geo-spatial Matrix</h3>
                                <div className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground group-hover:animate-ping" />
                                </div>
                            </div>
                            {teamData?.location && (
                                <AttendanceMap
                                    userLocation={userLocation}
                                    officeLocation={teamData.location}
                                    radius={teamData.radius}
                                    isWithinRadius={isWithinRadius}
                                />
                            )}
                            <div className="p-6 space-y-4 bg-secondary/5">
                                <div className="flex items-center gap-4 text-xs font-semibold tracking-wide uppercase">
                                    <div className="w-3 h-3 rounded bg-foreground shrink-0" />
                                    <span className="text-foreground">Designated HQ</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-semibold tracking-wide uppercase">
                                    <div className="w-3 h-3 rounded-full border-2 border-foreground shrink-0" />
                                    <span className="text-dim">Your Signature</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-8 rounded-3xl bg-foreground text-background space-y-8 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="opacity-40" />
                                <h4 className="text-xs font-semibold tracking-wide uppercase">Protocol Checklist</h4>
                            </div>
                            <ul className="space-y-4 text-xs leading-relaxed font-bold tracking-wide opacity-70">
                                <li className="flex gap-4">
                                    <span className="opacity-30">01</span>
                                    <span>Ensure GPS stabilizes before initializing check-in.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="opacity-30">02</span>
                                    <span>Home declaration is logged for remote verification.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="opacity-30">03</span>
                                    <span>Synchronize with HQ boundaries for office sessions.</span>
                                </li>
                            </ul>
                        </div>
                        {/* Decorative glow */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-background/5 rounded-full blur-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Maps Components
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const AttendanceMap = ({ userLocation, officeLocation, radius, isWithinRadius }) => {
    if (!API_KEY) return (
        <div className="h-[400px] bg-secondary/5 flex items-center justify-center p-10 text-center border-b border-border/40">
            <div className="space-y-3">
                <AlertTriangle className="mx-auto text-dim opacity-30" size={32} />
                <p className="text-xs text-dim font-semibold tracking-wide leading-loose">
                    Map unavailable <br/> Unable to load your location
                </p>
            </div>
        </div>
    );

    const center = userLocation || officeLocation;

    return (
        <APIProvider apiKey={API_KEY}>
            <div className="h-[400px] w-full border-b border-border/40 bg-muted/30">
                <Map
                    defaultCenter={center}
                    defaultZoom={15}
                    gestureHandling="cooperative"
                    disableDefaultUI={true}
                    zoomControl={false}
                    mapId={import.meta.env.VITE_GOOGLE_MAP_ID || 'sina-people-monochrome-matrix'}
                    style={{ width: '100%', height: '100%', filter: 'grayscale(1) contrast(1.1) brightness(0.95)' }}
                >
                    {/* Office marker */}
                    <AdvancedMarker position={officeLocation}>
                        <div className="bg-foreground text-background px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-background shadow-lg shadow-foreground/20">
                            HQ-CORE
                        </div>
                    </AdvancedMarker>

                    {/* Employee marker */}
                    {userLocation && (
                        <AdvancedMarker position={userLocation}>
                            <div className="relative">
                                <div className={`w-4 h-4 rounded-full border-2 bg-background transition-all duration-700 ${isWithinRadius ? 'border-foreground' : 'border-amber-500 animate-bounce'}`} />
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isWithinRadius ? 'bg-foreground' : 'bg-amber-500'}`} />
                            </div>
                        </AdvancedMarker>
                    )}

                    <GeofenceCircle center={officeLocation} radius={radius} />
                </Map>
            </div>
        </APIProvider>
    );
};

const GeofenceCircle = ({ center, radius }) => {
    const map = useMap();
    const circleRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        if (circleRef.current) {
            circleRef.current.setCenter(center);
            circleRef.current.setRadius(radius);
        } else {
            circleRef.current = new window.google.maps.Circle({
                map,
                center,
                radius,
                strokeColor: '#000000',
                strokeOpacity: 0.1,
                strokeWeight: 2,
                fillColor: '#000000',
                fillOpacity: 0.05,
            });
        }

        return () => {
            if (circleRef.current) {
                circleRef.current.setMap(null);
                circleRef.current = null;
            }
        };
    }, [map, center, radius]);

    return null;
};

export default MarkAttendance;
