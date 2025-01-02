import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.state';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrackId = createSelector(
  selectPlayerState,
  (state) => state.currentTrackId
);

export const selectPlayerStatus = createSelector(
  selectPlayerState,
  (state) => state.status
);

export const selectLoadingStatus = createSelector(
  selectPlayerState,
  (state) => state.loadingStatus
);

export const selectProgress = createSelector(
  selectPlayerState,
  (state) => ({
    currentTime: state.currentTime,
    duration: state.duration
  })
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state) => state.volume
);

export const selectError = createSelector(
  selectPlayerState,
  (state) => state.error
);

export const selectIsPlaying = createSelector(
  selectPlayerState,
  (state) => state.status === 'playing'
); 