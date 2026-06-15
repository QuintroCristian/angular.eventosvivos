import { EstadoReserva } from './enums';

export interface CrearReservaRequest {
  eventoId: number;
  nombreComprador?: string | null;
  emailComprador?: string | null;
  cantidad: number;
}

export interface ReservaResponseDto {
  id: number;
  codigo?: string | null;
  eventoId: number;
  eventoTitulo?: string | null;
  nombreComprador?: string | null;
  emailComprador?: string | null;
  cantidad: number;
  montoTotal: number;
  estado: EstadoReserva;
  fechaCreacion: string;
  penalizada: boolean;
}
