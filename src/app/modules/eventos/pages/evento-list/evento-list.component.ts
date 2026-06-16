import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, startWith, catchError, of, map } from 'rxjs';
import { ApiService } from '../../../../core/http/api.service';
import { EventoResponseDto } from '../../../../core/models/evento.model';
import { FiltroEventoRequest } from '../../../../core/models/filtro-evento.model';
import { EstadoEvento } from '../../../../core/models/enums';
import { EventoCardComponent } from '../../components/evento-card/evento-card.component';
import { EventoFilterComponent } from '../../components/evento-filter/evento-filter.component';

@Component({
  selector: 'app-evento-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
    RouterLink,
    EventoCardComponent,
    EventoFilterComponent,
  ],
  templateUrl: './evento-list.component.html',
  styleUrls: ['./evento-list.component.scss'],
})
export class EventoListComponent implements OnInit, OnDestroy {
  eventos = signal<EventoResponseDto[]>([]);
  loading = signal(true);
  error = signal(false);
  totalResultados = signal(0);

  private readonly apiService = inject(ApiService);
  private readonly filtros$ = new Subject<FiltroEventoRequest>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.filtros$
      .pipe(
        startWith({} as FiltroEventoRequest),
        switchMap((filtros) => {
          this.loading.set(true);
          this.error.set(false);
          return this.apiService.getEventos(filtros).pipe(
            // Filtrado cliente garantiza LIKE en título y rango de fechas
            // aunque el backend no soporte esos params aún
            map((data) => this.applyClientFilters(data, filtros)),
            catchError(() => {
              this.error.set(true);
              return of([] as EventoResponseDto[]);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.eventos.set(data);
          this.totalResultados.set(data.length);
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltrosChange(filtros: FiltroEventoRequest): void {
    this.filtros$.next(filtros);
  }

  private applyClientFilters(
    eventos: EventoResponseDto[],
    filtros: FiltroEventoRequest
  ): EventoResponseDto[] {
    let result = eventos;

    // título: búsqueda parcial LIKE case-insensitive
    if (filtros.titulo?.trim()) {
      const q = filtros.titulo.trim().toLowerCase();
      result = result.filter((e) => e.titulo?.toLowerCase().includes(q));
    }

    // tipo: exacto (refuerza filtro de servidor)
    if (filtros.tipo != null) {
      result = result.filter((e) => e.tipo === filtros.tipo);
    }

    // estado: exacto
    if (filtros.estado != null) {
      result = result.filter((e) => e.estado === filtros.estado);
    }

    // venue: filtrado por ID
    if (filtros.venueId != null) {
      result = result.filter((e) => e.venueId === filtros.venueId);
    }

    // rango de fechas: evento inicia en o después de fechaInicio
    if (filtros.fechaInicio) {
      const desde = new Date(filtros.fechaInicio).getTime();
      result = result.filter((e) => new Date(e.fechaInicio).getTime() >= desde);
    }

    // rango de fechas: evento inicia en o antes de fechaFin
    if (filtros.fechaFin) {
      const hasta = new Date(filtros.fechaFin).getTime();
      result = result.filter((e) => new Date(e.fechaInicio).getTime() <= hasta);
    }

    return result;
  }

  get estadoActivo(): EstadoEvento {
    return EstadoEvento.Activo;
  }
}
