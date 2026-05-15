export type ClimateMode = 'normal' | 'elnino' | 'lanina';

export interface ModeConfig {
  id: ClimateMode;
  label: string;
  emoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  tradeWindStrength: number;
  thermoclineWest: number;
  thermoclineEast: number;
  warmPoolWidth: number;
  upwellingStrength: number;
  precipWest: boolean;
  precipEast: boolean;
  seaLevelDiff: number;
  consequences: string[];
  causes: string[];
}

export const MODES: ModeConfig[] = [
  {
    id: 'normal',
    label: 'Conditions Normales',
    emoji: '🌊',
    color: '#3b82f6',
    bgGradient: 'from-blue-600 to-cyan-500',
    borderColor: 'border-blue-500',
    description:
      "Les alizés soufflent normalement vers l'ouest, empilant les eaux chaudes du côté australo-asiatique. Un upwelling modéré remonte les eaux froides au large du Pérou.",
    tradeWindStrength: 0.65,
    thermoclineWest: 120,
    thermoclineEast: 60,
    warmPoolWidth: 0.48,
    upwellingStrength: 0.55,
    precipWest: true,
    precipEast: false,
    seaLevelDiff: 40,
    consequences: [
      'Pluies abondantes en Asie du Sud-Est et Australie',
      'Sécheresse modérée sur les côtes péruviennes',
      'Upwelling actif nourrit les pêcheries du Pérou',
      'Température océanique équilibrée',
    ],
    causes: [
      'Alizés équatoriaux actifs (O→E)',
      'Cellule de Walker bien établie',
      'Gradient de température est-ouest modéré',
    ],
  },
  {
    id: 'elnino',
    label: 'El Niño',
    emoji: '🔥',
    color: '#ef4444',
    bgGradient: 'from-orange-500 to-red-600',
    borderColor: 'border-red-500',
    description:
      "Les alizés s'affaiblissent ou s'inversent. Les eaux chaudes migrent vers l'est, bloquant l'upwelling péruvien. La Cellule de Walker s'inverse partiellement.",
    tradeWindStrength: 0.15,
    thermoclineWest: 80,
    thermoclineEast: 110,
    warmPoolWidth: 0.82,
    upwellingStrength: 0.08,
    precipWest: false,
    precipEast: true,
    seaLevelDiff: -30,
    consequences: [
      'Inondations et pluies extrêmes au Pérou/Équateur',
      'Sécheresses sévères en Australie et Indonésie',
      'Effondrement des pêcheries péruviennes',
      'Perturbation météo mondiale (téléconnexions)',
    ],
    causes: [
      'Affaiblissement ou inversion des alizés',
      "Déplacement du bassin d'eau chaude vers l'est",
      "Thermocline s'aplatit / s'inverse",
    ],
  },
  {
    id: 'lanina',
    label: 'La Niña',
    emoji: '❄️',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 to-blue-700',
    borderColor: 'border-cyan-400',
    description:
      "Les alizés sont anormalement forts. Les eaux froides s'étendent plus à l'ouest, l'upwelling s'intensifie. C'est une amplification des conditions normales.",
    tradeWindStrength: 0.95,
    thermoclineWest: 150,
    thermoclineEast: 35,
    warmPoolWidth: 0.3,
    upwellingStrength: 0.92,
    precipWest: true,
    precipEast: false,
    seaLevelDiff: 65,
    consequences: [
      'Pluies et cyclones intenses en Asie-Pacifique',
      'Sécheresses prolongées en Amérique du Sud',
      'Upwelling intense → forte productivité marine',
      'Températures globales légèrement plus basses',
    ],
    causes: [
      'Renforcement exceptionnel des alizés',
      "Piscine d'eau chaude comprimée vers l'ouest",
      'Thermocline très inclinée est-ouest',
    ],
  },
];
