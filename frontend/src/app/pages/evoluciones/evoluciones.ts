import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EvolucionesService, Evolucion } from '../../services/evoluciones.service';
import { TratamientosService, Tratamiento } from '../../services/tratamientos.service';

@Component({
  selector: 'app-evoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './evoluciones.html',
  styleUrl: './evoluciones.css'
})
export class EvolucionesComponent implements OnInit {

  tratamientos: Tratamiento[] = [];
  evoluciones: Evolucion[] = [];
  mensaje = '';
  error = '';

  evolucion: Evolucion = {
    tratamiento_id: null,
    numero_sesion: 1,
    fecha: '',
    observaciones: '',
    procedimientos: '',
    dolor: '',
    movilidad: '',
    recomendaciones: ''
  };

  constructor(
    private evolucionesService: EvolucionesService,
    private tratamientosService: TratamientosService
  ) {}

  ngOnInit(): void {
    this.cargarTratamientos();
  }

  cargarTratamientos(): void {
    this.tratamientosService.listar().subscribe({
      next: (data) => {
        this.tratamientos = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar los tratamientos';
      }
    });
  }

  cargarEvoluciones(): void {
    if (!this.evolucion.tratamiento_id) {
      return;
    }

    this.evolucionesService
      .listarPorTratamiento(this.evolucion.tratamiento_id)
      .subscribe({
        next: (data) => {
          this.evoluciones = data;
        },
        error: () => {
          this.error = 'No se pudieron cargar las evoluciones';
        }
      });
  }

  guardarEvolucion(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.evolucion.tratamiento_id ||
      !this.evolucion.numero_sesion ||
      !this.evolucion.fecha
    ) {
      this.error = 'Datos obligatorios faltantes: Tratamiento, Sesión y Fecha';
      return;
    }

    if (this.evolucion.fecha && this.evolucion.fecha.trim() === '') {
      this.error = 'La fecha no puede estar vacía';
      return;
    }

    this.evolucionesService.crear(this.evolucion).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Evolución registrada correctamente';
        this.limpiarFormulario();
        this.cargarEvoluciones();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al registrar la evolución';
      }
    });
  }

  limpiarFormulario(): void {
    this.evolucion = {
      tratamiento_id: this.evolucion.tratamiento_id,
      numero_sesion: (this.evolucion.numero_sesion || 0) + 1,
      fecha: '',
      observaciones: '',
      procedimientos: '',
      dolor: '',
      movilidad: '',
      recomendaciones: ''
    };
  }
}