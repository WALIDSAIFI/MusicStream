import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as PlayerActions from './player.actions';
import { PlayerService } from '../../service/player.service';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private playerService: PlayerService,
    private store: Store
  ) {}

  playTrack$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.playTrack),
    tap(({ track }) => {
      this.playerService.loadTrack(track).subscribe({
        next: () => {
          this.playerService.play();
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la piste:', error);
        }
      });
    })
  ), { dispatch: false });

  pauseTrack$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.pauseTrack),
    tap(() => this.playerService.pause())
  ), { dispatch: false });

  stopTrack$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.stopTrack),
    tap(() => this.playerService.stop())
  ), { dispatch: false });

  seekTo$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.seekTo),
    tap(({ time }) => {
      console.log('Seeking to:', time);
      this.playerService.seekTo(time);
      // Mettre à jour le temps actuel immédiatement
      this.store.dispatch(PlayerActions.updateCurrentTime({ time }));
    })
  ), { dispatch: false });

  setVolume$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.setVolume),
    tap(({ volume }) => this.playerService.setVolume(volume))
  ), { dispatch: false });
} 