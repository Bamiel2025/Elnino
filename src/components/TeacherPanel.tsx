import { BookOpen, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export default function TeacherPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 p-6 bg-indigo-950/20 border border-indigo-500/30 rounded-3xl"
    >
      <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
        <div className="p-3 bg-indigo-500 rounded-2xl text-white">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-indigo-300">Guide Pédagogique</h2>
          <p className="text-slate-400 text-sm">Ressources pour l'enseignant • El Niño & La Niña</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-indigo-400 font-display font-bold uppercase tracking-widest text-xs">
            <Lightbulb size={16} /> Concepts Clés
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-slate-300">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-1" />
              <span><strong>Upwelling :</strong> Remontée d'eau profonde froide et riche en nutriments. Crucial pour la pêche péruvienne.</span>
            </li>
            <li className="flex gap-3 text-sm text-slate-300">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-1" />
              <span><strong>Alizés :</strong> Vents d'Est qui poussent l'eau chaude vers l'Indonésie (situation normale).</span>
            </li>
            <li className="flex gap-3 text-sm text-slate-300">
              <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-1" />
              <span><strong>ENSO :</strong> El Niño Southern Oscillation - le cycle complet du phénomène.</span>
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-indigo-400 font-display font-bold uppercase tracking-widest text-xs">
            <Info size={16} /> Questions pour la classe
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-xs italic text-slate-400">"Pourquoi les pêcheurs péruviens ont-ils nommé ce courant 'L'Enfant Jésus' ?"</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <p className="text-xs italic text-slate-400">"Qu'arrive-t-il à la pluie en Australie quand El Niño arrive ?"</p>
            </div>
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="flex items-center gap-2 text-emerald-400 font-display font-bold uppercase tracking-widest text-xs">
          <CheckCircle size={16} /> Correction : Synthèse Finale
        </h3>
        <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-emerald-500 mb-2">
            Modèle de conclusion attendu
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Le phénomène El Niño est une anomalie climatique majeure caractérisée par un réchauffement des eaux de surface du Pacifique équatorial, lié à un affaiblissement des alizés. 
            Ce dérèglement océanique modifie la circulation atmosphérique de Walker, déplaçant les zones de précipitations vers le centre du Pacifique. 
            À l'échelle mondiale, El Niño provoque des catastrophes climatiques en chaîne : sécheresses intenses et incendies en Australie et en Indonésie, et précipitations diluviennes entraînant des inondations sur la côte ouest-américaine (Pérou). 
            Sur le plan sociétal, il menace la sécurité alimentaire (effondrement de la pêche péruvienne dû à l'arrêt de l'upwelling) et cause d'importants dégâts matériels et humains.
          </p>
        </div>
      </section>

      <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
        <p className="text-[10px] text-indigo-400 font-mono uppercase mb-2">Note sur la correction</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          En mode professeur, vous pouvez cliquer sur "Afficher la solution" dans chaque activité pour placer instantanément les étiquettes ou les impacts aux bons endroits. Cela permet de valider le travail des élèves ou d'illustrer la correction.
        </p>
      </div>
    </motion.div>
  );
}
