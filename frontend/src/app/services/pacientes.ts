import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  ci?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  motivo_consulta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private apiUrl = 'http://localhost:3000/api/pacientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  crear(paciente: Paciente): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }

  actualizar(id: number, paciente: Paciente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}