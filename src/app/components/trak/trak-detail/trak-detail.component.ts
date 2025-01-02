import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Track } from '../../../models/track.model';
import { TrackService } from '../../../service/track.service';
import * as PlayerActions from '../../../store/player/player.actions';
import * as PlayerSelectors from '../../../store/player/player.selectors';

@Component({
  selector: 'app-trak-detail',
  templateUrl: './trak-detail.component.html',
  styleUrls: ['./trak-detail.component.css']
})
export class TrakDetailComponent implements OnInit, OnDestroy {
  track: Track | null = null;
  isPlaying$: Observable<boolean>;
  progress$: Observable<{ currentTime: number; duration: number }>;
  private trackSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private store: Store
  ) {
    this.isPlaying$ = this.store.select(PlayerSelectors.selectIsPlaying);
    this.progress$ = this.store.select(PlayerSelectors.selectProgress);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      this.loadTrack(trackId);
    });
  }

  ngOnDestroy(): void {
    this.trackSubscription?.unsubscribe();
  }

  private loadTrack(id: string): void {
    this.trackSubscription = this.trackService.getTrack(id)
      .subscribe(track => {
        this.track = track;
      });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  onPlayPause(): void {
    if (this.track) {
      this.store.dispatch(PlayerActions.playTrack({ trackId: this.track.id }));
    }
  }

  onSeek(event: Event): void {
    const time = +(event.target as HTMLInputElement).value;
    this.store.dispatch(PlayerActions.seekTo({ time }));
  }
}
