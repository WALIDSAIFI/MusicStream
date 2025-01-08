import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Track } from '../models/track.model';
import { Store } from '@ngrx/store';
import * as PlayerActions from '../store/player/player.actions';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement;
  

  constructor(private store: Store) {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    // Événement timeupdate pour suivre la progression
    this.audio.addEventListener('timeupdate', () => {
      console.log('Time Update:', {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration
      });
      this.store.dispatch(PlayerActions.updateCurrentTime({
        time: this.audio.currentTime
      }));
      if (this.audio.duration && this.audio.duration !== Infinity) {
        this.store.dispatch(PlayerActions.updateDuration({
          duration: this.audio.duration
        }));
      }
    });

    // Événement loadedmetadata pour obtenir la durée
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio.duration && this.audio.duration !== Infinity) {
        this.store.dispatch(PlayerActions.updateDuration({
          duration: this.audio.duration
        }));
      }
    });

    // Événement ended pour gérer la fin de la lecture
    this.audio.addEventListener('ended', () => {
      this.store.dispatch(PlayerActions.stopTrack());
    });

    // Événement error pour gérer les erreurs
    this.audio.addEventListener('error', (e) => {
      console.error('Erreur audio:', e);
    });
  }

  loadTrack(track: Track): Observable<void> {
    return new Observable(observer => {
      if (!track.audioUrl) {
        observer.error(new Error('URL audio manquante'));
        return;
      }

      // Réinitialiser l'état
      this.store.dispatch(PlayerActions.updateCurrentTime({ time: 0 }));
      this.store.dispatch(PlayerActions.updateDuration({ duration: 0 }));
      
      // Charger le nouveau fichier audio
      this.audio.src = track.audioUrl;
      this.audio.load();

      // Attendre que l'audio soit prêt
      this.audio.oncanplaythrough = () => {
        if (this.audio.duration && this.audio.duration !== Infinity) {
          this.store.dispatch(PlayerActions.updateDuration({
            duration: this.audio.duration
          }));
        }
        observer.next();
        observer.complete();
      };

      this.audio.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  play(): void {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Erreur de lecture:', error);
      });
    }
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.store.dispatch(PlayerActions.updateCurrentTime({ time: 0 }));
  }

  seekTo(time: number): void {
    console.log('Seeking to time:', time);
    try {
      if (this.audio && !isNaN(time) && isFinite(time)) {
        // S'assurer que le temps est dans les limites valides
        const safeTime = Math.max(0, Math.min(time, this.audio.duration || 0));
        
        // Mettre à jour le temps de l'audio
        this.audio.currentTime = safeTime;
        
        // Dispatch immédiat pour une mise à jour UI instantanée
        this.store.dispatch(PlayerActions.updateCurrentTime({ time: safeTime }));
      }
    } catch (error) {
      console.error('Erreur lors du seek:', error);
    }
  }

  setVolume(volume: number): void {
    try {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    } catch (error) {
      console.error('Erreur lors du réglage du volume:', error);
    }
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration;
  }
} 