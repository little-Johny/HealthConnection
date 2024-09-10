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
-- Asegúrate de que las ciudades estén insertadas primero
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
('Plan Vital Plus', 100.00, 10.00, 5,'Economica y de calidad'),
('Plan Salud Integral', 200.00, 15.00, 10, 'Lo mas saludable para ti'),
('Planzotote', 150.00, 12.00, 8,'La mejor afiliaicon que puede existir');

-- !7 Insertar registros de paciente --!(ROL=1)
INSERT INTO Paciente (numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_plan_afiliacion, foto_perfil, id_rol, estado, afiliado) VALUES
(123456789, 'Anthony', 'Stark', 'CC', '1985-02-15', 'M', '3001234567', 'juan.perez@example.com', 1, 'password1', 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq4qEkZIGH1sTKasXVrWzhUaGvUGADujNrbQ&s', 1, 'activo', TRUE),
(234567890, 'Wade', 'Wilson', 'CC', '1990-05-20', 'M', '3002345678', 'ana.garcia@example.com', 2, 'password2', 2, 'https://e.rpp-noticias.io/xlarge/2020/05/18/345934_943539.jpg', 1, 'activo', TRUE),
(345678901, 'Cristiano Ronaldo', 'dos Santos Aveiro', 'CC', '1985-02-15', 'M', '3003456789', 'luis.martinez@example.com', 3, 'password3', 3, 'https://www.buscabiografias.com/img/people/cristiano_ronaldo.jpg', 1, 'activo', TRUE),
(456789012, 'Chun', 'Li', 'CC', '1982-11-25', 'F', '3004567890', 'maria.rodriguez@example.com', 4, 'password4', NULL, 'https://www.waifu.com.mx/wp-content/uploads/elementor/thumbs/Chun-Li-Cover-q7otdgqbp6wkbza76dvjdrlqkajklkfzmepqt5hxm8.jpg', 1, 'activo', FALSE),
(567890123, 'Meguru', 'Bachira', 'TI', '2000-01-30', 'M', '3005678901', 'carlos.sanchez@example.com', 5, 'password5', NULL, 'https://images3.alphacoders.com/135/thumb-1920-1351410.png', 1, 'activo', FALSE);




-- !8 Insertar registros en la tabla Doctor --!(ROL =2)
INSERT INTO Doctor (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, id_especialidad, contraseña, foto_perfil, genero, id_rol) VALUES
('Luis', 'Álvarez', 'CC', 111111111, '3011111111', 'luis.alvarez@example.com', 1, 1, 'doc_password1', 'luis_alvarez.jpg', 'M', 2),
('Claudia', 'Torres', 'CC', 222222222, '3012222222', 'claudia.torres@example.com', 2, 2, 'doc_password2', 'claudia_torres.jpg', 'F', 2),
('Jorge', 'Córdoba', 'CC', 333333333, '3013333333', 'jorge.cordoba@example.com', 3, 3, 'doc_password3', 'jorge_cordoba.jpg', 'M', 2),
('Laura', 'Mendoza', 'CC', 444444444, '3014444444', 'laura.mendoza@example.com', 4, 4, 'doc_password4', 'laura_mendoza.jpg', 'F', 2),
('Andrés', 'Pineda', 'CC', 555555555, '3015555555', 'andres.pineda@example.com', 5, 5, 'doc_password5', 'andres_pineda.jpg', 'M', 2);


-- !9 Insertar registros en la tabla Administrativos --!(ROL =3)
INSERT INTO Administrativos (nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña) VALUES
('Carlos', 'García', 3, 'CC', 666666666, '3026666666', 'carlos.garcia@example.com', 1, 'admin_password1'),
('Marta', 'Vásquez', 3, 'CC', 777777777, '3027777777', 'marta.vasquez@example.com', 2, 'secretary_password2'),
('Diego', 'Ramírez', 3, 'CC', 888888888, '3028888888', 'diego.ramirez@example.com', 3, 'admin_password3'),
('Paola', 'Moreno', 3, 'CC', 999999999, '3029999999', 'paola.moreno@example.com', 4, 'secretary_password4'),
('Alejandro', 'Salazar', 3, 'CC', 101010101, '3021010101', 'alejandro.salazar@example.com', 5, 'admin_password5');

-- !10 Insertar registros en la tabla Secretaria --!(ROL =3)
INSERT INTO Secretaria (nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña) VALUES
('Carlos', 'García', 4, 'CC', 666666666, '3026666666', 'carlos.garcia@example.com', 1, 'admin_password1'),
('Marta', 'Vásquez', 4, 'CC', 777777777, '3027777777', 'marta.vasquez@example.com', 2, 'secretary_password2'),
('Diego', 'Ramírez', 4, 'CC', 888888888, '3028888888', 'diego.ramirez@example.com', 3, 'admin_password3'),
('Paola', 'Moreno', 4, 'CC', 999999999, '3029999999', 'paola.moreno@example.com', 4, 'secretary_password4'),
('Alejandro', 'Salazar', 4, 'CC', 101010101, '3021010101', 'alejandro.salazar@example.com', 5, 'admin_password5');


-- !11 Insertar registros en la tabla Estado
INSERT INTO Estado (nombre_estado) VALUES
('Pendiente'),
('En Progreso'),
('Completado');


-- !12 Insertar registros en la tabla Cita
INSERT INTO Cita (id_paciente, id_doctor, asignador, solicitante, tipo_solicitante, fecha, hora, tipo_cita, costo, especialidad, requiere_autorizacion, documento_autorizacion, estado)
VALUES
(123456789, 1, NULL, 123456789, 'paciente', '2024-09-15', '09:00:00', 1, 150.00, 1, FALSE, NULL, 1),
(234567890, 2, NULL, 2, 'secretaria', '2024-09-16', '10:30:00', 2, 200.00, 2, FALSE, NULL, 2),
(345678901, 3, 1, 234567890, 'paciente', '2024-09-17', '11:00:00', 3, 180.00, 3, FALSE, NULL, 1),
(456789012, 4, 2, 1, 'secretaria', '2024-09-18', '14:00:00', 1, 160.00, 1, TRUE, 'auth_doc_456.pdf', 1),
(567890123, 5, NULL, 567890123, 'paciente', '2024-09-19', '15:30:00', 2, 220.00, 2, FALSE, NULL, 1);

-- !13 Insertar registros en la tabla Autorizacion
INSERT INTO Autorizacion (id_paciente, id_doctor, asignador, tipo_cita, fecha_resolucion, fecha_procedimiento, descripcion, firma_doctor, estado)
VALUES
(123456789, 1, NULL, 1, '2024-09-02 12:00:00', '2024-09-05', 'Autorización para consulta general.', 'Dr. Carlos Rodríguez', 2),
(123456789, 2, NULL, 1, NULL, '2024-09-10', 'Autorización para chequeo de especialidad.', 'Dr. Laura Fernández', 1),
(234567890, 3, NULL, 1, NULL, '2024-09-15', 'Autorización para procedimiento de emergencia.', 'Dr. Javier Gómez', 1),
(345678901, 4, 1, 1, '2024-09-07 16:00:00', '2024-09-20', 'Consulta a domicilio para revisión postoperatoria.', 'Dra. Sofía Torres', 2),
(567890123, 5, NULL, 1, NULL, '2024-09-22', 'Control post cirugía.', 'Dr. Ricardo Muñoz', 2);

--!revisar el resto de registros

-- Insertar registros en la tabla HistorialCita para reflejar el estado actual de cada cita
INSERT INTO HistorialCita (id_cita, id_estado, fecha_cambio)
VALUES
(1, 1, '2024-09-15 09:00:00'),  -- Estado actual para id_cita = 1
(2, 2, '2024-09-16 10:30:00'),  -- Estado actual para id_cita = 2
(3, 1, '2024-09-17 11:00:00'),  -- Estado actual para id_cita = 3
(4, 1, '2024-09-18 14:00:00'),  -- Estado actual para id_cita = 4
(5, 1, '2024-09-19 15:30:00');  -- Estado actual para id_cita = 5


-- Insertar registros en la tabla Publicacion
INSERT INTO Publicacion (imagen_publicacion, titulo, contenido, fecha_publicacion)
VALUES
('img_001.jpg', 'Nueva política de seguridad', 'Se implementan nuevas medidas para mejorar la seguridad en el hospital.', '2024-09-01 10:00:00'),
('img_002.jpg', 'Actualización de horarios', 'Horarios de atención se extienden a fines de semana.', '2024-09-02 09:30:00'),
('img_003.jpg', 'Promociones en afiliaciones', 'Nuevas promociones disponibles para afiliaciones premium.', '2024-09-03 11:45:00'),
(NULL, 'Capacitación para personal médico', 'Capacitación obligatoria sobre nuevas tecnologías médicas.', '2024-09-04 15:00:00'),
('img_005.jpg', 'Aviso de mantenimiento', 'El sistema estará en mantenimiento el 10 de septiembre.', '2024-09-05 08:00:00');


-- Insertar registros en la tabla Administrativos_Publicacion
INSERT INTO Administrativos_Publicacion (id_Administrativos, id_publicacion)
VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(2, 5);

-- Insertar registros en la tabla Secretaria_Publicacion
INSERT INTO Secretaria_Publicacion (id_Secretaria, id_publicacion)
VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4),
(2, 5);



-- Insertar registros en la tabla Factura
INSERT INTO Factura (id_servicio, tipo_servicio, paciente, fecha_emision, monto_total, estado_pago, descripcion)
VALUES 
(1, 'Cita', 123456789, '2024-09-01 10:00:00', 150.00, 'Pendiente', 'Cita médica de especialidad general'),
(2, 'Cita', 234567890, '2024-09-02 11:30:00', 200.00, 'Pagado', 'Consulta de cardiología'),
(1, 'Afiliacion', 345678901, '2024-09-03 12:00:00', 180.00, 'Pendiente', 'Pago de afiliación básica anual'),
(3, 'Cita', 456789012, '2024-09-04 14:00:00', 160.00, 'Pagado', 'Examen de laboratorio'),
(2, 'Afiliacion', 567890123, '2024-09-05 15:30:00', 220.00, 'Pendiente', 'Pago de plan premium');


-- Insertar registros en la tabla Pago
INSERT INTO Pago (id_factura, fecha_pago, monto, metodo_pago)
VALUES 
(1, '2024-09-06 10:00:00', 150.00, 'Efectivo'),
(2, '2024-09-07 11:30:00', 200.00, 'Tarjeta de Crédito'),
(3, '2024-09-08 12:00:00', 180.00, 'Transferencia'),
(4, '2024-09-09 14:00:00', 160.00, 'Cheque'),
(5, '2024-09-10 15:30:00', 220.00, 'Efectivo');


-- Insertar registros en la tabla Observacion
INSERT INTO Observacion (id_cita, observacion, fecha_observacion)
VALUES 
(1, 'El paciente llegó tarde a la cita', '2024-09-01 10:30:00'),
(2, 'Se realizó un electrocardiograma durante la consulta', '2024-09-02 11:45:00'),
(3, 'Se solicitó un análisis adicional para confirmar el diagnóstico', '2024-09-03 12:15:00'),
(4, 'El paciente mostró una mejoría en la condición inicial', '2024-09-04 14:30:00'),
(5, 'La cita se reprogramó debido a problemas técnicos', '2024-09-05 15:45:00');

