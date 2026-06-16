import { TipoEvento, EstadoEvento } from './enums';

export interface EventoResponseDto {
  id?: number;
  titulo?: string | null;
  descripcion?: string | null;
  fechaInicio: string;
  fechaFin: string;
  tipo: TipoEvento;
  estado: EstadoEvento;
  venueId?: number | null;
  venueNombre?: string | null;
  venueCiudad?: string | null;
  capacidadMaxima: number;
  precio: number;
}

export interface CreateEventoRequest {
  titulo: string;
  descripcion: string;
  venueId?: number;
  venueNombre: string;
  venueCiudad: string;
  capacidadMaxima: number;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  tipo: TipoEvento;
  estado: EstadoEvento;
} 
