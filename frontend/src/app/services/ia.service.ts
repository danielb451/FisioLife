import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RespuestaIA {
  mensaje: string;
  paciente: any;
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaService {

  private apiUrl = 'http://localhost:3000/api/ia';

  constructor(private http: HttpClient) {}

  consultarIA(
    pacienteId: number,
    consulta: string,
    imagen: File | null
  ): Observable<RespuestaIA> {

    const formData = new FormData();

    formData.append('paciente_id', pacienteId.toString());
    formData.append('consulta', consulta || '');

    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.post<RespuestaIA>(
      `${this.apiUrl}/consulta`,
      formData
    );
  }
}