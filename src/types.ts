export type ClimatePhase = 'normal' | 'elnino';

export interface DropZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  correctPhase: ClimatePhase;
}

export interface SimulationLabel {
  id: string;
  text: string;
  targetZoneId: string;
}

export interface EventMarker {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  type: 'positive' | 'negative' | 'neutral';
  phase: ClimatePhase;
  targetId?: string; // For drag and drop matching
  image?: string;
}

export const SIMULATION_LABELS: SimulationLabel[] = [
  { id: 'alizes-forts', text: 'Alizés Forts', targetZoneId: 'winds' },
  { id: 'alizes-faibles', text: 'Alizés Faibles', targetZoneId: 'winds' },
  { id: 'upwelling-ok', text: 'Upwelling (Riche)', targetZoneId: 'upwelling' },
  { id: 'upwelling-stop', text: 'Upwelling (Stoppé)', targetZoneId: 'upwelling' },
  { id: 'rain-asia', text: 'Pluies Tropicales', targetZoneId: 'rain' },
  { id: 'rain-center', text: 'Pluies Déplacées', targetZoneId: 'rain' }
];

export const WORLD_EVENTS: EventMarker[] = [
  {
    id: 'floods-peru',
    label: 'Inondations',
    description: 'Les eaux chaudes apportent des pluies torrentielles sur les côtes normalement sèches du Pérou.',
    x: 32,
    y: 72,
    type: 'negative',
    phase: 'elnino',
    image: '/image/inondations au perou.jpg'
  },
  {
    id: 'drought-australia',
    label: 'Sécheresse',
    description: 'L\'absence de pluies tropicales provoque des incendies et des pénuries d\'eau en Australie.',
    x: 88,
    y: 84,
    type: 'negative',
    phase: 'elnino',
    image: '/image/secheresse en australie.jpg'
  },
  {
    id: 'fishing-collapse',
    label: 'Crise de la Pêche',
    description: 'L\'arrêt de l\'upwelling au Pérou coupe l\'arrivée de nourriture pour les poissons.',
    x: 22,
    y: 62,
    type: 'negative',
    phase: 'elnino',
    image: '/image/crise de la peche.jpg'
  },
  {
    id: 'fires-indonesia',
    label: 'Incendies',
    description: 'La sécheresse extrême en Indonésie favorise les feux de forêt géants.',
    x: 80,
    y: 58,
    type: 'negative',
    phase: 'elnino',
    image: '/image/incendies en indonésie.jpg'
  },
  {
    id: 'normal-fishing',
    label: 'Pêche Abondante',
    description: 'L\'upwelling fonctionne bien au Pérou, apportant beaucoup de poissons.',
    x: 22,
    y: 62,
    type: 'positive',
    phase: 'normal'
  },
  {
    id: 'normal-rain-se',
    label: 'Pluies Fertiles',
    description: 'L\'Asie du Sud-Est reçoit des pluies tropicales régulières pour l\'agriculture.',
    x: 80,
    y: 58,
    type: 'positive',
    phase: 'normal'
  },
  {
    id: 'normal-dry-peru',
    label: 'Climat Sec',
    description: 'Les côtes du Pérou restent sèches et stables, évitant les coulées de boue.',
    x: 32,
    y: 72,
    type: 'neutral',
    phase: 'normal'
  }
];
