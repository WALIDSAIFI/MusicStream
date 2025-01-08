import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../../store/player/player.actions';
import * as PlayerSelectors from '../../store/player/player.selectors';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  currentTrack$ = this.store.select(PlayerSelectors.selectCurrentTrack);
  playerInfo$ = this.store.select(PlayerSelectors.selectPlayerInfo);
  progress$ = this.store.select(PlayerSelectors.selectProgress);
  volume$ = this.store.select(PlayerSelectors.selectVolume);

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Restaurer le dernier volume
    const savedVolume = localStorage.getItem('playerVolume');
    if (savedVolume) {
      this.onVolumeChange(parseFloat(savedVolume));
    }
  }

  ngOnDestroy(): void {
    // Sauvegarder le volume actuel
    this.volume$.subscribe(volume => {
      localStorage.setItem('playerVolume', volume.toString());
    }).unsubscribe();
  }

  onPlay(): void {
    this.currentTrack$.subscribe(track => {
      if (track) {
        this.store.dispatch(PlayerActions.playTrack({ track }));
      }
    }).unsubscribe();
  }

  onPause(): void {
    this.store.dispatch(PlayerActions.pauseTrack());
  }

  onStop(): void {
    this.store.dispatch(PlayerActions.stopTrack());
  }

  onVolumeChange(event: Event | number): void {
    const volume = typeof event === 'number' 
      ? event 
      : parseFloat((event.target as HTMLInputElement).value);
    this.store.dispatch(PlayerActions.updateVolume({ volume }));
  }
} 