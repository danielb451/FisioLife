import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CitasService, Cita } from '../../services/citas.service';
import { PacientesService, Paciente } from '../../services/pacientes.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class CitasComponent implements OnInit {

  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  pacientes: Paciente[] = [];

  busqueda = '';
  mensaje = '';
  error = '';
  cargando = false;

  editando = false;
  idEditando: number | null = null;

  cita: Cita = {
    paciente_id: null,
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'Pendiente',
    observaciones: ''
  };

  constructor(
    private citasService: CitasService,
    private pacientesService: PacientesService
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarCitas();
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

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';

    this.citasService.listar().subscribe({
      next: (data) => {
        this.citas = data;
        this.citasFiltradas = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las citas. Revisa que el backend esté encendido.';
        this.cargando = false;
      }
    });
  }

  guardarCita(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.cita.paciente_id || !this.cita.fecha || !this.cita.hora || !this.cita.motivo.trim()) {
      this.error = 'Paciente, fecha, hora y motivo son obligatorios';
      return;
    }

    if (this.editando && this.idEditando !== null) {
      this.citasService.actualizar(this.idEditando, this.cita).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje || 'Cita actualizada correctamente';
          this.limpiarFormulario();
          this.cargarCitas();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al actualizar cita';
        }
      });
    } else {
      this.citasService.crear(this.cita).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje || 'Cita registrada correctamente';
          this.limpiarFormulario();
          this.cargarCitas();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al registrar cita';
        }
      });
    }
  }

  editarCita(citaSeleccionada: Cita): void {
    this.editando = true;
    this.idEditando = citaSeleccionada.id || null;

    this.cita = {
      paciente_id: citaSeleccionada.paciente_id,
      fecha: citaSeleccionada.fecha
        ? citaSeleccionada.fecha.substring(0, 10)
        : '',
      hora: citaSeleccionada.hora
        ? citaSeleccionada.hora.substring(0, 5)
        : '',
      motivo: citaSeleccionada.motivo || '',
      estado: citaSeleccionada.estado || 'Pendiente',
      observaciones: citaSeleccionada.observaciones || ''
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarCita(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar esta cita?');

    if (!confirmar) return;

    this.citasService.eliminar(id).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Cita eliminada correctamente';
        this.cargarCitas();
      },
      error: () => {
        this.error = 'Error al eliminar cita';
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;

    this.cita = {
      paciente_id: null,
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'Pendiente',
      observaciones: ''
    };
  }

  buscarCita(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      this.citasFiltradas = this.citas;
      return;
    }

    this.citasFiltradas = this.citas.filter((c) =>
      (c.paciente_nombre || '').toLowerCase().includes(texto) ||
      (c.paciente_apellido || '').toLowerCase().includes(texto) ||
      (c.paciente_ci || '').toLowerCase().includes(texto) ||
      (c.paciente_telefono || '').toLowerCase().includes(texto) ||
      (c.motivo || '').toLowerCase().includes(texto) ||
      (c.estado || '').toLowerCase().includes(texto)
    );
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Confirmada':
        return 'estado-confirmada';
      case 'Cancelada':
        return 'estado-cancelada';
      case 'Finalizada':
        return 'estado-finalizada';
      default:
        return 'estado-pendiente';
    }
  }
}