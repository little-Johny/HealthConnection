/* ************************************************************************************* */
/* ----------------------------- DATA MANIPULATION LANGUAGE ---------------------------- */
/* ---------------------- CONSULTAS DML - HEALTHCONNECTION ---------------------------- */
/* ************************************************************************************* */

/* ------------------------------------------------------------------------------------- */
/* 01. INSERTAR datos en una tabla (monotabla) */
INSERT INTO usuario (username, password, name, last_name, email, role, created_at)
VALUES ('jdoe', '$2b$10$Abc1234567890Hasheado', 'John', 'Doe', 'jdoe@example.com', 'paciente', NOW());

/* ------------------------------------------------------------------------------------- */
/* 02. INSERTAR múltiples registros */
INSERT INTO especialidad (nombre)
VALUES ('Pediatría'), ('Cardiología'), ('Dermatología');

/* ------------------------------------------------------------------------------------- */
/* 03. CONSULTAR datos simples (monotabla) */
SELECT * FROM usuario;
SELECT id, name, email FROM usuario WHERE role = 'doctor';

/* ------------------------------------------------------------------------------------- */
/* 04. ACTUALIZAR datos (monotabla) */
UPDATE usuario
SET email = 'nuevo_correo@example.com'
WHERE username = 'jdoe';

/* ------------------------------------------------------------------------------------- */
/* 05. ELIMINAR datos (monotabla) */
DELETE FROM usuario
WHERE username = 'jdoe';

/* ------------------------------------------------------------------------------------- */
/* 06. CONSULTA CONDICIONADA (monotabla) */
SELECT * FROM cita
WHERE status = 'pending' AND fecha > NOW();

/* ------------------------------------------------------------------------------------- */
/* 07. CONSULTA CON JOIN (multitabla) */
SELECT c.id, u.name AS paciente, d.name AS doctor, c.fecha
FROM cita c
JOIN paciente p ON c.paciente_id = p.id
JOIN usuario u ON p.usuario_id = u.id
JOIN doctor d ON c.doctor_id = d.id;

/* ------------------------------------------------------------------------------------- */
/* 08. CONSULTA CON AGRUPACIÓN (GROUP BY) */
SELECT doctor_id, COUNT(*) AS total_citas
FROM cita
GROUP BY doctor_id;

/* ------------------------------------------------------------------------------------- */
/* 09. CONSULTA CON SUBCONSULTA (multitabla) */
SELECT name, email
FROM usuario
WHERE id IN (
    SELECT usuario_id FROM paciente
);

/* ------------------------------------------------------------------------------------- */
/* 10. INSERTAR HISTORIA CLÍNICA ligada a una cita */
INSERT INTO historia_clinica (cita_id, descripcion, fecha)
VALUES (1, 'Paciente con síntomas leves de gripe.', NOW());

/* ------------------------------------------------------------------------------------- */
/* 11. INSERTAR OBSERVACIÓN ligada a historia clínica */
INSERT INTO observacion (historia_clinica_id, contenido, fecha)
VALUES (1, 'Se recomienda reposo y control en 48 horas.', NOW());

/* ------------------------------------------------------------------------------------- */
/* 12. CONSULTA DE CITAS CON DOCTOR Y ESPECIALIDAD */
SELECT c.id, d.name AS doctor, e.nombre AS especialidad, c.fecha
FROM cita c
JOIN doctor d ON c.doctor_id = d.id
JOIN especialidad e ON d.especialidad_id = e.id;

/* ------------------------------------------------------------------------------------- */
/* 13. ELIMINAR todas las observaciones de una historia clínica */
DELETE FROM observacion
WHERE historia_clinica_id = 1;

/* ------------------------------------------------------------------------------------- */
/* FIN DE CONSULTAS DML PARA LA BASE DE DATOS HEALTHCONNECTION                         */
/* ************************************************************************************* */
