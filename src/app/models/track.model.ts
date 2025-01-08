export enum MusicCategory {
  Rock = 'Rock',
  Pop = 'Pop',
  Jazz = 'Jazz',
  Classical = 'Classique',
  Electronic = 'Électronique',
  HipHop = 'Hip-Hop',
  Chaabi = 'Chaâbi',
  Other = 'Autre'
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  category: MusicCategory;
  description?: string;
  imageUrl?: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
  addedDate: Date;
  fileSize: number;
  mimeType: string;
  showMenu?: boolean;
} 