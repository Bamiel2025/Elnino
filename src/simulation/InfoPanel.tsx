import React, { useState } from 'react';
import { ModeConfig } from './types';

interface Props { mode: ModeConfig; }
const tabs = ['Causes', 'Conséquences'] as const;
type Tab = (typeof tabs)[number];

export const InfoPanel: React.FC<Props> = ({ mode }) => {
  const [tab, setTab] = useState<Tab>('Causes');
  const items = tab === 'Causes' ? mode.causes : mode.consequences;
  const tabColors: Record<Tab, string> = {
    Causes: 'bg-violet-600 text-white',
    Conséquences: 'bg-amber-500 text-white',
  };
  const itemColors: Record<Tab, string> = {
    Causes: 'text-violet-200 border-violet-600',
    Conséquences: 'text-amber-200 border-amber-500',
  };
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 ${tab === t ? tabColors[t] : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-2 text-xs border-l-2 pl-2 py-0.5 ${itemColors[tab]}`}>
            <span className="mt-0.5 shrink-0 text-sm">{tab === 'Causes' ? '→' : '⚡'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
