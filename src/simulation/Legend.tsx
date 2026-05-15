import React from 'react';

const legendItems = [
  { color: '#fb923c', label: 'Eaux chaudes (surface)', shape: 'rect' },
  { color: '#1e40af', label: 'Eaux froides (profondeur)', shape: 'rect' },
  { color: '#fbbf24', label: 'Thermocline', shape: 'dash' },
  { color: '#e2e8f0', label: 'Alizés / Vents', shape: 'arrow' },
  { color: '#22d3ee', label: 'Upwelling (remontée froide)', shape: 'arrow-up' },
  { color: '#93c5fd', label: 'Précipitations', shape: 'rain' },
];

export const Legend: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
    {legendItems.map((item) => (
      <div key={item.label} className="flex items-center gap-2 text-xs text-slate-300">
        <svg width="28" height="14" viewBox="0 0 28 14" className="shrink-0">
          {item.shape === 'rect' && <rect x="2" y="3" width="24" height="8" rx="2" fill={item.color} opacity="0.85" />}
          {item.shape === 'dash' && <line x1="2" y1="7" x2="26" y2="7" stroke={item.color} strokeWidth="2" strokeDasharray="5,3" />}
          {item.shape === 'arrow' && (<><line x1="2" y1="7" x2="20" y2="7" stroke={item.color} strokeWidth="2" /><polygon points="20,3 28,7 20,11" fill={item.color} /></>)}
          {item.shape === 'arrow-up' && (<><line x1="14" y1="13" x2="14" y2="4" stroke={item.color} strokeWidth="2" /><polygon points="10,6 14,0 18,6" fill={item.color} /></>)}
          {item.shape === 'rain' && [5, 11, 17, 23].map((x) => <line key={x} x1={x} y1="2" x2={x - 2} y2="12" stroke={item.color} strokeWidth="1.5" />)}
        </svg>
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);
