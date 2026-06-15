import { Routes } from '@angular/router';
import { EventoListComponent } from './modules/eventos/pages/evento-list.component';
import { CrearEventoComponent } from './modules/eventos/pages/crear-evento.component';
import { ReservaListComponent } from './modules/reservas/pages/reserva-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/eventos', pathMatch: 'full' },
  { path: 'eventos', component: EventoListComponent },
  { path: 'eventos/crear', component: CrearEventoComponent },
  { path: 'reservas', component: ReservaListComponent }
];
