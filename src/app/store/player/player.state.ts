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
  currentTrackId: string | null;
  status: PlayerStatus;
  loadingStatus: LoadingStatus;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
}

export const initialPlayerState: PlayerState = {
  currentTrackId: null,
  status: PlayerStatus.STOPPED,
  loadingStatus: LoadingStatus.IDLE,
  currentTime: 0,
  duration: 0,
  volume: 1,
  error: null
}; 