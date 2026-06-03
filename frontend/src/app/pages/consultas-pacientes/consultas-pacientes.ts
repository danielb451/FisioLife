import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consultas-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './consultas-pacientes.html',
  styleUrl: './consultas-pacientes.css'
})
export class ConsultasPacientesComponent {
  busqueda = '';

  pacientes = [
    {
      id: 1,
      nombre: 'Roberto',
      apellido: 'Tito',
      ci: '1234567',
      telefono: '79729710',
      email: 'roberto@gmail.com',
      motivo_consulta: 'Dolor lumbar'
    },
    {
      id: 2,
      nombre: 'Daniel',
      apellido: 'Bautista',
      ci: '7654321',
      telefono: '70000004',
      email: 'daniel@gmail.com',
      motivo_consulta: 'Lesión de rodilla'
    }
  ];

  get pacientesFiltrados() {
    const texto = this.busqueda.toLowerCase().trim();

    if (!texto) {
      return this.pacientes;
    }

    return this.pacientes.filter((paciente) =>
      `${paciente.nombre} ${paciente.apellido} ${paciente.ci} ${paciente.telefono}`
        .toLowerCase()
        .includes(texto)
    );
  }
}