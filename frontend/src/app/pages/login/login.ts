import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = 'admin@fisio.com';
  password = '123456';

  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  iniciarSesion(): void {
    this.error = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Debes ingresar correo y contraseña.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.token, res.usuario);

        this.cargando = false;
        this.error = '';

        this.cdr.detectChanges();

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error login:', err);

        this.error = err.error?.mensaje || 'Credenciales incorrectas o error de conexión.';
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }
}