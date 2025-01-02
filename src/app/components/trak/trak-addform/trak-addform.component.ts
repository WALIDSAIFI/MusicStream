import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackService } from '../../../service/track.service';
import { MusicCategory } from '../../../models/track.model';
import { Router } from '@angular/router';
import { SUPPORTED_AUDIO_FORMATS, FILE_SIZE_LIMIT } from '../../../models/track-storage.model';

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
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      category: ['', Validators.required],
      audio: [null, Validators.required],
      image: [null]
    });
  }

  onFileSelected(event: Event, type: 'audio' | 'image'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (type === 'audio') {
        if (!SUPPORTED_AUDIO_FORMATS.includes(file.type)) {
          this.errorMessage = `Format non supporté. Formats acceptés: ${SUPPORTED_AUDIO_FORMATS.join(', ')}`;
          return;
        }
        if (file.size > FILE_SIZE_LIMIT) {
          this.errorMessage = `Fichier trop volumineux. Taille maximale: ${FILE_SIZE_LIMIT / (1024 * 1024)}MB`;
          return;
        }
      }
      
      this.trackForm.patchValue({ [type]: file });
      this.errorMessage = '';
      
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(): void {
    if (this.trackForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const formData = new FormData();
      
      Object.keys(this.trackForm.value).forEach(key => {
        const value = this.trackForm.value[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });

      this.trackService.addTrack(formData).subscribe({
        next: (track) => {
          console.log('Track ajouté avec succès:', track);
          this.router.navigate(['/tracks']).then(() => {
            // Optionnel : Ajouter un message de succès
            // this.snackBar.open('Track ajouté avec succès', 'Fermer', { duration: 3000 });
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout:', error);
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
    }
  }
}
