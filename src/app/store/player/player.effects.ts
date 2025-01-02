import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import * as PlayerActions from './player.actions';
import { PlayerService } from '../../services/player.service';
import { PlayerStatus, LoadingStatus } from './player.state';

@Injectable()
export class PlayerEffects {
  playTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.playTrack),
      mergeMap(({ trackId }) =>
        this.playerService.loadAndPlayTrack(trackId).pipe(
          map(() => PlayerActions.updatePlayerStatus({ status: PlayerStatus.PLAYING })),
          catchError(error => of(PlayerActions.playerError({ error: error.message })))
        )
      )
    )
  );

  updateProgress$ = createEffect(() =>
    this.playerService.progress$.pipe(
      map(({ currentTime, duration }) =>
        PlayerActions.updateProgress({ currentTime, duration })
      )
    )
  );

  handleError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.playerError),
      map(() => PlayerActions.updateLoadingStatus({ status: LoadingStatus.ERROR }))
    )
  );

  constructor(
    private actions$: Actions,
    private playerService: PlayerService,
    private store: Store
  ) {}
} 