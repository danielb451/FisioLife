import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fisioterapeuta {
  id?: number;
  nombre: string;
  apellido: string;
  ci?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  especialidad: string;
  horario_atencion?: string;
  fecha_contratacion?: string;
  estado_laboral?: string;
  creado_en?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FisioterapeutasService {

  private apiUrl = 'http://localhost:3000/api/fisioterapeutas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Fisioterapeuta[]> {
    return this.http.get<Fisioterapeuta[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Fisioterapeuta> {
    return this.http.get<Fisioterapeuta>(`${this.apiUrl}/${id}`);
  }

  crear(fisioterapeuta: Fisioterapeuta): Observable<any> {
    return this.http.post(this.apiUrl, fisioterapeuta);
  }

  actualizar(id: number, fisioterapeuta: Fisioterapeuta): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fisioterapeuta);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}