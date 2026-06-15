import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { EventoResponseDto } from '../../../core/models/evento.model';
import { TipoEvento, EstadoEvento } from '../../../core/models/enums';

@Component({
  selector: 'app-evento-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './evento-card.component.html',
  styleUrls: ['./evento-card.component.scss']
})
export class EventoCardComponent {
  @Input() evento!: EventoResponseDto;

  TipoEvento = TipoEvento;
  EstadoEvento = EstadoEvento;

  getTipoLabel(tipo: TipoEvento): string {
    return TipoEvento[tipo];
  }

  getEstadoLabel(estado: EstadoEvento): string {
    return EstadoEvento[estado];
  }
}
