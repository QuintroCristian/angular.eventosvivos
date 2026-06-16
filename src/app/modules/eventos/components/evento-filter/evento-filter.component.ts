import { Component, OnInit, OnDestroy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { ApiService } from '../../../../core/http/api.service';
import { FiltroEventoRequest } from '../../../../core/models/filtro-evento.model';
import { TipoEvento, EstadoEvento } from '../../../../core/models/enums';
import { VenueResponseDto } from '../../../../core/models/venue.model';

@Component({
  selector: 'app-evento-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './evento-filter.component.html',
  styleUrls: ['./evento-filter.component.scss'],
})
export class EventoFilterComponent implements OnInit, OnDestroy {
  readonly filtrosChange = output<FiltroEventoRequest>();

  filterForm!: FormGroup;
  venues = signal<VenueResponseDto[]>([]);
  hayFiltros = signal(false);

  readonly tipoOptions = [
    { value: TipoEvento.Conferencia, label: 'Conferencia' },
    { value: TipoEvento.Taller, label: 'Taller' },
    { value: TipoEvento.Concierto, label: 'Concierto' },
  ];

  readonly estadoOptions = [
    { value: EstadoEvento.Activo, label: 'Activo' },
    { value: EstadoEvento.Cancelado, label: 'Cancelado' },
    { value: EstadoEvento.Completado, label: 'Completado' },
  ];

  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.buildForm();
    this.loadVenues();
    this.watchFormChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.filterForm = this.fb.group({
      titulo: [''],
      tipo: [null],
      estado: [null],
      venueId: [null],
      fechaInicio: [null],
      fechaFin: [null],
    });
  }

  private loadVenues(): void {
    this.apiService
      .getVenues()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: (v) => this.venues.set(v), error: () => {} });
  }

  private watchFormChanges(): void {
    // Observar cambios en todo el formulario
    // debounceTime(200) para que se procese rápidamente pero evita múltiples emisiones
    this.filterForm.valueChanges
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.emitFiltros());
  }

  private emitFiltros(): void {
    const v = this.filterForm.value;
    const filtros: FiltroEventoRequest = {};

    if (v.titulo?.trim())  filtros.titulo     = v.titulo.trim();
    if (v.tipo != null)    filtros.tipo       = v.tipo;
    if (v.estado != null)  filtros.estado     = v.estado;
    if (v.venueId != null) filtros.venueId    = v.venueId;
    if (v.fechaInicio)     filtros.fechaInicio = this.toIsoDate(v.fechaInicio);
    if (v.fechaFin)        filtros.fechaFin    = this.toIsoDate(v.fechaFin);

    this.hayFiltros.set(Object.keys(filtros).length > 0);
    this.filtrosChange.emit(filtros);
  }

  limpiarFiltros(): void {
    this.filterForm.reset({
      titulo: '', tipo: null, estado: null,
      venueId: null, fechaInicio: null, fechaFin: null,
    });
    this.hayFiltros.set(false);
    this.filtrosChange.emit({});
  }

  private toIsoDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
