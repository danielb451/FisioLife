import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  EspecialidadesService,
  Especialidad
} from '../../services/especialidad.service';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css'
})
export class EspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];
  especialidadesFiltradas: Especialidad[] = [];

  nuevaEspecialidad: Especialidad = {
    nombre: '',
    descripcion: '',
    estado: 1
  };

  busqueda = '';
  mensaje = '';
  error = '';

  cargando = false;
  guardando = false;

  editando = false;
  especialidadEditandoId: number | null = null;

  constructor(
    private especialidadesService: EspecialidadesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.especialidadesService.obtenerEspecialidades().subscribe({
      next: (data: Especialidad[]) => {
        console.log('Especialidades recibidas:', data);

        this.especialidades = data;
        this.especialidadesFiltradas = [...data];

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar especialidades:', error);

        this.error = 'No se pudieron cargar las especialidades.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  guardarEspecialidad(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.nuevaEspecialidad.nombre.trim()) {
      this.error = 'El nombre de la especialidad es obligatorio.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.editando && this.especialidadEditandoId !== null) {
      this.especialidadesService
        .actualizarEspecialidad(this.especialidadEditandoId, this.nuevaEspecialidad)
        .subscribe({
          next: (res: any) => {
            this.mensaje = res.mensaje || 'Especialidad actualizada correctamente.';
            this.guardando = false;

            this.cancelarEdicion();
            this.cargarEspecialidades();

            this.cdr.detectChanges();
          },
          error: (error: any) => {
            console.error('Error al actualizar especialidad:', error);

            this.error = error.error?.mensaje || 'No se pudo actualizar la especialidad.';
            this.guardando = false;

            this.cdr.detectChanges();
          }
        });
    } else {
      this.especialidadesService.crearEspecialidad(this.nuevaEspecialidad).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Especialidad registrada correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarEspecialidades();

          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al crear especialidad:', error);

          this.error = error.error?.mensaje || 'No se pudo crear la especialidad.';
          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
    }
  }

  editarEspecialidad(especialidad: Especialidad): void {
    this.editando = true;
    this.especialidadEditandoId = especialidad.id || null;

    this.nuevaEspecialidad = {
      nombre: especialidad.nombre || '',
      descripcion: especialidad.descripcion || '',
      estado: especialidad.estado ?? 1
    };

    this.mensaje = '';
    this.error = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarEspecialidad(id: number | undefined): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar esta especialidad?');

    if (!confirmar) return;

    this.mensaje = '';
    this.error = '';

    this.especialidadesService.eliminarEspecialidad(id).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Especialidad eliminada correctamente.';
        this.cargarEspecialidades();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al eliminar especialidad:', error);

        this.error = error.error?.mensaje || 'No se pudo eliminar la especialidad.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.especialidadEditandoId = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevaEspecialidad = {
      nombre: '',
      descripcion: '',
      estado: 1
    };

    this.guardando = false;
    this.error = '';

    this.cdr.detectChanges();
  }

  buscarEspecialidad(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      this.especialidadesFiltradas = [...this.especialidades];
      this.cdr.detectChanges();
      return;
    }

    this.especialidadesFiltradas = this.especialidades.filter((especialidad) =>
      (especialidad.nombre || '').toLowerCase().includes(texto) ||
      (especialidad.descripcion || '').toLowerCase().includes(texto) ||
      this.obtenerTextoEstado(especialidad.estado).toLowerCase().includes(texto)
    );

    this.cdr.detectChanges();
  }

  obtenerTextoEstado(estado: number | undefined): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  obtenerClaseEstado(estado: number | undefined): string {
    return estado === 1 ? 'estado-activo' : 'estado-inactivo';
  }

  totalActivas(): number {
    return this.especialidades.filter((e) => e.estado === 1).length;
  }

  totalInactivas(): number {
    return this.especialidades.filter((e) => e.estado !== 1).length;
  }
}