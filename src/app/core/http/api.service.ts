import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventoResponseDto, CreateEventoRequest } from '../models/evento.model';
import { CrearReservaRequest, ReservaResponseDto } from '../models/reserva.model';
import { VenueResponseDto } from '../models/venue.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getEventos(filtros?: any): Observable<EventoResponseDto[]> {
    let params = new HttpParams();
    if (filtros?.tipo !== undefined) params = params.set('tipo', filtros.tipo);
    if (filtros?.estado !== undefined) params = params.set('estado', filtros.estado);

    return this.http.get<EventoResponseDto[]>(`${this.baseUrl}/Eventos/ListarEventos`, { params });
  }

  getEventoById(id: number): Observable<EventoResponseDto> {
    return this.http.get<EventoResponseDto>(`${this.baseUrl}/Eventos/ObtenerEvento/${id}`);
  }

  crearEvento(evento: CreateEventoRequest): Observable<EventoResponseDto> {
    return this.http.post<EventoResponseDto>(`${this.baseUrl}/Eventos/CrearEvento`, evento);
  }

  actualizarEvento(id: number, evento: EventoResponseDto): Observable<EventoResponseDto> {
    return this.http.put<EventoResponseDto>(`${this.baseUrl}/Eventos/ActualizarEvento/${id}`, evento);
  }

  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Eventos/EliminarEvento/${id}`);
  }

  getReservas(filtros?: any): Observable<ReservaResponseDto[]> {
    let params = new HttpParams();
    if (filtros?.estado !== undefined) params = params.set('estado', filtros.estado);

    return this.http.get<ReservaResponseDto[]>(`${this.baseUrl}/Reservas/ListarReservas`, { params });
  }

  getReservaById(id: number): Observable<ReservaResponseDto> {
    return this.http.get<ReservaResponseDto>(`${this.baseUrl}/Reservas/ObtenerReserva/${id}`);
  }

  getReservasPorEvento(eventoId: number): Observable<ReservaResponseDto[]> {
    return this.http.get<ReservaResponseDto[]>(`${this.baseUrl}/Reservas/evento/ListarPorEvento/${eventoId}`);
  }

  crearReserva(reserva: CrearReservaRequest): Observable<ReservaResponseDto> {
    return this.http.post<ReservaResponseDto>(`${this.baseUrl}/Reservas/CrearReserva`, reserva);
  }

  confirmarReserva(id: number): Observable<ReservaResponseDto> {
    return this.http.post<ReservaResponseDto>(`${this.baseUrl}/Reservas/ConfirmarPago/${id}`, null);
  }

  cancelarReserva(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/Reservas/CancelarReserva/${id}`, null);
  }

  getVenues(): Observable<VenueResponseDto[]> {
    return this.http.get<VenueResponseDto[]>(`${this.baseUrl}/Venues/ListarVenues`);
  }

}
