import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Target, Map as MapIcon, Maximize, X, ZoomIn } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WORLD_EVENTS, ClimatePhase } from '../types';

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Consequence {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  position: [number, number];
  region: string;
}

const CONSEQUENCES: Consequence[] = [
  { id: 'floods', title: 'Inondations', titleFr: 'Inondations au Pérou', description: "El Niño provoque des pluies torrentielles sur la côte péruvienne, entraînant des inondations catastrophiques et la destruction de milliers d'habitations.", icon: '🌊', color: '#1e40af', image: '/image/floods.jpg', position: [-9.19, -75.015], region: 'Amérique du Sud' },
  { id: 'drought', title: 'Sécheresse', titleFr: 'Sécheresse en Australie', description: "El Niño provoque des conditions plus sèches en Australie. Les précipitations diminuent drastiquement, entraînant des sécheresses sévères.", icon: '☀️', color: '#b45309', image: '/image/drought.jpg', position: [-25.27, 133.77], region: 'Océanie' },
  { id: 'fishing', title: 'Crise de la pêche', titleFr: 'Crise de la pêche au Pérou', description: "El Niño affaiblit l'upwelling côtier péruvien : les eaux riches en nutriments ne remontent plus, les stocks d'anchois s'effondrent.", icon: '🐟', color: '#0e7490', image: '/image/fishing.jpg', position: [-15.5, -80.2], region: 'Pacifique Sud-Est' },
  { id: 'fires', title: 'Incendies', titleFr: 'Incendies en Indonésie', description: "La sécheresse intense liée à El Niño assèche les forêts tropicales d'Indonésie. Des incendies gigantesques se déclenchent.", icon: '🔥', color: '#c2410c', image: '/image/fires.jpg', position: [-0.79, 113.92], region: 'Asie du Sud-Est' },
];

function createIcon(emoji: string, color: string, selected: boolean) {
  const size = selected ? 60 : 50;
  const border = selected ? '3px solid white' : '2px solid white';
  const shadow = selected ? `0 0 0 3px ${color}, 0 6px 20px rgba(0,0,0,0.5)` : `0 0 0 2px ${color}, 0 4px 12px rgba(0,0,0,0.4)`;
  return L.divIcon({
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:${border};box-shadow:${shadow};display:flex;align-items:center;justify-content:center;transition:all 0.2s"><span style="transform:rotate(45deg);font-size:${selected ? 26 : 22}px;line-height:1">${emoji}</span></div>`,
    className: '', iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size],
  });
}

interface WorldMapActivityProps {
  phase: ClimatePhase;
  isTeacherMode?: boolean;
}

export default function WorldMapActivity({ phase, isTeacherMode }: WorldMapActivityProps) {
  const [placedEvents, setPlacedEvents] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<Consequence | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isElNino = phase === 'elnino';
  const relevantEvents = WORLD_EVENTS.filter(e => e.phase === phase);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
    const c = CONSEQUENCES.find(x => x.id === id);
    if (c) setActiveCard(c);
  }, []);

  const handleReset = () => { setSelectedId(null); setActiveCard(null); };

  // Drag-drop for existing exercise labels
  const handleDragEnd = (eventId: string, event: any, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = event.clientX ?? (event.touches?.[0]?.clientX ?? info.point.x);
    const clientY = event.clientY ?? (event.touches?.[0]?.clientY ?? info.point.y);
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const target = WORLD_EVENTS.find(e => e.id === eventId);
    if (target) {
      const dist = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
      if (dist < 25) setPlacedEvents(prev => [...prev, eventId]);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <MapIcon size={32} className="text-white" />
            </div>
            <h2 className="text-5xl font-display font-black text-white drop-shadow-lg">Géographie des Impacts</h2>
          </div>
          <p className="text-slate-400 max-w-2xl text-xl mt-2 leading-relaxed font-light">
            Explore la carte interactive des conséquences mondiales d'<span className={isElNino ? "text-orange-500 font-bold" : "text-blue-400 font-bold"}>{isElNino ? 'El Niño' : 'la phase normale'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Progression</span>
            <span className="text-xl font-mono font-black text-white">{placedEvents.length} / {relevantEvents.length}</span>
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${(placedEvents.length / Math.max(relevantEvents.length, 1)) * 100}%` }}
              className={`h-full ${isElNino ? 'bg-orange-500' : 'bg-blue-500'}`} />
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div ref={containerRef} className="relative w-full aspect-[2/1] bg-slate-950 rounded-[3rem] overflow-hidden border-4 border-slate-900 shadow-2xl">
        <button onClick={() => { if (!containerRef.current) return; !document.fullscreenElement ? containerRef.current.requestFullscreen() : document.exitFullscreen(); }}
          className="absolute top-6 right-6 z-[1000] p-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all shadow-2xl active:scale-95" title="Plein écran">
          <Maximize size={20} />
        </button>

        <MapContainer center={[10, 0]} zoom={2} minZoom={2} maxZoom={10}
          style={{ width: '100%', height: '100%' }} worldCopyJump={false}
          maxBounds={[[-90, -180], [90, 180]]} maxBoundsViscosity={0.8}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          {CONSEQUENCES.map(c => (
            <Marker key={c.id} position={c.position}
              icon={createIcon(c.icon, c.color, selectedId === c.id)}
              eventHandlers={{ click: () => handleSelect(c.id) }}>
              <Popup maxWidth={280} className="elnino-popup">
                <div style={{ padding: 4 }}>
                  <div style={{ borderBottom: `2px solid ${c.color}`, paddingBottom: 8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: 14, color: '#1e293b' }}>{c.titleFr}</h3>
                      <span style={{ fontSize: 10, background: c.color, color: 'white', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>{c.region}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{c.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Info panel */}
        {activeCard && (
          <div className="absolute top-4 right-4 z-[1000] w-80 rounded-2xl overflow-hidden text-white"
            style={{ background: 'rgba(10,20,40,0.92)', backdropFilter: 'blur(16px)', border: `1.5px solid ${activeCard.color}55`, boxShadow: `0 8px 32px rgba(0,0,0,0.5)` }}>
            <div className="relative h-44 overflow-hidden cursor-pointer group" onClick={() => setLightboxImage(activeCard.image)}>
              <img src={activeCard.image} alt={activeCard.titleFr} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,20,40,0.95) 100%)' }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn size={32} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="text-3xl">{activeCard.icon}</span>
                <div>
                  <div className="text-white font-black text-base leading-tight">{activeCard.titleFr}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: activeCard.color }}>{activeCard.region}</span>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setActiveCard(null); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform" style={{ background: 'rgba(0,0,0,0.5)' }}>✕</button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-300 leading-relaxed">{activeCard.description}</p>
              <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg text-xs" style={{ background: `${activeCard.color}22`, border: `1px solid ${activeCard.color}44` }}>
                <span className="text-lg mt-0.5">🌡️</span>
                <div>
                  <div className="font-bold mb-0.5" style={{ color: activeCard.color }}>Lien avec El Niño</div>
                  <div className="text-gray-400">
                    {activeCard.id === 'floods' && "Eaux chaudes → évaporation accrue → précipitations extrêmes"}
                    {activeCard.id === 'drought' && "Déplacement de la ZCIT → assèchement de l'Australie"}
                    {activeCard.id === 'fishing' && "Thermocline s'approfondit → upwelling bloqué"}
                    {activeCard.id === 'fires' && "Sécheresse prolongée → incendies incontrôlables"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom legend bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-5 py-2.5 rounded-full text-white text-xs font-medium"
          style={{ background: 'rgba(10,20,40,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <span className="opacity-70">🖱️</span>
          <span className="opacity-80">Cliquez un marqueur pour les infos · Molette pour zoomer</span>
        </div>
      </div>

      {/* Legend chips */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {CONSEQUENCES.map(c => (
          <button key={c.id} onClick={() => handleSelect(c.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 cursor-pointer hover:scale-105"
            style={{ background: selectedId === c.id ? c.color : `${c.color}88`, border: `1.5px solid ${c.color}`, boxShadow: selectedId === c.id ? `0 0 12px ${c.color}88` : 'none' }}>
            <span>{c.icon}</span>{c.title}
          </button>
        ))}
        <button onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-gray-500 bg-gray-700 hover:bg-gray-600 transition-all cursor-pointer hover:scale-105">
          🔄 Réinitialiser
        </button>
      </div>

      {/* Consequence Photos with Enlarge */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {CONSEQUENCES.map(c => (
          <div key={c.id} className="group relative rounded-2xl overflow-hidden border-2 border-slate-800 hover:border-slate-600 transition-all cursor-pointer shadow-lg"
            onClick={() => setLightboxImage(c.image)}>
            <img src={c.image} alt={c.titleFr} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <div className="font-bold text-sm">{c.titleFr}</div>
                  <div className="text-xs text-gray-300">{c.region}</div>
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={18} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-8"
            onClick={() => setLightboxImage(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] w-full" onClick={e => e.stopPropagation()}>
              <img src={lightboxImage} alt="Agrandir" className="w-full h-full object-contain rounded-2xl shadow-2xl" />
              <button onClick={() => setLightboxImage(null)}
                className="absolute -top-4 -right-4 p-3 bg-white text-slate-950 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-2xl">
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise: Drag-Drop Cards */}
      <div className="glass-panel p-10 bg-slate-900/40 border-slate-800 flex flex-col gap-10">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">Anomalies à localiser</h3>
            <p className="text-sm text-slate-500">Fais glisser les cartes vers leur zone d'impact géographique.</p>
          </div>
          {isTeacherMode && (
            <button onClick={() => setPlacedEvents(relevantEvents.map(e => e.id))}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl">
              Solution Professeur
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          {relevantEvents.filter(e => !placedEvents.includes(e.id)).map(event => (
            <motion.div key={event.id} drag dragConstraints={containerRef}
              onDragEnd={(e, info) => handleDragEnd(event.id, e, info)}
              whileDrag={{ scale: 1.05, zIndex: 100, rotate: 2 }} style={{ zIndex: 50 }}
              className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all shadow-xl group flex flex-col gap-2 w-[220px]">
              {event.image ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-blue-500/30 transition-all">
                  <img src={encodeURI(event.image)} alt={event.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white leading-tight">{event.label}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${isElNino ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <Target size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-display font-black text-xs text-white uppercase tracking-wider">{event.label}</h4>
                    <span className="text-[10px] text-slate-400 line-clamp-2">{event.description}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {relevantEvents.length === placedEvents.length && placedEvents.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full p-16 bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 shadow-inner">
              <div className="p-6 bg-emerald-500 rounded-full shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                <CheckCircle2 size={60} className="text-white" />
              </div>
              <div>
                <h4 className="text-3xl font-display font-black text-emerald-400 uppercase tracking-tighter">Cartographie Validée</h4>
                <p className="text-lg text-slate-400 max-w-lg mx-auto mt-4 leading-relaxed">
                  Toutes les anomalies climatiques mondiales ont été correctement localisées.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
