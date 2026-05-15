import React from 'react';
import { ModeConfig, ClimateMode } from './types';

interface Props {
  modes: ModeConfig[];
  activeId: ClimateMode;
  onChange: (id: ClimateMode) => void;
}

const ringColors: Record<ClimateMode, string> = {
  normal: 'ring-blue-500', elnino: 'ring-red-500', lanina: 'ring-cyan-400',
};
const activeBg: Record<ClimateMode, string> = {
  normal: 'bg-blue-600', elnino: 'bg-red-600', lanina: 'bg-cyan-600',
};

export const ModeSelector: React.FC<Props> = ({ modes, activeId, onChange }) => (
  <div className="flex gap-3 justify-center flex-wrap">
    {modes.map((m) => {
      const isActive = m.id === activeId;
      return (
        <button key={m.id} onClick={() => onChange(m.id)}
          className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-200 ${isActive
            ? `${activeBg[m.id]} border-transparent text-white shadow-lg ring-2 ${ringColors[m.id]} ring-offset-2 ring-offset-slate-900 scale-105`
            : 'border-slate-600 text-slate-300 bg-slate-800 hover:bg-slate-700 hover:border-slate-500'}`}>
          <span className="text-2xl">{m.emoji}</span>
          <span>{m.label}</span>
        </button>
      );
    })}
  </div>
);
