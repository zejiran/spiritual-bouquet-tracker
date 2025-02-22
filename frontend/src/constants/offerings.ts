import { OfferingTypeConfig } from '../types';

export const OFFERING_TYPES: OfferingTypeConfig[] = [
  {
    value: 'eucaristia',
    label: 'Eucaristía',
    icon: '🕊',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    value: 'rosario',
    label: 'Rosario',
    icon: '📿',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800'
  },
  {
    value: 'ayuno',
    label: 'Ayuno',
    icon: '🙏',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  {
    value: 'horaSanta',
    label: 'Hora Santa',
    icon: '⛪',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    value: 'otro',
    label: 'Otro',
    icon: '✨',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
];
