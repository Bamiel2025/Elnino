import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Globe, AlertCircle, Share2, CheckCircle, ArrowRight, Home, Edit3 } from 'lucide-react';

export default function Conclusion() {
  const [studentConclusion, setStudentConclusion] = useState('');
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto flex flex-col gap-16 py-12 px-6"
    >
      {/* Success Celebration */}
      <section className="text-center flex flex-col items-center gap-8 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
           <div className="w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>

        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
          className="p-8 bg-emerald-500 rounded-[3rem] shadow-[0_0_60px_rgba(16,185,129,0.5)] text-white"
        >
          <Trophy size={80} />
        </motion.div>

        <div className="flex flex-col gap-4">
           <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter">
             MISSION ACCOMPLIE
           </h1>
           <p className="text-xl text-emerald-400 font-display font-bold uppercase tracking-[0.3em]">
             Expertise Climatique Validée
           </p>
        </div>
      </section>

      {/* Summary Recap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-10 bg-slate-900/40 border-slate-800 flex flex-col gap-8">
          <h2 className="text-2xl font-display font-black text-white flex items-center gap-4">
             <Globe className="text-blue-500" />
             Bilan Planétaire
          </h2>
          <div className="space-y-6">
             {[
               "Tu as compris le cycle de Walker et le basculement des Alizés.",
               "Tu as identifié le lien entre El Niño et le réchauffement des océans.",
               "Tu as localisé les zones de sécheresse et d'inondations extrêmes.",
               "Tu as appris à lire l'indice ONI pour prévoir les crises climatiques."
             ].map((text, i) => (
               <div key={i} className="flex gap-4 items-start">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-1" size={20} />
                  <p className="text-slate-300 leading-relaxed">{text}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-panel p-10 bg-orange-500/10 border-orange-500/20 rounded-[2.5rem] flex flex-col gap-8">
          <h2 className="text-2xl font-display font-black text-white flex items-center gap-4">
             <AlertCircle className="text-orange-500" />
             L'Enjeu 2026
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            Le **Super El Niño de 2026** n'est pas une fatalité, mais un signal d'alarme. 
            L'augmentation de la température globale rend ces événements plus fréquents et plus violents.
          </p>
          <div className="p-6 bg-slate-950 rounded-2xl border border-white/5">
             <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest block mb-2">Message Scientifique</span>
             <p className="text-sm italic text-slate-400 leading-relaxed">
               "La compréhension du climat est la première étape vers sa protection. Ta mission d'ambassadeur du climat commence maintenant."
             </p>
          </div>
        </div>
      </div>

      {/* Student Conclusion Area */}
      <section className="glass-panel p-10 bg-indigo-900/20 border-indigo-500/30 rounded-[2.5rem] flex flex-col gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Edit3 size={120} />
         </div>
         <div className="relative z-10">
            <h2 className="text-2xl font-display font-black text-white flex items-center gap-4 mb-4">
               <Edit3 className="text-indigo-400" />
               Synthèse Finale
            </h2>
            <p className="text-slate-300 mb-6">
               En utilisant tes connaissances acquises lors des activités précédentes, rédige une conclusion sur l'impact du phénomène El Niño sur le climat mondial et ses conséquences sociétales.
            </p>
            <textarea
               value={studentConclusion}
               onChange={(e) => setStudentConclusion(e.target.value)}
               placeholder="Saisissez votre conclusion ici..."
               className="w-full h-40 bg-slate-950 border border-slate-700 rounded-2xl p-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-inner"
            />
         </div>
      </section>

      {/* Final Actions */}
      <section className="flex flex-col items-center gap-8 py-12">
         <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => window.location.reload()}
              className="group flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-display font-black text-xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
            >
              <Home size={24} />
              RETOUR À L'ACCUEIL
            </button>
            <button 
              className="flex items-center gap-4 bg-slate-800 text-white px-10 py-5 rounded-2xl font-display font-black text-xl hover:bg-slate-700 transition-all border border-slate-700"
            >
              <Share2 size={24} />
              PARTAGER MON SCORE
            </button>
         </div>
         
         <div className="mt-8 text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em] text-center">
            Fin de la Simulation Scientifique • Version Professionnelle 2026
         </div>
      </section>
    </motion.div>
  );
}
