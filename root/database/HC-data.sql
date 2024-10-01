USE Health_connection;

-- !1 Insercion de los roles necesarios para el aplicativo
    INSERT INTO Rol (id_rol, nombre_rol) VALUES
    (1, 'Paciente'),
    (2, 'Doctor'),
    (3, 'Administrativo'),
    (4, 'Secretaria');


-- !2 Insertar registros en la tabla Ciudad
    INSERT INTO Ciudad (nombre_ciudad) VALUES
    ('Bogotá'),
    ('Medellín'),
    ('Cali'),
    ('Barranquilla'),
    ('Cartagena');


-- !3 Insertar registros en la tabla Direccion
    INSERT INTO Direccion (direccion, id_ciudad) VALUES
    ('Calle 1 #10-20', 1),  -- Bogotá
    ('Avenida 70 #32-14', 2),  -- Medellín
    ('Carrera 15 #5-10', 3),  -- Cali
    ('Calle 85 #50-22', 4),  -- Barranquilla
    ('Avenida San Martín #12-34', 5);  -- Cartagena


-- !4 Insertar registros en la tabla Especialidad
    INSERT INTO Especialidad (nombre_especialidad, costo) VALUES
    ('Cardiología', 150.00),
    ('Dermatología', 120.00),
    ('Pediatría', 130.00),
    ('Ginecología', 140.00),
    ('Oftalmología', 110.00);


-- !5 Tipos de cita
    INSERT INTO TipoCita (nombre_tipo, costo_adicional) VALUES
    ('Examen', 50.00),
    ('Especialista', 75.00),
    ('Checkeo', 30.00);


-- !6 Planes de afiliacion
    INSERT INTO Afiliacion (nombre_plan, costo, descuento, max_beneficiarios, descripcion) VALUES 
    ('Plan Básico', 500.00, 5.00, 2, 'Cobertura básica para consultas generales y exámenes.'),
    ('Plan Oro', 1000.00, 10.00, 3, 'Cobertura ampliada para especialistas y cirugías.'),
    ('Plan Plata', 750.00, 7.50, 3, 'Cobertura media con algunos exámenes y consultas incluidas.'),
    ('Plan Familiar', 1200.00, 15.00, 5, 'Cobertura completa para toda la familia.'),
    ('Plan Estudiante', 40.00, 3.00, 1, 'Cobertura básica para estudiantes.');


-- !7 Insertar registros de paciente --!(ROL=1)
    INSERT INTO Paciente 
    (numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_plan_afiliacion, foto_perfil, id_rol, estado, afiliado) 
    VALUES 
    (12345678, 'Juan', 'Pérez', 'CC', '1990-05-15', 'M', '3101234567', 'juan.perez@gmail.com', 1, AES_ENCRYPT('otra_contraseña_secreta', 'mi_llave_contraseña'), 1, 'foto1.jpg', 1, 'activo', TRUE),
    (23456789, 'María', 'Gómez', 'CC', '1985-10-20', 'F', '3102345678', 'maria.gomez@gmail.com', 2, AES_ENCRYPT('33332','mi_llave_contraseña'), 2, 'foto2.jpg', 1, 'inactivo', FALSE),
    (34567890, 'Carlos', 'Ramírez', 'TI', '2000-01-10', 'M', '3103456789', 'carlos.ramirez@gmail.com', 3, AES_ENCRYPT('33234212','mi_llave_contraseña'), 3, 'foto3.jpg', 1, 'activo', TRUE),
    (45678901, 'Ana', 'Martínez', 'CC', '1995-07-22', 'F', '3104567890', 'ana.martinez@gmail.com', 4, AES_ENCRYPT('23423','mi_llave_contraseña'), 2, 'foto4.jpg', 1, 'inactivo', FALSE),
    (56789012, 'Laura', 'Rodríguez', 'CE', '1992-03-30', 'F', '3105678901', 'laura.rodriguez@gmail.com', 5, AES_ENCRYPT('5524','mi_llave_contraseña'), 2, 'foto5.jpg', 1, 'activo', TRUE);


-- !8 Insertar registros en la tabla Doctor --!(ROL =2)
    INSERT INTO Doctor 
    (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, id_especialidad, contraseña, foto_perfil, genero, id_rol) 
    VALUES 
    ('Ricardo', 'López', 'CC', 87654321, '3201234567', 'ricardo.lopez@gmail.com', 1, 1, AES_ENCRYPT('10293847', 'mi_llave_contraseña'), 'foto6.jpg', 'M', 2),
    ('Luisa', 'Fernández', 'CC', 98765432, '3202345678', 'luisa.fernandez@gmail.com', 2, 2, AES_ENCRYPT('20938475', 'mi_llave_contraseña'), 'foto7.jpg', 'F', 2),
    ('Andrés', 'García', 'TI', 19876543, '3203456789', 'andres.garcia@gmail.com', 3, 3, AES_ENCRYPT('74829301', 'mi_llave_contraseña'), 'foto8.jpg', 'M', 2),
    ('Sofía', 'Pérez', 'CC', 29876543, '3204567890', 'sofia.perez@gmail.com', 4, 4, AES_ENCRYPT('93847281', 'mi_llave_contraseña'), 'foto9.jpg', 'F', 2),
    ('Diego', 'Moreno', 'CC', 39876543, '3205678901', 'diego.moreno@gmail.com', 5, 5, AES_ENCRYPT('82736490', 'mi_llave_contraseña'), 'foto10.jpg', 'M', 2);


-- !9 Insertar registros en la tabla Administrativos --!(ROL =3)
    INSERT INTO Administrativos 
    (nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña) 
    VALUES 
    ('Camila', 'Torres', 4, 'CC', 87651234, '3121234567', 'camila.torres@gmail.com', 1, AES_ENCRYPT('48593012', 'mi_llave_contraseña')),
    ('Jorge', 'Díaz', 4, 'CC', 97651234, '3122345678', 'jorge.diaz@gmail.com', 2, AES_ENCRYPT('39485721', 'mi_llave_contraseña')),
    ('Paula', 'González', 4, 'CE', 107651234, '3123456789', 'paula.gonzalez@gmail.com', 3, AES_ENCRYPT('84736291', 'mi_llave_contraseña')),
    ('Daniel', 'Hernández', 4, 'TI', 117651234, '3124567890', 'daniel.hernandez@gmail.com', 4, AES_ENCRYPT('90218374', 'mi_llave_contraseña')),
    ('Carolina', 'Cruz', 4, 'CC', 127651234, '3125678901', 'carolina.cruz@gmail.com', 5, AES_ENCRYPT('12984763', 'mi_llave_contraseña'));


-- !10 Insertar registros en la tabla Secretaria --!(ROL =3)
    INSERT INTO Secretaria 
    (nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña) 
    VALUES 
    ('Mónica', 'Ramírez', 3, 'CC', 65432187, '3131234567', 'monica.ramirez@gmail.com', 1, AES_ENCRYPT('74812039', 'mi_llave_contraseña')),
    ('Pedro', 'Sánchez', 3, 'CC', 75432187, '3132345678', 'pedro.sanchez@gmail.com', 2, AES_ENCRYPT('91827364', 'mi_llave_contraseña')),
    ('Lorena', 'Vargas', 3, 'TI', 85432187, '3133456789', 'lorena.vargas@gmail.com', 3, AES_ENCRYPT('27483910', 'mi_llave_contraseña')),
    ('Oscar', 'Ortiz', 3, 'CC', 95432187, '3134567890', 'oscar.ortiz@gmail.com', 4, AES_ENCRYPT('90817263', 'mi_llave_contraseña')),
    ('Fernanda', 'Ríos', 3, 'CC', 105432187, '3135678901', 'fernanda.rios@gmail.com', 5, AES_ENCRYPT('73619284', 'mi_llave_contraseña'));


-- !11 Insertar registros en la tabla Estado
    INSERT INTO Estado (nombre_estado) VALUES 
    ('Pendiente'),
    ('Aprobado'),
    ('Rechazado'),
    ('Cancelado'),
    ('Completado');


-- !12 Insertar registros en la tabla Cita
    INSERT INTO Cita (id_paciente, id_doctor, asignador, solicitante, tipo_solicitante, fecha, hora, tipo_cita, costo, especialidad, requiere_autorizacion, documento_autorizacion, estado)
    VALUES 
    (1012345424, 4, 3, 1012345424, 'paciente', '2024-10-20', '08:30:00', 1, 120.00, 1, FALSE, NULL, 1),
    (2123456535, 5, 11, 6, 'secretaria', '2024-11-15', '10:00:00', 2, 150.00, 2, TRUE, 'ruta_autorizacion.pdf', 1),
    (1012345424, 5, 4, 1012345424, 'paciente', '2024-12-01', '11:15:00', 3, 200.00, 3, FALSE, NULL, 1),
    (2123456535, 6, 2, 5, 'secretaria', '2024-09-30', '14:45:00', 3, 180.00, 4, TRUE, 'autorizacion_cirugia.pdf', 1),
    (1012345424, 7, 13, 1012345424, 'paciente', '2024-11-05', '16:00:00', 1, 100.00, 2, FALSE, NULL, 1);


-- !13 Insertar registros en la tabla Autorizacion
    INSERT INTO Autorizacion (id_paciente, id_doctor, asignador, tipo_cita, fecha_resolucion, fecha_procedimiento, descripcion, firma_doctor, estado)
    VALUES 
    (1012345424, 3, 3, 1, NULL, '2024-10-20', 'Autorización para procedimiento general', 'firma1.png', 1),
    (2123456535, 4, 4, 2, NULL, '2024-11-15', 'Autorización para examen de rutina', 'firma2.png', 1),
    (1012345424, 3, NULL, 3, NULL, '2024-12-01', 'Autorización para consulta especializada', 'firma3.png', 1),
    (2123456535, 4, 2, 3, NULL, '2024-09-30', 'Autorización para cirugía', 'firma4.png', 1),
    (1012345424, 5, 2, 1, NULL, '2024-11-05', 'Autorización para revisión de seguimiento', 'firma5.png', 1);


-- !14 Insertar historialCutorizacion 
    INSERT INTO HistorialAutorizacion (id_autorizacion, id_estado, fecha_cambio)
    VALUES 
    (6, 1, NOW()),  
    (12, 2, NOW()),  
    (13, 3, NOW()),  
    (14, 1, NOW()),  
    (15, 2, NOW());  


-- !15 Insertar registros en la tabla HistorialCita 
    INSERT INTO HistorialCita (id_cita, id_estado, fecha_cambio)
    VALUES 
    (13, 1, NOW()),  
    (24, 2, NOW()),  
    (25, 3, NOW()),  
    (27, 1, NOW()),  
    (28, 2, NOW());  


-- !16 Insertar HistorialClinico
    INSERT INTO HistorialClinico (id_paciente, diagnostico, tratamiento, procedimientos, observaciones, alergias)
    VALUES 
    (1012345424, 'Infección respiratoria', 'Antibióticos', 'Radiografía de tórax', 'Seguimiento recomendado', 'Ninguna'),
    (12345678, 'Diabetes tipo 2', 'Metformina', 'Control de glucosa', 'Requiere dieta especial', 'Alergia a la penicilina'),
    (45678901, 'Hipertensión', 'Antihipertensivos', NULL, 'Controlar la presión regularmente', 'Ninguna'),
    (2123456535, 'Gripe', 'Reposo y líquidos', NULL, 'Revisar síntomas', 'Alergia a aspirina'),
    (56789012, 'Alergia estacional', 'Antihistamínicos', NULL, 'Evitar alérgenos', 'Polen, ácaros');


-- !17 Insertar HistorialClinico_Cita
    INSERT INTO HistorialClinico_Cita (id_historial, id_cita)
    VALUES 
    (11, 13),
    (12, 24),
    (15, 25),
    (14, 26),
    (13, 27);

-- !18 Insertar registros en la tabla Publicacion
    INSERT INTO Publicacion (imagen_publicacion, titulo, contenido, fecha_publicacion)
    VALUES 
    ('imagen1.jpg', 'Título de la publicación 1', 'Contenido de la publicación 1', NOW()),
    ('imagen2.jpg', 'Título de la publicación 2', 'Contenido de la publicación 2', NOW()),
    ('imagen3.jpg', 'Título de la publicación 3', 'Contenido de la publicación 3', NOW()),
    ('imagen4.jpg', 'Título de la publicación 4', 'Contenido de la publicación 4', NOW()),
    ('imagen5.jpg', 'Título de la publicación 5', 'Contenido de la publicación 5', NOW());


-- !19 nsertar registros en la tabla Administrativos_Publicacion
    INSERT INTO Administrativos_Publicacion (id_Administrativos, id_publicacion)
    VALUES 
    (11, 10),
    (12, 11),
    (13, 8),
    (11, 9),
    (12, 7);


-- !20 Insertar registros en la tabla Secretaria_Publicacion
    INSERT INTO Secretaria_Publicacion (id_Secretaria, id_publicacion)
    VALUES
    (4, 10),
    (5, 5);


-- !21 Insertar registros en la tabla Factura
    INSERT INTO Factura (id_servicio, tipo_servicio, paciente, fecha_limite, monto_total, estado_pago, descripcion)
    VALUES 
    (1, 'Cita', 1012345424, '2024-10-30', 100.00, 'Pendiente', 'Factura por consulta médica'),
    (2, 'Afiliacion', 2123456535, '2024-11-15', 150.00, 'Pagado', 'Factura por plan de afiliación'),
    (3, 'Cita', 1012345424, '2024-12-01', 120.00, 'Pendiente', 'Factura por segunda consulta'),
    (4, 'Afiliacion', 2123456535, '2024-09-30', 200.00, 'Pagado', 'Factura por renovación de afiliación'),
    (5, 'Cita', 1012345424, '2024-11-05', 80.00, 'Pendiente', 'Factura por chequeo médico');


-- !22 Insertar registros en la tabla Pago
    INSERT INTO Pago (id_factura, monto, metodo_pago)
    VALUES 
    (1, 100.00, 'Efectivo'),
    (2, 150.00, 'Tarjeta de Crédito'),
    (3, 120.00, 'Transferencia'),
    (4, 200.00, 'Cheque'),
    (5, 80.00, 'Efectivo');


-- !23 Insertar registros en la tabla Observacion
    INSERT INTO Observacion (id_cita, observacion)
    VALUES 
    (13, 'El paciente presenta mejoría tras el tratamiento.'),
    (24, 'Se recomienda seguimiento en dos semanas.'),
    (25, 'El paciente debe evitar esfuerzos físicos.'),
    (26, 'Se requiere análisis adicionales.'),
    (27, 'Control de síntomas es esencial.');


