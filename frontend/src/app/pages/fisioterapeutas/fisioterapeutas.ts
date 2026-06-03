import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  filtroEstado = 'Todos';

  mensaje = '';
  error = '';

  cargando = false;
  guardando = false;

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

  constructor(
    private fisioterapeutasService: FisioterapeutasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarFisioterapeutas();
  }

  cargarFisioterapeutas(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.fisioterapeutasService.listar().subscribe({
      next: (data: Fisioterapeuta[]) => {
        console.log('Fisioterapeutas recibidos:', data);

        this.fisioterapeutas = data;
        this.fisioterapeutasFiltrados = [...data];

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar fisioterapeutas:', err);

        this.error = 'No se pudieron cargar los fisioterapeutas. Revisa que el backend esté encendido.';
        this.cargando = false;

        this.cdr.detectChanges();
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
      this.error = 'Nombre, apellido y especialidad son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.editando && this.idEditando !== null) {
      this.fisioterapeutasService.actualizar(this.idEditando, this.fisioterapeuta).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Fisioterapeuta actualizado correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarFisioterapeutas();

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al actualizar fisioterapeuta:', err);

          this.error = err.error?.mensaje || 'Error al actualizar fisioterapeuta.';
          this.guardando = false;

          this.cdr.detectChanges();
        }
      });
    } else {
      this.fisioterapeutasService.crear(this.fisioterapeuta).subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Fisioterapeuta registrado correctamente.';
          this.guardando = false;

          this.limpiarFormulario();
          this.cargarFisioterapeutas();

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al registrar fisioterapeuta:', err);

          this.error = err.error?.mensaje || 'Error al registrar fisioterapeuta.';
          this.guardando = false;

          this.cdr.detectChanges();
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

    this.mensaje = '';
    this.error = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminarFisioterapeuta(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este fisioterapeuta?');

    if (!confirmar) return;

    this.mensaje = '';
    this.error = '';

    this.fisioterapeutasService.eliminar(id).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Fisioterapeuta eliminado correctamente.';
        this.cargarFisioterapeutas();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al eliminar fisioterapeuta:', err);

        this.error = err.error?.mensaje || 'Error al eliminar fisioterapeuta.';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;
    this.guardando = false;

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

    this.cdr.detectChanges();
  }

  buscarFisioterapeuta(): void {
    const texto = this.busqueda.toLowerCase().trim();

    this.fisioterapeutasFiltrados = this.fisioterapeutas.filter((f) => {
      const coincideTexto =
        !texto ||
        (f.nombre || '').toLowerCase().includes(texto) ||
        (f.apellido || '').toLowerCase().includes(texto) ||
        (f.ci || '').toLowerCase().includes(texto) ||
        (f.telefono || '').toLowerCase().includes(texto) ||
        (f.email || '').toLowerCase().includes(texto) ||
        (f.direccion || '').toLowerCase().includes(texto) ||
        (f.especialidad || '').toLowerCase().includes(texto) ||
        (f.horario_atencion || '').toLowerCase().includes(texto) ||
        (f.estado_laboral || '').toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' || f.estado_laboral === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });

    this.cdr.detectChanges();
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

  totalActivos(): number {
    return this.fisioterapeutas.filter((f) => f.estado_laboral === 'Activo').length;
  }

  totalVacaciones(): number {
    return this.fisioterapeutas.filter((f) => f.estado_laboral === 'Vacaciones').length;
  }

  totalInactivos(): number {
    return this.fisioterapeutas.filter((f) => f.estado_laboral === 'Inactivo').length;
  }
}