import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  crearReserva(): void {
    if (!this.reservaForm.eventoId || this.reservaForm.cantidad <= 0) {
      this.errorMessage.set('Completa los campos obligatorios para crear la reserva.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload: CrearReservaRequest = {
      eventoId: Number(this.reservaForm.eventoId),
      nombreComprador: this.reservaForm.nombreComprador || null,
      emailComprador: this.reservaForm.emailComprador || null,
      cantidad: Number(this.reservaForm.cantidad)
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
