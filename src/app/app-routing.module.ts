import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrakComponent } from './components/trak/trak.component';
import { TrakAddformComponent } from './components/trak/trak-addform/trak-addform.component';
import { TrakDetailComponent } from './components/trak/trak-detail/trak-detail.component';
import { TrakUpdatformComponent } from './components/trak/trak-updatform/trak-updatform.component';
import { BiblioComponent } from './components/biblio/biblio.component';

const routes: Routes = [
  { path: '', redirectTo: '/tracks', pathMatch: 'full' },
  { path: 'tracks', component: TrakComponent },
  { path: 'tracks/add', component: TrakAddformComponent },
  { path: 'tracks/edit/:id', component: TrakUpdatformComponent },
  { path: 'tracks/:id', component: TrakDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
