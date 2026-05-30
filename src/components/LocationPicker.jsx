import { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 }; // Hyderabad, India
const DEFAULT_ZOOM = 14;

/**
 * Reusable Google Maps location picker.
 *
 * Props:
 *   lat, lng         — current coordinates (null = no pin yet)
 *   radius           — geofence radius in meters (optional, shows circle)
 *   address          — display address text
 *   onLocationChange — callback({ lat, lng, address })
 *   showRadius       — whether to show the radius circle (default false)
 *   height           — map height (default '350px')
 *   disabled         — disables interactions (default false)
 */
const LocationPicker = ({
    lat,
    lng,
    radius = 200,
    address = '',
    onLocationChange,
    showRadius = false,
    height = '350px',
    disabled = false,
}) => {
    const [searchText, setSearchText] = useState(address || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [markerPos, setMarkerPos] = useState(
        lat != null && lng != null ? { lat: Number(lat), lng: Number(lng) } : null
    );
    const [displayAddress, setDisplayAddress] = useState(address);
    const mapCenter = markerPos || DEFAULT_CENTER;
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Sync from props when editing existing location
    useEffect(() => {
        if (lat != null && lng != null) {
            setMarkerPos({ lat: Number(lat), lng: Number(lng) });
        }
    }, [lat, lng]);

    useEffect(() => {
        setDisplayAddress(address || '');
        setSearchText(address || '');
    }, [address]);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reverse geocode lat/lng to address
    const reverseGeocode = useCallback(async (position) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await geocoder.geocode({ location: position });
            if (result.results && result.results[0]) {
                return result.results[0].formatted_address;
            }
        } catch {
            // Geocoding failed, return coords as fallback
        }
        return `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
    }, []);

    // Handle map click — place/move marker
    const handleMapClick = useCallback(async (e) => {
        if (disabled) return;
        const pos = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
        setMarkerPos(pos);
        const addr = await reverseGeocode(pos);
        setDisplayAddress(addr);
        onLocationChange?.({ lat: pos.lat, lng: pos.lng, address: addr });
    }, [disabled, onLocationChange, reverseGeocode]);

    // Autocomplete — fetch suggestions as user types
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchText(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!value.trim() || value.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            try {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions(
                    { input: value, types: ['establishment', 'geocode'] },
                    (predictions, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                            setSuggestions(predictions.slice(0, 5));
                            setShowSuggestions(true);
                        } else {
                            setSuggestions([]);
                            setShowSuggestions(false);
                        }
                    }
                );
            } catch {
                setSuggestions([]);
            }
        }, 300);
    }, []);

    // Select a suggestion — geocode it and pin
    const handleSelectSuggestion = useCallback(async (suggestion) => {
        setSearchText(suggestion.description);
        setSuggestions([]);
        setShowSuggestions(false);

        try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await geocoder.geocode({ placeId: suggestion.place_id });
            if (result.results && result.results[0]) {
                const loc = result.results[0].geometry.location;
                const pos = { lat: loc.lat(), lng: loc.lng() };
                const addr = result.results[0].formatted_address;
                setMarkerPos(pos);
                setDisplayAddress(addr);
                onLocationChange?.({ lat: pos.lat, lng: pos.lng, address: addr });
            }
        } catch {
            // Geocode failed
        }
    }, [onLocationChange]);

    // Fallback: search on Enter or button click
    const handleSearchSubmit = useCallback(async () => {
        if (!searchText.trim()) return;
        setShowSuggestions(false);

        try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await geocoder.geocode({ address: searchText });
            if (result.results && result.results[0]) {
                const loc = result.results[0].geometry.location;
                const pos = { lat: loc.lat(), lng: loc.lng() };
                const addr = result.results[0].formatted_address;
                setMarkerPos(pos);
                setDisplayAddress(addr);
                onLocationChange?.({ lat: pos.lat, lng: pos.lng, address: addr });
            }
        } catch {
            // Search failed
        }
    }, [searchText, onLocationChange]);

    if (!API_KEY) {
        return (
            <div style={{
                border: '2px dashed var(--border)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div>
                    <p style={{ marginBottom: '8px' }}>⚠️ Google Maps API key missing</p>
                    <p style={{ fontSize: '0.8rem' }}>Add <code>VITE_GOOGLE_MAPS_API_KEY</code> and <code>VITE_GOOGLE_MAP_ID</code> to <code>client/.env</code></p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider apiKey={API_KEY} libraries={['places']}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Search bar with autocomplete */}
                {!disabled && (
                    <div ref={searchRef} style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                className="form-input"
                                placeholder="Search location (e.g., MG Road, Hyderabad)"
                                value={searchText}
                                onChange={handleSearchChange}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchSubmit(); } }}
                                style={{ flex: 1 }}
                                autoComplete="off"
                            />
                            <button type="button" className="btn btn-primary" onClick={handleSearchSubmit} style={{ whiteSpace: 'nowrap' }}>
                                🔍 Search
                            </button>
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'var(--t-surface)',
                                border: '1px solid var(--t-line)',
                                borderRadius: '0 0 8px 8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                overflow: 'hidden',
                            }}>
                                {suggestions.map((s) => (
                                    <div
                                        key={s.place_id}
                                        onClick={() => handleSelectSuggestion(s)}
                                        style={{
                                            padding: '10px 14px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--t-line)',
                                            fontSize: '0.875rem',
                                            color: 'var(--t-bright)',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--t-raised)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span style={{ marginRight: '8px' }}>📍</span>
                                        <strong>{s.structured_formatting?.main_text}</strong>
                                        <span style={{ color: 'var(--t-subtle)', marginLeft: '6px' }}>
                                            {s.structured_formatting?.secondary_text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Map */}
                <div style={{ height, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <Map
                        defaultCenter={mapCenter}
                        center={markerPos || undefined}
                        defaultZoom={DEFAULT_ZOOM}
                        gestureHandling="cooperative"
                        disableDefaultUI={false}
                        onClick={handleMapClick}
                        mapId={import.meta.env.VITE_GOOGLE_MAP_ID || 'uma-location-picker'}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {markerPos && (
                            <AdvancedMarker position={markerPos} />
                        )}
                        {markerPos && showRadius && (
                            <RadiusCircle center={markerPos} radius={radius} />
                        )}
                    </Map>
                </div>

                {/* Address display */}
                {displayAddress && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        📍 {displayAddress}
                    </p>
                )}
                {markerPos && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        Coordinates: {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                    </p>
                )}
            </div>
        </APIProvider>
    );
};

/**
 * Draws a circle on the map for the geofence radius.
 */
const RadiusCircle = ({ center, radius }) => {
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
                strokeColor: '#4285F4',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#4285F4',
                fillOpacity: 0.15,
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

export default LocationPicker;
