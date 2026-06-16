export interface VenueResponseDto {
  id: number;
  nombre: string;
  ciudad: string;
  pais?: string | null;
  capacidad: number;
  direccion?: string | null;
}
