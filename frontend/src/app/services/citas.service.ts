import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cita {
  id?: number;
  paciente_id: number | null;
  paciente_nombre?: string;
  paciente_apellido?: string;
  paciente_ci?: string;
  paciente_telefono?: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  observaciones?: string;
  creado_en?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private apiUrl = 'http://localhost:3000/api/citas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  crear(cita: Cita): Observable<any> {
    return this.http.post(this.apiUrl, cita);
  }

  actualizar(id: number, cita: Cita): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cita);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}