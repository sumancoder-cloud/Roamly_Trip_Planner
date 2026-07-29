import { FiMap, FiMapPin, FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';

import { useAuth } from '@/_core/hooks/useAuth.jsx';

function formatDistanceMeters(m) {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  return `${Math.round(m)} m`;
}

export default function NearbyPlaces({ defaultLat = 51.5074, defaultLon = -0.1278 }) {
  const { saveTrip, user } = useAuth();
  const [location, setLocation] = useState({ lat: defaultLat, lon: defaultLon });
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [justSaved, setJustSaved] = useState(null);

  useEffect(() => {
    // Try to get browser geolocation
    if (!navigator?.geolocation) return fetchPlaces(location.lat, location.lon);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });
        fetchPlaces(lat, lon);
      },
      () => {
        // fallback to default
        fetchPlaces(location.lat, location.lon);
      },
      { timeout: 5000 }
    );
  }, []);

  async function fetchPlaces(lat, lon) {
    try {
      setLoading(true);
      setError('');
      const q = `/api/places?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=5000`;
      const res = await fetch(q);
      const data = await res.json();
      if (data?.success && Array.isArray(data.places)) {
        setPlaces(data.places.map((p) => ({ ...p, distance: null })));
      } else if (Array.isArray(data.places)) {
        setPlaces(data.places);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      setError('Could not load nearby places');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }

  const mapSrc = (() => {
    const lat = selected?.lat ?? location.lat;
    const lon = selected?.lon ?? location.lon;
    const delta = 0.03;
    const left = lon - delta;
    const bottom = lat - delta;
    const right = lon + delta;
    const top = lat + delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
  })();

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-50 p-2 text-emerald-700"><FiMapPin className="h-4 w-4" /></div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Nearby places</div>
            <div className="text-xs text-slate-500">Based on your current location</div>
          </div>
        </div>
        <div className="text-sm text-slate-500">{loading ? 'Loading…' : `${places.length} places`}</div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          {error ? (
            <div className="text-sm text-rose-600">{error}</div>
          ) : places.length === 0 ? (
            <div className="text-sm text-slate-500">No places found nearby.</div>
          ) : (
            <div className="space-y-3">
              {places.map((p) => (
                <div key={p.id} className={`rounded-[1rem] border ${selected?.id === p.id ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-white'} p-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{p.category}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => setSelected(p)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">Center</button>
                      <button
                        onClick={() => {
                          if (!user) return setJustSaved('Please login to save trips');
                          const trip = {
                            tripTitle: `Saved place: ${p.name}`,
                            destination: p.name,
                            durationDays: 1,
                            pace: 'Leisure',
                            stops: [{ name: p.name, lat: p.lat, lon: p.lon }],
                            savedAt: Date.now(),
                          };
                          saveTrip(trip);
                          setJustSaved(`${p.name} saved`);
                          setTimeout(() => setJustSaved(null), 2200);
                        }}
                        className="rounded-full bg-emerald-600 px-3 py-1 text-xs text-white"
                      >
                        <FiPlus className="inline-block mr-1 h-3 w-3" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {justSaved ? <div className="mt-3 text-sm text-emerald-700">{justSaved}</div> : null}
        </div>
        <div className="h-44 w-full overflow-hidden rounded-[1rem] border border-slate-100">
          <iframe title="Nearby map" src={mapSrc} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
