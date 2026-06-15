import { EstadoReserva } from './enums';

export interface ReservaResponseDto {
  id: number;
  eventoId: number;
  usuarioId: number;
  estado: EstadoReserva;
  fechaCreacion: string;
  cantidadEntradas: number;
  precioTotal: number;
}
