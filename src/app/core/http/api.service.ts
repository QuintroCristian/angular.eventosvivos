import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventoResponseDto } from '../models/evento.model';
import { ReservaResponseDto } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getEventos(filtros?: any): Observable<EventoResponseDto[]> {
    let params = new HttpParams();
    if (filtros?.tipo !== undefined) params = params.set('tipo', filtros.tipo);
    if (filtros?.estado !== undefined) params = params.set('estado', filtros.estado);

    return this.http.get<EventoResponseDto[]>(`${this.baseUrl}/eventos/ListarEventos`, { params });
  }

  getEventoById(id: number): Observable<EventoResponseDto> {
    return this.http.get<EventoResponseDto>(`${this.baseUrl}/eventos/${id}`);
  }

  crearEvento(evento: EventoResponseDto): Observable<EventoResponseDto> {
    return this.http.post<EventoResponseDto>(`${this.baseUrl}/eventos`, evento);
  }

  actualizarEvento(id: number, evento: EventoResponseDto): Observable<EventoResponseDto> {
    return this.http.put<EventoResponseDto>(`${this.baseUrl}/eventos/${id}`, evento);
  }

  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eventos/${id}`);
  }

  getReservas(filtros?: any): Observable<ReservaResponseDto[]> {
    let params = new HttpParams();
    if (filtros?.estado !== undefined) params = params.set('estado', filtros.estado);

    return this.http.get<ReservaResponseDto[]>(`${this.baseUrl}/reservas`, { params });
  }

  getReservaById(id: number): Observable<ReservaResponseDto> {
    return this.http.get<ReservaResponseDto>(`${this.baseUrl}/reservas/${id}`);
  }

  crearReserva(reserva: ReservaResponseDto): Observable<ReservaResponseDto> {
    return this.http.post<ReservaResponseDto>(`${this.baseUrl}/reservas`, reserva);
  }

  cancelarReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reservas/${id}`);
  }
}
