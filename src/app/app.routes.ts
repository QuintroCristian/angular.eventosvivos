import { Routes } from '@angular/router';
import { EventoListComponent } from './modules/eventos/pages/evento-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  { path: 'eventos', component: EventoListComponent }
];
