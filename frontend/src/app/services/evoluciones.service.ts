import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evolucion {
  id?: number;
  tratamiento_id: number | null;
  numero_sesion: number;
  fecha: string;
  procedimientos?: string;
  observaciones?: string;
  dolor?: string;
  movilidad?: string;
  recomendaciones?: string;
  creado_en?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvolucionesService {
  private apiUrl = 'http://localhost:3000/api/evoluciones';

  constructor(private http: HttpClient) {}

  listarPorTratamiento(tratamientoId: number): Observable<Evolucion[]> {
    return this.http.get<Evolucion[]>(`${this.apiUrl}/${tratamientoId}`);
  }

  crear(evolucion: Evolucion): Observable<any> {
    return this.http.post(this.apiUrl, evolucion);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}