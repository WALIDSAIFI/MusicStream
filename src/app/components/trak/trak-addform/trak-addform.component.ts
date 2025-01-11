import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackService } from '../../../service/track.service';
import { MusicCategory } from '../../../models/track.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trak-addform',
  templateUrl: './trak-addform.component.html',
  styleUrls: ['./trak-addform.component.css']
})
export class TrakAddformComponent implements OnInit {
  trackForm!: FormGroup;
  categories = Object.values(MusicCategory);
  errorMessage: string = '';
  isLoading: boolean = false;
  imagePreview: string | null = null;
  audioDuration: number = 0;

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.trackForm = this.fb.group({
      title: [''],
      artist: [''],
      description: [''],
      category: [''],
      audio: [null],
      image: [null]
    });
  }

  onFileSelected(event: Event, type: 'audio' | 'image'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const control = this.trackForm.get(type);
      control?.setValue(file);
      
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }

      if (type === 'audio') {
        const audioElement = new Audio();
        const objectUrl = URL.createObjectURL(file);
        
        audioElement.addEventListener('loadedmetadata', () => {
          this.audioDuration = audioElement.duration;
          console.log('Durée calculée:', this.audioDuration);
          URL.revokeObjectURL(objectUrl);
        });

        audioElement.src = objectUrl;
      }
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    const formData = new FormData();
    
    // Ajouter les champs du formulaire à formData
    Object.keys(this.trackForm.value).forEach(key => {
      if (this.trackForm.value[key] !== null) {
        formData.append(key, this.trackForm.value[key]);
      }
    });

    // Ajouter la durée calculée
    formData.append('duration', this.audioDuration.toString());

    this.trackService.addTrack(formData).subscribe({
      next: (response) => {
        console.log('Piste ajoutée avec succès:', response);
        this.router.navigate(['/tracks']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de la piste:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    // Nettoyer les ressources si nécessaire
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
    // Rediriger vers la liste des tracks
    this.router.navigate(['/tracks']);
  }
}
