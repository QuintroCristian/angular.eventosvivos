import { TipoEvento, EstadoEvento } from './enums';

export interface FiltroEventoRequest {
  tipo?: TipoEvento | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  venueId?: number | null;
  estado?: EstadoEvento | null;
  titulo?: string | null;
}
