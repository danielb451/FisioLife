import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacientesService, Paciente } from '../../services/pacientes';

@Component({
  selector: 'app-pacientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class PacientesComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];

  busqueda = '';
  mensaje = '';
  error = '';

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

  constructor(private pacientesService: PacientesService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacientesService.listar().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.pacientesFiltrados = data;
      },
      error: () => {
        this.error = 'Error al cargar pacientes';
      }
    });
  }

  guardarPaciente(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.paciente.nombre || !this.paciente.apellido) {
      this.error = 'Nombre y apellido son obligatorios';
      return;
    }

    if (this.editando && this.idEditando !== null) {
      this.pacientesService.actualizar(this.idEditando, this.paciente).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.limpiarFormulario();
          this.cargarPacientes();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al actualizar paciente';
        }
      });
    } else {
      this.pacientesService.crear(this.paciente).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.limpiarFormulario();
          this.cargarPacientes();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al registrar paciente';
        }
      });
    }
  }

  editarPaciente(paciente: Paciente): void {
    this.editando = true;
    this.idEditando = paciente.id || null;

    this.paciente = {
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      ci: paciente.ci || '',
      telefono: paciente.telefono || '',
      email: paciente.email || '',
      direccion: paciente.direccion || '',
      fecha_nacimiento: paciente.fecha_nacimiento
        ? paciente.fecha_nacimiento.substring(0, 10)
        : '',
      genero: paciente.genero || 'Otro',
      motivo_consulta: paciente.motivo_consulta || ''
    };
  }

  eliminarPaciente(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este paciente?');

    if (!confirmar) return;

    this.pacientesService.eliminar(id).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje;
        this.cargarPacientes();
      },
      error: () => {
        this.error = 'Error al eliminar paciente';
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;

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
  }

  buscarPaciente(): void {
    const texto = this.busqueda.toLowerCase();

    this.pacientesFiltrados = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.apellido.toLowerCase().includes(texto) ||
      (p.ci || '').toLowerCase().includes(texto) ||
      (p.telefono || '').toLowerCase().includes(texto)
    );
  }
}