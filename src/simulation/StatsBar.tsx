import React from 'react';
import { ModeConfig } from './types';

interface Props { mode: ModeConfig; }

export const StatsBar: React.FC<Props> = ({ mode }) => {
  const windPct = Math.round(mode.tradeWindStrength * 100);
  const upwellPct = Math.round(mode.upwellingStrength * 100);
  const sealevel = mode.seaLevelDiff > 0 ? `+${mode.seaLevelDiff} cm (Ouest > Est)` : mode.seaLevelDiff < 0 ? `${mode.seaLevelDiff} cm (Est > Ouest)` : '≈ Égal';
  const thermSlope = mode.thermoclineWest > mode.thermoclineEast ? `↘ ${mode.thermoclineWest - mode.thermoclineEast} m` : mode.thermoclineWest < mode.thermoclineEast ? `↗ ${mode.thermoclineEast - mode.thermoclineWest} m` : '→ Horizontale';

  const stats = [
    { label: 'Force des Alizés', value: `${windPct}%`, sub: windPct > 70 ? 'Forts' : windPct > 35 ? 'Modérés' : 'Faibles / inversés', icon: '💨', color: mode.id === 'elnino' ? 'text-orange-400' : 'text-blue-300' },
    { label: 'Upwelling', value: `${upwellPct}%`, sub: upwellPct > 70 ? 'Très actif' : upwellPct > 30 ? 'Modéré' : 'Quasi absent', icon: '🌊', color: 'text-cyan-300' },
    { label: 'Niveau de mer', value: sealevel, icon: '📏', color: 'text-amber-300' },
    { label: 'Pente thermocline', value: thermSlope, icon: '📐', color: 'text-violet-300' },
    { label: 'Précipitations', value: mode.id === 'normal' ? 'Ouest ☔' : mode.id === 'elnino' ? 'Est ☔  Ouest 🏜' : 'Ouest ⛈  Est 🏜', icon: '🌧', color: 'text-sky-300' },
    { label: 'Anomalie SST Est', value: mode.id === 'normal' ? '≈ 0 °C' : mode.id === 'elnino' ? '+2 à +4 °C' : '−1 à −2 °C', sub: mode.id === 'elnino' ? 'Réchauffement anormal' : mode.id === 'lanina' ? 'Refroidissement' : 'Normal', icon: '🌡', color: mode.id === 'elnino' ? 'text-red-400' : mode.id === 'lanina' ? 'text-cyan-400' : 'text-green-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5 rounded-xl bg-slate-800/60 border border-slate-700 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"><span>{s.icon}</span><span>{s.label}</span></div>
          <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
          {s.sub && <p className="text-xs text-slate-500">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
};
