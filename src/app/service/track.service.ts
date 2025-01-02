import { Injectable } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Track, MusicCategory } from '../models/track.model';
import { TrackMetadata } from '../models/track-storage.model';
import { IndexDBService } from './indexdb.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private indexDBService: IndexDBService) {}

  addTrack(trackData: FormData): Observable<Track> {
    const audioFile = trackData.get('audio') as File;
    const imageFile = trackData.get('image') as File;
    
    const metadata: TrackMetadata = {
      id: crypto.randomUUID(),
      title: trackData.get('title') as string,
      artist: trackData.get('artist') as string,
      description: trackData.get('description') as string,
      category: trackData.get('category') as MusicCategory,
      addedDate: new Date(),
      duration: 0,
      fileSize: audioFile.size,
      mimeType: audioFile.type
    };

    if (imageFile) {
      return this.indexDBService.saveImage(metadata.id, imageFile).pipe(
        switchMap(() => this.indexDBService.saveTrack(metadata, audioFile)),
        switchMap(() => this.getTrack(metadata.id))
      );
    }

    return this.indexDBService.saveTrack(metadata, audioFile).pipe(
      switchMap(() => this.getTrack(metadata.id))
    );
  }

  getAllTracks(): Observable<Track[]> {
    return this.indexDBService.getAllTracks().pipe(
      switchMap(tracks => 
        forkJoin(
          tracks.map(track => 
            forkJoin({
              audio: this.indexDBService.getAudioBlob(track.id),
              image: this.indexDBService.getImage(track.id)
            }).pipe(
              map(({ audio, image }) => ({
                ...track,
                audioUrl: URL.createObjectURL(audio),
                imageUrl: image ? URL.createObjectURL(image) : undefined
              }))
            )
          )
        )
      )
    );
  }

  getTrack(id: string): Observable<Track> {
    return this.indexDBService.getTrackMetadata(id).pipe(
      switchMap(metadata => 
        forkJoin({
          audio: this.indexDBService.getAudioBlob(id),
          image: this.indexDBService.getImage(id)
        }).pipe(
          map(({ audio, image }) => ({
            ...metadata,
            audioUrl: URL.createObjectURL(audio),
            imageUrl: image ? URL.createObjectURL(image) : undefined
          }))
        )
      )
    );
  }

  updateTrack(id: string, formData: FormData): Observable<Track> {
    const imageFile = formData.get('image') as File | null;
    
    const metadata: Partial<TrackMetadata> = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      description: formData.get('description') as string || '',
      category: formData.get('category') as MusicCategory,
      id: id
    };

    let updateChain: Observable<any> = this.indexDBService.getTrackMetadata(id);

    if (imageFile) {
      updateChain = updateChain.pipe(
        switchMap(() => this.indexDBService.saveImage(id, imageFile))
      );
    }

    return updateChain.pipe(
      switchMap(() => this.indexDBService.updateTrack(id, metadata)),
      switchMap(() => this.getTrack(id))
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.indexDBService.deleteTrack(id);
  }
} 