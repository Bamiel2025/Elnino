import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Search, CheckCircle2, HelpCircle, Thermometer, Calendar, TrendingUp, X, Award, ChevronRight } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: "À partir de quel seuil d'anomalie de température (°C) considère-t-on qu'un épisode El Niño est officiellement actif ?",
    options: [
      "+0.1°C de manière instantanée",
      "+0.5°C mesuré sur 5 mois consécutifs",
      "+1.5°C dans l'océan Atlantique",
      "-0.5°C persistant dans le Pacifique Est"
    ],
    correctAnswer: 1,
    explanation: "Le seuil officiel fixé par la NOAA est de +0.5°C d'anomalie dans la région Niño 3.4 pendant au moins 5 trimestres mobiles consécutifs."
  },
  {
    id: 'q2',
    question: "Quels sont les trois épisodes historiques qualifiés de 'Super El Niño' dépassant la barre extrême des +2.0 °C ?",
    options: [
      "1982-83, 1997-98 et 2015-16",
      "1990, 2000 et 2010",
      "1988, 1999 et 2021",
      "Il n'y a jamais eu d'épisode dépassant +2.0 °C"
    ],
    correctAnswer: 0,
    explanation: "Ces trois hivers (1982-83, 1997-98, 2015-16) ont pulvérisé les records avec des anomalies supérieures à +2.0°C (atteignant +2.6°C en 2015-16), provoquant des catastrophes planétaires."
  },
  {
    id: 'q3',
    question: "À quoi correspond une anomalie négative de l'indice ONI sous le seuil critique de -0.5 °C ?",
    options: [
      "Le déclenchement d'un El Niño extrême",
      "Une stabilité parfaite du climat global",
      "L'activation du phénomène La Niña (eaux plus froides que la normale à l'Est)",
      "Un arrêt de la rotation de la Terre"
    ],
    correctAnswer: 2,
    explanation: "Une anomalie négative durable sous -0.5°C indique La Niña, qui est la phase froide caractérisée par des alizés très puissants et un upwelling sur-activé au Pérou."
  },
  {
    id: 'q4',
    question: "En analysant le graphique interactif, quel épisode détient le record absolu d'anomalie chaude enregistré ?",
    options: [
      "Le Super El Niño de 1982-1983 (+2.2 °C)",
      "Le Super El Niño de 1997-1998 (+2.4 °C)",
      "Le Super El Niño de 2015-2016 (+2.6 °C)",
      "La prévision pour 2026 (+2.2 °C)"
    ],
    correctAnswer: 2,
    explanation: "Avec un pic exceptionnel mesuré à +2.6 °C au plus fort de l'hiver 2015-2016, cet épisode reste à ce jour le plus intense de l'ère instrumentale moderne."
  },
  {
    id: 'q5',
    question: "Quelle tendance observe-t-on sur la fréquence des épisodes de forte intensité ces 40 dernières années ?",
    options: [
      "Ils s'affaiblissent et tendent à disparaître",
      "Leur fréquence et leur intensité semblent augmenter, suggérant un lien avec le réchauffement global",
      "Ils se produisent de manière parfaitement rigoureuse tous les 10 ans",
      "Seuls les épisodes La Niña augmentent"
    ],
    correctAnswer: 1,
    explanation: "Le graphique montre un rapprochement des épisodes très forts (1982, 1997, 2015, 2024, 2026). La communauté scientifique s'accorde à dire que le réchauffement climatique global fournit plus d'énergie à l'océan, amplifiant potentiellement la sévérité et la récurrence de ces anomalies."
  }
];

interface ONIDataPoint {
  year: string;
  value: number;
  event: string;
  phase: 'elnino' | 'lanina' | 'normal';
  details: string;
}

const ONI_DATA: ONIDataPoint[] = [
  { year: '1980', value: 0.1, event: 'Normal', phase: 'normal', details: 'Année stable, conditions de circulation de Walker normales.' },
  { year: '1981', value: -0.2, event: 'Normal', phase: 'normal', details: 'Faible anomalie froide sans impact climatique majeur.' },
  { year: '1982', value: 0.8, event: 'Début El Niño', phase: 'elnino', details: 'Début d\'un réchauffement anormal du Pacifique équatorial Est.' },
  { year: '1983', value: 2.2, event: 'Super El Niño 1982-83', phase: 'elnino', details: 'Un des épisodes les plus destructeurs du XXe siècle. Inondations massives.' },
  { year: '1984', value: -0.4, event: 'Normal', phase: 'normal', details: 'Retour rapide à des températures équatoriales équilibrées.' },
  { year: '1985', value: -0.8, event: 'La Niña Modérée', phase: 'lanina', details: 'Renforcement des alizés et refroidissement côtier au Pérou.' },
  { year: '1986', value: 0.5, event: 'El Niño Faible', phase: 'elnino', details: 'Faible réchauffement, peu d\'impacts globaux.' },
  { year: '1987', value: 1.2, event: 'El Niño Fort', phase: 'elnino', details: 'Sécheresse marquée en Australie et moussons affaiblies en Asie.' },
  { year: '1988', value: -0.2, event: 'Transition', phase: 'normal', details: 'Période charnière de basculement rapide des températures.' },
  { year: '1989', value: -1.8, event: 'La Niña Forte 1988-89', phase: 'lanina', details: 'Épisode très vigoureux. Pêche miraculeuse au Pérou, pluies intenses en Indonésie.' },
  { year: '1990', value: 0.2, event: 'Normal', phase: 'normal', details: 'Conditions neutres et stables.' },
  { year: '1991', value: 0.7, event: 'El Niño Faible', phase: 'elnino', details: 'Réchauffement modeste sous surveillance.' },
  { year: '1992', value: 1.5, event: 'El Niño Fort', phase: 'elnino', details: 'Perturbations notables de la pêche côtière sud-américaine.' },
  { year: '1993', value: 0.3, event: 'Normal', phase: 'normal', details: 'Retour à l\'équilibre dans le Pacifique.' },
  { year: '1994', value: 1.1, event: 'El Niño Modéré', phase: 'elnino', details: 'Températures de surface modérément élevées.' },
  { year: '1995', value: -0.7, event: 'La Niña Faible', phase: 'lanina', details: 'Léger refroidissement bénéfique pour les écosystèmes marins.' },
  { year: '1996', value: -0.3, event: 'Normal', phase: 'normal', details: 'Conditions stables normales.' },
  { year: '1997', value: 1.0, event: 'Début El Niño', phase: 'elnino', details: 'Ascension thermique océanique ultra-rapide au printemps.' },
  { year: '1998', value: 2.4, event: 'Super El Niño 1997-98', phase: 'elnino', details: 'Chaos climatique mondial, blanchissement corallien historique dans les tropiques.' },
  { year: '1999', value: -1.6, event: 'La Niña Forte', phase: 'lanina', details: 'Forte réaction froide compensatrice après le Super El Niño.' },
  { year: '2000', value: -1.2, event: 'La Niña Modérée', phase: 'lanina', details: 'Prolongation des alizés puissants et de l\'eau froide.' },
  { year: '2001', value: -0.2, event: 'Normal', phase: 'normal', details: 'Pacifique équatorial calme.' },
  { year: '2002', value: 0.9, event: 'El Niño Modéré', phase: 'elnino', details: 'Réchauffement modeste.' },
  { year: '2003', value: 0.4, event: 'Normal', phase: 'normal', details: 'Conditions normales.' },
  { year: '2004', value: 0.7, event: 'El Niño Faible', phase: 'elnino', details: 'Légères perturbations atmosphériques.' },
  { year: '2005', value: -0.5, event: 'Transition La Niña', phase: 'lanina', details: 'Légère baisse sous les normales saisonnières.' },
  { year: '2006', value: 0.8, event: 'El Niño Faible', phase: 'elnino', details: 'Court épisode sans conséquences majeures.' },
  { year: '2007', value: -1.4, event: 'La Niña Forte', phase: 'lanina', details: 'Vents d\'Est très soutenus, eaux côtières froides très productives.' },
  { year: '2008', value: -0.6, event: 'La Niña Faible', phase: 'lanina', details: 'Faible anomalie négative persistante.' },
  { year: '2009', value: 1.3, event: 'El Niño Fort', phase: 'elnino', details: 'Sécheresse sévère dans le Sud-Est de l\'Australie.' },
  { year: '2010', value: -1.5, event: 'La Niña Forte', phase: 'lanina', details: 'Retour rapide et brutal de conditions froides extrêmes.' },
  { year: '2011', value: -0.9, event: 'La Niña Modérée', phase: 'lanina', details: 'Forte mousson et inondations en Australie orientale.' },
  { year: '2012', value: 0.3, event: 'Normal', phase: 'normal', details: 'Stabilité générale du Pacifique.' },
  { year: '2013', value: -0.2, event: 'Normal', phase: 'normal', details: 'Faibles variations thermiques de surface.' },
  { year: '2014', value: 0.5, event: 'Seuil El Niño', phase: 'elnino', details: 'Frôlement du seuil d\'activation officiel.' },
  { year: '2015', value: 1.8, event: 'Début El Niño Fort', phase: 'elnino', details: 'Réchauffement sans précédent dans les enregistrements.' },
  { year: '2016', value: 2.6, event: 'Super El Niño 2015-16', phase: 'elnino', details: 'Le record absolu. Tempête hivernale extrême en Californie, famine liée à la sécheresse en Afrique.' },
  { year: '2017', value: -0.8, event: 'La Niña Modérée', phase: 'lanina', details: 'Épisode froid modéré stabilisant les températures de surface.' },
  { year: '2018', value: 0.8, event: 'El Niño Faible', phase: 'elnino', details: 'Réchauffement de faible intensité.' },
  { year: '2019', value: 0.4, event: 'Normal', phase: 'normal', details: 'Températures proches des moyennes de référence.' },
  { year: '2020', value: -1.1, event: 'La Niña Modérée', phase: 'lanina', details: 'Début d\'un épisode La Niña persistant sur plusieurs années.' },
  { year: '2021', value: -1.0, event: 'La Niña (Double Dip)', phase: 'lanina', details: 'Deuxième année consécutive de refroidissement Pacifique (Double Dip).' },
  { year: '2022', value: -1.2, event: 'La Niña (Triple Dip)', phase: 'lanina', details: 'Fait rarissime : troisième année froide consécutive (Triple Dip).' },
  { year: '2023', value: 1.5, event: 'El Niño Fort', phase: 'elnino', details: 'Sortie brutale du froid et transition chaude vigoureuse.' },
  { year: '2024', value: 2.0, event: 'El Niño Très Fort 2023-24', phase: 'elnino', details: 'Épisode très intense, incendies dévastateurs en Amazonie et chaleur planétaire record.' },
  { year: '2025', value: -0.4, event: 'Transition', phase: 'normal', details: 'Phase neutre de stabilisation thermique.' },
  { year: '2026', value: 2.2, event: 'Prévision : Super El Niño 2026', phase: 'elnino', details: 'L\'épisode critique que nous simulons, avec des menaces majeures de téléconnexions.' }
];

export default function ONIActivity({ isTeacherMode }: { isTeacherMode?: boolean }) {
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>('2026');
  const [hoveredPoint, setHoveredPoint] = useState<ONIDataPoint | null>(null);
  
  // Quiz States
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // SVG dimensions
  const svgWidth = 900;
  const svgHeight = 350;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate conversion
  const getX = (index: number) => paddingLeft + (index / (ONI_DATA.length - 1)) * chartWidth;
  // ONI ranges from +3.0 to -2.0
  const getY = (value: number) => {
    const minVal = -2.2;
    const maxVal = 2.8;
    const ratio = (value - minVal) / (maxVal - minVal);
    return svgHeight - paddingBottom - ratio * chartHeight;
  };

  // Build SVG path
  const linePath = ONI_DATA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');

  // Hover detection
  const svgRef = useRef<SVGSVGElement>(null);
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    // Calculate closest index
    const percentX = (mouseX - (rect.width * paddingLeft) / svgWidth) / ((rect.width * chartWidth) / svgWidth);
    let index = Math.round(percentX * (ONI_DATA.length - 1));
    index = Math.max(0, Math.min(ONI_DATA.length - 1, index));
    setHoveredPoint(ONI_DATA[index]);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleClick = () => {
    if (hoveredPoint) {
      setSelectedYear(hoveredPoint.year);
    }
  };

  const selectedData = ONI_DATA.find(d => d.year === selectedYear) || ONI_DATA[ONI_DATA.length - 1];

  const score = Object.keys(answers).filter(qId => {
    const q = quizQuestions.find(x => x.id === qId);
    return q && answers[qId] === q.correctAnswer;
  }).length;

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-display font-black text-white flex items-center gap-4">
          <div className="p-3 bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-500/20">
             <LineChart size={28} />
          </div>
          Analyse Interactive de l'Indice ONI
        </h2>
        <p className="text-slate-400 max-w-3xl text-lg leading-relaxed">
          Explorez l'**Oceanic Niño Index (ONI)**, l'indicateur officiel utilisé par les climatologues mondiaux pour surveiller l'état thermique de l'océan Pacifique Équatorial central de 1980 à 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Graph Area - High Visibility */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative glass-panel p-6 bg-slate-950/70 border-slate-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-4">
            
            {/* Legend indicators */}
            <div className="flex justify-between items-center px-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">🎛️ Survolez et cliquez pour analyser</span>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded bg-red-500/30 border border-red-500" /> El Niño ({'>'}+0.5°C)
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" /> Neutre
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500/30 border border-blue-500" /> La Niña ({'<'}-0.5°C)
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG Chart */}
            <div className="relative w-full aspect-[2.6/1] select-none bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              >
                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="elnino-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lanina-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.0" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Colored Zone Background Bands */}
                <rect x={paddingLeft} y={paddingTop} width={chartWidth} height={getY(0.5) - paddingTop} fill="url(#elnino-grad)" />
                <rect x={paddingLeft} y={getY(-0.5)} width={chartWidth} height={svgHeight - paddingBottom - getY(-0.5)} fill="url(#lanina-grad)" />

                {/* Grid Lines */}
                {[2.0, 1.5, 0.5, 0, -0.5, -1.5].map((val, idx) => {
                  const y = getY(val);
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={svgWidth - paddingRight}
                        y2={y}
                        stroke={val === 0 ? '#475569' : '#1e293b'}
                        strokeWidth={val === 0 ? 1.5 : 1}
                        strokeDasharray={val !== 0 ? '4,4' : undefined}
                      />
                      <text
                        x={paddingLeft - 10}
                        y={y + 4}
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}°C
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Labels (Every 5 years) */}
                {ONI_DATA.map((p, idx) => {
                  if (idx % 5 === 0 || idx === ONI_DATA.length - 1) {
                    return (
                      <g key={idx}>
                        <line
                          x1={getX(idx)}
                          y1={svgHeight - paddingBottom}
                          x2={getX(idx)}
                          y2={svgHeight - paddingBottom + 5}
                          stroke="#334155"
                        />
                        <text
                          x={getX(idx)}
                          y={svgHeight - paddingBottom + 18}
                          fill="#64748b"
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {p.year}
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}

                {/* The main data line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#line-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_4px_10px_rgba(99,102,241,0.3)]"
                />

                {/* Static indicator for selected point */}
                {selectedYear && (
                  (() => {
                    const idx = ONI_DATA.findIndex(d => d.year === selectedYear);
                    if (idx !== -1) {
                      const p = ONI_DATA[idx];
                      const cx = getX(idx);
                      const cy = getY(p.value);
                      const color = p.value >= 0.5 ? '#ef4444' : p.value <= -0.5 ? '#3b82f6' : '#cbd5e1';
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r="8" fill={color} fillOpacity="0.2" className="animate-ping" />
                          <circle cx={cx} cy={cy} r="5.5" fill={color} stroke="#ffffff" strokeWidth="2.5" />
                        </g>
                      );
                    }
                  })()
                )}

                {/* Hover line and cursor details */}
                {hoveredPoint && (
                  (() => {
                    const idx = ONI_DATA.findIndex(d => d.year === hoveredPoint.year);
                    const cx = getX(idx);
                    const cy = getY(hoveredPoint.value);
                    const color = hoveredPoint.value >= 0.5 ? '#ef4444' : hoveredPoint.value <= -0.5 ? '#3b82f6' : '#cbd5e1';
                    return (
                      <g>
                        <line x1={cx} y1={paddingTop} x2={cx} y2={svgHeight - paddingBottom} stroke="#cbd5e1" strokeOpacity="0.25" strokeWidth="1.5" />
                        <circle cx={cx} cy={cy} r="8" fill={color} stroke="#ffffff" strokeWidth="2" />
                      </g>
                    );
                  })()
                )}
              </svg>

              {/* Floating Hover Tooltip inside SVG */}
              {hoveredPoint && (
                (() => {
                  const idx = ONI_DATA.findIndex(d => d.year === hoveredPoint.year);
                  const isRightSide = idx > ONI_DATA.length / 2;
                  return (
                    <div
                      className="absolute p-4 text-white text-xs rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-1 backdrop-blur-md"
                      style={{
                        top: '40px',
                        left: isRightSide ? undefined : `${getX(idx) + 20}px`,
                        right: isRightSide ? `${svgWidth - getX(idx) + 20}px` : undefined,
                        background: 'rgba(9, 15, 30, 0.88)',
                        width: '180px'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-slate-500 font-bold">ANNÉE {hoveredPoint.year}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          hoveredPoint.value >= 0.5 ? 'bg-red-500/20 text-red-400' : hoveredPoint.value <= -0.5 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {hoveredPoint.event}
                        </span>
                      </div>
                      <div className="text-sm font-black flex items-center justify-between mt-1">
                        <span>Anomalie ONI :</span>
                        <span style={{ color: hoveredPoint.value >= 0.5 ? '#f87171' : hoveredPoint.value <= -0.5 ? '#60a5fa' : '#ffffff' }}>
                          {hoveredPoint.value > 0 ? `+${hoveredPoint.value.toFixed(2)}` : hoveredPoint.value.toFixed(2)} °C
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-tight mt-1">Clic pour figer l'analyse</p>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Subtitles & details */}
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-4 text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                 <span>Source : NOAA Climate Prediction Center</span>
                 <div className="w-1 h-1 bg-slate-800 rounded-full" />
                 <span>Résolution : Saisonnière</span>
              </div>
              {isTeacherMode && (
                <button
                  onClick={() => setShowCorrection(!showCorrection)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
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
        </div>

        {/* Sidebar : Year details & Science Bilan */}
        <aside className="xl:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-8 bg-slate-900/60 border-slate-800 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Search size={80} />
            </div>

            <div className="relative z-10 flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                     <Calendar className="text-indigo-400" size={18} />
                     Fiche de Mesures ONI
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                     Cliquez sur n'importe quel point ou pic du graphique interactif pour charger la fiche climatique historique associée.
                  </p>
               </div>

               <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Période Clé</span>
                     <h4 className="text-2xl font-mono font-black text-white mt-0.5">{selectedData.year}</h4>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     selectedData.value >= 0.5 ? 'bg-red-500/20 text-red-400 border border-red-500/20' : selectedData.value <= -0.5 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400'
                   }`}>
                     {selectedData.event}
                   </span>
                 </div>

                 <div className="flex items-center gap-4 py-2 border-y border-slate-900">
                   <div className="p-2.5 bg-slate-900 rounded-xl text-orange-400 shrink-0">
                     <Thermometer size={20} className={selectedData.value >= 0.5 ? 'text-red-400' : selectedData.value <= -0.5 ? 'text-blue-400' : 'text-slate-400'} />
                   </div>
                   <div>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Écart Thermique (SST)</span>
                     <p className="text-base font-mono font-black text-white">
                       {selectedData.value > 0 ? `+${selectedData.value.toFixed(1)}` : selectedData.value.toFixed(1)} °C
                     </p>
                   </div>
                 </div>

                 <div className="flex flex-col gap-1.5">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Diagnostic Physique</span>
                   <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedData.details}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Teacher Correction Card */}
          <AnimatePresence>
            {showCorrection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel p-6 bg-indigo-900/20 border-indigo-500/30"
              >
                 <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="text-indigo-400" size={18} />
                    <h4 className="text-xs font-display font-black text-indigo-400 uppercase tracking-widest leading-none">Guide de correction</h4>
                 </div>
                 <div className="space-y-3 text-[11px] text-slate-300 leading-relaxed font-sans">
                    <p>
                      <strong>Seuils à repérer</strong> : Tout ce qui dépasse +1.5 est un El Niño "fort", au-dessus de +2.0 c'est un "Super El Niño". Les anomalies négatives sous -1.5 marquent les "Forts épisodes La Niña".
                    </p>
                    <p>
                      <strong>Tendance globale</strong> : Notez l'accumulation de 3 Super El Niño en moins de 40 ans (1982, 1997, 2015) et la récurrence de 2024/2026. L'énergie stockée par le réchauffement des océans favorise des pics élevés.
                    </p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* Quiz Section - Improved to 5 Questions */}
      <div className="glass-panel p-10 bg-slate-900/40 border-slate-800 flex flex-col gap-8 mt-4 relative overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6">
           <div className="flex flex-col gap-1">
             <span className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.3em] font-black">Activité d'Entraînement</span>
             <h3 className="text-2xl font-display font-extrabold text-white flex items-center gap-3">
                <Award className="text-orange-500" size={24} />
                Entraînement de Lecture Scientifique
             </h3>
           </div>
           
           <div className="px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-400">
             Question <span className="text-indigo-400">{activeQuestionIdx + 1}</span> sur <span className="text-slate-200">5</span>
           </div>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Questions Carousel / Active View */}
           <div className="lg:col-span-8 flex flex-col gap-6">
             <AnimatePresence mode="wait">
               {(!showQuizResult) ? (
                 <motion.div
                   key={activeQuestionIdx}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="p-8 bg-slate-950 rounded-[2rem] border border-slate-900 flex flex-col gap-6 shadow-inner"
                 >
                   <h4 className="text-lg font-bold text-white leading-relaxed">
                     {quizQuestions[activeQuestionIdx].question}
                   </h4>
                   
                   <div className="flex flex-col gap-3">
                     {quizQuestions[activeQuestionIdx].options.map((opt, idx) => {
                       const isSelected = answers[quizQuestions[activeQuestionIdx].id] === idx;
                       const isCorrect = quizQuestions[activeQuestionIdx].correctAnswer === idx;
                       
                       let btnClass = "p-4 rounded-xl border-2 text-left transition-all font-semibold text-xs flex justify-between items-center ";
                       
                       if (isSelected) {
                         btnClass += "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/10";
                       } else {
                         btnClass += "bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900 cursor-pointer";
                       }

                       return (
                         <button
                           key={idx}
                           onClick={() => setAnswers(prev => ({...prev, [quizQuestions[activeQuestionIdx].id]: idx}))}
                           className={btnClass}
                         >
                           <span>{opt}</span>
                           {isSelected && <ChevronRight size={14} className="text-indigo-300" />}
                         </button>
                       );
                     })}
                   </div>

                   {/* Next / Previous controls */}
                   <div className="flex justify-between items-center pt-4 border-t border-slate-900">
                     <button
                       disabled={activeQuestionIdx === 0}
                       onClick={() => setActiveQuestionIdx(p => p - 1)}
                       className="px-5 py-2.5 rounded-xl border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                     >
                       Précédent
                     </button>
                     
                     {activeQuestionIdx < quizQuestions.length - 1 ? (
                       <button
                         disabled={answers[quizQuestions[activeQuestionIdx].id] === undefined}
                         onClick={() => setActiveQuestionIdx(p => p + 1)}
                         className="px-6 py-2.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                       >
                         Suivant
                       </button>
                     ) : (
                       <button
                         disabled={Object.keys(answers).length < quizQuestions.length}
                         onClick={() => setShowQuizResult(true)}
                         className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                       >
                         Soumettre le Diagnostic
                       </button>
                     )}
                   </div>
                 </motion.div>
               ) : (
                 /* Results panel */
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-8 bg-slate-950 rounded-[2rem] border border-emerald-500/10 flex flex-col gap-6 shadow-inner text-center items-center justify-center relative overflow-hidden"
                 >
                   {/* Background glow */}
                   <div className="absolute -inset-10 bg-emerald-500/5 blur-3xl pointer-events-none" />
                   
                   <div className="p-4 bg-emerald-500 text-white rounded-full shadow-lg relative z-10">
                     <CheckCircle2 size={36} />
                   </div>
                   
                   <div className="flex flex-col gap-1 relative z-10">
                     <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">Test Réussi !</span>
                     <h4 className="text-2xl font-display font-black text-white mt-1">Score : {score} / 5 Réponses Correctes</h4>
                   </div>
                   
                   <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans relative z-10">
                     Excellent travail d'analyse graphique. Vos connaissances vous permettent désormais de formuler une conclusion scientifique rigoureuse dans l'onglet **Conclusion**.
                   </p>

                   <button
                     onClick={() => { setAnswers({}); setShowQuizResult(false); setActiveQuestionIdx(0); }}
                     className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer relative z-10"
                   >
                     Recommencer le test
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           {/* Explanations & corrections side of the active question (after answering or in teacher mode) */}
           <div className="lg:col-span-4 flex flex-col gap-4">
             {answers[quizQuestions[activeQuestionIdx].id] !== undefined ? (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`p-6 rounded-3xl border flex flex-col gap-3 h-full justify-between ${
                   answers[quizQuestions[activeQuestionIdx].id] === quizQuestions[activeQuestionIdx].correctAnswer
                     ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                     : 'bg-red-500/5 border-red-500/20 text-red-400'
                 }`}
               >
                 <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 size={16} />
                     <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                       {answers[quizQuestions[activeQuestionIdx].id] === quizQuestions[activeQuestionIdx].correctAnswer ? 'Excellente réponse !' : 'Réponse incorrecte'}
                     </span>
                   </div>
                   <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
                     {quizQuestions[activeQuestionIdx].explanation}
                   </p>
                 </div>
                 
                 <div className="text-[9px] text-slate-500 font-mono mt-3 border-t border-slate-900 pt-3">
                   Indice scientifique validé
                 </div>
               </motion.div>
             ) : (
               <div className="p-6 bg-slate-900/20 border border-slate-800/60 border-dashed rounded-3xl flex flex-col justify-center items-center text-center gap-2 h-48 opacity-50">
                 <HelpCircle size={24} className="text-slate-500" />
                 <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider font-bold">Sélectionnez une réponse pour révéler l'explication scientifique</span>
               </div>
             )}
           </div>

         </div>
      </div>
    </div>
  );
}
