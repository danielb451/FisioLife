import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EspecialidadesService, Especialidad } from '../../services/especialidades.service';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css'
})
export class EspecialidadesComponent implements OnInit {

  especialidades: Especialidad[] = [];
  mensaje = '';
  error = '';
  editando = false;
  idEditando: number | null = null;

  especialidad: Especialidad = {
    nombre: '',
    descripcion: ''
  };

  constructor(private especialidadesService: EspecialidadesService) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadesService.listar().subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: () => {
        this.error = 'Error al cargar especialidades';
      }
    });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.especialidad.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    if (this.editando && this.idEditando !== null) {
      this.especialidadesService.actualizar(this.idEditando, this.especialidad).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.limpiar();
          this.cargarEspecialidades();
        }
      });
    } else {
      this.especialidadesService.crear(this.especialidad).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.limpiar();
          this.cargarEspecialidades();
        }
      });
    }
  }

  editar(e: Especialidad): void {
    this.editando = true;
    this.idEditando = e.id || null;

    this.especialidad = {
      nombre: e.nombre,
      descripcion: e.descripcion || ''
    };
  }

  eliminar(id?: number): void {
    if (!id) return;

    if (!confirm('¿Eliminar esta especialidad?')) return;

    this.especialidadesService.eliminar(id).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje;
        this.cargarEspecialidades();
      }
    });
  }

  limpiar(): void {
    this.editando = false;
    this.idEditando = null;

    this.especialidad = {
      nombre: '',
      descripcion: ''
    };
  }
}