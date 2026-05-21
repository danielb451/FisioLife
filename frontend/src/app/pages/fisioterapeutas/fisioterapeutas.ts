import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FisioterapeutasService, Fisioterapeuta } from '../../services/fisioterapeutas.service';

@Component({
  selector: 'app-fisioterapeutas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fisioterapeutas.html',
  styleUrl: './fisioterapeutas.css'
})
export class FisioterapeutasComponent implements OnInit {

  fisioterapeutas: Fisioterapeuta[] = [];
  fisioterapeutasFiltrados: Fisioterapeuta[] = [];

  busqueda = '';
  mensaje = '';
  error = '';
  cargando = false;

  editando = false;
  idEditando: number | null = null;

  fisioterapeuta: Fisioterapeuta = {
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    email: '',
    direccion: '',
    especialidad: '',
    horario_atencion: '',
    fecha_contratacion: '',
    estado_laboral: 'Activo'
  };

  constructor(private fisioterapeutasService: FisioterapeutasService) {}

  ngOnInit(): void {
    this.cargarFisioterapeutas();
  }

  cargarFisioterapeutas(): void {
    this.cargando = true;
    this.error = '';

    this.fisioterapeutasService.listar().subscribe({
      next: (data: Fisioterapeuta[]) => {
        this.fisioterapeutas = data;
        this.fisioterapeutasFiltrados = data;
        this.cargando = false;
      },
      error: (err: { error?: { mensaje?: string } }) => {
        this.error = 'No se pudieron cargar los fisioterapeutas. Revisa que el backend esté encendido.';
        this.cargando = false;
      }
    });
  }

  guardarFisioterapeuta(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.fisioterapeuta.nombre.trim() ||
      !this.fisioterapeuta.apellido.trim() ||
      !this.fisioterapeuta.especialidad.trim()
    ) {
      this.error = 'Nombre, apellido y especialidad son obligatorios';
      return;
    }

    if (this.editando && this.idEditando !== null) {
      this.fisioterapeutasService.actualizar(this.idEditando, this.fisioterapeuta).subscribe({
        next: (res: { mensaje?: string }) => {
          this.mensaje = res.mensaje || 'Fisioterapeuta actualizado correctamente';
          this.limpiarFormulario();
          this.cargarFisioterapeutas();
        },
        error: (err: { error?: { mensaje?: string } }) => {
          this.error = err.error?.mensaje || 'Error al actualizar fisioterapeuta';
        }
      });
    } else {
      this.fisioterapeutasService.crear(this.fisioterapeuta).subscribe({
        next: (res: { mensaje?: string }) => {
          this.mensaje = res.mensaje || 'Fisioterapeuta registrado correctamente';
          this.limpiarFormulario();
          this.cargarFisioterapeutas();
        },
        error: (err: { error?: { mensaje?: string } }) => {
          this.error = err.error?.mensaje || 'Error al registrar fisioterapeuta';
        }
      });
    }
  }

  editarFisioterapeuta(f: Fisioterapeuta): void {
    this.editando = true;
    this.idEditando = f.id || null;

    this.fisioterapeuta = {
      nombre: f.nombre || '',
      apellido: f.apellido || '',
      ci: f.ci || '',
      telefono: f.telefono || '',
      email: f.email || '',
      direccion: f.direccion || '',
      especialidad: f.especialidad || '',
      horario_atencion: f.horario_atencion || '',
      fecha_contratacion: f.fecha_contratacion
        ? f.fecha_contratacion.substring(0, 10)
        : '',
      estado_laboral: f.estado_laboral || 'Activo'
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarFisioterapeuta(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este fisioterapeuta?');

    if (!confirmar) return;

    this.fisioterapeutasService.eliminar(id).subscribe({
      next: (res: { mensaje?: string }) => {
        this.mensaje = res.mensaje || 'Fisioterapeuta eliminado correctamente';
        this.cargarFisioterapeutas();
      },
      error: (err: { error?: { mensaje?: string } }) => {
        this.error = err.error?.mensaje || 'Error al eliminar fisioterapeuta';
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;

    this.fisioterapeuta = {
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      email: '',
      direccion: '',
      especialidad: '',
      horario_atencion: '',
      fecha_contratacion: '',
      estado_laboral: 'Activo'
    };
  }

  buscarFisioterapeuta(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      this.fisioterapeutasFiltrados = this.fisioterapeutas;
      return;
    }

    this.fisioterapeutasFiltrados = this.fisioterapeutas.filter((f) =>
      f.nombre.toLowerCase().includes(texto) ||
      f.apellido.toLowerCase().includes(texto) ||
      (f.ci || '').toLowerCase().includes(texto) ||
      (f.telefono || '').toLowerCase().includes(texto) ||
      (f.email || '').toLowerCase().includes(texto) ||
      (f.especialidad || '').toLowerCase().includes(texto) ||
      (f.estado_laboral || '').toLowerCase().includes(texto)
    );
  }

  obtenerClaseEstado(estado: string | undefined): string {
    switch (estado) {
      case 'Activo':
        return 'estado-activo';
      case 'Inactivo':
        return 'estado-inactivo';
      case 'Vacaciones':
        return 'estado-vacaciones';
      default:
        return 'estado-activo';
    }
  }
}