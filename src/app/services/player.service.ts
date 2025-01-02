import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IndexDBService } from '../service/indexdb.service';

interface ProgressState {
  currentTime: number;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement;
  private progressSubject = new Subject<ProgressState>();
  
  progress$ = this.progressSubject.asObservable();

  constructor(private indexDBService: IndexDBService) {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.progressSubject.next({
        currentTime: this.audio.currentTime,
        duration: this.audio.duration
      });
    });
  }

  loadAndPlayTrack(trackId: string): Observable<void> {
    return new Observable(observer => {
      this.indexDBService.getAudioBlob(trackId).subscribe({
        next: (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            this.audio.src = url;
            this.audio.play()
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch(error => observer.error(error));
          } else {
            observer.error(new Error('Audio blob not found'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  play(): Promise<void> {
    return this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
  }

  seekTo(time: number): void {
    this.audio.currentTime = time;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration;
  }
} 