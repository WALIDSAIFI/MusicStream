import { createReducer, on } from '@ngrx/store';
import * as PlayerActions from './player.actions';
import { initialPlayerState, PlayerStatus, LoadingStatus } from './player.state';

export const playerReducer = createReducer(
  initialPlayerState,

  on(PlayerActions.playTrack, (state, { trackId }) => ({
    ...state,
    currentTrackId: trackId,
    status: PlayerStatus.BUFFERING,
    loadingStatus: LoadingStatus.LOADING,
    error: null
  })),

  on(PlayerActions.pauseTrack, (state) => ({
    ...state,
    status: PlayerStatus.PAUSED
  })),

  on(PlayerActions.resumeTrack, (state) => ({
    ...state,
    status: PlayerStatus.PLAYING
  })),

  on(PlayerActions.stopTrack, (state) => ({
    ...state,
    status: PlayerStatus.STOPPED,
    currentTrackId: null,
    currentTime: 0
  })),

  on(PlayerActions.updatePlayerStatus, (state, { status }) => ({
    ...state,
    status
  })),

  on(PlayerActions.updateLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status
  })),

  on(PlayerActions.updateProgress, (state, { currentTime, duration }) => ({
    ...state,
    currentTime,
    duration
  })),

  on(PlayerActions.setVolume, (state, { volume }) => ({
    ...state,
    volume
  })),

  on(PlayerActions.playerError, (state, { error }) => ({
    ...state,
    error,
    status: PlayerStatus.STOPPED,
    loadingStatus: LoadingStatus.ERROR
  }))
); 