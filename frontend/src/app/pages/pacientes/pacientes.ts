import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PacientesService, Paciente } from '../../services/pacientes.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];

  busqueda = '';
  mensaje = '';
  error = '';

  cargando = false;
  guardando = false;

  editando = false;
  idEditando: number | null = null;

  paciente: Paciente = {
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    email: '',
    direccion: '',
    fecha_nacimiento: '',
    genero: 'Otro',
    motivo_consulta: ''
  };

  constructor(
    private pacientesService: PacientesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.pacientesService.listar().subscribe({
      next: (data: Paciente[]) => {
        console.log('Pacientes recibidos:', data);

        this.pacientes = data;
        this.pacientesFiltrados = [...data];

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar pacientes:', err);

        this.error = 'Error al cargar pacientes. Revisa que el backend esté encendido.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  guardarPaciente(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.paciente.nombre.trim() || !this.paciente.apellido.trim()) {
      this.error = 'Nombre y apellido son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.editando && this.idEditando !== null) {
      this.pacientesService.actualizar(this.idEditando, this.paciente).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Paciente actualizado correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarPacientes();

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al actualizar paciente:', err);

          this.error = err.error?.mensaje || 'Error al actualizar paciente.';
          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
    } else {
      this.pacientesService.crear(this.paciente).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Paciente registrado correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarPacientes();

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al registrar paciente:', err);

          this.error = err.error?.mensaje || 'Error al registrar paciente.';
          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
    }
  }

  editarPaciente(pacienteSeleccionado: Paciente): void {
    this.editando = true;
    this.idEditando = pacienteSeleccionado.id || null;

    this.paciente = {
      nombre: pacienteSeleccionado.nombre || '',
      apellido: pacienteSeleccionado.apellido || '',
      ci: pacienteSeleccionado.ci || '',
      telefono: pacienteSeleccionado.telefono || '',
      email: pacienteSeleccionado.email || '',
      direccion: pacienteSeleccionado.direccion || '',
      fecha_nacimiento: pacienteSeleccionado.fecha_nacimiento
        ? pacienteSeleccionado.fecha_nacimiento.substring(0, 10)
        : '',
      genero: pacienteSeleccionado.genero || 'Otro',
      motivo_consulta: pacienteSeleccionado.motivo_consulta || ''
    };

    this.mensaje = '';
    this.error = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarPaciente(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este paciente?');

    if (!confirmar) return;

    this.mensaje = '';
    this.error = '';

    this.pacientesService.eliminar(id).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Paciente eliminado correctamente.';
        this.cargarPacientes();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al eliminar paciente:', err);

        this.error = 'Error al eliminar paciente.';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;
    this.guardando = false;

    this.paciente = {
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      email: '',
      direccion: '',
      fecha_nacimiento: '',
      genero: 'Otro',
      motivo_consulta: ''
    };

    this.cdr.detectChanges();
  }

  buscarPaciente(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      this.pacientesFiltrados = [...this.pacientes];
      this.cdr.detectChanges();
      return;
    }

    this.pacientesFiltrados = this.pacientes.filter((p) =>
      (p.nombre || '').toLowerCase().includes(texto) ||
      (p.apellido || '').toLowerCase().includes(texto) ||
      (p.ci || '').toLowerCase().includes(texto) ||
      (p.telefono || '').toLowerCase().includes(texto) ||
      (p.email || '').toLowerCase().includes(texto) ||
      (p.direccion || '').toLowerCase().includes(texto) ||
      (p.motivo_consulta || '').toLowerCase().includes(texto)
    );

    this.cdr.detectChanges();
  }

  totalConTelefono(): number {
    return this.pacientes.filter((p) => !!p.telefono).length;
  }

  totalConEmail(): number {
    return this.pacientes.filter((p) => !!p.email).length;
  }
}