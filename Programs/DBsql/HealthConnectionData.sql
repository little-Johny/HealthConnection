
-- Tabla de Roles
INSERT INTO Rol (rol) VALUES 
('Administrador'),
('Doctor'),
('Enfermero'),
('Recepcionista'),
('Tecnico'),
('Farmaceutico'),
('Contador'),
('Gerente'),
('Limpieza'),
('Seguridad');

-- Tabla de Tipos de Documento
INSERT INTO TiposDocumento (nombre_tipo, descripcion) VALUES 
('Cédula de Ciudadanía', 'Documento de identidad colombiano'),
('Pasaporte', 'Documento internacional'),
('Cédula de Extranjería', 'Documento de identidad para extranjeros en Colombia'),
('Tarjeta de Identidad', 'Documento de identidad para menores'),
('Registro Civil', 'Documento de nacimiento'),
('DNI', 'Documento Nacional de Identidad'),
('RUT', 'Registro Único Tributario'),
('Licencia de Conducir', 'Documento para conducir vehículos'),
('Carné Militar', 'Documento de identificación militar'),
('NIT', 'Número de Identificación Tributaria');

-- Tabla de Ciudades
INSERT INTO Ciudades (nombre_ciudad, descripcion) VALUES 
('Bogotá', 'Capital de Colombia'),
('Medellín', 'Ciudad de la eterna primavera'),
('Cali', 'Capital de la salsa'),
('Barranquilla', 'Puerta de oro de Colombia'),
('Cartagena', 'Ciudad heroica'),
('Bucaramanga', 'Ciudad de los parques'),
('Pereira', 'Capital del Eje cafetero'),
('Manizales', 'Ciudad de las puertas abiertas'),
('Cúcuta', 'Ciudad fronteriza con Venezuela'),
('Santa Marta', 'Perla del Caribe');

-- Tabla de Direcciones
INSERT INTO Direcciones (direccion, id_ciudad) VALUES 
('Calle 123 #45-67', 1),
('Carrera 78 #12-34', 2),
('Avenida Siempre Viva #742', 3),
('Calle Falsa #123', 4),
('Carrera 50 #20-30', 5),
('Calle 5 #10-20', 6),
('Carrera 15 #25-35', 7),
('Calle 9 #6-10', 8),
('Carrera 11 #8-12', 9),
('Calle 10 #30-40', 10);

-- Tabla de Planes de Afiliación
INSERT INTO PlanesAfiliacion (nombre_plan, descripcion, precio) VALUES 
('Plan Básico', 'Cobertura básica', 100000),
('Plan Silver', 'Cobertura media', 200000),
('Plan Gold', 'Cobertura avanzada', 300000),
('Plan Platinum', 'Cobertura completa', 400000),
('Plan Familiar', 'Cobertura para familias', 500000),
('Plan Estudiantil', 'Cobertura para estudiantes', 80000),
('Plan Ejecutivo', 'Cobertura para ejecutivos', 450000),
('Plan Empresarial', 'Cobertura para empresas', 600000),
('Plan Preferencial', 'Cobertura con beneficios adicionales', 350000),
('Plan Jubilados', 'Cobertura para jubilados', 150000);

INSERT INTO Pacientes (documento_paciente, nombre, apellido, tipo_documento, fecha_nacimiento, sexo, telefono, email, direccion, ciudad, contraseña)
VALUES
(10001, 'Juan', 'Pérez', 1, '1985-07-15', 'Masculino', '3001234567', 'juan.perez@example.com', 1, 1, 'juan1234'),
(10002, 'Ana', 'Gómez', 2, '1990-03-22', 'Femenino', '3012345678', 'ana.gomez@example.com', 2, 2, 'ana5678'),
(10003, 'Luis', 'Martínez', 1, '1978-11-05', 'Masculino', '3023456789', 'luis.martinez@example.com', 3, 3, 'luis8765'),
(10004, 'María', 'Rodríguez', 3, '1983-09-10', 'Femenino', '3034567890', 'maria.rodriguez@example.com', 4, 4, 'maria4321'),
(10005, 'Carlos', 'Hernández', 1, '1992-12-01', 'Masculino', '3045678901', 'carlos.hernandez@example.com', 5, 5, 'carlos6789'),
(10006, 'Laura', 'Cano', 2, '1987-05-30', 'Femenino', '3056789012', 'laura.cano@example.com', 6, 6, 'laura9876'),
(10007, 'Miguel', 'Sánchez', 1, '1995-06-14', 'Masculino', '3067890123', 'miguel.sanchez@example.com', 7, 7, 'miguel5432'),
(10008, 'Isabela', 'Martínez', 3, '1998-04-21', 'Femenino', '3078901234', 'isabela.martinez@example.com', 8, 8, 'isabela6789'),
(10009, 'Andrés', 'García', 1, '1980-08-17', 'Masculino', '3089012345', 'andres.garcia@example.com', 9, 9, 'andres1234'),
(10010, 'Camila', 'Torres', 2, '1993-10-25', 'Femenino', '3090123456', 'camila.torres@example.com', 10, 10, 'camila4321');

-- Tabla de Afiliaciones
INSERT INTO Afiliaciones (documento_paciente, id_plan_afiliacion, fecha_inicio, fecha_fin, estado) VALUES 
(10001, 1, '2023-01-01', '2023-12-31', 'Activa'),
(10002, 2, '2023-02-01', NULL, 'Activa'),
(10003, 3, '2023-03-01', '2024-03-01', 'Activa'),
(10004, 4, '2023-04-01', NULL, 'Inactiva'),
(10005, 5, '2023-05-01', '2023-11-01', 'Activa'),
(10006, 6, '2023-06-01', NULL, 'Activa'),
(10007, 7, '2023-07-01', '2024-07-01', 'Activa'),
(10008, 8, '2023-08-01', NULL, 'Inactiva'),
(10009, 9, '2023-09-01', '2024-09-01', 'Activa'),
(10010, 10, '2023-10-01', NULL, 'Activa');

-- Tabla de Especialidad de Funcionarios
INSERT INTO EspecialidadFuncionarios (nombre_especialidad, descripcion) VALUES 
('Cardiología', 'Especialidad en enfermedades del corazón'),
('Pediatría', 'Especialidad en atención a niños'),
('Ginecología', 'Especialidad en salud femenina'),
('Dermatología', 'Especialidad en piel y tejidos'),
('Neurología', 'Especialidad en sistema nervioso'),
('Oftalmología', 'Especialidad en salud visual'),
('Psiquiatría', 'Especialidad en salud mental'),
('Ortopedia', 'Especialidad en sistema musculoesquelético'),
('Urología', 'Especialidad en sistema urinario'),
('Endocrinología', 'Especialidad en sistema endocrino');

-- Tabla de Funcionarios
INSERT INTO Funcionarios (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, ciudad, especialidad, rol, contraseña) VALUES 
('Miguel', 'Álvarez', 1, '1234567890', '3001234567', 'miguel.alvarez@mail.com', 1, 'Bogotá', 1, 2, 'abcd'),
('Paula', 'Mora', 2, '0987654321', '3002345678', 'paula.mora@mail.com', 2, 'Medellín', 2, 3, 'abcd'),
('Fernando', 'Cruz', 3, '1122334455', '3003456789', 'fernando.cruz@mail.com', 3, 'Cali', 3, 2, 'abcd'),
('Claudia', 'Ortiz', 4, '2233445566', '3004567890', 'claudia.ortiz@mail.com', 4, 'Barranquilla', 4, 3, 'abcd'),
('Ricardo', 'Gutiérrez', 5, '3344556677', '3005678901', 'ricardo.gutierrez@mail.com', 5, 'Cartagena', 5, 2, 'abcd'),
('Diana', 'Sánchez', 6, '4455667788', '3006789012', 'diana.sanchez@mail.com', 6, 'Bucaramanga', 6, 3, 'abcd'),
('Jorge', 'López', 7, '5566778899', '3007890123', 'jorge.lopez@mail.com', 7, 'Pereira', 7, 2, 'abcd'),
('Mariana', 'Rojas', 8, '6677889900', '3008901234', 'mariana.rojas@mail.com', 8, 'Manizales', 8, 3, 'abcd'),
('Luis', 'Gómez', 9, '7788990011', '3009012345', 'luis.gomez@mail.com', 9, 'Cúcuta', 9, 2, 'abcd'),
('Sara', 'Martínez', 10, '8899001122', '3000123456', 'sara.martinez@mail.com', 10, 'Santa Marta', 10, 3, 'abcd');

-- Tabla de Tipos de Servicios
INSERT INTO TiposServicios (nombre_tipo, descripcion) VALUES 
('Consulta General', 'Servicio de consulta médica general'),
('Consulta Especializada', 'Servicio de consulta con especialistas'),
('Examen de Laboratorio', 'Servicio de análisis y exámenes de laboratorio'),
('Cirugía Menor', 'Procedimientos quirúrgicos menores'),
('Cirugía Mayor', 'Procedimientos quirúrgicos mayores'),
('Terapia Física', 'Servicio de rehabilitación física'),
('Imagenología', 'Servicio de diagnóstico por imágenes'),
('Psicología', 'Servicio de atención psicológica'),
('Odontología', 'Servicio de atención dental'),
('Oftalmología', 'Servicio de atención visual');

-- Tabla de Categorías de Citas
INSERT INTO CategoriasCitas (nombre_categoria, descripcion) VALUES 
('Consulta Médica', 'Cita para consultas generales'),
('Chequeo Preventivo', 'Cita para revisiones de salud'),
('Seguimiento', 'Cita para seguimiento de tratamientos'),
('Vacunación', 'Cita para aplicación de vacunas'),
('Atención Especializada', 'Cita con especialistas médicos'),
('Psicología', 'Cita para atención psicológica'),
('Odontología', 'Cita para atención dental'),
('Control Prenatal', 'Cita para mujeres embarazadas'),
('Nutrición', 'Cita para asesoría nutricional'),
('Terapia Física', 'Cita para rehabilitación física');

-- Tabla de Categorías de Exámenes
INSERT INTO CategoriasExamenes (nombre_categoria, descripcion) VALUES 
('Laboratorio Clínico', 'Exámenes de laboratorio estándar'),
('Imagenología', 'Exámenes de diagnóstico por imágenes'),
('Genética', 'Exámenes de análisis genético'),
('Hematología', 'Exámenes relacionados con la sangre'),
('Microbiología', 'Exámenes para identificar microorganismos'),
('Endocrinología', 'Exámenes relacionados con el sistema endocrino'),
('Inmunología', 'Exámenes del sistema inmunológico'),
('Toxicología', 'Exámenes para detectar sustancias tóxicas'),
('Patología', 'Exámenes de tejidos y órganos'),
('Bacteriología', 'Exámenes para identificar bacterias');

-- Tabla de Exámenes
INSERT INTO Examenes (documento_paciente, id_funcionario, fecha_examen, resultado, id_categoria_examen, id_tipo_servicio) VALUES 
(10001, 1, '2023-01-01 09:00:00', 'Normal', 1, 1),
(10002, 2, '2023-02-01 10:00:00', 'Anormal', 2, 2),
(10003, 3, '2023-03-01 11:00:00', 'Normal', 3, 3),
(10004, 4, '2023-04-01 12:00:00', 'Anormal', 4, 4),
(10005, 5, '2023-05-01 13:00:00', 'Normal', 5, 5),
(10006, 6, '2023-06-01 14:00:00', 'Anormal', 6, 6),
(10007, 7, '2023-07-01 15:00:00', 'Normal', 7, 7),
(10008, 8, '2023-08-01 16:00:00', 'Anormal', 8, 8),
(10009, 9, '2023-09-01 17:00:00', 'Normal', 9, 9),
(10010, 10, '2023-10-01 18:00:00', 'Anormal', 10, 10);

-- Tabla de Citas
INSERT INTO Citas (documento_paciente, id_funcionario, fecha_cita, estado, id_categoria_cita, id_tipo_servicio, notificaciones) VALUES 
(10001, 1, '2023-01-02 09:00:00', 'Pendiente', 1, 1, true),
(10002, 2, '2023-02-02 10:00:00', 'Confirmada', 2, 2, true),
(10003, 3, '2023-03-02 11:00:00', 'Cancelada', 3, 3, true),
(10004, 4, '2023-04-02 12:00:00', 'Completada', 4, 4, false),
(10005, 5, '2023-05-02 13:00:00', 'Pendiente', 5, 5, true),
(10006, 6, '2023-06-02 14:00:00', 'Confirmada', 6, 6, true),
(10007, 7, '2023-07-02 15:00:00', 'Cancelada', 7, 7, true),
(10008, 8, '2023-08-02 16:00:00', 'Completada', 8, 8, false),
(10009, 9, '2023-09-02 17:00:00', 'Pendiente', 9, 9, true),
(10010, 10, '2023-10-02 18:00:00', 'Confirmada', 10, 10, true);

-- Tabla de Pagos
INSERT INTO Pagos (documento_paciente, id_cita, id_examen, id_afiliacion, monto, fecha_pago, descripcion, tipo_servicio) VALUES 
(10001, 1, 1, 1, 100000, '2023-01-02 10:00:00', 'Pago por consulta general', 1),
(10002, 2, 2, 2, 200000, '2023-02-02 11:00:00', 'Pago por consulta especializada', 2),
(10003, 3, 3, 3, 300000, '2023-03-02 12:00:00', 'Pago por examen de laboratorio', 3),
(10004, 4, 4, 4, 400000, '2023-04-02 13:00:00', 'Pago por cirugía menor', 4),
(10005, 5, 5, 5, 500000, '2023-05-02 14:00:00', 'Pago por cirugía mayor', 5),
(10006, 6, 6, 6, 600000, '2023-06-02 15:00:00', 'Pago por terapia física', 6),
(10007, 7, 7, 7, 700000, '2023-07-02 16:00:00', 'Pago por imagenología', 7),
(10008, 8, 8, 8, 800000, '2023-08-02 17:00:00', 'Pago por psicología', 8),
(10009, 9, 9, 9, 900000, '2023-09-02 18:00:00', 'Pago por odontología', 9),
(10010, 10, 10, 10, 1000000, '2023-10-02 19:00:00', 'Pago por oftalmología', 10);

-- Tabla de Publicaciones
INSERT INTO Publicaciones (titulo, contenido, imagen, fecha_publicacion, autor) VALUES 
('Cómo prevenir enfermedades cardíacas', 'Contenido sobre prevención de enfermedades cardíacas...', 'imagen1.jpg', '2023-01-01 09:00:00', 1),
('Cuidado infantil en casa', 'Contenido sobre el cuidado infantil...', 'imagen2.jpg', '2023-02-01 10:00:00', 2),
('Salud femenina: Consejos básicos', 'Contenido sobre salud femenina...', 'imagen3.jpg', '2023-03-01 11:00:00', 3),
('Cuidado de la piel en verano', 'Contenido sobre cuidado de la piel...', 'imagen4.jpg', '2023-04-01 12:00:00', 4),
('Cómo mantener una buena salud mental', 'Contenido sobre salud mental...', 'imagen5.jpg', '2023-05-01 13:00:00', 5),
('Prevención de enfermedades visuales', 'Contenido sobre prevención visual...', 'imagen6.jpg', '2023-06-01 14:00:00', 6),
('Rehabilitación post-operatoria', 'Contenido sobre rehabilitación...', 'imagen7.jpg', '2023-07-01 15:00:00', 7),
('Consejos de nutrición', 'Contenido sobre nutrición...', 'imagen8.jpg', '2023-08-01 16:00:00', 8),
('Cuidados durante el embarazo', 'Contenido sobre cuidados durante el embarazo...', 'imagen9.jpg', '2023-09-01 17:00:00', 9),
('Prevención de enfermedades respiratorias', 'Contenido sobre prevención de enfermedades respiratorias...', 'imagen10.jpg', '2023-10-01 18:00:00', 10);

-- Tabla de Agenda de Doctores
INSERT INTO AgendaDoctor (id_funcionario, fecha, hora_inicio, hora_fin, disponible) VALUES 
(1, '2023-01-01', '09:00:00', '17:00:00', true),
(2, '2023-02-01', '09:00:00', '17:00:00', true),
(3, '2023-03-01', '09:00:00', '17:00:00', true),
(4, '2023-04-01', '09:00:00', '17:00:00', true),
(5, '2023-05-01', '09:00:00', '17:00:00', true),
(6, '2023-06-01', '09:00:00', '17:00:00', true),
(7, '2023-07-01', '09:00:00', '17:00:00', true),
(8, '2023-08-01', '09:00:00', '17:00:00', true),
(9, '2023-09-01', '09:00:00', '17:00:00', true),
(10, '2023-10-01', '09:00:00', '17:00:00', true);
