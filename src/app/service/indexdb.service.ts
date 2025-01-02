import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { TrackMetadata, AudioBlob, SUPPORTED_AUDIO_FORMATS, FILE_SIZE_LIMIT } from '../models/track-storage.model';

@Injectable({
  providedIn: 'root'
})
export class IndexDBService {
  private dbName = 'musicStreamDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private dbInitialized: Promise<void>;

  constructor() {
    this.dbInitialized = this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Création des stores si ils n'existent pas
        if (!db.objectStoreNames.contains('trackMetadata')) {
          db.createObjectStore('trackMetadata', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('audioBlobs')) {
          db.createObjectStore('audioBlobs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('imageBlobs')) {
          db.createObjectStore('imageBlobs', { keyPath: 'id' });
        }
      };
    });
  }

  private ensureDbInitialized(): Observable<void> {
    return from(this.dbInitialized).pipe(
      catchError(error => throwError(() => new Error('Failed to initialize database: ' + error.message)))
    );
  }

  getAllTracks(): Observable<TrackMetadata[]> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<TrackMetadata[]>(observer => {
        const transaction = this.db?.transaction(['trackMetadata'], 'readonly');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const request = transaction.objectStore('trackMetadata').getAll();
        request.onerror = () => observer.error(request.error);
        request.onsuccess = () => {
          observer.next(request.result);
          observer.complete();
        };
      }))
    );
  }

  getTrackMetadata(id: string): Observable<TrackMetadata> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<TrackMetadata>(observer => {
        const transaction = this.db?.transaction(['trackMetadata'], 'readonly');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const request = transaction.objectStore('trackMetadata').get(id);
        request.onerror = () => observer.error(request.error);
        request.onsuccess = () => {
          if (!request.result) {
            observer.error(new Error('Track not found'));
            return;
          }
          observer.next(request.result);
          observer.complete();
        };
      }))
    );
  }

  getAudioBlob(id: string): Observable<Blob> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<Blob>(observer => {
        const transaction = this.db?.transaction(['audioBlobs'], 'readonly');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const request = transaction.objectStore('audioBlobs').get(id);
        request.onerror = () => observer.error(request.error);
        request.onsuccess = () => {
          if (!request.result) {
            observer.error(new Error('Audio blob not found'));
            return;
          }
          observer.next(request.result.blob);
          observer.complete();
        };
      }))
    );
  }

  getImage(id: string): Observable<Blob | null> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<Blob | null>(observer => {
        const transaction = this.db?.transaction(['imageBlobs'], 'readonly');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const request = transaction.objectStore('imageBlobs').get(id);
        request.onerror = () => observer.error(request.error);
        request.onsuccess = () => {
          observer.next(request.result ? request.result.blob : null);
          observer.complete();
        };
      }))
    );
  }

  saveTrack(metadata: TrackMetadata, audioBlob: Blob): Observable<string> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<string>(observer => {
        if (!this.validateAudioFile(audioBlob)) {
          observer.error(new Error('Format de fichier non supporté ou taille dépassée'));
          return;
        }

        const transaction = this.db?.transaction(['trackMetadata', 'audioBlobs'], 'readwrite');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const metadataStore = transaction.objectStore('trackMetadata');
        const blobStore = transaction.objectStore('audioBlobs');

        const audioBlobData: AudioBlob = {
          id: metadata.id,
          blob: audioBlob,
          mimeType: audioBlob.type
        };

        const blobRequest = blobStore.add(audioBlobData);
        blobRequest.onerror = () => observer.error(blobRequest.error);

        const metadataRequest = metadataStore.add(metadata);
        metadataRequest.onerror = () => observer.error(metadataRequest.error);

        transaction.oncomplete = () => {
          observer.next(metadata.id);
          observer.complete();
        };
      }))
    );
  }

  private validateAudioFile(file: Blob): boolean {
    return SUPPORTED_AUDIO_FORMATS.includes(file.type) && file.size <= FILE_SIZE_LIMIT;
  }

  saveImage(id: string, imageBlob: Blob): Observable<void> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<void>(observer => {
        const transaction = this.db?.transaction(['imageBlobs'], 'readwrite');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const store = transaction.objectStore('imageBlobs');
        const request = store.put({ id, blob: imageBlob });

        request.onerror = () => observer.error(request.error);
        request.onsuccess = () => {
          observer.next();
          observer.complete();
        };
      }))
    );
  }

  updateTrack(id: string, metadata: Partial<TrackMetadata>): Observable<void> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<void>(observer => {
        console.log('Début de la mise à jour du track:', id, metadata);
        const transaction = this.db?.transaction(['trackMetadata'], 'readwrite');
        if (!transaction) {
          console.error('Base de données non initialisée');
          observer.error(new Error('Database not initialized'));
          return;
        }

        const store = transaction.objectStore('trackMetadata');
        const getRequest = store.get(id);
        
        getRequest.onerror = () => {
          console.error('Erreur lors de la récupération du track:', getRequest.error);
          observer.error(getRequest.error);
        };

        getRequest.onsuccess = () => {
          const existingTrack = getRequest.result;
          if (!existingTrack) {
            console.error('Track non trouvé:', id);
            observer.error(new Error('Track not found'));
            return;
          }

          const updatedTrack = {
            ...existingTrack,
            ...metadata,
            id
          };

          console.log('Track mis à jour:', updatedTrack);

          const putRequest = store.put(updatedTrack);
          putRequest.onerror = () => {
            console.error('Erreur lors de la sauvegarde du track:', putRequest.error);
            observer.error(putRequest.error);
          };
          putRequest.onsuccess = () => {
            console.log('Track sauvegardé avec succès');
            observer.next();
            observer.complete();
          };
        };
      }))
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.ensureDbInitialized().pipe(
      switchMap(() => new Observable<void>(observer => {
        const transaction = this.db?.transaction(['trackMetadata', 'audioBlobs', 'imageBlobs'], 'readwrite');
        if (!transaction) {
          observer.error(new Error('Database not initialized'));
          return;
        }

        const metadataStore = transaction.objectStore('trackMetadata');
        const audioStore = transaction.objectStore('audioBlobs');
        const imageStore = transaction.objectStore('imageBlobs');

        const deleteMetadata = metadataStore.delete(id);
        const deleteAudio = audioStore.delete(id);
        const deleteImage = imageStore.delete(id);

        transaction.oncomplete = () => {
          observer.next();
          observer.complete();
        };
        transaction.onerror = () => observer.error(transaction.error);
      }))
    );
  }
} 