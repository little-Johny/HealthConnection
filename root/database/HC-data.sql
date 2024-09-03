USE Health_connection;


-- Insertar registros en la tabla Ciudad
INSERT INTO Ciudad (nombre_ciudad) VALUES
('Bogotá'),
('Medellín' ),
('Cali');

-- Insertar registros en la tabla Especialidad
INSERT INTO Especialidad (nombre_especialidad,costo) VALUES
('Medicina General', 1000.00),
('Cardiología',2000.00),
('Pediatría',3000.00);

-- Insertar registros en la tabla Direccion
INSERT INTO Direccion (direccion, id_ciudad) VALUES
('Avenida Carrera 13 # 80-30', 1),
('Calle 10 # 20-30', 2),
('Calle 5 # 15-40', 3);

-- Insertar registros en la tabla Afiliacion
INSERT INTO Afiliacion (nombre_plan, costo, descuento, max_beneficiarios) VALUES
('Plan Básico', 100.00, 10.00, 3),
('Plan Estándar', 200.00, 15.00, 5),
('Plan Premium', 300.00, 20.00, 7);

-- Insertar registros en la tabla Paciente
INSERT INTO Paciente (numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, telefono, email, direccion, contraseña, id_afiliacion) VALUES
(123456789, 'Juan', 'Pérez', 'C.C', '1980-05-15', '3001234567', 'juan.perez@example.com', 1, 'password123', 1),
(987654321, 'Ana', 'García', 'C.C', '1990-08-22', '3007654321', 'ana.garcia@example.com', 2, 'password456', 2),
(456789123, 'Luis', 'Martínez', 'C.C', '2000-12-01', '3001122334', 'luis.martinez@example.com', 3, 'password789', 3);

-- Insertar registros en la tabla Doctor
INSERT INTO Doctor (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, id_especialidad, contraseña) VALUES
('Carlos', 'Hernández', 'C.C', '123456789', '3101234567', 'carlos.hernandez@example.com', 1, 1, 'docpassword123'),
('María', 'Lopez', 'C.C', '987654321', '3107654321', 'maria.lopez@example.com', 2, 2, 'docpassword456'),
('Jorge', 'Martínez', 'C.C', '456789123', '3101122334', 'jorge.martinez@example.com', 3, 3, 'docpassword789');

-- Insertar registros en la tabla Administrativos
INSERT INTO Administrativos (nombre, apellido,rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña) VALUES
('Laura', 'Gómez', 'Administrador','C.C', '234567890', '3201234567', 'laura.gomez@example.com', 1, 'Administrativos123'),
('Pedro', 'Rodríguez', 'Secretaria','C.C', '876543210', '3207654321', 'pedro.rodriguez@example.com', 2, 'Administrativos456'),
('Sofia', 'Ramírez', 'Administrador','C.C', '987654321', '3201122334', 'sofia.ramirez@example.com', 3, 'Administrativos789');

-- Insertar registros en la tabla CategoriaCita
INSERT INTO TipoCita (nombre_tipo, costo_adicional) VALUES
('Consulta General',500.00),
('Consulta Especializada',800.00),
('Exámenes',1000.00);

-- Insertar registros en la tabla Cita
INSERT INTO Cita (id_paciente, id_doctor, id_Administrativos, fecha, tipo_cita, costo, categoria, requiere_autorizacion) VALUES
(123456789, 4, 1, '2024-09-01 09:00:00', 'Medicina General', 50.00, 1, FALSE),
(987654321, 5, 2, '2024-09-02 10:00:00', 'Especialista', 100.00, 2, TRUE),
(456789123, 6, 3, '2024-09-03 11:00:00', 'Examen', 150.00, 3, FALSE);

-- Insertar registros en la tabla Estado
INSERT INTO Estado (estado) VALUES
('Pendiente'),
('En Progreso'),
('Completado');

-- Insertar registros en la tabla HistorialEstados
INSERT INTO HistorialEstados (id_cita, id_estado, fecha_cambio) VALUES
(4, 1, '2024-09-01 09:00:00'),
(5, 2, '2024-09-02 10:00:00'),
(6, 3, '2024-09-03 11:00:00');

-- Insertar registros en la tabla Publicacion
INSERT INTO Publicacion (titulo, contenido, fecha_publicacion) VALUES
('Bienvenida', 'Bienvenidos a nuestro sistema de gestión de citas médicas.', '2024-08-01 10:00:00'),
('Nuevo Servicio', 'Hemos agregado un nuevo servicio de telemedicina.', '2024-08-15 14:00:00'),
('Actualización', 'El horario de atención se ha modificado.', '2024-08-20 09:00:00');

-- Insertar registros en la tabla Administrativos_Publicacion
INSERT INTO Administrativos_Publicacion (id_Administrativos, id_publicacion) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insertar registros en la tabla AsignacionCita
INSERT INTO AsignacionCita (id_cita, id_Administrativos, fecha_asignacion) VALUES
(4, 1, '2024-08-01 08:00:00'),
(5, 2, '2024-08-02 09:00:00'),
(6, 3, '2024-08-03 10:00:00');

-- Insertar registros en la tabla Factura
INSERT INTO Factura (id_servicio, tipo_servicio, id_paciente, fecha_emision, monto_total, estado_pago, descripcion) VALUES
(4, 'Cita', 123456789, '2024-09-01 09:00:00', 50.00, 'Pendiente', 'Consulta general'),
(5, 'Cita', 987654321, '2024-09-02 10:00:00', 100.00, 'Pendiente', 'Consulta especializada'),
(1, 'Afiliacion', 456789123, '2024-09-03 11:00:00', 150.00, 'Pendiente', 'Exámenes médicos');

-- Insertar registros en la tabla Pago
INSERT INTO Pago (id_factura, fecha_pago, monto, metodo_pago) VALUES
(1, '2024-09-01 10:00:00', 50.00, 'Efectivo'),
(2, '2024-09-02 11:00:00', 100.00, 'Tarjeta de Crédito'),
(3, '2024-09-03 12:00:00', 150.00, 'Transferencia');

-- Insertar registros en la tabla Observacion
INSERT INTO Observacion (id_cita, observacion, fecha_observacion) VALUES
(4, 'Paciente llegó a tiempo.', '2024-09-01 09:00:00'),
(5, 'Se realizó consulta completa.', '2024-09-02 10:00:00'),
(6, 'Paciente se quejó de dolor en el brazo.', '2024-09-03 11:00:00');
