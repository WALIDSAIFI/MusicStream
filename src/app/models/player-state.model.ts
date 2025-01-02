import { Track } from './track.model';

export interface PlayerState {
  currentTrack: Track | null;
  status: PlaybackStatus;
  volume: number;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
}

export enum PlaybackStatus {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped'
} 