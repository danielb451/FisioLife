import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PacientesService, Paciente } from '../../services/pacientes.service';
import { IaService } from '../../services/ia.service';

@Component({
  selector: 'app-asistente-ia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './asistente-ia.html',
  styleUrl: './asistente-ia.css'
})
export class AsistenteIaComponent implements OnInit {

  pacientes: Paciente[] = [];

  pacienteId: number | null = null;
  consulta = '';
  imagen: File | null = null;
  imagenPreview: string | null = null;

  respuestaIA = '';
  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private pacientesService: PacientesService,
    private iaService: IaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacientesService.listar().subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar los pacientes';
      }
    });
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.imagen = null;
      this.imagenPreview = null;
      return;
    }

    this.imagen = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagenPreview = reader.result as string;
    };

    reader.readAsDataURL(this.imagen);
  }

  consultarIA(): void {
    this.mensaje = '';
    this.error = '';
    this.respuestaIA = '';

    if (!this.pacienteId) {
      this.error = 'Debes seleccionar un paciente';
      this.cdr.detectChanges();
      return;
    }

    if (!this.consulta.trim() && !this.imagen) {
      this.error = 'Debes escribir una consulta o subir una imagen';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.iaService.consultarIA(
      this.pacienteId,
      this.consulta,
      this.imagen
    ).subscribe({
      next: (res) => {
        console.log('Respuesta IA:', res);

        this.mensaje = res.mensaje;
        this.respuestaIA = res.respuesta;
        this.cargando = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error IA frontend:', err);

        this.error = err.error?.mensaje || 'Error al consultar la IA';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  limpiar(): void {
    this.consulta = '';
    this.imagen = null;
    this.imagenPreview = null;
    this.respuestaIA = '';
    this.mensaje = '';
    this.error = '';
  }
}