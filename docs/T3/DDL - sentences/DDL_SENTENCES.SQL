/* ************************************************************************************* */
/* ----------------------------- DATA DEFINITION LANGUAGE ------------------------------ */
/* -------------------------- PARA PROYECTO: HEALTHCONNECTION -------------------------- */
/* ************************************************************************************* */

/* 01. Mostrar Bases de Datos */
-- PostgreSQL
\l

/* 02. Usar Base de Datos */
-- PostgreSQL
\c healthconnection

/* 03. Crear Base de Datos */
CREATE DATABASE healthconnection;

/* 04. Mostrar Tablas */
-- PostgreSQL
\dt

/* 05. Mostrar Columnas de una tabla */
-- PostgreSQL
\d usuario

/* 06. Agregar una columna */
ALTER TABLE usuario ADD COLUMN telefono VARCHAR(20);

/* 07. Renombrar columna */
ALTER TABLE usuario RENAME COLUMN nombre TO nombres;

/* 08. Eliminar columna */
ALTER TABLE usuario DROP COLUMN telefono;

/* 09. Modificar tipo de dato */
ALTER TABLE cita ALTER COLUMN fecha SET DATA TYPE TIMESTAMP;

/* 10. Agregar llave foránea */
ALTER TABLE cita ADD CONSTRAINT fk_cita_paciente
FOREIGN KEY (paciente_id) REFERENCES paciente(id);

/* 11. Eliminar restricción */
ALTER TABLE cita DROP CONSTRAINT fk_cita_paciente;

/* 12. Agregar índice */
CREATE INDEX idx_doctor_id ON cita(doctor_id);

/* 13. Crear nueva tabla */
CREATE TABLE especialidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

/* 14. Eliminar tabla */
DROP TABLE observaciones;

/* 15. Limpiar registros (TRUNCATE) */
TRUNCATE TABLE usuario;

/* 16. Eliminar llave primaria */
ALTER TABLE usuario DROP CONSTRAINT usuario_pkey;

/* 17. Agregar llave primaria */
ALTER TABLE usuario ADD PRIMARY KEY (id);

/* 18. Renombrar tabla */
ALTER TABLE usuario RENAME TO usuarios;

/* ************************************************************************************* */
/* FIN DE COMANDOS DDL PARA LA BASE DE DATOS HEALTHCONNECTION                           */
/* ************************************************************************************* */
