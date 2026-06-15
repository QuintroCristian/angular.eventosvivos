import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/http/api.service';
import { EventoResponseDto } from '../../../core/models/evento.model';
import { EventoCardComponent } from '../components/evento-card.component';

@Component({
  selector: 'app-evento-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule, RouterModule, RouterLink, EventoCardComponent],
  templateUrl: './evento-list.component.html',
  styleUrls: ['./evento-list.component.scss']
})
export class EventoListComponent implements OnInit {
  eventos: EventoResponseDto[] = [];
  loading = true;
  private readonly apiService = inject(ApiService);

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos() {
    this.loading = true;
    this.apiService.getEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
