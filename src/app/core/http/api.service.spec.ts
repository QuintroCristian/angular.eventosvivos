import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should call the OpenAPI evento endpoints with the documented paths', () => {
    service.getEventos().subscribe();

    const eventosReq = httpMock.expectOne('https://localhost:44356/api/Eventos/ListarEventos');
    expect(eventosReq.request.method).toBe('GET');
    eventosReq.flush([]);

    service.getEventoById(7).subscribe();

    const eventoByIdReq = httpMock.expectOne('https://localhost:44356/api/Eventos/ObtenerEvento/7');
    expect(eventoByIdReq.request.method).toBe('GET');
    eventoByIdReq.flush({});
  });

  it('should call the OpenAPI reserva endpoints with the documented paths', () => {
    service.crearReserva({
      eventoId: 1,
      nombreComprador: 'Carlos',
      emailComprador: 'carlos@example.com',
      cantidad: 2
    }).subscribe();

    const reservaReq = httpMock.expectOne('https://localhost:44356/api/Reservas/CrearReserva');
    expect(reservaReq.request.method).toBe('POST');
    reservaReq.flush({});

    service.confirmarReserva(9).subscribe();

    const confirmarReq = httpMock.expectOne('https://localhost:44356/api/Reservas/ConfirmarPago/9');
    expect(confirmarReq.request.method).toBe('POST');
    confirmarReq.flush({});
  });
});
