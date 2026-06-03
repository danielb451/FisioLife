import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EvolucionesService, Evolucion } from '../../services/evoluciones.service';
import { TratamientosService, Tratamiento } from '../../services/tratamientos.service';

@Component({
  selector: 'app-evoluciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './evoluciones.html',
  styleUrl: './evoluciones.css'
})
export class EvolucionesComponent implements OnInit {
  tratamientos: Tratamiento[] = [];
  evoluciones: Evolucion[] = [];

  mensaje = '';
  error = '';

  cargandoTratamientos = false;
  cargandoEvoluciones = false;
  guardando = false;

  busqueda = '';

  evolucion: Evolucion = {
    tratamiento_id: null,
    numero_sesion: 1,
    fecha: '',
    observaciones: '',
    procedimientos: '',
    dolor: '',
    movilidad: '',
    recomendaciones: ''
  };

  constructor(
    private evolucionesService: EvolucionesService,
    private tratamientosService: TratamientosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTratamientos();
  }

  cargarTratamientos(): void {
    this.cargandoTratamientos = true;
    this.error = '';
    this.cdr.detectChanges();

    this.tratamientosService.listar().subscribe({
      next: (data: Tratamiento[]) => {
        console.log('Tratamientos para evoluciones:', data);

        this.tratamientos = data;
        this.cargandoTratamientos = false;

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar tratamientos:', err);

        this.error = 'No se pudieron cargar los tratamientos.';
        this.cargandoTratamientos = false;

        this.cdr.detectChanges();
      }
    });
  }

  cargarEvoluciones(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.evolucion.tratamiento_id) {
      this.evoluciones = [];
      this.cdr.detectChanges();
      return;
    }

    this.cargandoEvoluciones = true;
    this.cdr.detectChanges();

    this.evolucionesService
      .listarPorTratamiento(this.evolucion.tratamiento_id)
      .subscribe({
        next: (data: Evolucion[]) => {
          console.log('Evoluciones recibidas:', data);

          this.evoluciones = data;
          this.cargandoEvoluciones = false;

          const ultimaSesion = this.obtenerUltimaSesion();

          if (!this.evolucion.numero_sesion || this.evolucion.numero_sesion <= ultimaSesion) {
            this.evolucion.numero_sesion = ultimaSesion + 1;
          }

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar evoluciones:', err);

          this.error = 'No se pudieron cargar las evoluciones.';
          this.cargandoEvoluciones = false;

          this.cdr.detectChanges();
        }
      });
  }

  guardarEvolucion(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.evolucion.tratamiento_id ||
      !this.evolucion.numero_sesion ||
      !this.evolucion.fecha
    ) {
      this.error = 'Datos obligatorios faltantes: tratamiento, sesión y fecha.';
      this.cdr.detectChanges();
      return;
    }

    if (this.evolucion.fecha.trim() === '') {
      this.error = 'La fecha no puede estar vacía.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    this.evolucionesService.crear(this.evolucion).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Evolución registrada correctamente.';
        this.guardando = false;

        this.limpiarFormulario();
        this.cargarEvoluciones();

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al registrar evolución:', err);

        this.error = err.error?.mensaje || 'Error al registrar la evolución.';
        this.guardando = false;

        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    const tratamientoActual = this.evolucion.tratamiento_id;
    const siguienteSesion = this.obtenerUltimaSesion() + 1;

    this.evolucion = {
      tratamiento_id: tratamientoActual,
      numero_sesion: siguienteSesion,
      fecha: '',
      observaciones: '',
      procedimientos: '',
      dolor: '',
      movilidad: '',
      recomendaciones: ''
    };

    this.cdr.detectChanges();
  }

  obtenerUltimaSesion(): number {
    if (this.evoluciones.length === 0) return 0;

    return Math.max(
      ...this.evoluciones.map((e) => Number(e.numero_sesion || 0))
    );
  }

  obtenerTratamientoSeleccionado(): Tratamiento | undefined {
    return this.tratamientos.find(
      (t) => t.id === this.evolucion.tratamiento_id
    );
  }

  totalEvoluciones(): number {
    return this.evoluciones.length;
  }

  ultimaFecha(): string {
    if (this.evoluciones.length === 0) return 'Sin registro';

    const ordenadas = [...this.evoluciones].sort((a, b) => {
      const fechaA = new Date(a.fecha || '').getTime();
      const fechaB = new Date(b.fecha || '').getTime();

      return fechaB - fechaA;
    });

    return ordenadas[0].fecha || 'Sin registro';
  }

  evolucionesFiltradas(): Evolucion[] {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      return this.evoluciones;
    }

    return this.evoluciones.filter((e) =>
      String(e.numero_sesion || '').includes(texto) ||
      (e.fecha || '').toLowerCase().includes(texto) ||
      (e.dolor || '').toLowerCase().includes(texto) ||
      (e.movilidad || '').toLowerCase().includes(texto) ||
      (e.observaciones || '').toLowerCase().includes(texto) ||
      (e.procedimientos || '').toLowerCase().includes(texto) ||
      (e.recomendaciones || '').toLowerCase().includes(texto)
    );
  }
}