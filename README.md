# FisioLife - Sistema Web para Clínica Fisioterapéutica

Proyecto inicial completo con:

- Frontend en Angular 21
- Login funcional
- Dashboard protegido
- Backend en Node.js + Express
- Base de datos MySQL
- Autenticación con JWT
- Modo Angular zoneless para evitar el error NG0908 de Zone.js

## Estructura

```txt
FisioLife/
├── frontend/   # Angular
├── backend/    # Node.js + Express
└── database/   # Script SQL inicial
```

## 1. Crear base de datos

Abre MySQL, phpMyAdmin o consola y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS fisiolife_db;
```

El backend creará automáticamente las tablas y el usuario administrador cuando arranque.

También puedes ejecutar manualmente el archivo:

```txt
database/schema.sql
```

## 2. Configurar backend

Entra a la carpeta backend:

```bash
cd backend
npm install
npm run dev
```

El backend correrá en:

```txt
http://localhost:3000
```

Archivo de configuración:

```txt
backend/.env
```

Por defecto está configurado así:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fisiolife_db
DB_PORT=3306
```

Si tu MySQL tiene contraseña, cámbiala en `DB_PASSWORD`.

## 3. Configurar frontend

Abre otra terminal:

```bash
cd frontend
npm install
npm start
```

Angular correrá en:

```txt
http://localhost:4200
```

## 4. Usuario de prueba

```txt
Correo: admin@fisio.com
Contraseña: 123456
```

## 5. Nota importante sobre Zone.js

Este proyecto usa:

```ts
provideZonelessChangeDetection()
```

Por eso no necesita `zone.js` y evita el error:

```txt
NG0908: In this configuration Angular requires Zone.js
```

No agregues `import 'zone.js'` en `main.ts` para este proyecto.

## 6. Próximos módulos recomendados

- CRUD de pacientes
- Gestión de citas
- Gestión de fisioterapeutas
- Tratamientos y evolución
- Historial clínico
- Reportes administrativos
- Pagos o facturación
