import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
    private router: Router
  ) {}

  iniciarSesion(): void {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Debes ingresar correo y contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.token, res.usuario);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo iniciar sesión.';
        this.cargando = false;
      }
    });
  }
}
