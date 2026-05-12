import { motion } from 'motion/react';
import { Play, BookOpen, Target, ArrowRight, ThermometerSun, Globe, Sparkles } from 'lucide-react';

interface IntroductionProps {
  onStart: () => void;
}

export default function Introduction({ onStart }: IntroductionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto flex flex-col gap-8 py-8 px-4"
    >
      {/* Cinematic Hero Section */}
      <section className="text-center flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/10 blur-[80px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col gap-2 w-full">
           <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white leading-tight">
             Le phénomène <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-blue-400">El Niño</span>
           </h1>
           <p className="text-lg text-slate-400 font-display font-medium mt-2 tracking-tight">
             Expédition Scientifique vers l'événement Climatique de 2026.
           </p>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="mt-6 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl max-w-2xl mx-auto w-full group relative"
           >
              <img src={encodeURI('/image/VUE SATELLITE.png')} alt="Vue Satellite d'El Niño" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
           </motion.div>
        </div>
      </section>

      {/* Narrative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="glass-panel p-8 bg-slate-900/40 border-slate-800 flex flex-col gap-6">
          <h2 className="text-2xl font-display font-extrabold text-white flex items-center gap-3">
             <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
             Le Défi de notre Siècle
          </h2>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-sans">
            <p>
              Nous allons explorer ensemble un phénomène climatique majeur appelé **El Niño**, et plus particulièrement un événement potentiellement très fort prévu pour **2026**.
            </p>
            <p>
              Nous verrons comment ce phénomène naturel interagit avec le réchauffement climatique causé par les activités humaines, et quelles en sont les conséquences pour notre planète.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-slate-400 text-xs">
              "El Niño est un réchauffement anormal et prolongé des eaux de surface dans l'océan Pacifique équatorial."
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 bg-blue-600/10 border-blue-500/20 rounded-[2rem] flex flex-col gap-6">
          <h3 className="text-xs font-display font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-3">
             <Target size={16} /> Objectifs de Mission
          </h3>
          <ul className="space-y-4">
             {[
               "Comprendre les mécanismes du phénomène naturel El Niño.",
               "Analyser les interactions avec le réchauffement climatique anthropique.",
               "Identifier les conséquences mondiales d'un événement extrême.",
               "Décoder les documents et graphiques scientifiques."
             ].map((obj, i) => (
               <li key={i} className="flex gap-3 text-slate-200 items-start">
                 <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-bold text-xs">
                    {i + 1}
                 </div>
                 <span className="text-xs font-medium leading-relaxed">{obj}</span>
               </li>
             ))}
          </ul>
        </div>
      </div>

      {/* Start Button Section */}
      <section className="flex flex-col items-center gap-6 py-6">
         <button 
           onClick={onStart}
           className="group relative flex items-center gap-4 bg-white text-slate-950 px-8 py-4 rounded-2xl font-display font-black text-xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-blue-500/40 active:scale-95"
         >
           <Play className="fill-current" size={24} />
           DÉBUTER LA MISSION
           <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
         </button>
         
         <div className="flex gap-6 items-center opacity-40">
            <Globe size={24} className="text-white" />
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">Simulation Scientifique</span>
               <span className="text-[9px] font-black uppercase tracking-widest text-white/60 leading-none">V 3.0 • ENS-Climat</span>
            </div>
         </div>
      </section>
    </motion.div>
  );
}
