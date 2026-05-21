import React, { useState } from 'react';

interface Question {
  id: number;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    q: "Dans quelle direction soufflent les alizés en conditions normales sur le Pacifique équatorial ?",
    options: ["De l'Est vers l'Ouest", "De l'Ouest vers l'Est", "Du Nord vers le Sud", "Du Sud vers le Nord"],
    correct: 0,
    explanation: "Les alizés soufflent normalement de l'Est (Pérou) vers l'Ouest (Australie/Asie), poussant les eaux chaudes vers le Pacifique occidental."
  },
  {
    id: 2,
    q: "Qu'est-ce que l'upwelling péruvien ?",
    options: [
      "Un courant chaud remontant en surface",
      "Une remontée d'eaux froides profondes vers la surface",
      "Un vent descendant le long des côtes",
      "Une élévation du niveau de la mer",
    ],
    correct: 1,
    explanation: "L'upwelling est une remontée d'eaux froides et riches en nutriments depuis les profondeurs vers la surface, provoquée par les alizés qui repoussent les eaux de surface."
  },
  {
    id: 3,
    q: "Lors d'El Niño, que se passe-t-il au Pérou ?",
    options: [
      "Sécheresse intense et upwelling renforcé",
      "Températures normales et pluies habituelles",
      "Inondations et pluies excessives, upwelling bloqué",
      "Le niveau de la mer baisse considérablement",
    ],
    correct: 2,
    explanation: "Lors d'El Niño, les eaux chaudes migrent vers l'Est, bloquant l'upwelling froid. Les côtes péruviennes reçoivent alors des pluies diluviennes inhabituelles."
  },
  {
    id: 4,
    q: "La La Niña est caractérisée par :",
    options: [
      "Des alizés affaiblis",
      "Un réchauffement du Pacifique Est",
      "Des alizés renforcés et des eaux plus froides à l'Est",
      "Une inversion de la cellule de Walker",
    ],
    correct: 2,
    explanation: "La Niña amplifie les conditions normales : les alizés sont très forts, poussant encore plus d'eaux chaudes vers l'Ouest, rendant les eaux de l'Est encore plus froides."
  },
  {
    id: 5,
    q: "La thermocline désigne :",
    options: [
      "La surface de l'océan agitée par les vagues",
      "La zone de transition entre eaux chaudes de surface et eaux froides profondes",
      "Le fond de l'océan Pacifique",
      "Un type de courant marin horizontal",
    ],
    correct: 1,
    explanation: "La thermocline est la couche de l'océan où la température chute rapidement avec la profondeur. Elle sépare les eaux chaudes de surface et les eaux froides des profondeurs."
  },
];

export const QuizSection: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [activeQ, setActiveQ] = useState<number>(0);

  const q = QUESTIONS[activeQ];
  const answered = answers[q.id] !== undefined && answers[q.id] !== null;
  const isCorrect = answered && answers[q.id] === q.correct;

  const score = QUESTIONS.filter(
    (qu) => answers[qu.id] !== undefined && answers[qu.id] === qu.correct
  ).length;

  const allAnswered = QUESTIONS.every(
    (qu) => answers[qu.id] !== undefined && answers[qu.id] !== null
  );

  const handleAnswer = (optIdx: number) => {
    if (answered) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
    setRevealed((prev) => ({ ...prev, [q.id]: true }));
  };

  const reset = () => {
    setAnswers({});
    setRevealed({});
    setActiveQ(0);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Évaluation</p>
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
            🎓 Testez vos connaissances
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {allAnswered && (
            <span className="text-sm font-mono font-black text-green-400">
              Score : {score} / {QUESTIONS.length}
            </span>
          )}
          <button
            onClick={reset}
            className="text-xs text-slate-400 hover:text-white hover:underline transition-colors cursor-pointer"
          >
            Recommencer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Question nav */}
        <div className="md:col-span-1 flex md:flex-col gap-2">
          {QUESTIONS.map((qu, i) => {
            const ans = answers[qu.id];
            const done = ans !== undefined && ans !== null;
            const correct = done && ans === qu.correct;
            return (
              <button
                key={qu.id}
                onClick={() => setActiveQ(i)}
                className={`w-full text-xs font-mono font-bold rounded-xl px-3 py-2.5 transition-all border cursor-pointer ${
                  i === activeQ
                    ? 'bg-white border-slate-700 text-slate-950 shadow-xl'
                    : done
                    ? correct
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {done ? (correct ? '✓' : '✗') : `Q${i + 1}`}
              </button>
            );
          })}
        </div>

        {/* Question content */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <p className="text-base font-display font-bold text-slate-200 leading-relaxed">
            <span className="text-slate-500 mr-2">Question {activeQ + 1} :</span>
            {q.q}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt, i) => {
              const isSelected = answers[q.id] === i;
              const isRevealedCorrect = revealed[q.id] && i === q.correct;
              const isRevealedWrong = revealed[q.id] && isSelected && i !== q.correct;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`text-left text-sm px-4 py-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isRevealedCorrect
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold shadow-lg shadow-emerald-500/10'
                      : isRevealedWrong
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : answered
                      ? 'border-slate-800/50 text-slate-600 cursor-not-allowed'
                      : 'border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="font-mono font-bold mr-3 text-slate-500">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {isRevealedCorrect && <span className="ml-2 font-sans text-emerald-400">✓</span>}
                  {isRevealedWrong && <span className="ml-2 font-sans text-red-400">✗</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed[q.id] && (
            <div
              className={`text-xs rounded-2xl px-4 py-3.5 border leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
              }`}
            >
              <span className="font-bold mr-1">{isCorrect ? '✓ Correct !' : '✗ Explication :'}</span>
              {q.explanation}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-2">
            <button
              disabled={activeQ === 0}
              onClick={() => setActiveQ((p) => p - 1)}
              className="text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Précédent
            </button>
            <button
              disabled={activeQ === QUESTIONS.length - 1}
              onClick={() => setActiveQ((p) => p + 1)}
              className="text-xs font-mono font-bold px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Suivant →
            </button>
            {allAnswered && (
              <div className="ml-auto flex items-center gap-2">
                <span
                  className={`text-sm font-mono font-black ${
                    score >= 4 ? 'text-green-400' : score >= 3 ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  {score >= 4 ? '🏆' : score >= 3 ? '👍' : '📖'} {score} / {QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-500">
                  {score >= 4 ? 'Excellent !' : score >= 3 ? 'Bien joué !' : 'Continuez à apprendre !'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
