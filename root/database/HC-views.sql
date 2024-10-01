DELIMITER $$

-- ! Vista para Rol
CREATE VIEW vw_rol AS
SELECT id_rol, nombre_rol
FROM Rol;

-- ! Vista para Ciudad
CREATE VIEW vw_ciudad AS
SELECT id_ciudad, nombre_ciudad
FROM Ciudad;

-- ! Vista para Direccion
CREATE VIEW vw_direccion AS
SELECT id_direccion, direccion, id_ciudad
FROM Direccion;

-- ! Vista para Especialidad
CREATE VIEW vw_especialidad AS
SELECT id_especialidad, nombre_especialidad, costo
FROM Especialidad;

-- ! Vista para TipoCita
CREATE VIEW vw_tipo_cita AS
SELECT id_tipo, nombre_tipo, costo_adicional
FROM TipoCita;

-- ! Vista para Afiliacion
CREATE VIEW vw_afiliacion AS
SELECT id_afiliacion, nombre_plan, costo, descuento, max_beneficiarios, descripcion
FROM Afiliacion;

-- ! Vista para Paciente
CREATE VIEW vw_paciente AS
SELECT numero_documento, nombre, apellido, tipo_doc, fecha_de_nacimiento, genero, telefono, email, direccion, contraseña, id_plan_afiliacion, foto_perfil, id_rol, estado, afiliado
FROM Paciente;

-- ! Vista para Doctor
CREATE VIEW vw_doctor AS
SELECT id_doctor, nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, id_especialidad, contraseña, foto_perfil, genero, id_rol
FROM Doctor;

-- ! Vista para Administrativos
CREATE VIEW vw_administrativos AS
SELECT id_Administrativos, nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña
FROM Administrativos;

-- ! Vista para Secretaria
CREATE VIEW vw_secretaria AS
SELECT id_Secretaria, nombre, apellido, id_rol, tipo_documento, numero_documento, telefono, email, direccion, contraseña
FROM Secretaria;

-- ! Vista para Estado
CREATE VIEW vw_estado AS
SELECT id_estado, nombre_estado
FROM Estado;

-- ! Vista para Cita
CREATE VIEW vw_cita AS
SELECT id_cita, id_paciente, id_doctor, asignador, solicitante, tipo_solicitante, fecha, hora, tipo_cita, costo, especialidad, requiere_autorizacion, documento_autorizacion, estado, fecha_registro
FROM Cita;

-- ! Vista para Autorizacion
CREATE VIEW vw_autorizacion AS
SELECT id_autorizacion, id_paciente, id_doctor, asignador, tipo_cita, fecha_resolucion, fecha_procedimiento, descripcion, firma_doctor, estado, fecha_registro
FROM Autorizacion;

-- ! Vista para HistorialAutorizacion
CREATE VIEW vw_historial_autorizacion AS
SELECT id_historial, id_autorizacion, id_estado, fecha_cambio
FROM HistorialAutorizacion;

-- ! Vista para HistorialCita
CREATE VIEW vw_historial_cita AS
SELECT id_historial, id_cita, id_estado, fecha_cambio
FROM HistorialCita;

-- ! Vista para HistorialClinico
CREATE VIEW vw_historial_clinico AS
SELECT id_historial_clinico, id_paciente, fecha_registro, diagnostico, tratamiento, procedimientos, observaciones, alergias
FROM HistorialClinico;

-- ! Vista para HistorialClinico_Cita
CREATE VIEW vw_historial_clinico_cita AS
SELECT id_historial, id_cita, fecha_actualizacion
FROM HistorialClinico_Cita;

-- ! Vista para Publicacion
CREATE VIEW vw_publicacion AS
SELECT id_publicacion, imagen_publicacion, titulo, contenido, fecha_publicacion
FROM Publicacion;

-- ! Vista para Administrativos_Publicacion
CREATE VIEW vw_administrativos_publicacion AS
SELECT id_Administrativos, id_publicacion
FROM Administrativos_Publicacion;

-- ! Vista para Secretaria_Publicacion
CREATE VIEW vw_secretaria_publicacion AS
SELECT id_Secretaria, id_publicacion
FROM Secretaria_Publicacion;

-- ! Vista para Factura
CREATE VIEW vw_factura AS
SELECT id_factura, id_servicio, tipo_servicio, paciente, fecha_emision, fecha_limite, monto_total, estado_pago, descripcion
FROM Factura;

-- ! Vista para Pago
CREATE VIEW vw_pago AS
SELECT id_pago, id_factura, fecha_pago, monto, metodo_pago
FROM Pago;

-- ! Vista para Observacion
CREATE VIEW vw_observacion AS
SELECT id_observacion, id_cita, observacion, fecha_observacion
FROM Observacion;

DELIMITER ;

-- !llamadas 
-- SELECT * FROM vw_rol;
-- SELECT * FROM vw_ciudad;
-- SELECT * FROM vw_direccion;
-- SELECT * FROM vw_especialidad;
-- SELECT * FROM vw_tipo_cita;
-- SELECT * FROM vw_afiliacion;
-- SELECT * FROM vw_paciente;
-- SELECT * FROM vw_doctor;
-- SELECT * FROM vw_administrativos;
-- SELECT * FROM vw_secretaria;
-- SELECT * FROM vw_estado;
-- SELECT * FROM vw_cita;
-- SELECT * FROM vw_autorizacion;
-- SELECT * FROM vw_historial_autorizacion;
-- SELECT * FROM vw_historial_cita;
-- SELECT * FROM vw_historial_clinico;
-- SELECT * FROM vw_historial_clinico_cita;
-- SELECT * FROM vw_publicacion;
-- SELECT * FROM vw_administrativos_publicacion;
-- SELECT * FROM vw_secretaria_publicacion;
-- SELECT * FROM vw_factura;
-- SELECT * FROM vw_pago;
-- SELECT * FROM vw_observacion;