import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { DashboardService, DashboardData } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;

  datos: DashboardData = {
    pacientes: 0,
    citasHoy: 0,
    tratamientos: 0,
    usuarios: 0
  };

  cargando = true;
  error = '';

  fechaActual = new Date();

  modulos = [
    {
      titulo: 'Pacientes',
      descripcion: 'Registro, búsqueda e historial clínico de pacientes.',
      ruta: '/pacientes',
      icono: '👥'
    },
    {
      titulo: 'Citas',
      descripcion: 'Agenda de sesiones y control de horarios.',
      ruta: '/citas',
      icono: '📅'
    },
    {
      titulo: 'Fisioterapeutas',
      descripcion: 'Gestión del personal fisioterapéutico.',
      ruta: '/fisioterapeutas',
      icono: '🧑‍⚕️'
    },
    {
      titulo: 'Tratamientos',
      descripcion: 'Seguimiento de terapias activas y finalizadas.',
      ruta: '/tratamientos',
      icono: '💪'
    },
    {
      titulo: 'Evoluciones',
      descripcion: 'Control del avance de cada paciente.',
      ruta: '/evoluciones',
      icono: '📈'
    },
    {
      titulo: 'Especialidades',
      descripcion: 'Administración de áreas de atención clínica.',
      ruta: '/especialidades',
      icono: '🏥'
    }
  ];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.dashboardService.obtenerDatos().subscribe({
      next: (data: DashboardData) => {
        console.log('Dashboard recibido:', data);

        this.datos = data;
        this.cargando = false;

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar dashboard:', error);

        this.error = 'No se pudieron cargar los datos del dashboard.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}