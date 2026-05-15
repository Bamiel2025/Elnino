import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Target, Waves, Maximize, EyeOff } from 'lucide-react';
import { ClimatePhase, SIMULATION_LABELS } from '../types';
import { OceanSimulator } from '../simulation/OceanSimulator';
import { ModeSelector } from '../simulation/ModeSelector';
import { InfoPanel } from '../simulation/InfoPanel';
import { Legend } from '../simulation/Legend';
import { StatsBar } from '../simulation/StatsBar';
import { MODES, ModeConfig, ClimateMode } from '../simulation/types';

interface PacificViewProps {
  phase: ClimatePhase;
  intensity: number;
  isTeacherMode?: boolean;
}

function getModeFromPhase(phase: ClimatePhase): ClimateMode {
  return phase === 'elnino' ? 'elnino' : 'normal';
}

export default function PacificView({ phase, intensity, isTeacherMode }: PacificViewProps) {
  const [placedLabels, setPlacedLabels] = useState<Record<string, string>>({});
  const [showRefImage, setShowRefImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation state
  const [activeId, setActiveId] = useState<ClimateMode>(getModeFromPhase(phase));
  const [prevMode, setPrevMode] = useState<ModeConfig | null>(null);
  const [animTick, setAnimTick] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  // Sync activeId with parent phase prop
  useEffect(() => {
    const newId = getModeFromPhase(phase);
    if (newId !== activeId) {
      const current = MODES.find(m => m.id === activeId) ?? null;
      setPrevMode(current);
      setActiveId(newId);
    }
  }, [phase]);

  // Animation ticker
  useEffect(() => {
    const tick = (ts: number) => {
      if (ts - lastRef.current > 16) {
        setAnimTick(p => p + 1);
        lastRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleModeChange = (id: ClimateMode) => {
    const current = MODES.find(m => m.id === activeId) ?? null;
    setPrevMode(current);
    setActiveId(id);
  };

  const activeMode = MODES.find(m => m.id === activeId)!;

  const ACCENT: Record<ClimateMode, { ring: string; badge: string }> = {
    normal: { ring: 'ring-blue-500/40', badge: 'bg-blue-600' },
    elnino: { ring: 'ring-red-500/40', badge: 'bg-red-600' },
    lanina: { ring: 'ring-cyan-400/40', badge: 'bg-cyan-600' },
  };
  const accent = ACCENT[activeId];

  const dropZones = [
    { id: 'winds', x: '50%', y: '35%', label: 'Circulation des Alizés' },
    { id: 'upwelling', x: '92%', y: '75%', label: 'Zone de Nutriments' },
    { id: 'rain', x: phase === 'normal' ? '15%' : '55%', y: '15%', label: 'Convection Tropicale' },
  ];

  const currentLabels = SIMULATION_LABELS.filter(l => {
    if (phase === 'normal') return ['alizes-forts', 'upwelling-ok', 'rain-asia'].includes(l.id);
    else return ['alizes-faibles', 'upwelling-stop', 'rain-center'].includes(l.id);
  });

  const handleDragEnd = (labelId: string, event: any, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = event.clientX ?? (event.touches && event.touches.length > 0 ? event.touches[0].clientX : info.point.x);
    const clientY = event.clientY ?? (event.touches && event.touches.length > 0 ? event.touches[0].clientY : info.point.y);
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const label = SIMULATION_LABELS.find(l => l.id === labelId);
    if (!label) return;
    const targetZone = dropZones.find(z => z.id === label.targetZoneId);
    if (targetZone) {
      const tx = parseFloat(targetZone.x);
      const ty = parseFloat(targetZone.y);
      const distance = Math.sqrt(Math.pow(x - tx, 2) + Math.pow(y - ty, 2));
      if (distance < 25) setPlacedLabels(prev => ({ ...prev, [label.targetZoneId]: label.text }));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Mode Selector ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center">Choisir un mode de simulation</p>
        <ModeSelector modes={MODES} activeId={activeId} onChange={handleModeChange} />
      </div>

      {/* ── Main Simulator Canvas ─────────────────────────────────── */}
      <div className={`rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl ring-2 ${accent.ring} transition-all duration-500`}>
        {/* Canvas header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${accent.badge} text-white`}>
              {activeMode.emoji} {activeMode.label}
            </span>
            <span className="text-xs text-slate-500 hidden sm:block">· Simulation en direct</span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">Océan Pacifique · vue en coupe (Ouest → Est)</p>
        </div>

        {/* Canvas */}
        <div className="p-3">
          <OceanSimulator mode={activeMode} prevMode={prevMode} animTick={animTick} />
        </div>

        {/* Legend */}
        <div className="border-t border-slate-800 px-4 py-3 bg-slate-900/50">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Légende</p>
          <Legend />
        </div>
      </div>

      {/* ── Info Panel (causes / consequences) ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg">
          <h2 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <span className="text-base">{activeMode.emoji}</span>
            {activeMode.label}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">{activeMode.description}</p>
          <InfoPanel mode={activeMode} />
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">📊 Indicateurs</p>
          <StatsBar mode={activeMode} />
        </div>
      </div>

      {/* ── Comparative table ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">⚖️ Tableau comparatif</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-2.5 text-left text-slate-500 font-medium w-36">Paramètre</th>
                {MODES.map(m => (
                  <th key={m.id} className={`px-4 py-2.5 text-center font-semibold ${m.id === activeId ? 'text-white bg-slate-800' : 'text-slate-400'}`}>
                    {m.emoji} {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Alizés', normal: '💨 Modérés → Ouest', elnino: '💤 Faibles / inversés', lanina: '🌪 Très forts → Ouest' },
                { label: 'Eaux chaudes', normal: '🟠 Pacifique Ouest', elnino: '🔴 Pacifique Centre-Est', lanina: '🟢 Pacifique Ouest (plus)' },
                { label: 'Upwelling (Pérou)', normal: '🌊 Modéré', elnino: '⛔ Quasi absent', lanina: '⬆ Très intense' },
                { label: 'Thermocline', normal: '📐 Inclinée', elnino: '📏 Aplatie / inversée', lanina: '📐 Très inclinée' },
                { label: 'Pluies', normal: '🌧 Asie / Australie', elnino: '⛈ Pérou / Équateur', lanina: '🌩 Asie (intense)' },
                { label: 'SST Est', normal: '≈ Normale', elnino: '🔴 +2 à +4 °C', lanina: '🔵 −1 à −2 °C' },
              ].map((row, i) => (
                <tr key={row.label} className={`border-b border-slate-800/50 ${i % 2 === 0 ? '' : 'bg-slate-900/50'}`}>
                  <td className="px-4 py-2.5 text-slate-500 font-medium">{row.label}</td>
                  <td className={`px-4 py-2.5 text-center text-slate-300 ${activeId === 'normal' ? 'bg-slate-800 text-white font-medium' : ''}`}>{row.normal}</td>
                  <td className={`px-4 py-2.5 text-center text-slate-300 ${activeId === 'elnino' ? 'bg-slate-800 text-white font-medium' : ''}`}>{row.elnino}</td>
                  <td className={`px-4 py-2.5 text-center text-slate-300 ${activeId === 'lanina' ? 'bg-slate-800 text-white font-medium' : ''}`}>{row.lanina}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Label Drop Activity ───────────────────────────────────── */}
      <div ref={containerRef} className="relative w-full aspect-[21/9] bg-[#020617] rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-600 text-xs font-mono">
            <div className="text-4xl mb-2">🗺️</div>
            <div>Zone de dépôt des étiquettes</div>
            <div className="text-slate-700 mt-1">Phase : {phase === 'normal' ? 'Normale' : 'El Niño'}</div>
          </div>
        </div>

        {/* Fullscreen */}
        <button
          onClick={() => { if (!containerRef.current) return; !document.fullscreenElement ? containerRef.current.requestFullscreen() : document.exitFullscreen(); }}
          className="absolute top-8 right-8 z-50 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all shadow-2xl active:scale-95"
          title="Plein écran"
        >
          <Maximize size={20} />
        </button>

        {/* Drop zones */}
        {dropZones.map(zone => (
          <div key={zone.id} style={{ left: zone.x, top: zone.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-40 h-20 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 z-30 ${placedLabels[zone.id] ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'border-white/10 bg-white/5 backdrop-blur-[4px] hover:border-white/30 hover:bg-white/10'}`}>
            {placedLabels[zone.id] ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.8)] border border-emerald-400">
                <CheckCircle2 size={20} className="text-white drop-shadow" />
                <span className="text-sm font-display font-black text-white uppercase tracking-wider leading-none drop-shadow">{placedLabels[zone.id]}</span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center opacity-40"><Target size={24} className="text-white" /></div>
            )}
          </div>
        ))}

        {/* Reference modal */}
        <AnimatePresence>
          {showRefImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md p-12 flex items-center justify-center">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-4xl w-full">
                <img src="/image/situation normale versus elnino.jpg" alt="Reference" className="w-full h-auto rounded-[2rem] shadow-2xl border border-white/20" />
                <button onClick={() => setShowRefImage(false)} className="absolute -top-6 -right-6 p-4 bg-white text-slate-950 rounded-full hover:bg-blue-400 hover:text-white transition-all shadow-2xl">
                  <EyeOff size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Label drag deck ───────────────────────────────────────── */}
      <div className="glass-panel p-10 bg-gradient-to-r from-slate-900/60 to-slate-950/60 border-slate-800 flex flex-col gap-8 relative z-[60]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-3">
              <Waves className="text-blue-500" />
              Étiquettes à placer
            </h3>
            <p className="text-slate-400 text-sm">Glisse les étiquettes dans les zones correspondantes du schéma ci-dessus.</p>
          </div>
          {isTeacherMode && (
            <button
              onClick={() => { const sol: Record<string, string> = {}; currentLabels.forEach(l => { sol[l.targetZoneId] = l.text; }); setPlacedLabels(sol); }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
              Résoudre Automatiquement
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-5 min-h-[80px] items-center">
          {currentLabels.filter(l => !Object.values(placedLabels).includes(l.text)).map(label => (
            <motion.div key={label.id} drag dragConstraints={containerRef}
              onDragEnd={(e, info) => handleDragEnd(label.id, e, info)}
              whileDrag={{ scale: 1.1, zIndex: 9999 }} style={{ zIndex: 100 }}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-4 shadow-xl group relative z-[100]">
              <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:bg-blue-400 transition-colors"><Target size={18} /></div>
              <span className="text-sm font-display font-black text-slate-200 uppercase tracking-wider">{label.text}</span>
            </motion.div>
          ))}

          {currentLabels.length === Object.keys(placedLabels).length && currentLabels.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex items-center gap-6 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl shadow-inner">
              <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/40"><CheckCircle2 size={32} /></div>
              <div className="flex flex-col gap-1">
                <span className="text-lg font-display font-black text-emerald-400 uppercase tracking-tighter">Diagnostic Validé</span>
                <span className="text-xs text-slate-400 font-medium">Tous les paramètres sont identifiés.</span>
              </div>
              <button onClick={() => setPlacedLabels({})} className="ml-auto text-[10px] font-black text-slate-600 hover:text-red-500 transition-colors uppercase tracking-[0.2em]">
                Recommencer
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
