import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Track, MusicCategory } from '../../models/track.model';
import { TrackService } from '../../service/track.service';
import * as PlayerActions from '../../store/player/player.actions';

@Component({
  selector: 'app-trak',
  templateUrl: './trak.component.html',
  styleUrls: ['./trak.component.css']
})
export class TrakComponent implements OnInit {
  tracks: Track[] = [];
  filteredTracks: Track[] = [];
  categories: MusicCategory[] = Object.values(MusicCategory);
  selectedCategory: string = '';
  error: string | null = null;
  isLoading = false;

  constructor(
    private trackService: TrackService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  loadTracks(): void {
    this.isLoading = true;
    this.trackService.getAllTracks().subscribe({
      next: (tracks) => {
        this.tracks = tracks;
        this.filteredTracks = tracks;
        this.isLoading = false;
        console.log(this.tracks);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pistes:', error);
        this.error = 'Impossible de charger les pistes.';
        this.isLoading = false;
      }
    });
    
    
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filteredTracks = category
      ? this.tracks.filter(track => track.category === category)
      : this.tracks;
  }

  playTrack(track: Track): void {
    this.store.dispatch(PlayerActions.playTrack({ track }));
  }

  toggleMenu(track: Track): void {
    // Fermer tous les autres menus
    this.filteredTracks.forEach(t => {
      if (t !== track) {
        t.showMenu = false;
      }
    });
    // Basculer le menu de la piste actuelle
    track.showMenu = !track.showMenu;
  }

  deleteTrack(track: Track): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette piste ?')) {
      this.trackService.deleteTrack(track.id).subscribe({
        next: () => {
          this.tracks = this.tracks.filter(t => t.id !== track.id);
          this.filteredTracks = this.filteredTracks.filter(t => t.id !== track.id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Impossible de supprimer la piste.';
        }
      });
    }
  }

  // Méthode utilitaire pour formater la durée
  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
