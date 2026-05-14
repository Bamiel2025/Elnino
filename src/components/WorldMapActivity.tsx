import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Fish, Target, Info, Map as MapIcon, ChevronRight, Globe, Maximize, X } from 'lucide-react';
import { WORLD_EVENTS, ClimatePhase } from '../types';
import { useState, useRef } from 'react';

interface WorldMapActivityProps {
  phase: ClimatePhase;
  isTeacherMode?: boolean;
}

export default function WorldMapActivity({ phase, isTeacherMode }: WorldMapActivityProps) {
  const [placedEvents, setPlacedEvents] = useState<string[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isElNino = phase === 'elnino';

  const relevantEvents = WORLD_EVENTS.filter(e => e.phase === phase);

  const handleDragEnd = (eventId: string, event: any, info: any) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = event.clientX ?? (event.touches && event.touches.length > 0 ? event.touches[0].clientX : info.point.x);
    const clientY = event.clientY ?? (event.touches && event.touches.length > 0 ? event.touches[0].clientY : info.point.y);
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const targetEvent = WORLD_EVENTS.find(e => e.id === eventId);
    if (targetEvent) {
      const distance = Math.sqrt(Math.pow(x - targetEvent.x, 2) + Math.pow(y - targetEvent.y, 2));
      if (distance < 25) { 
        setPlacedEvents(prev => [...prev, eventId]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header with Phase Context */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)]">
               <MapIcon size={32} className="text-white" />
            </div>
            <h2 className="text-5xl font-display font-black text-white drop-shadow-lg">
              Géographie des Impacts
            </h2>
          </div>
          <p className="text-slate-400 max-w-2xl text-xl mt-2 leading-relaxed font-light">
            Le dérèglement thermique du Pacifique se propage par ondes atmosphériques. 
            Identifie les zones critiques touchées par la phase <span className={isElNino ? "text-orange-500 font-bold" : "text-blue-400 font-bold"}>{isElNino ? 'EL NIÑO' : 'NORMALE'}</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
           <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Progression</span>
              <span className="text-xl font-mono font-black text-white">{placedEvents.length} / {relevantEvents.length}</span>
           </div>
           <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(placedEvents.length / relevantEvents.length) * 100}%` }}
                className={`h-full ${isElNino ? 'bg-orange-500' : 'bg-blue-500'}`} 
              />
           </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full aspect-[2/1] bg-slate-950 rounded-[3rem] overflow-hidden border-4 border-slate-900 shadow-2xl group/map">
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
           className="absolute top-6 right-6 z-50 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all shadow-2xl active:scale-95"
           title="Plein écran"
         >
            <Maximize size={20} />
         </button>
        {/* Real World Map Image with Zoom Effect */}
        {/*
          IMPORTANT: This path expects the 'carteconsequences' folder to be present in the 'public' directory.
          The file name inside the folder is assumed to be 'carte_globale.jpg'.
          If you haven't uploaded it yet, please do so for the new map to work.
        */}
        <motion.img 
          src="/carteconsequences/carte_globale.jpg"
          alt="World Map Impacts" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/map:scale-[1.02] transition-transform duration-[2000ms] ease-out"
          style={{ imageRendering: 'high-quality' }}
          onError={(e) => {
            // Fallback to original image if folder is not yet present
            const target = e.target as HTMLImageElement;
            target.src = "/image/carte consequences mondiales elnino.jpg";
          }}
        />

        {/* Dynamic Atmospheric Glow (Waves from Pacific) */}
        <AnimatePresence>
          {isElNino && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
               {[...Array(3)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ scale: 0.5, opacity: 0 }}
                   animate={{ scale: [1, 2], opacity: [0, 0.1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border-[40px] border-orange-500/20 rounded-full"
                 />
               ))}
            </div>
          )}
        </AnimatePresence>

        {/* Drop Targets (Pins) */}
        {relevantEvents.map((event) => {
          const isPlaced = placedEvents.includes(event.id);
          return (
            <div
              key={event.id}
              style={{ left: `${event.x}%`, top: `${event.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
            >
              {/* The Target Area */}
              <div className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-700 ${
                isPlaced 
                  ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.4)] scale-125' 
                  : 'border-white/20 bg-black/40 backdrop-blur-md hover:border-white/50'
              }`}>
                {isPlaced ? (
                  <CheckCircle2 size={28} className="text-emerald-300" />
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-20 group-hover/map:opacity-40 transition-opacity">
                     <Target size={24} className="text-white" />
                  </div>
                )}
              </div>
              
              {/* Event Label or Image (Animated in) */}
              <AnimatePresence>
                {isPlaced && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`mt-4 ${event.image ? 'p-2' : 'px-4 py-2'} bg-slate-900 border-2 border-emerald-500 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap shadow-[0_0_40px_rgba(0,0,0,0.8)] z-[60] backdrop-blur-md`}
                  >
                    {event.image ? (
                      <div
                        className="relative cursor-zoom-in"
                        onClick={() => setZoomedImage(event.image || null)}
                      >
                        <img src={encodeURI(event.image)} alt={event.label} className="w-56 h-36 object-cover rounded-lg shadow-md border border-slate-700" />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
                           <span className="text-xs text-white drop-shadow-md">{event.label}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm">{event.label}</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}


      </div>

      {/* Interactive Activity Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="glass-panel p-10 bg-slate-900/40 border-slate-800 flex flex-col gap-10">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">Anomalies à localiser</h3>
                <p className="text-sm text-slate-500">Fais glisser les cartes vers leur zone d'impact géographique.</p>
              </div>
              {isTeacherMode && (
                <button 
                  onClick={() => setPlacedEvents(relevantEvents.map(e => e.id))}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  Solution Professeur
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-6">
              {relevantEvents.filter(e => !placedEvents.includes(e.id)).map(event => (
                <motion.div
                  key={event.id}
                  drag
                  dragConstraints={containerRef}
                  onDragEnd={(e, info) => handleDragEnd(event.id, e, info)}
                  whileDrag={{ scale: 1.05, zIndex: 100, rotate: 2 }}
                  style={{ zIndex: 50 }}
                  className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all shadow-xl group flex flex-col gap-2 w-[220px]"
                >
                  {event.image ? (
                    <div
                      className="relative w-full h-32 rounded-xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-blue-500/30 transition-all cursor-zoom-in"
                      onClick={() => setZoomedImage(event.image || null)}
                    >
                       <img src={encodeURI(event.image)} alt={event.label} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-3">
                          <span className="text-xs font-bold text-white leading-tight shadow-black">{event.label}</span>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isElNino ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {event.id.includes('fishing') ? <Fish size={20} /> : <AlertTriangle size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-display font-black text-xs text-white uppercase tracking-wider">{event.label}</h4>
                        <span className="text-[10px] text-slate-400 line-clamp-2">{event.description}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {relevantEvents.length === placedEvents.length && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full p-16 bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 shadow-inner"
                >
                   <div className="p-6 bg-emerald-500 rounded-full shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                      <CheckCircle2 size={60} className="text-white" />
                   </div>
                   <div>
                      <h4 className="text-3xl font-display font-black text-emerald-400 uppercase tracking-tighter">Cartographie Validée</h4>
                      <p className="text-lg text-slate-400 max-w-lg mx-auto mt-4 leading-relaxed">
                        Toutes les anomalies climatiques mondiales ont été correctement localisées pour cette phase.
                      </p>
                   </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
           <div className="glass-panel p-8 bg-indigo-500/10 border-indigo-500/20 rounded-[2.5rem]">
              <h3 className="text-xs font-display font-black mb-6 uppercase tracking-[0.3em] text-indigo-400">Le Saviez-vous ?</h3>
              <div className="flex flex-col gap-6">
                 <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                       Pendant El Niño, les ouragans sont plus fréquents dans le Pacifique Est mais moins nombreux dans l'Atlantique.
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                       Le phénomène peut affecter la mousson en Inde, menaçant les récoltes de riz de millions de personnes.
                    </p>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedImage(null)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl"
            >
              <img src={encodeURI(zoomedImage)} alt="Zoomed consequence" className="w-full h-full object-contain" />
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-white transition-all shadow-2xl active:scale-95"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
