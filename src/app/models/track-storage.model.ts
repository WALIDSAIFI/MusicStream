import { MusicCategory } from './track.model';

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedDate: Date;
  duration: number;
  category: MusicCategory;
  fileSize: number;
  mimeType: string;
  imageUrl?: string;
}

export interface AudioBlob {
  id: string;
  blob: Blob;
  mimeType: string;
}

export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp3'
];

export const FILE_SIZE_LIMIT = 15 * 1024 * 1024; 