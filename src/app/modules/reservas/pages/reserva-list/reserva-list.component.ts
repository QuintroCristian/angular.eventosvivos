import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../../core/http/api.service';
import { CrearReservaRequest, ReservaResponseDto } from '../../../../core/models/reserva.model';
import { EstadoReserva } from '../../../../core/models/enums';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.scss']
})
export class ReservaListComponent implements OnInit {
  reservas = signal<ReservaResponseDto[]>([]);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  reservaForm: CrearReservaRequest = {
    eventoId: 1,
    nombreComprador: '',
    emailComprador: '',
    cantidad: 1
  };

  EstadoReserva = EstadoReserva;
  readonly emailPattern = String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`;

  private readonly emailRegex = new RegExp(`^${this.emailPattern}$`);

  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const eventoId = params.get('eventoId');
      if (eventoId) {
        this.reservaForm.eventoId = Number(eventoId);
      }
    });

    this.loadReservas();
  }

  loadReservas(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.apiService.getReservas().subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible cargar las reservas.');
        this.loading.set(false);
      }
    });
  }

  crearReserva(form?: NgForm): void {
    if (form?.invalid) {
      form.control.markAllAsTouched();
      this.errorMessage.set('Completa correctamente todos los campos obligatorios.');
      return;
    }

    const eventoId = Number(this.reservaForm.eventoId);
    const cantidad = Number(this.reservaForm.cantidad);
    const nombreComprador = (this.reservaForm.nombreComprador ?? '').trim();
    const emailComprador = (this.reservaForm.emailComprador ?? '').trim();

    if (!Number.isInteger(eventoId) || eventoId <= 0) {
      this.errorMessage.set('El ID del evento debe ser un número entero mayor a 0.');
      return;
    }

    if (nombreComprador.length < 3 || nombreComprador.length > 120) {
      this.errorMessage.set('El nombre debe tener entre 3 y 120 caracteres.');
      return;
    }

    if (!this.emailRegex.test(emailComprador)) {
      this.errorMessage.set('El correo no tiene un formato válido.');
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > 20) {
      this.errorMessage.set('La cantidad debe ser un número entero entre 1 y 20.');
      return;
    }

    if (!this.reservaForm.eventoId || this.reservaForm.cantidad <= 0) {
      this.errorMessage.set('Completa los campos obligatorios para crear la reserva.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload: CrearReservaRequest = {
      eventoId,
      nombreComprador,
      emailComprador,
      cantidad
    };

    this.apiService.crearReserva(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set('Reserva creada correctamente.');
        this.reservaForm = {
          eventoId: 1,
          nombreComprador: '',
          emailComprador: '',
          cantidad: 1
        };
        this.loadReservas();
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('No fue posible crear la reserva. Revisa los datos e intenta nuevamente.');
      }
    });
  }

  getEstadoLabel(estado: EstadoReserva): string {
    return EstadoReserva[estado] ?? 'Desconocido';
  }
}
