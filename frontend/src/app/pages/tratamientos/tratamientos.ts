import { Component, OnInit } from '@angular/core';
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
  cargando = false;

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
    private fisioterapeutasService: FisioterapeutasService
  ) {}

  ngOnInit(): void {
    this.cargarTratamientos();
    this.cargarPacientes();
    this.cargarFisioterapeutas();
  }

  cargarTratamientos(): void {

    this.cargando = true;

    this.tratamientosService.listar().subscribe({
      next: (data) => {
        this.tratamientos = data;
        this.tratamientosFiltrados = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar tratamientos';
        this.cargando = false;
      }
    });
  }

  cargarPacientes(): void {

    this.pacientesService.listar().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
      }
    });
  }

  cargarFisioterapeutas(): void {

    this.fisioterapeutasService.listar().subscribe({
      next: (data: Fisioterapeuta[]) => {
        this.fisioterapeutas = data;
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
      this.error = 'Paciente, fisioterapeuta y diagnóstico son obligatorios';
      return;
    }

    if (this.editando && this.idEditando !== null) {

      this.tratamientosService.actualizar(
        this.idEditando,
        this.tratamiento
      ).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.limpiarFormulario();
          this.cargarTratamientos();
        },
        error: () => {
          this.error = 'Error al actualizar tratamiento';
        }
      });

    } else {

      this.tratamientosService.crear(
        this.tratamiento
      ).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje;
          this.limpiarFormulario();
          this.cargarTratamientos();
        },
        error: () => {
          this.error = 'Error al registrar tratamiento';
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

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarTratamiento(id?: number): void {

    if (!id) return;

    const confirmar = confirm(
      '¿Seguro que deseas eliminar este tratamiento?'
    );

    if (!confirmar) return;

    this.tratamientosService.eliminar(id).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje;
        this.cargarTratamientos();
      },
      error: () => {
        this.error = 'Error al eliminar tratamiento';
      }
    });
  }

  limpiarFormulario(): void {

    this.editando = false;
    this.idEditando = null;

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
  }

  buscarTratamiento(): void {

    const texto = this.busqueda.toLowerCase();

    this.tratamientosFiltrados =
      this.tratamientos.filter((t) =>

        (t.paciente_nombre || '')
          .toLowerCase()
          .includes(texto)

        ||

        (t.paciente_apellido || '')
          .toLowerCase()
          .includes(texto)

        ||

        (t.fisio_nombre || '')
          .toLowerCase()
          .includes(texto)

        ||

        (t.fisio_apellido || '')
          .toLowerCase()
          .includes(texto)

        ||

        (t.estado || '')
          .toLowerCase()
          .includes(texto)
      );
  }
}