import { createAction, props } from '@ngrx/store';
import { Track } from '../../models/track.model';
import { PlayerStatus, LoadingStatus } from './player.state';

// Actions de contrôle du lecteur
export const playTrack = createAction(
  '[Player] Play Track',
  props<{ track: Track }>()
);

export const pauseTrack = createAction(
  '[Player] Pause Track'
);

export const resumeTrack = createAction('[Player] Resume Track');
export const stopTrack = createAction(
  '[Player] Stop Track'
);
export const bufferTrack = createAction('[Player] Buffer Track');

// Actions de mise à jour de l'état
export const updatePlayerStatus = createAction(
  '[Player] Update Status',
  props<{ status: PlayerStatus }>()
);

export const updateLoadingStatus = createAction(
  '[Player] Update Loading Status',
  props<{ status: LoadingStatus }>()
);

export const updateCurrentTime = createAction(
  '[Player] Update Current Time',
  props<{ time: number }>()
);

export const updateDuration = createAction(
  '[Player] Update Duration',
  props<{ duration: number }>()
);

export const updateVolume = createAction(
  '[Player] Update Volume',
  props<{ volume: number }>()
);

// Actions de gestion des erreurs
export const playerError = createAction(
  '[Player] Error',
  props<{ error: string }>()
);

export const clearError = createAction('[Player] Clear Error');

// Actions de gestion de la file d'attente
export const addToQueue = createAction(
  '[Player] Add To Queue',
  props<{ track: Track }>()
);

export const removeFromQueue = createAction(
  '[Player] Remove From Queue',
  props<{ trackId: string }>()
);

export const clearQueue = createAction('[Player] Clear Queue');

export const seekTo = createAction(
  '[Player] Seek To',
  props<{ time: number }>()
);

export const setVolume = createAction(
  '[Player] Set Volume',
  props<{ volume: number }>()
);

export const bufferingStarted = createAction(
  '[Player] Buffering Started'
);

export const bufferingEnded = createAction(
  '[Player] Buffering Ended'
);

export const toggleMute = createAction(
  '[Player] Toggle Mute'
); 