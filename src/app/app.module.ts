import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TrakComponent } from './components/trak/trak.component';
import { TrakAddformComponent } from './components/trak/trak-addform/trak-addform.component';
import { TrakUpdatformComponent } from './components/trak/trak-updatform/trak-updatform.component';
import { TrakDetailComponent } from './components/trak/trak-detail/trak-detail.component';
import { BiblioComponent } from './components/biblio/biblio.component';
import { PlayerComponent } from './components/player/player.component';
import { TrackService } from './service/track.service';
import { IndexDBService } from './service/indexdb.service';
import { PlayerService } from './services/player.service';
import { playerReducer } from './store/player/player.reducer';
import { PlayerEffects } from './store/player/player.effects';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TrakComponent,
    TrakAddformComponent,
    TrakUpdatformComponent,
    TrakDetailComponent,
    BiblioComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ player: playerReducer }),
    EffectsModule.forRoot([PlayerEffects])
  ],
  providers: [
    TrackService,
    IndexDBService,
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
