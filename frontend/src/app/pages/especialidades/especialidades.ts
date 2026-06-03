import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialidadesService, Especialidad } from '../../services/especialidad.service';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css'
})
export class EspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];

  nuevaEspecialidad: Especialidad = {
    nombre: '',
    descripcion: '',
    estado: 1
  };

  editando = false;
  especialidadEditandoId: number | null = null;

  cargando = false;
  error = '';

  constructor(private especialidadesService: EspecialidadesService) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.cargando = true;

    this.especialidadesService.obtenerEspecialidades().subscribe({
      next: (data: Especialidad[]) => {
        this.especialidades = data;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar especialidades:', error);
        this.error = 'No se pudieron cargar las especialidades';
        this.cargando = false;
      }
    });
  }

  guardarEspecialidad(): void {
    if (!this.nuevaEspecialidad.nombre.trim()) {
      this.error = 'El nombre de la especialidad es obligatorio';
      return;
    }

    if (this.editando && this.especialidadEditandoId !== null) {
      this.especialidadesService
        .actualizarEspecialidad(this.especialidadEditandoId, this.nuevaEspecialidad)
        .subscribe({
          next: (res: any) => {
            this.cancelarEdicion();
            this.cargarEspecialidades();
          },
          error: (error: any) => {
            console.error('Error al actualizar especialidad:', error);
            this.error = 'No se pudo actualizar la especialidad';
          }
        });
    } else {
      this.especialidadesService.crearEspecialidad(this.nuevaEspecialidad).subscribe({
        next: (res: any) => {
          this.limpiarFormulario();
          this.cargarEspecialidades();
        },
        error: (error: any) => {
          console.error('Error al crear especialidad:', error);
          this.error = 'No se pudo crear la especialidad';
        }
      });
    }
  }

  editarEspecialidad(especialidad: Especialidad): void {
    this.editando = true;
    this.especialidadEditandoId = especialidad.id || null;

    this.nuevaEspecialidad = {
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion || '',
      estado: especialidad.estado ?? 1
    };
  }

  eliminarEspecialidad(id: number | undefined): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar esta especialidad?');

    if (!confirmar) return;

    this.especialidadesService.eliminarEspecialidad(id).subscribe({
      next: (res: any) => {
        this.cargarEspecialidades();
      },
      error: (error: any) => {
        console.error('Error al eliminar especialidad:', error);
        this.error = 'No se pudo eliminar la especialidad';
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

    this.error = '';
  }
}