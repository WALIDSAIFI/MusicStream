import { createReducer, on } from '@ngrx/store';
import { PlayerState, PlayerStatus, LoadingStatus } from './player.state';
import * as PlayerActions from './player.actions';

export const initialState: PlayerState = {
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

export const playerReducer = createReducer(
  initialState,

  // Actions de contrôle du lecteur
  on(PlayerActions.playTrack, (state, { track }) => ({
    ...state,
    currentTrack: track,
    currentTrackId: track.id,
    playerStatus: PlayerStatus.PLAYING,
    loadingStatus: LoadingStatus.LOADING,
    error: null
  })),

  on(PlayerActions.pauseTrack, (state) => ({
    ...state,
    playerStatus: PlayerStatus.PAUSED
  })),

  on(PlayerActions.resumeTrack, (state) => ({
    ...state,
    playerStatus: PlayerStatus.PLAYING
  })),

  on(PlayerActions.stopTrack, (state) => ({
    ...state,
    playerStatus: PlayerStatus.STOPPED,
    currentTime: 0
  })),

  on(PlayerActions.bufferTrack, (state) => ({
    ...state,
    playerStatus: PlayerStatus.BUFFERING
  })),

  // Actions de mise à jour de l'état
  on(PlayerActions.updatePlayerStatus, (state, { status }) => ({
    ...state,
    playerStatus: status
  })),

  on(PlayerActions.updateLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status
  })),

  on(PlayerActions.updateCurrentTime, (state, { time }) => ({
    ...state,
    currentTime: time
  })),

  on(PlayerActions.updateDuration, (state, { duration }) => ({
    ...state,
    duration
  })),

  on(PlayerActions.updateVolume, (state, { volume }) => ({
    ...state,
    volume
  })),

  // Actions de gestion des erreurs
  on(PlayerActions.playerError, (state, { error }) => ({
    ...state,
    error,
    loadingStatus: LoadingStatus.ERROR,
    playerStatus: PlayerStatus.STOPPED
  })),

  on(PlayerActions.clearError, (state) => ({
    ...state,
    error: null,
    loadingStatus: LoadingStatus.IDLE
  })),

  // Actions de gestion de la file d'attente
  on(PlayerActions.addToQueue, (state, { track }) => ({
    ...state,
    queue: [...state.queue, track]
  })),

  on(PlayerActions.removeFromQueue, (state, { trackId }) => ({
    ...state,
    queue: state.queue.filter(track => track.id !== trackId)
  })),

  on(PlayerActions.clearQueue, (state) => ({
    ...state,
    queue: []
  }))
); 