import { TipoEvento, EstadoEvento } from './enums';

export interface EventoResponseDto {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: TipoEvento;
  estado: EstadoEvento;
  venueNombre: string;
  venueCiudad: string;
  capacidadMaxima: number;
  precio: number;
}
