import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import * as PlayerSelectors from '../../store/player/player.selectors';
import * as PlayerActions from '../../store/player/player.actions';
import { PlayerStatus, LoadingStatus } from '../../store/player/player.state';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  status$ = this.store.select(PlayerSelectors.selectPlayerStatus);
  loadingStatus$ = this.store.select(PlayerSelectors.selectLoadingStatus);
  isPlaying$ = this.store.select(PlayerSelectors.selectIsPlaying);
  progress$ = this.store.select(PlayerSelectors.selectProgress);
  volume$ = this.store.select(PlayerSelectors.selectVolume);
  error$ = this.store.select(PlayerSelectors.selectError);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  onPlayPause(): void {
    this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
      if (isPlaying) {
        this.store.dispatch(PlayerActions.pauseTrack());
      } else {
        this.store.dispatch(PlayerActions.resumeTrack());
      }
    });
  }

  onStop(): void {
    this.store.dispatch(PlayerActions.stopTrack());
  }

  onVolumeChange(event: Event): void {
    const volume = +(event.target as HTMLInputElement).value;
    this.store.dispatch(PlayerActions.setVolume({ volume }));
  }
} 