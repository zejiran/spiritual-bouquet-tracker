export interface Offering {
  id?: string;
  recipientId: string;
  type: OfferingType;
  userName: string;
  imageUrl?: string;
  comment?: string;
  timestamp: string;
}

export interface Recipient {
  id: string;
  name: string;
  createdAt: string;
}

export type OfferingType =
  | 'eucaristia'
  | 'rosario'
  | 'ayuno'
  | 'horaSanta'
  | 'otro';

export interface OfferingSummary {
  [key: string]: number;
  eucaristia: number;
  rosario: number;
  ayuno: number;
  horaSanta: number;
  otro: number;
}

export interface OfferingTypeConfig {
  value: OfferingType;
  label: string;
  icon: string;
  bgColor: string;
  textColor: string;
}
