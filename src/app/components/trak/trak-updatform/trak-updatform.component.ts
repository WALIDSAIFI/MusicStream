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
  audioFileName: string | null = null;

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
      image: [null],
      audio: [null]
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

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.trackForm.patchValue({ audio: file });
      this.audioFileName = file.name;
    }
  }

  getAudioFileName(url: string): string {
    return url.split('/').pop() || 'fichier audio';
  }

  onSubmit(): void {
    if (this.trackForm.valid && this.track) {
      this.isLoading = true;
      const formData = new FormData();
      
      formData.append('title', this.trackForm.get('title')?.value);
      formData.append('artist', this.trackForm.get('artist')?.value);
      formData.append('description', this.trackForm.get('description')?.value || '');
      formData.append('category', this.trackForm.get('category')?.value);

      const imageFile = this.trackForm.get('image')?.value;
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }

      const audioFile = this.trackForm.get('audio')?.value;
      if (audioFile instanceof File) {
        formData.append('audio', audioFile);
      } else if (!audioFile && this.track.audioUrl) {
        formData.append('audioUrl', this.track.audioUrl);
      }

      this.trackService.updateTrack(this.track.id, formData).subscribe({
        next: (updatedTrack) => {
          console.log('Track mis à jour:', updatedTrack);
          this.isLoading = false;
          this.router.navigate(['/tracks', updatedTrack.id]);
        },
        error: (error: Error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.error = error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'Veuillez remplir tous les champs requis correctement.';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.trackForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.trackForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['maxlength']) {
        return `La longueur maximale est de ${field.errors['maxlength'].requiredLength} caractères`;
      }
    }
    return '';
  }
}
