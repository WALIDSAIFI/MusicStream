import { Component, OnInit, OnDestroy } from '@angular/core';
import { Track, MusicCategory } from '../../models/track.model';
import { TrackService } from '../../service/track.service';

@Component({
  selector: 'app-trak',
  templateUrl: './trak.component.html',
  styleUrls: ['./trak.component.css']
})
export class TrakComponent implements OnInit, OnDestroy {
  tracks: Track[] = [];
  filteredTracks: Track[] = [];
  categories = Object.values(MusicCategory);
  selectedCategory: string = '';
  isLoading = false;
  error: string | null = null;

  constructor(private trackService: TrackService) {}

  ngOnInit() {
    this.loadTracks();
  }

  ngOnDestroy() {
    this.tracks.forEach(track => {
      if (track.audioUrl) {
        URL.revokeObjectURL(track.audioUrl);
      }
      if (track.imageUrl) {
        URL.revokeObjectURL(track.imageUrl);
      }
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterTracks();
  }

  private filterTracks() {
    if (!this.selectedCategory) {
      this.filteredTracks = this.tracks;
    } else {
      this.filteredTracks = this.tracks.filter(
        track => track.category === this.selectedCategory
      );
    }
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.trackService.deleteTrack(id).subscribe({
      next: () => {
        this.tracks = this.tracks.filter(track => track.id !== id);
        this.filterTracks();
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  private loadTracks() {
    this.isLoading = true;
    this.trackService.getAllTracks().subscribe({
      next: (tracks) => {
        this.tracks = tracks;
        this.filterTracks();
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }
}
