import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Track } from '../../../models/track.model';
import { TrackService } from '../../../service/track.service';
import * as PlayerActions from '../../../store/player/player.actions';
import * as PlayerSelectors from '../../../store/player/player.selectors';
import { PlayerStatus } from '../../../store/player/player.state';

interface PlayerProgress {
  currentTime: number;
  duration: number;
  progress: number;
}

@Component({
  selector: 'app-trak-detail',
  templateUrl: './trak-detail.component.html',
  styleUrls: ['./trak-detail.component.css']
})
export class TrakDetailComponent implements OnInit, OnDestroy {
  @ViewChild('progressBar') progressBar!: ElementRef;
  PlayerStatus = PlayerStatus;
  track: Track | null = null;
  isLoading = false;
  error: string | null = null;
  playerInfo$ = this.store.select(PlayerSelectors.selectPlayerInfo);
  progress$: Observable<PlayerProgress>;
  isDragging = false;
  volume$ = this.store.select(PlayerSelectors.selectVolume);
  showVolumeSlider = false;
  previousVolume = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trackService: TrackService,
    private store: Store
  ) {
    this.progress$ = combineLatest([
      this.store.select(PlayerSelectors.selectCurrentTime),
      this.store.select(PlayerSelectors.selectDuration)
    ]).pipe(
      map(([currentTime, duration]) => {
        const trackDuration = duration || 0;
        const currentTimeValue = Math.min(currentTime || 0, trackDuration);
        return {
          currentTime: currentTimeValue,
          duration: trackDuration,
          progress: trackDuration > 0 ? (currentTimeValue / trackDuration) * 100 : 0
        };
      })
    );
  }

  ngOnInit(): void {
    this.loadTrack();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadTrack();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.track) {
      if (this.track.audioUrl) URL.revokeObjectURL(this.track.audioUrl);
      if (this.track.imageUrl) URL.revokeObjectURL(this.track.imageUrl);
    }
  }

  loadTrack(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de piste invalide';
      return;
    }

    this.isLoading = true;
    this.trackService.getTrack(id).subscribe({
      next: (track) => {
        this.track = track;
        this.isLoading = false;
        if (track.duration) {
          this.store.dispatch(PlayerActions.updateDuration({ duration: track.duration }));
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la piste:', error);
        this.error = 'Impossible de charger la piste.';
        this.isLoading = false;
      }
    });
  }

  onPlay(): void {
    if (this.track) {
      this.store.dispatch(PlayerActions.playTrack({ track: this.track }));
    }
  }

  onPause(): void {
    this.store.dispatch(PlayerActions.pauseTrack());
  }

  onStop(): void {
    this.store.dispatch(PlayerActions.stopTrack());
  }

  formatTime(seconds: number | null): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onDelete(): void {
    if (!this.track) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette piste ?')) {
      this.isLoading = true;
      this.trackService.deleteTrack(this.track.id).subscribe({
        next: () => this.router.navigate(['/tracks']),
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Impossible de supprimer la piste.';
          this.isLoading = false;
        }
      });
    }
  }

  onEdit(): void {
    if (this.track) {
      this.router.navigate(['/tracks/edit', this.track.id]);
    }
  }

  onNextTrack(): void {
    if (this.track) {
      this.trackService.getNextTrack(this.track.id).subscribe({
        next: (nextTrack) => {
          if (nextTrack) {
            this.store.dispatch(PlayerActions.stopTrack());
            this.router.navigate(['/tracks', nextTrack.id]).then(() => {
              this.store.dispatch(PlayerActions.playTrack({ track: nextTrack }));
            });
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la piste suivante:', error);
        }
      });
    }
  }

  onPreviousTrack(): void {
    if (this.track) {
      this.trackService.getPreviousTrack(this.track.id).subscribe({
        next: (prevTrack) => {
          if (prevTrack) {
            this.store.dispatch(PlayerActions.stopTrack());
            this.router.navigate(['/tracks', prevTrack.id]).then(() => {
              this.store.dispatch(PlayerActions.playTrack({ track: prevTrack }));
            });
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la piste précédente:', error);
        }
      });
    }
  }

  toggleMute(): void {
    this.volume$.pipe(take(1)).subscribe(currentVolume => {
      if (currentVolume === 0) {
        this.store.dispatch(PlayerActions.setVolume({ volume: this.previousVolume }));
      } else {
        this.previousVolume = currentVolume;
        this.store.dispatch(PlayerActions.setVolume({ volume: 0 }));
      }
    });
  }

  toggleVolumeSlider(): void {
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  getVolumeIcon(volume: number): string {
    if (volume === 0) {
      return 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
    } else if (volume < 0.5) {
      return 'M5 9v6h4l5 5V4L9 9H5zm7-.17v6.34L9.83 13H7v-2h2.83L12 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z';
    } else {
      return 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
    }
  }

  onSeek(event: MouseEvent): void {
    const progressBar = this.progressBar.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    this.progress$.pipe(take(1)).subscribe(progress => {
      const newTime = (clampedPercentage / 100) * progress.duration;
      this.store.dispatch(PlayerActions.seekTo({ time: newTime }));
    });
  }

  onProgressBarMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.onSeek(event);
    document.addEventListener('mousemove', this.onProgressBarMouseMove);
    document.addEventListener('mouseup', this.onProgressBarMouseUp);
  }

  onProgressBarMouseMove = (event: MouseEvent): void => {
    if (this.isDragging) {
      this.onSeek(event);
    }
  }

  onProgressBarMouseUp = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onProgressBarMouseMove);
    document.removeEventListener('mouseup', this.onProgressBarMouseUp);
  }

  onVolumeChange(event: any): void {
    const volume = parseFloat(event.target.value);
    if (volume > 0) {
      this.previousVolume = volume;
    }
    this.store.dispatch(PlayerActions.setVolume({ volume }));
  }
}
