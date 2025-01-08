import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TrakComponent } from './components/trak/trak.component';
import { TrakAddformComponent } from './components/trak/trak-addform/trak-addform.component';
import { TrakUpdatformComponent } from './components/trak/trak-updatform/trak-updatform.component';
import { TrakDetailComponent } from './components/trak/trak-detail/trak-detail.component';
import { BiblioComponent } from './components/biblio/biblio.component';
import { PlayerComponent } from './components/player/player.component';
import { PlayerControlsComponent } from './components/trak/player-controls/player-controls.component';
import { TrackService } from './service/track.service';
import { IndexDBService } from './service/indexdb.service';
import { PlayerService } from './service/player.service';
import { playerReducer } from './store/player/player.reducer';
import { PlayerEffects } from './store/player/player.effects';
import { TimePipe } from './pipes/time.pipe';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TrakComponent,
    TrakAddformComponent,
    TrakUpdatformComponent,
    TrakDetailComponent,
    BiblioComponent,
    PlayerComponent,
    PlayerControlsComponent,
    TimePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ player: playerReducer }),
    EffectsModule.forRoot([PlayerEffects]),
    MatProgressBarModule
  ],
  providers: [
    TrackService,
    IndexDBService,
    PlayerService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
