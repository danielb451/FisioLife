import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tratamiento {
  id?: number;
  paciente_id: number | null;
  fisioterapeuta_id: number | null;
  paciente_nombre?: string;
  paciente_apellido?: string;
  fisio_nombre?: string;
  fisio_apellido?: string;
  diagnostico: string;
  objetivo?: string;
  plan_tratamiento?: string;
  sesiones_totales?: number;
  sesiones_realizadas?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
  creado_en?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TratamientosService {

  private apiUrl = 'http://localhost:3000/api/tratamientos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Tratamiento> {
    return this.http.get<Tratamiento>(`${this.apiUrl}/${id}`);
  }

  crear(tratamiento: Tratamiento): Observable<any> {
    return this.http.post(this.apiUrl, tratamiento);
  }

  actualizar(id: number, tratamiento: Tratamiento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tratamiento);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
