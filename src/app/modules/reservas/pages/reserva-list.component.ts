import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/http/api.service';
import { CrearReservaRequest, ReservaResponseDto } from '../../../core/models/reserva.model';
import { EstadoReserva } from '../../../core/models/enums';

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
  reservas: ReservaResponseDto[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

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
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar las reservas.';
        this.loading = false;
      }
    });
  }

  crearReserva(): void {
    if (!this.reservaForm.eventoId || this.reservaForm.cantidad <= 0) {
      this.errorMessage = 'Completa los campos obligatorios para crear la reserva.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CrearReservaRequest = {
      eventoId: Number(this.reservaForm.eventoId),
      nombreComprador: this.reservaForm.nombreComprador || null,
      emailComprador: this.reservaForm.emailComprador || null,
      cantidad: Number(this.reservaForm.cantidad)
    };

    this.apiService.crearReserva(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Reserva creada correctamente.';
        this.reservaForm = {
          eventoId: 1,
          nombreComprador: '',
          emailComprador: '',
          cantidad: 1
        };
        this.loadReservas();
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'No fue posible crear la reserva. Revisa los datos e intenta nuevamente.';
      }
    });
  }

  getEstadoLabel(estado: EstadoReserva): string {
    return EstadoReserva[estado] ?? 'Desconocido';
  }
}
