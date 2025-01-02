import { createAction, props } from '@ngrx/store';
import { PlayerStatus, LoadingStatus } from './player.state';

// Actions de contrôle du lecteur
export const playTrack = createAction(
  '[Player] Play Track',
  props<{ trackId: string }>()
);

export const pauseTrack = createAction('[Player] Pause Track');
export const resumeTrack = createAction('[Player] Resume Track');
export const stopTrack = createAction('[Player] Stop Track');
export const seekTo = createAction(
  '[Player] Seek To',
  props<{ time: number }>()
);

export const setVolume = createAction(
  '[Player] Set Volume',
  props<{ volume: number }>()
);

// Actions de statut
export const updatePlayerStatus = createAction(
  '[Player] Update Status',
  props<{ status: PlayerStatus }>()
);

export const updateLoadingStatus = createAction(
  '[Player] Update Loading Status',
  props<{ status: LoadingStatus }>()
);

export const updateProgress = createAction(
  '[Player] Update Progress',
  props<{ currentTime: number; duration: number }>()
);

// Actions d'erreur
export const playerError = createAction(
  '[Player] Error',
  props<{ error: string }>()
); 