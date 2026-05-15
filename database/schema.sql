CREATE DATABASE IF NOT EXISTS fisiolife_db;
USE fisiolife_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'recepcionista', 'fisioterapeuta') DEFAULT 'admin',
  estado TINYINT DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(30),
  email VARCHAR(120),
  fecha_nacimiento DATE,
  motivo_consulta TEXT,
  estado TINYINT DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT,
  fisioterapeuta_id INT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada') DEFAULT 'pendiente',
  observacion TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE SET NULL,
  FOREIGN KEY (fisioterapeuta_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
