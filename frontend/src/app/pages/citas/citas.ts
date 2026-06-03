import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  filtroEstado = 'Todos';

  mensaje = '';
  error = '';
  cargando = false;
  guardando = false;

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
    private pacientesService: PacientesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarCitas();
  }

  cargarPacientes(): void {
    this.pacientesService.listar().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar pacientes:', err);
        this.error = 'No se pudieron cargar los pacientes.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarCitas(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.citasService.listar().subscribe({
      next: (data: Cita[]) => {
        console.log('Citas recibidas:', data);

        this.citas = data;
        this.citasFiltradas = [...data];

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar citas:', err);

        this.error = 'No se pudieron cargar las citas. Revisa que el backend esté encendido.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  guardarCita(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.cita.paciente_id || !this.cita.fecha || !this.cita.hora || !this.cita.motivo?.trim()) {
      this.error = 'Paciente, fecha, hora y motivo son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.editando && this.idEditando !== null) {
      this.citasService.actualizar(this.idEditando, this.cita).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Cita actualizada correctamente.';
          this.guardando = false;
          this.limpiarFormulario();
          this.cargarCitas();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al actualizar cita:', err);
          this.error = err.error?.mensaje || 'Error al actualizar la cita.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.citasService.crear(this.cita).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Cita registrada correctamente.';
          this.guardando = false;
          this.limpiarFormulario();
          this.cargarCitas();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al registrar cita:', err);
          this.error = err.error?.mensaje || 'Error al registrar la cita.';
          this.guardando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  editarCita(citaSeleccionada: Cita): void {
    this.editando = true;
    this.idEditando = citaSeleccionada.id || null;

    this.cita = {
      paciente_id: citaSeleccionada.paciente_id,
      fecha: citaSeleccionada.fecha ? citaSeleccionada.fecha.substring(0, 10) : '',
      hora: citaSeleccionada.hora ? citaSeleccionada.hora.substring(0, 5) : '',
      motivo: citaSeleccionada.motivo || '',
      estado: citaSeleccionada.estado || 'Pendiente',
      observaciones: citaSeleccionada.observaciones || ''
    };

    this.mensaje = '';
    this.error = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarCita(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar esta cita?');

    if (!confirmar) return;

    this.mensaje = '';
    this.error = '';

    this.citasService.eliminar(id).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Cita eliminada correctamente.';
        this.cargarCitas();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al eliminar cita:', err);
        this.error = 'Error al eliminar la cita.';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;
    this.guardando = false;

    this.cita = {
      paciente_id: null,
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'Pendiente',
      observaciones: ''
    };

    this.cdr.detectChanges();
  }

  buscarCita(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto && this.filtroEstado === 'Todos') {
      this.citasFiltradas = [...this.citas];
      this.cdr.detectChanges();
      return;
    }

    this.citasFiltradas = this.citas.filter((c) => {
      const coincideTexto =
        !texto ||
        (c.paciente_nombre || '').toLowerCase().includes(texto) ||
        (c.paciente_apellido || '').toLowerCase().includes(texto) ||
        (c.paciente_ci || '').toLowerCase().includes(texto) ||
        (c.paciente_telefono || '').toLowerCase().includes(texto) ||
        (c.motivo || '').toLowerCase().includes(texto) ||
        (c.estado || '').toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' || c.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });

    this.cdr.detectChanges();
  }

  aplicarFiltros(): void {
    this.buscarCita();
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

  contarPorEstado(estado: string): number {
    return this.citas.filter((c) => c.estado === estado).length;
  }

  totalHoy(): number {
    const hoy = new Date().toISOString().substring(0, 10);

    return this.citas.filter((c) => {
      const fecha = c.fecha ? c.fecha.substring(0, 10) : '';
      return fecha === hoy;
    }).length;
  }
}