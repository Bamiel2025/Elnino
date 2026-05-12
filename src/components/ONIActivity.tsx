import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Search, CheckCircle2, HelpCircle, Thermometer, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Target } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: "À partir de quelle valeur d'anomalie considère-t-on que le phénomène El Niño est actif (zone rouge) ?",
    options: ["+0.1°C", "+0.5°C", "+1.0°C", "-0.5°C"],
    correctAnswer: 1
  },
  {
    id: 'q2',
    question: "Parmi les épisodes suivants, lequel a atteint le plus haut pic de température (Super El Niño) ?",
    options: ["1982-1983", "1997-1998", "2015-2016", "2009-2010"],
    correctAnswer: 2
  }
];

interface ONIActivityProps {
  isTeacherMode?: boolean;
}

export default function ONIActivity({ isTeacherMode }: ONIActivityProps) {
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  const majorYears = [
    { year: '1982-83', intensity: 'Exceptionnelle', impact: 'Premier "Super El Niño" moderne.' },
    { year: '1997-98', intensity: 'Extrême', impact: 'Record de température mondiale battu.' },
    { year: '2015-16', intensity: 'Record', impact: 'Blanchissement massif des coraux.' },
    { year: '2026', intensity: 'Prévision', impact: 'Le potentiel "Super El Niño" que nous étudions.' },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-display font-black text-white flex items-center gap-4">
          <div className="p-3 bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/20">
             <LineChart size={28} />
          </div>
          Analyse de l'Indice ONI
        </h2>
        <p className="text-slate-400 max-w-3xl text-lg leading-relaxed">
          Pour les scientifiques, El Niño n'est pas qu'une animation : c'est une mesure précise de l'écart de température (anomalie) dans le Pacifique. 
          L'**Oceanic Niño Index (ONI)** est le baromètre mondial du phénomène.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Graph Area - High Visibility */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative glass-panel p-4 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] group/graph">
            <motion.img 
              src="/image/evolution indice oni.jpg" 
              alt="Évolution Indice ONI" 
              className="w-full h-auto rounded-2xl transition-transform duration-700 group-hover/graph:scale-[1.01]"
            />
            
            {/* Visual Helper Overlays */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
               Zone El Niño (Anomalie {'>'} +0.5°C)
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
               Zone La Niña (Anomalie {'<'} -0.5°C)
            </div>
          </div>
          
          <div className="flex justify-between items-center px-6">
            <div className="flex items-center gap-4 text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest">
               <span>Données : NOAA Climate Prediction Center</span>
               <div className="w-1 h-1 bg-slate-800 rounded-full" />
               <span>Mise à jour : 2026</span>
            </div>
            {isTeacherMode && (
              <button 
                onClick={() => setShowCorrection(!showCorrection)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  showCorrection 
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/30' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {showCorrection ? "Masquer la correction" : "Afficher l'aide à l'analyse"}
              </button>
            )}
          </div>
        </div>

        {/* Question & Interactive Sidebar */}
        <aside className="xl:col-span-4 flex flex-col gap-8">
          <div className="glass-panel p-10 bg-slate-900/60 border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Search size={100} />
            </div>

            <div className="relative z-10 flex flex-col gap-8">
               <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-display font-extrabold text-white flex items-center gap-3">
                     <Calendar className="text-indigo-400" size={20} />
                     Laboratoire de lecture
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                     Analyse le graphique et identifie les événements historiques les plus puissants (pics rouges dépassant la barre des +2).
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  {majorYears.map((item) => (
                    <button
                      key={item.year}
                      onClick={() => setSelectedYear(selectedYear === item.year ? null : item.year)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedYear === item.year 
                          ? 'bg-indigo-600 border-indigo-400 shadow-lg' 
                          : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                       <span className={`block text-xs font-black uppercase tracking-widest mb-1 ${selectedYear === item.year ? 'text-white' : 'text-slate-500'}`}>
                          Année
                       </span>
                       <span className="text-lg font-mono font-black text-white">{item.year}</span>
                    </button>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                  {selectedYear && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800 shadow-inner"
                    >
                       <div className="flex items-center gap-3 mb-3">
                          <Thermometer className="text-orange-500" size={16} />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Détails de l'événement</span>
                       </div>
                       <p className="text-sm text-slate-200 font-bold mb-1">
                          Intensité : {majorYears.find(y => y.year === selectedYear)?.intensity}
                       </p>
                       <p className="text-xs text-slate-400 leading-relaxed italic">
                          "{majorYears.find(y => y.year === selectedYear)?.impact}"
                       </p>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>

          {/* Teacher Correction Card */}
          <AnimatePresence>
            {showCorrection && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 bg-indigo-900/20 border-indigo-500/30"
              >
                 <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="text-indigo-400" size={20} />
                    <h4 className="text-xs font-display font-black text-indigo-400 uppercase tracking-widest leading-none">Guide de correction</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Tendance Générale</span>
                       <p className="text-xs text-slate-300 leading-relaxed">
                          La fréquence des épisodes intenses semble augmenter, ce qui suggère une interaction forte avec le réchauffement global anthropique.
                       </p>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Seuils Critiques</span>
                       <p className="text-xs text-slate-300 leading-relaxed">
                          Tout ce qui dépasse +1.5 est un El Niño "fort", au-dessus de +2.0 c'est un "Super El Niño".
                       </p>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                <TrendingUp size={120} />
             </div>
             <div className="flex items-center gap-3 text-indigo-400 mb-3">
                <HelpCircle size={20} />
                <span className="text-xs font-display font-black uppercase tracking-widest">Le sais-tu ?</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed italic relative z-10">
               "L'indice ONI est calculé en faisant la moyenne des anomalies de température de surface de la mer sur trois mois consécutifs."
             </p>
          </div>
        </aside>
      </div>

      {/* Quiz Section */}
      <div className="glass-panel p-10 bg-slate-900/40 border-slate-800 flex flex-col gap-8 mt-4">
         <h3 className="text-2xl font-display font-extrabold text-white flex items-center gap-3">
            <Target className="text-orange-500" size={28} />
            Test de connaissances
         </h3>
         <p className="text-slate-400">Réponds à ces questions en observant bien le graphique de l'indice ONI.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quizQuestions.map((q) => (
               <div key={q.id} className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800">
                  <h4 className="text-lg font-bold text-white mb-6">{q.question}</h4>
                  <div className="flex flex-col gap-3">
                     {q.options.map((opt, idx) => {
                        const isSelected = answers[q.id] === idx;
                        const isCorrect = q.correctAnswer === idx;
                        const showFeedback = showQuizResult || isTeacherMode;
                        
                        let btnClass = "p-4 rounded-xl border-2 text-left transition-all font-semibold ";
                        if (showFeedback) {
                           if (isCorrect) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                           else if (isSelected) btnClass += "bg-red-500/20 border-red-500 text-red-400";
                           else btnClass += "bg-slate-900 border-slate-800 text-slate-500 opacity-50";
                        } else {
                           if (isSelected) btnClass += "bg-indigo-600 border-indigo-400 text-white";
                           else btnClass += "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600";
                        }

                        return (
                           <button 
                              key={idx}
                              disabled={showQuizResult}
                              onClick={() => setAnswers(prev => ({...prev, [q.id]: idx}))}
                              className={btnClass}
                           >
                              {opt}
                           </button>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>
         
         {!showQuizResult && Object.keys(answers).length === quizQuestions.length && (
            <button 
               onClick={() => setShowQuizResult(true)}
               className="self-center px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20"
            >
               Valider mes réponses
            </button>
         )}
      </div>
    </div>
  );
}
