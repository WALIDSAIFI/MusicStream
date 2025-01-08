import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PlayerStatus } from '../../../store/player/player.state';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent {
  @Input() playerStatus: PlayerStatus = PlayerStatus.STOPPED;
  @Input() isBuffering = false;
  @Input() isDisabled = false;
  @Output() play = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();

  PlayerStatus = PlayerStatus;  // Pour utiliser l'enum dans le template

  onPlayPauseClick(): void {
    console.log('État actuel du lecteur:', {
      playerStatus: this.playerStatus,
      isBuffering: this.isBuffering,
      isDisabled: this.isDisabled
    });

    try {
      if (this.isDisabled) {
        console.warn('Le bouton est désactivé, action ignorée');
        return;
      }

      if (this.isBuffering) {
        console.warn('Lecture en cours de chargement, action ignorée');
        return;
      }

      if (this.playerStatus === PlayerStatus.PLAYING) {
        console.log('Émission de l\'événement pause');
        this.pause.emit();
      } else {
        console.log('Émission de l\'événement play');
        this.play.emit();
      }
    } catch (error) {
      console.error('Erreur lors du contrôle de la lecture:', error);
    }
  }

  onStopClick(): void {
    console.log('Arrêt de la lecture demandé');
    try {
      if (!this.canStop) {
        console.warn('Impossible d\'arrêter la lecture dans l\'état actuel');
        return;
      }
      this.stop.emit();
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de la lecture:', error);
    }
  }

  get isPlaying(): boolean {
    const playing = this.playerStatus === PlayerStatus.PLAYING;
    console.log('Vérification isPlaying:', { playerStatus: this.playerStatus, playing });
    return playing;
  }

  get canStop(): boolean {
    const canStop = this.playerStatus === PlayerStatus.PLAYING || 
                   this.playerStatus === PlayerStatus.PAUSED ||
                   this.isBuffering;
    console.log('Vérification canStop:', { 
      playerStatus: this.playerStatus, 
      isBuffering: this.isBuffering,
      canStop 
    });
    return canStop;
  }
}   