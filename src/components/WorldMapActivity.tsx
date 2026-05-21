import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Target, Map as MapIcon, Maximize, X, ZoomIn, ZoomOut, RotateCcw, Info, HelpCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ClimatePhase } from '../types';

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
  elninoLink: string;
}

const ELNINO_CONSEQUENCES: Consequence[] = [
  {
    id: 'floods',
    title: 'Inondations',
    titleFr: 'Inondations au Pérou',
    description: 'El Niño réchauffe les eaux côtières péruviennes, provoquant une évaporation intense et des pluies diluviennes sur des terres désertiques. Cela engendre des coulées de boue dévastatrices (huaicos) et des crues de rivières historiques.',
    icon: '🌊',
    color: '#3b82f6', // blue
    image: '/image/inondations au perou.jpg',
    position: [-9.19, -75.015],
    region: 'Amérique du Sud',
    elninoLink: 'Eaux océaniques plus chaudes à l\'Est → évaporation accrue → convection atmosphérique massive → pluies torrentielles sur les côtes péruviennes.'
  },
  {
    id: 'drought',
    title: 'Sécheresse',
    titleFr: 'Sécheresse en Australie',
    description: "Le déplacement de la convection atmosphérique vers le centre du Pacifique prive l'Est de l'Australie de ses nuages pluvieux réguliers. Les sols s'assèchent dramatiquement, pénalisant l'élevage et l'agriculture.",
    icon: '☀️',
    color: '#f59e0b', // amber
    image: '/image/secheresse en australie.jpg',
    position: [-25.27, 133.77],
    region: 'Océanie',
    elninoLink: "Affaiblissement des alizés → absence d'ascendance d'air humide sur le continent australien → anticyclone persistant et temps aride."
  },
  {
    id: 'fishing',
    title: 'Crise de la Pêche',
    titleFr: 'Crise de la Pêche au Pérou',
    description: "L'arrivée des eaux chaudes tropicales approfondit la thermocline et bloque l'upwelling côtier. Sans les nutriments des eaux froides profondes, le phytoplancton disparaît, affamant les bancs de poissons (anchois) qui fuient.",
    icon: '🐟',
    color: '#06b6d4', // cyan
    image: '/image/crise de la peche.jpg',
    position: [-15.5, -80.2],
    region: 'Pacifique Sud-Est',
    elninoLink: "Thermocline aplatie → l'upwelling ne pompe plus que de l'eau chaude et pauvre en sels minéraux → effondrement de la chaîne alimentaire marine."
  },
  {
    id: 'fires',
    title: 'Incendies',
    titleFr: 'Incendies en Indonésie',
    description: "L'Indonésie subit une sécheresse extrême similaire à l'Australie. Les forêts primaires et surtout les tourbières asséchées s'enflamment facilement, dégageant un brouillard toxique géant (haze) qui paralyse le transport et l'économie locale.",
    icon: '🔥',
    color: '#ef4444', // red
    image: '/image/incendies en indonésie.jpg',
    position: [-0.79, 113.92],
    region: 'Asie du Sud-Est',
    elninoLink: "Inversion de la cellule de Walker → subsidence d'air sec au-dessus de l'Asie du Sud-Est → sécheresse prononcée propice aux méga-feux."
  }
];

const NORMAL_CONSEQUENCES: Consequence[] = [
  {
    id: 'normal-fishing',
    title: 'Pêche Abondante',
    titleFr: 'Upwelling & Pêche au Pérou',
    description: 'En conditions normales, des alizés puissants et réguliers soufflent d\'Est en Ouest. Ils repoussent les eaux chaudes de surface. Une remontée constante d\'eau froide profonde riche en nutriments fertilise le littoral péruvien.',
    icon: '🐟',
    color: '#10b981', // emerald
    image: '/image/fishing.jpg',
    position: [-15.5, -80.2],
    region: 'Pacifique Sud-Est',
    elninoLink: 'Alizés soutenus d\'Est en Ouest → transport d\'Ekman repoussant l\'eau côtière → remontée d\'eau profonde froide et nutritive → abondance de poissons.'
  },
  {
    id: 'normal-rain',
    title: 'Pluies Fertiles',
    titleFr: 'Pluies de Mousson en Indonésie',
    description: 'Les alizés accumulent l\'eau de surface chaude à l\'Ouest du Pacifique. L\'évaporation y est maximale, créant une zone de basse pression dynamique qui déclenche des précipitations régulières fertiles indispensables aux cultures asiatiques.',
    icon: '🌧️',
    color: '#3b82f6', // blue
    image: '/image/floods.jpg',
    position: [-0.79, 113.92],
    region: 'Asie du Sud-Est',
    elninoLink: 'Piscine d\'eau chaude (>28°C) à l\'Ouest → forte ascendance de l\'air chaud humide → convection vigoureuse → pluies bienfaisantes de mousson.'
  },
  {
    id: 'normal-dry',
    title: 'Climat Sec',
    titleFr: 'Climat Sec Stable au Pérou',
    description: 'La présence permanente d\'eau froide sur la côte péruvienne refroidit les basses couches de l\'atmosphère. Cela stabilise l\'air et empêche la formation de nuages de pluie, maintenant le climat côtier aride et stable.',
    icon: '🌵',
    color: '#6b7280', // gray
    image: '/image/drought.jpg',
    position: [-9.19, -75.015],
    region: 'Amérique du Sud',
    elninoLink: 'Eau de surface froide → refroidissement de l\'air inférieur → inversion thermique → stabilité verticale → absence totale de précipitations.'
  }
];

const ELNINO_STARTS: Record<string, [number, number]> = {
  floods: [0, -110],
  drought: [0, -135],
  fishing: [0, -160],
  fires: [0, 165]
};

const NORMAL_STARTS: Record<string, [number, number]> = {
  'normal-fishing': [0, -115],
  'normal-rain': [0, -145],
  'normal-dry': [0, 160]
};

function createCustomIcon(emoji: string, color: string, selected: boolean, isPlaced: boolean) {
  const size = selected ? 56 : 46;
  const border = selected ? `3px solid white` : `2px solid white`;
  const shadow = selected
    ? `0 0 0 3px ${color}, 0 6px 20px rgba(0,0,0,0.5)`
    : isPlaced 
      ? `0 0 0 2px ${color}, 0 4px 12px rgba(0,0,0,0.3)`
      : `0 0 12px ${color}88, 0 4px 10px rgba(0,0,0,0.4)`;
  
  const html = `
    <div style="
      background: ${isPlaced ? color : '#1e293b'};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: ${border};
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    ">
      <span style="transform: rotate(45deg); font-size: ${selected ? 22 : 18}px; line-height:1;">
        ${emoji}
      </span>
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export default function WorldMapActivity({ phase }: { phase: ClimatePhase; isTeacherMode?: boolean }) {
  const isElNino = phase === 'elnino';
  const consequences = isElNino ? ELNINO_CONSEQUENCES : NORMAL_CONSEQUENCES;
  const defaultStarts = isElNino ? ELNINO_STARTS : NORMAL_STARTS;

  const [markerPositions, setMarkerPositions] = useState<Record<string, [number, number]>>(defaultStarts);
  const [correctPlaced, setCorrectPlaced] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<Consequence | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset states when the climate phase changes
  useEffect(() => {
    setMarkerPositions(defaultStarts);
    const initialCorrect: Record<string, boolean> = {};
    consequences.forEach(c => {
      initialCorrect[c.id] = false;
    });
    setCorrectPlaced(initialCorrect);
    setSelectedId(null);
    setActiveCard(null);
  }, [phase]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
    const c = consequences.find(x => x.id === id);
    if (c) setActiveCard(c);
  }, [consequences]);

  const handleReset = () => {
    setMarkerPositions(defaultStarts);
    const resetCorrect: Record<string, boolean> = {};
    consequences.forEach(c => {
      resetCorrect[c.id] = false;
    });
    setCorrectPlaced(resetCorrect);
    setSelectedId(null);
    setActiveCard(null);
  };

  const handleMarkerDragEnd = (id: string, latlng: L.LatLng) => {
    const target = consequences.find(c => c.id === id);
    if (!target) return;

    // Calculate absolute distance in degrees (latitude / longitude)
    const latDiff = Math.abs(latlng.lat - target.position[0]);
    const lngDiff = Math.abs(latlng.lng - target.position[1]);

    // If within ~8.5 degrees, snap it to the correct coordinate!
    if (latDiff < 8.5 && lngDiff < 8.5) {
      setMarkerPositions(prev => ({ ...prev, [id]: target.position }));
      setCorrectPlaced(prev => ({ ...prev, [id]: true }));
      setSelectedId(id);
      setActiveCard(target);
    } else {
      setMarkerPositions(prev => ({ ...prev, [id]: [latlng.lat, latlng.lng] }));
    }
  };

  const score = Object.values(correctPlaced).filter(Boolean).length;
  const isFinished = consequences.length > 0 && score === consequences.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <MapIcon size={24} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-wider">Cartographie des Impacts</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Positionnez les étiquettes d'anomalies sur la carte en les faisant glisser depuis l'océan Pacifique central vers leurs zones d'impact géographiques.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">Diagnostic</span>
            <span className="text-sm font-mono font-black text-white mt-1">{score} / {consequences.length} Placées</span>
          </div>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${(score / consequences.length) * 100}%` }}
              className={`h-full ${isElNino ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          </div>
        </div>
      </div>

      {/* Leaflet Map Area */}
      <div ref={containerRef} className="relative w-full aspect-[2/1] bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        {/* Fullscreen Button */}
        <button onClick={() => { if (!containerRef.current) return; !document.fullscreenElement ? containerRef.current.requestFullscreen() : document.exitFullscreen(); }}
          className="absolute top-6 right-6 z-[1000] p-2.5 bg-slate-900/80 hover:bg-slate-900/100 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all shadow-2xl active:scale-95 cursor-pointer" title="Plein écran">
          <Maximize size={18} />
        </button>

        <MapContainer center={[5, -40]} zoom={2} minZoom={2} maxZoom={9}
          style={{ width: '100%', height: '100%', background: '#090d16' }} worldCopyJump={false}
          maxBounds={[[-75, -180], [75, 180]]} maxBoundsViscosity={0.85}>
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          
          {/* Target Zones (dashed circles) */}
          {consequences.map(c => (
            <Circle
              key={`target-${c.id}`}
              center={c.position}
              radius={800000} // ~800km Target Radius
              pathOptions={{
                color: c.color,
                dashArray: '6, 8',
                fillColor: c.color,
                fillOpacity: correctPlaced[c.id] ? 0.3 : 0.08,
                weight: correctPlaced[c.id] ? 3 : 2,
              }}
            />
          ))}

          {/* Draggable Markers */}
          {consequences.map(c => {
            const isPlaced = correctPlaced[c.id] || false;
            const currentPos = markerPositions[c.id] || defaultStarts[c.id];
            
            return (
              <Marker
                key={c.id}
                position={currentPos}
                draggable={!isPlaced}
                icon={createCustomIcon(c.icon, c.color, selectedId === c.id, isPlaced)}
                eventHandlers={{
                  click: () => handleSelect(c.id),
                  dragend: (e) => {
                    const marker = e.target;
                    if (marker) {
                      handleMarkerDragEnd(c.id, marker.getLatLng());
                    }
                  }
                }}
              />
            );
          })}
        </MapContainer>

        {/* Side Panel Info Panel */}
        <AnimatePresence>
          {activeCard && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-4 right-4 bottom-4 z-[1000] w-80 rounded-[2rem] overflow-y-auto text-white flex flex-col shadow-2xl border border-slate-800"
              style={{ background: 'rgba(10,20,40,0.92)', backdropFilter: 'blur(20px)' }}
            >
              {/* Photo section */}
              <div className="relative h-40 shrink-0 overflow-hidden cursor-pointer group" onClick={() => { setZoomLevel(1); setLightboxImage(activeCard.image); }}>
                <img src={activeCard.image} alt={activeCard.titleFr} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                  <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white shadow-lg">
                    <ZoomIn size={20} />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-2xl">{activeCard.icon}</span>
                  <div>
                    <h3 className="text-white font-display font-black text-sm leading-none drop-shadow">{activeCard.titleFr}</h3>
                    <span className="text-[9px] font-semibold text-slate-300 uppercase tracking-widest mt-1 inline-block">{activeCard.region}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setActiveCard(null); }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-xl flex items-center justify-center bg-slate-900/60 hover:bg-slate-900 text-white text-xs border border-white/10 hover:border-white/20 transition-all cursor-pointer">✕</button>
              </div>

              {/* Text Content */}
              <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Info size={10} /> DESCRIPTION
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeCard.description}</p>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 flex flex-col gap-1.5" style={{ background: `${activeCard.color}10`, borderColor: `${activeCard.color}25` }}>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-black" style={{ color: activeCard.color }}>
                    🌡️ Lien scientifique
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{activeCard.elninoLink}</p>
                </div>

                <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Coordonnées :</span>
                  <span className="text-slate-400 font-bold">📍 {activeCard.position[0].toFixed(2)}°, {activeCard.position[1].toFixed(2)}°</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Legend Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-5 py-2.5 rounded-full text-white text-[10px] font-mono font-bold uppercase tracking-wider"
          style={{ background: 'rgba(10,20,40,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <span className="text-blue-400">🖱️ Glissez</span>
          <span className="text-slate-400">les ronds colorés</span>
          <span className="opacity-30">|</span>
          <span className="text-emerald-400">Cible</span>
          <span className="text-slate-400">en pointillés</span>
        </div>
      </div>

      {/* Game Legend & Reset Button */}
      <div className="flex items-center gap-3 flex-wrap justify-between bg-slate-900/20 p-4 rounded-3xl border border-slate-800/60">
        <div className="flex gap-2 flex-wrap items-center">
          {consequences.map(c => (
            <button key={c.id} onClick={() => handleSelect(c.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white transition-all duration-300 cursor-pointer hover:scale-[1.03] border"
              style={{
                background: correctPlaced[c.id] ? `${c.color}25` : '#1e293b50',
                borderColor: correctPlaced[c.id] ? c.color : '#33415550',
                boxShadow: selectedId === c.id ? `0 0 15px ${c.color}50` : 'none'
              }}
            >
              <span>{c.icon}</span>
              <span className="uppercase tracking-wider text-[10px]">{c.title}</span>
              {correctPlaced[c.id] && <span className="text-emerald-400 ml-1">✓</span>}
            </button>
          ))}
        </div>
        <button onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest text-slate-300 hover:text-white border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer hover:scale-[1.03] active:scale-95 shrink-0"
        >
          <RotateCcw size={12} />
          Réinitialiser le jeu
        </button>
      </div>

      {/* Grid of Consequences with Photos & Lightbox */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Documentation Photographique</p>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
            📸 Preuves & Témoignages Visuels
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {consequences.map(c => (
            <div key={c.id} className="group relative rounded-3xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all cursor-pointer shadow-lg bg-slate-900/40"
              onClick={() => { setZoomLevel(1); setLightboxImage(c.image); }}>
              <div className="h-44 overflow-hidden relative">
                <img src={c.image} alt={c.titleFr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 right-3 p-2 bg-slate-950/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg leading-none">{c.icon}</span>
                  <span className="text-xs font-display font-black text-white leading-tight">{c.titleFr}</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{c.region}</span>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed mt-1 font-sans">{c.description}</p>
                
                {/* Visual game indicator */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-500">Statut :</span>
                  {correctPlaced[c.id] ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">✓ Placé</span>
                  ) : (
                    <span className="text-amber-500 font-bold flex items-center gap-1 animate-pulse">● À placer</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finished Modal overlay */}
      {isFinished && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="w-full p-12 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 mt-6 shadow-inner relative overflow-hidden"
        >
          {/* Decorative glowing backplate */}
          <div className="absolute -inset-10 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="p-4 bg-emerald-500 rounded-full text-white shadow-xl shadow-emerald-500/30 animate-bounce relative z-10">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <div className="relative z-10 max-w-xl flex flex-col gap-2">
            <h4 className="text-2xl font-display font-black text-emerald-400 uppercase tracking-wider leading-none">Diagnostic Climatique Validé !</h4>
            <p className="text-sm text-slate-300 leading-relaxed mt-2 font-sans">
              Félicitations ! Vous avez correctement identifié et géolocalisé toutes les anomalies {isElNino ? 'liées au phénomène El Niño' : 'en conditions normales'} sur le globe.
            </p>
          </div>
        </motion.div>
      )}

      {/* Premium Lightbox with Interactive Zoom & Reset */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}>
            
            {/* Top Bar Controls */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-[10000]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 text-white font-mono text-xs bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
                <span>🔍 Zoom : </span>
                <span className="text-blue-400 font-bold">{(zoomLevel * 100).toFixed(0)}%</span>
              </div>
              
              {/* Controls group */}
              <div className="flex items-center gap-2">
                <button onClick={() => setZoomLevel(z => Math.min(z + 0.25, 3))}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-white/20 rounded-2xl text-white/80 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center" title="Zoomer">
                  <ZoomIn size={16} />
                </button>
                <button onClick={() => setZoomLevel(z => Math.max(z - 0.25, 1))}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-white/20 rounded-2xl text-white/80 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center" title="Dézoomer">
                  <ZoomOut size={16} />
                </button>
                <button onClick={() => setZoomLevel(1)}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-white/20 rounded-2xl text-white/80 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center" title="Réinitialiser le zoom">
                  <RotateCcw size={16} />
                </button>
                <span className="w-[1px] h-6 bg-white/15 mx-1" />
                <button onClick={() => setLightboxImage(null)}
                  className="p-3 bg-white text-slate-950 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center font-bold">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Image display wrapper */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center cursor-default" onClick={e => e.stopPropagation()}>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/40 p-2 shadow-2xl flex items-center justify-center max-w-full max-h-full">
                <div className="overflow-auto max-w-full max-h-[75vh] flex items-center justify-center no-scrollbar rounded-2xl">
                  <img
                    src={lightboxImage}
                    alt="Agrandissement"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      maxHeight: '70vh',
                      objectContain: 'contain'
                    }}
                    className="rounded-xl shadow-inner max-w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
