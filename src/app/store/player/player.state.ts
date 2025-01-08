import { Track } from '../../models/track.model';

export enum PlayerStatus {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped'
}

export enum LoadingStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface PlayerState {
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  playerStatus: PlayerStatus;
  loadingStatus: LoadingStatus;
  error: string | null;
  queue: Track[];
  currentTrackId: string | null;
}

export const initialPlayerState: PlayerState = {
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playerStatus: PlayerStatus.STOPPED,
  loadingStatus: LoadingStatus.IDLE,
  error: null,
  queue: [],
  currentTrackId: null
}; 