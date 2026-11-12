export interface Pollution {
  id: number;
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photo?: string;
  valeur?: number;
  indice?: number;
  dangerosite?: number;
  polluant?: string;
  ville?: string;
}
