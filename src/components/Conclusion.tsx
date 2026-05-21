import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Globe, AlertCircle, CheckCircle, Edit3,
  Lightbulb, Printer, Eye, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';

// ── Key concepts the student must address ───────────────────────────────────
const KEY_CONCEPTS = [
  { keyword: 'alizé', label: 'Alizés', hint: 'Les alizés soufflent normalement d\'Est en Ouest...' },
  { keyword: 'thermocline', label: 'Thermocline', hint: 'La thermocline est la couche qui sépare les eaux chaudes des eaux froides...' },
  { keyword: 'upwelling', label: 'Upwelling', hint: 'L\'upwelling est la remontée des eaux profondes froides et riches en nutriments...' },
  { keyword: 'pérou', label: 'Pérou / Équateur', hint: 'Les côtes du Pérou subissent des inondations dévastatrices pendant El Niño...' },
  { keyword: 'australi', label: 'Australie', hint: 'L\'Australie subit une sécheresse sévère car les pluies se déplacent vers le Pacifique central...' },
  { keyword: 'oni', label: 'Indice ONI', hint: 'L\'indice ONI mesure l\'anomalie de température de surface de l\'océan Pacifique équatorial...' },
  { keyword: 'téléconnex', label: 'Téléconnexions', hint: 'Les téléconnexions sont les effets à distance d\'El Niño sur le climat mondial...' },
  { keyword: 'température', label: 'Température SST', hint: 'La température de surface de la mer (SST) augmente de +0.5°C ou plus lors d\'El Niño...' },
];

const PLAN_STEPS = [
  {
    title: '1. Introduction : définir El Niño',
    guide: 'Présentez El Niño comme un réchauffement anormal des eaux du Pacifique Est. Mentionnez l\'indice ONI (+0.5°C) et la périodicité (2-7 ans).'
  },
  {
    title: '2. Mécanisme physique',
    guide: 'Expliquez le rôle des alizés, de la thermocline et de l\'upwelling. Décrivez comment leur affaiblissement déclenche El Niño.'
  },
  {
    title: '3. Impacts géographiques',
    guide: 'Localisez les conséquences : inondations au Pérou/Équateur, sécheresse en Australie et Indonésie, effondrement des pêcheries péruviennes.'
  },
  {
    title: '4. Effets à l\'échelle mondiale (téléconnexions)',
    guide: 'Montrez que l\'anomalie du Pacifique perturbe les courants-jets et impacte le monde entier (Afrique, Amérique du Nord...).'
  },
  {
    title: '5. Conclusion : enjeux et perspectives',
    guide: 'Soulignez le lien entre El Niño et le réchauffement climatique global. Présentez les enjeux humanitaires et la nécessité d\'une surveillance continue.'
  },
];

export default function Conclusion() {
  const [studentConclusion, setStudentConclusion] = useState('');
  const [showPlan, setShowPlan] = useState(false);
  const [showPrint, setShowPrint] = useState(false);

  // ── Keyword detection ────────────────────────────────────────────────────
  const detectedConcepts = useMemo(() => {
    const lower = studentConclusion.toLowerCase();
    return KEY_CONCEPTS.map(c => ({
      ...c,
      found: lower.includes(c.keyword.toLowerCase()),
    }));
  }, [studentConclusion]);

  const rigorScore = detectedConcepts.filter(c => c.found).length;
  const rigorPercent = Math.round((rigorScore / KEY_CONCEPTS.length) * 100);

  const rigorLevel =
    rigorPercent >= 75 ? { label: 'Excellent', color: 'text-emerald-400', bar: 'bg-emerald-500' } :
    rigorPercent >= 50 ? { label: 'Satisfaisant', color: 'text-amber-400', bar: 'bg-amber-500' } :
    rigorPercent >= 25 ? { label: 'Incomplet', color: 'text-orange-400', bar: 'bg-orange-500' } :
    { label: 'Insuffisant', color: 'text-red-400', bar: 'bg-red-500' };

  const handlePrint = () => {
    const content = `
      <html><head><title>Ma Synthèse El Niño</title>
      <style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#111;line-height:1.8}
      h1{font-size:1.6rem;border-bottom:2px solid #333;padding-bottom:8px}
      p{font-size:1rem;text-align:justify}
      .meta{font-size:0.75rem;color:#666;margin-bottom:24px}</style>
      </head><body>
      <h1>Synthèse Scientifique – Phénomène El Niño</h1>
      <p class="meta">Rédigée le ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>${studentConclusion.replace(/\n/g, '<br/>')}</p>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) { w.document.write(content); w.document.close(); w.print(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto flex flex-col gap-16 py-12 px-6"
    >
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="text-center flex flex-col items-center gap-8 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
           <div className="w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
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

      {/* ── Summary Recap ─────────────────────────────────────────────────── */}
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
               "Tu as localisé les zones de sécheresse, d\'inondations et les téléconnexions mondiales.",
               "Tu as appris à lire l\'indice ONI pour analyser les épisodes passés et prévoir les crises climatiques.",
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
            Le <strong>Super El Niño de 2026</strong> n'est pas une fatalité, mais un signal d'alarme.
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

      {/* ── Student Synthesis + Rigor Checker ─────────────────────────────── */}
      <section className="glass-panel p-10 bg-indigo-900/20 border-indigo-500/30 rounded-[2.5rem] flex flex-col gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Edit3 size={120} />
         </div>

         <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
               <h2 className="text-2xl font-display font-black text-white flex items-center gap-4">
                  <Edit3 className="text-indigo-400" />
                  Synthèse Scientifique
               </h2>
               <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  Rédigez ci-dessous une conclusion complète sur le phénomène El Niño. L'outil de rigueur scientifique ci-dessous s'active en temps réel à mesure que vous intégrez les concepts clés.
               </p>
            </div>

            {/* Plan Toggle */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-900/20 overflow-hidden">
               <button
                  onClick={() => setShowPlan(!showPlan)}
                  className="w-full flex justify-between items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-indigo-900/30 transition-colors"
               >
                  <div className="flex items-center gap-3 text-sm font-bold text-indigo-300">
                     <Lightbulb size={16} className="text-amber-400" />
                     Aide : Plan de rédaction guidé
                  </div>
                  {showPlan ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
               </button>

               <AnimatePresence>
                  {showPlan && (
                     <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                     >
                        <div className="px-5 pb-5 flex flex-col gap-3">
                           {PLAN_STEPS.map((step, i) => (
                              <div key={i} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                                 <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">{step.title}</span>
                                 <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{step.guide}</p>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Textarea */}
            <textarea
               value={studentConclusion}
               onChange={(e) => setStudentConclusion(e.target.value)}
               placeholder="El Niño est un phénomène climatique qui se manifeste par... Les alizés s'affaiblissent lorsque... La thermocline... L'upwelling..."
               className="w-full h-52 bg-slate-950 border border-slate-700 rounded-2xl p-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-inner text-sm leading-relaxed font-sans"
            />

            {/* Word count */}
            <div className="flex justify-end">
               <span className="text-[10px] font-mono text-slate-600">
                  {studentConclusion.trim().split(/\s+/).filter(Boolean).length} mots
               </span>
            </div>
         </div>

         {/* ── Real-Time Rigor Checker ──────────────────────────────────────── */}
         <div className="border-t border-indigo-500/10 pt-8 flex flex-col gap-5">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <span className="text-xs font-display font-black text-indigo-300 uppercase tracking-wider">🔬 Analyseur de Rigueur Scientifique</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className={`text-sm font-black ${rigorLevel.color}`}>{rigorLevel.label}</span>
                  <span className="text-[10px] font-mono text-slate-500">{rigorScore}/{KEY_CONCEPTS.length} concepts</span>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
               <motion.div
                  animate={{ width: `${rigorPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${rigorLevel.bar}`}
               />
            </div>

            {/* Keyword Badges */}
            <div className="flex flex-wrap gap-2.5">
               {detectedConcepts.map(concept => (
                  <motion.div
                     key={concept.keyword}
                     initial={false}
                     animate={concept.found ? { scale: [1.15, 1] } : { scale: 1 }}
                     title={concept.hint}
                     className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold transition-all cursor-default select-none ${
                        concept.found
                           ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                           : 'bg-slate-900/50 border-slate-800 text-slate-600'
                     }`}
                  >
                     <span>{concept.found ? '✅' : '○'}</span>
                     <span>{concept.label}</span>
                  </motion.div>
               ))}
            </div>

            <p className="text-[10px] text-slate-600 font-mono">
               💡 Survolez un badge pour obtenir un indice sur le concept à intégrer dans votre synthèse.
            </p>
         </div>
      </section>

      {/* ── Final Actions ──────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-8 py-8">
         <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-display font-black text-base hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
            >
              🏠 RETOUR À L'ACCUEIL
            </button>

            <button
              onClick={handlePrint}
              disabled={studentConclusion.trim().length < 50}
              className="flex items-center gap-4 bg-slate-800 text-white px-10 py-5 rounded-2xl font-display font-black text-base hover:bg-indigo-700 transition-all border border-slate-700 disabled:opacity-40 disabled:pointer-events-none shadow-lg"
            >
              <Printer size={20} />
              IMPRIMER MA SYNTHÈSE
            </button>
         </div>

         <div className="mt-4 text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em] text-center">
            Fin de la Simulation Scientifique • Version Professionnelle 2026
         </div>
      </section>
    </motion.div>
  );
}
