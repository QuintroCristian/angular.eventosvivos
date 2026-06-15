import { TipoEvento, EstadoEvento } from './enums';

export interface EventoResponseDto {
  id?: number;
  titulo?: string | null;
  descripcion?: string | null;
  fechaInicio: string;
  fechaFin: string;
  tipo: TipoEvento;
  estado: EstadoEvento;
  venueNombre?: string | null;
  venueCiudad?: string | null;
  capacidadMaxima: number;
  precio: number;
}
