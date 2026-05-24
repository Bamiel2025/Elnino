import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import Introduction from './components/Introduction';
import Conclusion from './components/Conclusion';
import ONIActivity from './components/ONIActivity';
import PacificView from './components/PacificView';
import WorldMapActivity from './components/WorldMapActivity';
import TeacherPanel from './components/TeacherPanel';
import { ClimatePhase } from './types';

export default function App() {
  const [phase, setPhase] = useState<ClimatePhase>('normal');
  const [intensity, setIntensity] = useState(0); 
  const [currentStage, setCurrentStage] = useState<'intro' | 'simulation' | 'map' | 'oni' | 'conclusion'>('intro');
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Sync intensity with phase when buttons are clicked
  const handlePhaseChange = (p: ClimatePhase) => {
    setPhase(p);
    setIntensity(p === 'normal' ? 0 : 1);
  };

  // Sync phase with intensity when slider is moved
  const handleIntensityChange = (val: number) => {
    setIntensity(val);
    if (val > 0.5 && phase === 'normal') setPhase('elnino');
    if (val <= 0.5 && phase === 'elnino') setPhase('normal');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === 'elnino') {
      setIsTeacherMode(true);
      setIsLoginOpen(false);
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  // Logic for children: Simple explanations
  const getExplanation = () => {
    if (phase === 'normal') {
      return {
        title: "Comment ça marche normalement ?",
        text: "Le vent souffle d'Est en Ouest. Il pousse l'eau chaude vers l'Asie. Au large du Pérou, l'eau froide et riche en poissons remonte : c'est l'upwelling !",
        conseil: "Observe les flèches blanches (le vent) et les gouttes d'eau (la pluie)."
      };
    } else {
      return {
        title: "L'arrivée d'El Niño",
        text: "Les Alizés faiblissent. L'eau chaude reflue vers l'Amérique. La pluie se déplace et l'upwelling s'arrête. C'est un bouleversement pour la nature et les hommes.",
        conseil: "Vois comment la zone de pluie s'est déplacée vers le milieu de l'océan."
      };
    }
  };

  const explanation = getExplanation();

  const stages = [
    { id: 'intro', label: '1. Introduction' },
    { id: 'simulation', label: '2. Simulation' },
    { id: 'map', label: '3. Impacts' },
    { id: 'oni', label: '4. Analyse ONI' },
    { id: 'conclusion', label: '5. Conclusion' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col gap-10 max-w-7xl mx-auto no-scrollbar">
      {/* High-End Navigation Bar */}
      {currentStage !== 'intro' && (
        <header className="flex justify-between items-center bg-slate-900/90 backdrop-blur-xl p-4 rounded-3xl border border-slate-800 shadow-2xl sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 hidden md:block">
              <Globe className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-display font-extrabold tracking-tight text-white leading-none">El Niño 2026</h1>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Mission Scientifique</span>
            </div>
          </div>

          <nav className="flex gap-1 md:gap-2">
            {stages.map((stage, i) => (
              <button 
                key={stage.id}
                onClick={() => setCurrentStage(stage.id as any)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  currentStage === stage.id 
                    ? 'bg-white text-slate-950 shadow-xl' 
                    : i < currentStageIndex 
                      ? 'text-emerald-400 hover:bg-emerald-500/10' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                  currentStage === stage.id 
                    ? 'bg-slate-950 border-slate-800 text-white' 
                    : i < currentStageIndex 
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  {i < currentStageIndex ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <span className="text-xs font-display font-bold hidden lg:block uppercase tracking-wider">{stage.label.split('. ')[1]}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
             {isTeacherMode && (
                <div className="hidden xl:flex flex-col items-end mr-2">
                   <span className="text-[10px] font-mono text-indigo-400 font-black uppercase tracking-widest leading-none">Mode</span>
                   <span className="text-[10px] font-mono text-indigo-500 font-black uppercase tracking-widest leading-none">Professeur</span>
                </div>
             )}
             <button 
                onClick={() => isTeacherMode ? setIsTeacherMode(false) : setIsLoginOpen(true)}
                className={`p-2.5 rounded-xl border transition-all duration-300 ${isTeacherMode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white'}`}
                title="Accès Professeur"
             >
                <Layers size={18} />
             </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex flex-col gap-8 min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentStage === 'intro' && <Introduction onStart={() => setCurrentStage('simulation')} />}
            
            {currentStage === 'simulation' && (
              <div className="flex flex-col gap-8">
                <PacificView phase={phase} intensity={intensity} isTeacherMode={isTeacherMode} onPhaseChange={handlePhaseChange} />
                <div className="flex justify-end">
                  <button 
                    onClick={() => setCurrentStage('map')}
                    className="group flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-display font-black text-xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95"
                  >
                    Voir les impacts mondiaux
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {currentStage === 'map' && (
               <div className="flex flex-col gap-8">
                  {/* High-End Phase Selector for Map stage */}
                  <div className="flex justify-center mt-2">
                    <div className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 gap-2 shadow-2xl">
                      <button
                        onClick={() => handlePhaseChange('normal')}
                        className={`px-6 py-3 rounded-xl font-display font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          phase === 'normal'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🌊 Conditions Normales
                      </button>
                      <button
                        onClick={() => handlePhaseChange('elnino')}
                        className={`px-6 py-3 rounded-xl font-display font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          phase === 'elnino'
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🔥 Phénomène El Niño
                      </button>
                    </div>
                  </div>

                  <WorldMapActivity phase={phase} isTeacherMode={isTeacherMode} />
                  <div className="flex justify-end mt-4">
                     <button 
                        onClick={() => setCurrentStage('oni')}
                        className="group flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-display font-black text-xl hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95"
                     >
                        Analyser l'indice ONI
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
               </div>
            )}

            {currentStage === 'oni' && (
               <div className="flex flex-col gap-8">
                  <ONIActivity isTeacherMode={isTeacherMode} />
                  <div className="flex justify-end mt-8">
                     <button 
                        onClick={() => setCurrentStage('conclusion')}
                        className="group flex items-center gap-4 bg-emerald-500 text-white px-10 py-5 rounded-2xl font-display font-black text-xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
                     >
                        Terminer la mission
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
               </div>
            )}

            {currentStage === 'conclusion' && <Conclusion />}
          </motion.div>
        </AnimatePresence>

        {/* Global Teacher Panel */}
        {isTeacherMode && currentStage !== 'intro' && (
           <div className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <TeacherPanel />
           </div>
        )}
      </main>

      <footer className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 mb-12">
        <div className="flex items-center gap-2">
          <Layers size={16} />
          <span className="text-xs font-mono">DONNÉES SCIENTIFIQUES : GÉNÉRALES & MÉTÉOSUISSE</span>
        </div>
        <p className="text-xs font-sans">Crée pour apprendre en s'amusant • ENS-Climat 2026</p>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <Layers size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold">Accès Professeur</h2>
                <p className="text-slate-400 text-sm">
                  Veuillez entrer le code d'accès pour déverrouiller les corrections et les ressources pédagogiques.
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 ml-1">Code Secret</label>
                  <input 
                    type="text" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    placeholder="Saisissez le code"
                    className={`w-full bg-slate-950 border ${loginError ? 'border-red-500' : 'border-slate-800'} p-4 rounded-xl text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-indigo-500 transition-colors uppercase font-bold`}
                  />
                  {loginError && <span className="text-red-400 text-[10px] text-center font-bold">Code incorrect. Réessayez.</span>}
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-display font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Valider
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
