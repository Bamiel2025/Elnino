import { motion, AnimatePresence } from 'motion/react';
import { Wind, Droplets, ArrowUp, Thermometer, Info, Target, Eye, EyeOff, Waves, CloudRain, Sun, CheckCircle2, Maximize, Minimize } from 'lucide-react';
import { ClimatePhase, SIMULATION_LABELS } from '../types';
import { useState, useRef } from 'react';

interface PacificViewProps {
  phase: ClimatePhase;
  intensity: number;
  isTeacherMode?: boolean;
}

export default function PacificView({ phase, intensity, isTeacherMode }: PacificViewProps) {
  const [placedLabels, setPlacedLabels] = useState<Record<string, string>>({});
  const [showRefImage, setShowRefImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isElNinoLike = intensity > 0.5;

  const dropZones = [
    { id: 'winds', x: '50%', y: '35%', label: 'Circulation des Alizés' },
    { id: 'upwelling', x: '92%', y: '75%', label: 'Zone de Nutriments' },
    { id: 'rain', x: phase === 'normal' ? '15%' : '55%', y: '15%', label: 'Convection Tropicale' },
  ];

  const currentLabels = SIMULATION_LABELS.filter(l => {
    if (phase === 'normal') {
      return ['alizes-forts', 'upwelling-ok', 'rain-asia'].includes(l.id);
    } else {
      return ['alizes-faibles', 'upwelling-stop', 'rain-center'].includes(l.id);
    }
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
      if (distance < 25) {
        setPlacedLabels(prev => ({ ...prev, [label.targetZoneId]: label.text }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Simulation Container */}
      <div 
        ref={containerRef} 
        className="relative w-full aspect-[21/9] bg-[#020617] rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
      >
        {/* High-End Background: Two separate images with cross-fade */}
        <div className="absolute inset-0 z-0 bg-[#020617]">
           <AnimatePresence mode="wait">
             <motion.img 
               key={phase}
               src={phase === 'normal' ? "/image/situation normale.jpg" : "/image/situation elnino.jpg"}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               alt={`Situation ${phase}`}
               className="w-full h-full object-cover"
               style={{ imageRendering: 'high-quality' }}
             />
           </AnimatePresence>
           
           {/* Intensity-based overlay for micro-adjustments */}
           <motion.div 
             animate={{ opacity: intensity > 0.5 ? (intensity - 0.5) * 2 : 0 }}
             className="absolute inset-0 pointer-events-none bg-orange-500/10 mix-blend-overlay"
           />
        </div>

        {/* Atmospheric Circulation (Walker Cell) - Dynamic elements over the image */}
        <div className="absolute inset-x-48 top-16 h-64 z-10">
           <div className="relative w-full h-full">
              {/* Cloud and Convection */}
              <motion.div
                animate={{ x: `${10 + 55 * intensity}%` }}
                className="absolute top-0 flex flex-col items-center"
              >
                 <motion.div 
                    animate={{ scale: [1, 1.1, 1], y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative"
                 >
                    <CloudRain size={80} className="text-white/80 drop-shadow-2xl" />
                    <div className="absolute inset-0 bg-white blur-3xl opacity-20" />
                 </motion.div>
                 
                 {/* Heavy Rain Particles */}
                 <div className="flex gap-3 mt-4">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, 100], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="text-blue-400"
                      >
                         <Droplets size={12} strokeWidth={3} />
                      </motion.div>
                    ))}
                 </div>
              </motion.div>

               {/* Trade Winds (Winds arrows) - Refined SVG version */}
               <motion.div 
                 animate={{ opacity: 1 - (intensity * 0.8) }}
                 className="absolute right-20 top-1/2 w-full"
               >
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className="absolute flex items-center gap-2" style={{ top: i * 40, right: 0 }}>
                        <svg width="200" height="20" viewBox="0 0 200 20" className="opacity-40">
                           <motion.path 
                              d="M200,10 L0,10" 
                              stroke="white" 
                              strokeWidth="2" 
                              strokeDasharray="5,10"
                              animate={{ strokeDashoffset: [0, 100] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                           />
                           <path d="M5,5 L0,10 L5,15" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                        <Wind size={16} className="text-white/40" />
                     </div>
                  ))}
               </motion.div>

               {/* Ocean Current - Subsurface Animation */}
               <div className="absolute inset-x-0 bottom-10 h-20 pointer-events-none">
                  <svg width="100%" height="100%" preserveAspectRatio="none">
                     <motion.path 
                        d="M0,50 Q250,20 500,50 T1000,50" 
                        fill="none" 
                        stroke={isElNinoLike ? "#f97316" : "#3b82f6"} 
                        strokeWidth="4" 
                        strokeOpacity="0.3"
                        strokeDasharray="20,40"
                        animate={{ strokeDashoffset: isElNinoLike ? [0, -100] : [0, 100] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     />
                  </svg>
               </div>
               </div>
           </div>

         {/* Fullscreen Toggle Button */}
         <button 
           onClick={() => {
              if (!containerRef.current) return;
              if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
           }}
           className="absolute top-8 right-8 z-50 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all shadow-2xl active:scale-95"
           title="Plein écran"
         >
            <Maximize size={20} />
         </button>

        {/* Drop Targets (High-End Design) */}
        {dropZones.map(zone => (
          <div 
            key={zone.id}
            style={{ left: zone.x, top: zone.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-40 h-20 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 z-30 ${
              placedLabels[zone.id] 
                ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.3)]' 
                : 'border-white/10 bg-white/5 backdrop-blur-[4px] hover:border-white/30 hover:bg-white/10'
            }`}
          >
            {placedLabels[zone.id] ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.8)] border border-emerald-400">
                 <CheckCircle2 size={20} className="text-white drop-shadow" />
                 <span className="text-sm font-display font-black text-white uppercase tracking-wider leading-none drop-shadow">
                   {placedLabels[zone.id]}
                 </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <Target size={24} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Reference Image Modal */}
        <AnimatePresence>
          {showRefImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md p-12 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative max-w-4xl w-full"
              >
                <img src="/image/situation normale versus elnino.jpg" alt="Reference" className="w-full h-auto rounded-[2rem] shadow-2xl border border-white/20" />
                <button 
                  onClick={() => setShowRefImage(false)}
                  className="absolute -top-6 -right-6 p-4 bg-white text-slate-950 rounded-full hover:bg-blue-400 hover:text-white transition-all shadow-2xl"
                >
                  <EyeOff size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Activity Footer */}
      <div className="glass-panel p-10 bg-gradient-to-r from-slate-900/60 to-slate-950/60 border-slate-800 flex flex-col gap-8 relative z-[60]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-3">
               <Waves className="text-blue-500" />
               Analyse du Pacifique Équatorial
            </h3>
            <p className="text-slate-400 text-sm">Complète le schéma en plaçant les étiquettes sur les mécanismes actifs de la phase actuelle.</p>
          </div>
          {isTeacherMode && (
            <button 
              onClick={() => {
                const solution: Record<string, string> = {};
                currentLabels.forEach(l => { solution[l.targetZoneId] = l.text; });
                setPlacedLabels(solution);
              }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Résoudre Automatiquement
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-5 min-h-[80px] items-center">
          {currentLabels.filter(l => !Object.values(placedLabels).includes(l.text)).map(label => (
            <motion.div
              key={label.id}
              drag
              dragConstraints={containerRef}
              onDragEnd={(e, info) => handleDragEnd(label.id, e, info)}
              whileDrag={{ scale: 1.1, zIndex: 9999 }}
              style={{ zIndex: 100 }}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-4 shadow-xl group relative z-[100]"
            >
              <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:bg-blue-400 transition-colors">
                <Target size={18} />
              </div>
              <span className="text-sm font-display font-black text-slate-200 uppercase tracking-wider">{label.text}</span>
            </motion.div>
          ))}
          
          {currentLabels.length === Object.keys(placedLabels).length && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex items-center gap-6 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl shadow-inner"
            >
               <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 size={32} />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-lg font-display font-black text-emerald-400 uppercase tracking-tighter">Diagnostic Validé</span>
                  <span className="text-xs text-slate-400 font-medium">Tous les paramètres de la phase {phase === 'normal' ? 'Normale' : 'El Niño'} sont identifiés.</span>
               </div>
               <button 
                  onClick={() => setPlacedLabels({})}
                  className="ml-auto text-[10px] font-black text-slate-600 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                >
                  Recommencer
                </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
