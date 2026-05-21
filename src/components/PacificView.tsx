import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Target, Waves, Maximize, Eye, X, ZoomIn } from 'lucide-react';
import { ClimatePhase, SIMULATION_LABELS } from '../types';
import { OceanSimulator } from '../simulation/OceanSimulator';
import { ModeSelector } from '../simulation/ModeSelector';
import { InfoPanel } from '../simulation/InfoPanel';
import { Legend } from '../simulation/Legend';
import { StatsBar } from '../simulation/StatsBar';
import { MODES, ModeConfig, ClimateMode } from '../simulation/types';
import { QuizSection } from './QuizSection';

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
      <div ref={containerRef} className="relative w-full aspect-[21/9] bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        {/* Render the live OceanSimulator inside the drop zone container as the background! */}
        <div className="absolute inset-0 w-full h-full opacity-65 pointer-events-none z-10 flex items-center justify-center">
          <OceanSimulator mode={activeMode} prevMode={prevMode} animTick={animTick} />
        </div>

        {/* Dark overlay to increase contrast of UI elements */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none z-20" />

        {/* Help button */}
        <button
          onClick={() => setShowRefImage(true)}
          className="absolute top-8 right-24 z-50 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-900/100 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-2xl active:scale-95 flex items-center gap-2 cursor-pointer"
          title="Schéma de référence"
        >
          <Eye size={16} className="text-blue-400" />
          Aide : Schéma
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => { if (!containerRef.current) return; !document.fullscreenElement ? containerRef.current.requestFullscreen() : document.exitFullscreen(); }}
          className="absolute top-8 right-8 z-50 p-2.5 bg-slate-900/80 hover:bg-slate-900/100 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl text-white/60 hover:text-white transition-all shadow-2xl active:scale-95 cursor-pointer"
          title="Plein écran"
        >
          <Maximize size={18} />
        </button>

        {/* Drop zones */}
        {dropZones.map(zone => (
          <div key={zone.id} style={{ left: zone.x, top: zone.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-44 h-22 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 z-30 ${placedLabels[zone.id] ? 'border-emerald-500 bg-slate-950/80 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'border-white/20 bg-slate-950/50 backdrop-blur-[4px] hover:border-white/40 hover:bg-slate-950/70'}`}>
            {placedLabels[zone.id] ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.8)] border border-emerald-400">
                <CheckCircle2 size={18} className="text-white drop-shadow" />
                <span className="text-xs font-display font-black text-white uppercase tracking-wider leading-none drop-shadow">{placedLabels[zone.id]}</span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 opacity-60">
                <Target size={20} className="text-slate-400 animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">{zone.label}</span>
              </div>
            )}
          </div>
        ))}

        {/* Reference modal with lightbox zoom */}
        <AnimatePresence>
          {showRefImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md p-8 flex items-center justify-center cursor-zoom-out"
              onClick={() => setShowRefImage(false)}>
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center cursor-default" onClick={e => e.stopPropagation()}>
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                  <img src="/image/situation normale versus elnino.jpg" alt="Schémas comparatifs El Niño vs Normal" className="w-full h-auto max-h-[75vh] object-contain" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 text-center">
                    <h4 className="text-lg font-display font-extrabold text-white uppercase tracking-wider">
                      Schéma Pédagogique de Référence - Normal vs El Niño
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Utilisez ces schémas pour localiser et comprendre les processus physiques.</p>
                  </div>
                </div>
                <button onClick={() => setShowRefImage(false)} className="absolute -top-4 -right-4 p-3 bg-white text-slate-950 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-2xl cursor-pointer">
                  <X size={20} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Label drag deck ───────────────────────────────────────── */}
      <div className="glass-panel p-8 bg-gradient-to-r from-slate-900/60 to-slate-950/60 border border-slate-800 rounded-3xl flex flex-col gap-6 relative z-[40]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
              <Waves className="text-blue-500 animate-pulse" size={20} />
              Étiquettes à placer
            </h3>
            <p className="text-slate-400 text-xs">Faites glisser les étiquettes dans les zones correspondantes sur l'animation en direct ci-dessus.</p>
          </div>
          {isTeacherMode && (
            <button
              onClick={() => { const sol: Record<string, string> = {}; currentLabels.forEach(l => { sol[l.targetZoneId] = l.text; }); setPlacedLabels(sol); }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 cursor-pointer">
              Résoudre Automatiquement
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 min-h-[60px] items-center">
          {currentLabels.filter(l => !Object.values(placedLabels).includes(l.text)).map(label => (
            <motion.div key={label.id} drag dragConstraints={containerRef}
              onDragEnd={(e, info) => handleDragEnd(label.id, e, info)}
              whileDrag={{ scale: 1.1, zIndex: 9999 }} style={{ zIndex: 100 }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 shadow-xl group relative z-[50]">
              <div className="p-1.5 bg-blue-500 rounded-lg text-white group-hover:bg-blue-400 transition-colors"><Target size={14} /></div>
              <span className="text-xs font-display font-black text-slate-200 uppercase tracking-wider">{label.text}</span>
            </motion.div>
          ))}

          {currentLabels.length === Object.keys(placedLabels).length && currentLabels.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-inner">
              <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/40"><CheckCircle2 size={24} /></div>
              <div className="flex flex-col">
                <span className="text-sm font-display font-black text-emerald-400 uppercase tracking-tighter leading-none">Diagnostic Validé</span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">Tous les processus de cette phase sont identifiés.</span>
              </div>
              <button onClick={() => setPlacedLabels({})} className="ml-auto text-[9px] font-black text-slate-500 hover:text-red-500 transition-colors uppercase tracking-[0.2em] cursor-pointer">
                Recommencer
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Quiz Section ─────────────────────────────────────────── */}
      <QuizSection />
    </div>
  );
}
