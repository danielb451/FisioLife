import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Especialidad {
  id?: number;
  nombre: string;
  descripcion?: string;
  estado?: number;
  creado_en?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private apiUrl = 'http://localhost:3000/api/especialidades';

  constructor(private http: HttpClient) {}

  obtenerEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.apiUrl);
  }

  obtenerEspecialidadPorId(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }

  crearEspecialidad(especialidad: Especialidad): Observable<any> {
    return this.http.post(this.apiUrl, especialidad);
  }

  actualizarEspecialidad(id: number, especialidad: Especialidad): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, especialidad);
  }

  eliminarEspecialidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}