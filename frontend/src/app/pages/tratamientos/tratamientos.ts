import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  TratamientosService,
  Tratamiento
} from '../../services/tratamientos';

import {
  PacientesService,
  Paciente
} from '../../services/pacientes.service';

import {
  FisioterapeutasService,
  Fisioterapeuta
} from '../../services/fisioterapeutas.service';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tratamientos.html',
  styleUrl: './tratamientos.css'
})
export class TratamientosComponent implements OnInit {
  tratamientos: Tratamiento[] = [];
  tratamientosFiltrados: Tratamiento[] = [];

  pacientes: Paciente[] = [];
  fisioterapeutas: Fisioterapeuta[] = [];

  mensaje = '';
  error = '';
  busqueda = '';
  filtroEstado = 'Todos';

  cargando = false;
  guardando = false;

  editando = false;
  idEditando: number | null = null;

  tratamiento: Tratamiento = {
    paciente_id: null,
    fisioterapeuta_id: null,
    diagnostico: '',
    objetivo: '',
    plan_tratamiento: '',
    sesiones_totales: 0,
    sesiones_realizadas: 0,
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Pendiente'
  };

  constructor(
    private tratamientosService: TratamientosService,
    private pacientesService: PacientesService,
    private fisioterapeutasService: FisioterapeutasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTratamientos();
    this.cargarPacientes();
    this.cargarFisioterapeutas();
  }

  cargarTratamientos(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.tratamientosService.listar().subscribe({
      next: (data: Tratamiento[]) => {
        console.log('Tratamientos recibidos:', data);

        this.tratamientos = data;
        this.tratamientosFiltrados = [...data];

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar tratamientos:', err);

        this.error = 'Error al cargar tratamientos. Revisa que el backend esté encendido.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
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

  cargarFisioterapeutas(): void {
    this.fisioterapeutasService.listar().subscribe({
      next: (data: Fisioterapeuta[]) => {
        this.fisioterapeutas = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar fisioterapeutas:', err);
        this.error = 'No se pudieron cargar los fisioterapeutas.';
        this.cdr.detectChanges();
      }
    });
  }

  guardarTratamiento(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.tratamiento.paciente_id ||
      !this.tratamiento.fisioterapeuta_id ||
      !this.tratamiento.diagnostico.trim()
    ) {
      this.error = 'Paciente, fisioterapeuta y diagnóstico son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.editando && this.idEditando !== null) {
      this.tratamientosService.actualizar(
        this.idEditando,
        this.tratamiento
      ).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Tratamiento actualizado correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarTratamientos();

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al actualizar tratamiento:', err);

          this.error = err.error?.mensaje || 'Error al actualizar tratamiento.';
          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
    } else {
      this.tratamientosService.crear(this.tratamiento).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Tratamiento registrado correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarTratamientos();

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al registrar tratamiento:', err);

          this.error = err.error?.mensaje || 'Error al registrar tratamiento.';
          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
    }
  }

  editarTratamiento(t: Tratamiento): void {
    this.editando = true;
    this.idEditando = t.id || null;

    this.tratamiento = {
      paciente_id: t.paciente_id,
      fisioterapeuta_id: t.fisioterapeuta_id,
      diagnostico: t.diagnostico || '',
      objetivo: t.objetivo || '',
      plan_tratamiento: t.plan_tratamiento || '',
      sesiones_totales: t.sesiones_totales || 0,
      sesiones_realizadas: t.sesiones_realizadas || 0,
      fecha_inicio: t.fecha_inicio
        ? t.fecha_inicio.substring(0, 10)
        : '',
      fecha_fin: t.fecha_fin
        ? t.fecha_fin.substring(0, 10)
        : '',
      estado: t.estado || 'Pendiente'
    };

    this.mensaje = '';
    this.error = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarTratamiento(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este tratamiento?');

    if (!confirmar) return;

    this.mensaje = '';
    this.error = '';

    this.tratamientosService.eliminar(id).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Tratamiento eliminado correctamente.';
        this.cargarTratamientos();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al eliminar tratamiento:', err);

        this.error = 'Error al eliminar tratamiento.';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;
    this.guardando = false;

    this.tratamiento = {
      paciente_id: null,
      fisioterapeuta_id: null,
      diagnostico: '',
      objetivo: '',
      plan_tratamiento: '',
      sesiones_totales: 0,
      sesiones_realizadas: 0,
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'Pendiente'
    };

    this.cdr.detectChanges();
  }

  buscarTratamiento(): void {
    const texto = this.busqueda.toLowerCase().trim();

    this.tratamientosFiltrados = this.tratamientos.filter((t) => {
      const coincideTexto =
        !texto ||
        (t.paciente_nombre || '').toLowerCase().includes(texto) ||
        (t.paciente_apellido || '').toLowerCase().includes(texto) ||
        (t.fisio_nombre || '').toLowerCase().includes(texto) ||
        (t.fisio_apellido || '').toLowerCase().includes(texto) ||
        (t.diagnostico || '').toLowerCase().includes(texto) ||
        (t.objetivo || '').toLowerCase().includes(texto) ||
        (t.estado || '').toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' || t.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });

    this.cdr.detectChanges();
  }

  obtenerClaseEstado(estado: string | undefined): string {
    switch (estado) {
      case 'En tratamiento':
        return 'estado-tratamiento';
      case 'Finalizado':
        return 'estado-finalizado';
      case 'Suspendido':
        return 'estado-suspendido';
      default:
        return 'estado-pendiente';
    }
  }

  totalEnTratamiento(): number {
    return this.tratamientos.filter((t) => t.estado === 'En tratamiento').length;
  }

  totalFinalizados(): number {
    return this.tratamientos.filter((t) => t.estado === 'Finalizado').length;
  }

  totalPendientes(): number {
    return this.tratamientos.filter((t) => t.estado === 'Pendiente').length;
  }

  calcularProgreso(t: Tratamiento): number {
    const total = Number(t.sesiones_totales || 0);
    const realizadas = Number(t.sesiones_realizadas || 0);

    if (total <= 0) return 0;

    const progreso = Math.round((realizadas / total) * 100);

    return progreso > 100 ? 100 : progreso;
  }
}