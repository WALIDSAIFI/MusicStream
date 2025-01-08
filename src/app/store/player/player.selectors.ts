import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState, PlayerStatus } from './player.state';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrack = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.currentTrack
);

export const selectPlayerStatus = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.playerStatus
);

export const selectLoadingStatus = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.loadingStatus
);

export const selectCurrentTime = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.currentTime
);

export const selectDuration = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.duration
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.volume
);

export const selectError = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.error
);

export const selectQueue = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.queue
);

export const selectProgress = createSelector(
  selectPlayerState,
  (state: PlayerState) => ({
    currentTime: state.currentTime,
    duration: state.duration,
    progress: state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0
  })
);

export const selectPlayerInfo = createSelector(
  selectPlayerState,
  (state: PlayerState) => ({
    playerStatus: state.playerStatus,
    isPlaying: state.playerStatus === PlayerStatus.PLAYING,
    isBuffering: state.playerStatus === PlayerStatus.BUFFERING,
    isError: state.loadingStatus === 'error',
    errorMessage: state.error
  })
); 