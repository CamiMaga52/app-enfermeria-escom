# Base de Datos - Sistema de Enfermería ESCOM

## Estructura de la Base de Datos

### Tablas Principales:

1. **rol** - Roles de usuario (ADMIN, ENFERMERO, AUXILIAR)
2. **administrador** - Administradores del sistema
3. **usuario** - Usuarios (personal de enfermería)
4. **categoria** - Categorías para medicamentos/materiales
5. **paciente** - Pacientes atendidos
6. **medicamento** - Medicamentos en inventario
7. **material** - Material médico en inventario
8. **receta** - Recetas médicas
9. **detalle_receta** - Detalle de medicamentos en recetas
10. **movimiento** - Entradas y salidas de inventario
11. **reporte** - Reportes generados

## Scripts de Migración

1. `01_create_tables.sql` - Crea todas las tablas
2. `02_insert_data.sql` - Inserta datos iniciales de prueba

## Conexión

- **Motor:** PostgreSQL 14+
- **Puerto:** 5432
- **Base de datos:** enfermeria_escom
- **Usuario:** postgres
- **Contraseña:** [definir en .env]

## Ejecutar Migraciones

```bash
# Conectar a PostgreSQL
psql -U postgres -d enfermeria_escom

# Ejecutar scripts
\i database/scripts/01_create_tables.sql
\i database/scripts/02_insert_data.sql

