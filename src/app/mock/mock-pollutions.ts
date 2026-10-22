import { Pollution } from '../models/pollution.model';

export const INITIAL_POLLUTIONS: Pollution[] = [
  {
    id: 1,
    titre: "Déchets plastiques au bord de l'eau",
    type: 'Plastique',
    description: 'Nombreuses bouteilles, emballages et plastiques abandonnés près des berges.',
    date: '2026-10-15',
    lieu: "Strasbourg - Parc de l'Orangerie",
    latitude: 48.5901,
    longitude: 7.7712,
    photo:
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    titre: 'Dépôt sauvage de gravats',
    type: 'Dépôt sauvage',
    description:
      'Amas important de gravats et débris de chantier déversés illégalement en lisière de forêt.',
    date: '2026-10-18',
    lieu: 'Forêt de la Robertsau',
    latitude: 48.6214,
    longitude: 7.7955,
    photo:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    titre: 'Fumées suspectes zone portuaire',
    type: 'Air',
    description:
      'Émanations sombres et persistantes avec une odeur âcre observées en début de matinée.',
    date: '2026-10-20',
    lieu: 'Port du Rhin',
    latitude: 48.5732,
    longitude: 7.7981,
    photo: '',
  },
  {
    id: 4,
    titre: "Nappe irisée d'hydrocarbures",
    type: 'Eau',
    description:
      "Traces d'huile et de carburant formant des reflets irisés en surface sur plusieurs mètres.",
    date: '2026-10-21',
    lieu: 'Canal du Rhône au Rhin',
    latitude: 48.5523,
    longitude: 7.7654,
    photo:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60',
  },
];
