import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from '../../../service/track.service';
import { Track, MusicCategory } from '../../../models/track.model';

@Component({
  selector: 'app-trak-updatform',
  templateUrl: './trak-updatform.component.html',
  styleUrls: ['./trak-updatform.component.css']
})
export class TrakUpdatformComponent implements OnInit, OnDestroy {
  trackForm!: FormGroup;
  track: Track | null = null;
  categories = Object.values(MusicCategory);
  isLoading = false;
  error: string | null = null;
  imagePreview: string | null = null;
  private currentImageUrl: string | undefined;

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadTrack(params['id']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentImageUrl) {
      URL.revokeObjectURL(this.currentImageUrl);
    }
  }

  private initForm(): void {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      category: ['', [Validators.required]],
      image: [null]
    });
  }

  private loadTrack(id: string): void {
    this.isLoading = true;
    this.trackService.getTrack(id).subscribe({
      next: (track) => {
        this.track = track;
        this.trackForm.patchValue({
          title: track.title,
          artist: track.artist,
          description: track.description,
          category: track.category
        });
        if (track.imageUrl) {
          this.imagePreview = track.imageUrl;
          this.currentImageUrl = track.imageUrl;
        }
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.currentImageUrl) {
        URL.revokeObjectURL(this.currentImageUrl);
      }
      
      this.trackForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.trackForm.valid && this.track) {
      this.isLoading = true;
      const formData = new FormData();
      
      Object.keys(this.trackForm.value).forEach(key => {
        const value = this.trackForm.value[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });

      this.trackService.updateTrack(this.track.id, formData).subscribe({
        next: (updatedTrack) => {
          this.router.navigate(['/tracks', updatedTrack.id]);
        },
        error: (error: Error) => {
          this.error = error.message;
          this.isLoading = false;
        }
      });
    }
  }
}
