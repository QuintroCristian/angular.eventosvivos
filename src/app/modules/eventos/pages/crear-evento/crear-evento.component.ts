import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ApiService } from '../../../../core/http/api.service';
import { CreateEventoRequest } from '../../../../core/models/evento.model';
import { VenueResponseDto } from '../../../../core/models/venue.model';
import { EstadoEvento, TipoEvento } from '../../../../core/models/enums';
import { EventoValidators } from '../../../../core/validators/evento.validators';

@Component({
  selector: 'app-crear-evento',
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
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.scss']
})
export class CrearEventoComponent implements OnInit {
  form!: FormGroup;
  venues = signal<VenueResponseDto[]>([]);
  loading = signal(false);
  submitting = signal(false);
  TipoEvento = TipoEvento;
  tipoEventoOptions = [
    { value: TipoEvento.Conferencia, label: 'Conferencia' },
    { value: TipoEvento.Taller, label: 'Taller' },
    { value: TipoEvento.Concierto, label: 'Concierto' }
  ];

  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.initializeForm();
    this.loadVenues();
    this.setupCapacityValidation();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      titulo: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      descripcion: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ],
      venueId: ['', Validators.required],
      capacidadMaxima: ['', [Validators.required, EventoValidators.positiveNumber()]],
      fechaInicio: ['', [Validators.required, EventoValidators.futureDate()]],
      fechaFin: ['', Validators.required],
      precio: ['', [Validators.required, EventoValidators.positiveNumber()]],
      tipo: ['', Validators.required]
    });
  }

  private loadVenues(): void {
    this.loading.set(true);
    this.apiService.getVenues().subscribe({
      next: (venues) => {
        this.venues.set(venues);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar venues:', error);
        this.snackBar.open('Error al cargar los lugares disponibles', 'Cerrar', { duration: 5000 });
        this.loading.set(false);
      }
    });
  }

  private setupCapacityValidation(): void {
    const venueIdControl = this.form.get('venueId');
    const capacidadControl = this.form.get('capacidadMaxima');

    if (venueIdControl && capacidadControl) {
      venueIdControl.valueChanges.subscribe((venueId) => {
        if (!venueId) {
          capacidadControl.setValue('', { emitEvent: false });
          return;
        }

        const selectedVenue = this.venues().find((v) => v.id === Number(venueId));
        if (selectedVenue) {
          capacidadControl.setValue(selectedVenue.capacidad, { emitEvent: false });
          capacidadControl.clearAsyncValidators();
          capacidadControl.setValidators([
            Validators.required,
            EventoValidators.positiveNumber(),
            EventoValidators.maxCapacity(selectedVenue.capacidad)
          ]);
          capacidadControl.updateValueAndValidity({ emitEvent: false });
        }
      });
    }
  }

  get startDateControl() {
    return this.form.get('fechaInicio');
  }

  get endDateControl() {
    return this.form.get('fechaFin');
  }

  updateEndDateValidation(): void {
    const endDateControl = this.form.get('fechaFin');
    if (endDateControl) {
      endDateControl.clearAsyncValidators();
      endDateControl.setValidators([
        Validators.required,
        EventoValidators.afterStartDate(this.startDateControl!)
      ]);
      endDateControl.updateValueAndValidity();
    }
  }

  getVenueCapacity(venueId: number): number {
    return this.venues().find((v) => v.id === venueId)?.capacidad ?? 0;
  }

  crearEvento(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, completa todos los campos correctamente', 'Cerrar', { duration: 5000 });
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;
    const selectedVenue = this.venues().find((v) => v.id === Number(formValue.venueId));

    if (!selectedVenue) {
      this.submitting.set(false);
      this.snackBar.open('No se encontró el lugar seleccionado. Intenta nuevamente.', 'Cerrar', { duration: 5000 });
      return;
    }

    const request: CreateEventoRequest = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      venueId: Number(formValue.venueId),
      venueNombre: selectedVenue.nombre,
      venueCiudad: selectedVenue.ciudad,
      capacidadMaxima: Number(formValue.capacidadMaxima),
      fechaInicio: new Date(formValue.fechaInicio).toISOString(),
      fechaFin: new Date(formValue.fechaFin).toISOString(),
      precio: Number(formValue.precio),
      tipo: Number(formValue.tipo),
      estado: EstadoEvento.Activo
    };

    this.apiService.crearEvento(request).subscribe({
      next: (evento) => {
        this.submitting.set(false);
        this.snackBar.open(`Evento "${evento.titulo}" creado correctamente`, 'Cerrar', { duration: 5000 });
        this.router.navigate(['/eventos']);
      },
      error: (error) => {
        this.submitting.set(false);
        const errorMessage = error?.error?.message || 'Error al crear el evento. Intenta nuevamente.';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        console.error('Error al crear evento:', error);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/eventos']);
  }
}
