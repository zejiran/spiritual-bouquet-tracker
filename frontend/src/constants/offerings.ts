import { OfferingTypeConfig } from '../types';

export const OFFERING_TYPES: OfferingTypeConfig[] = [
  {
    value: 'eucaristia',
    label: 'Eucaristía',
    icon: '🕊',
    bgColor: 'bg-primary-100',
    textColor: 'text-primary-800',
  },
  {
    value: 'rosario',
    label: 'Rosario',
    icon: '📿',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-800',
  },
  {
    value: 'ayuno',
    label: 'Ayuno',
    icon: '🙏',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
  },
  {
    value: 'horaSanta',
    label: 'Hora Santa',
    icon: '⛪',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
  },
  {
    value: 'otro',
    label: 'Otro',
    icon: '✨',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
];
