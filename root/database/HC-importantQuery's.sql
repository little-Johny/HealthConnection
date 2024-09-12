-- !Estas consultas son de la tabla relaiconal `HistorialEstados`
-- Consultar todo el historial de estados
SELECT * FROM HistorialEstados;

-- Consultar el historial de estados para una cita específica
SELECT * FROM HistorialEstados
WHERE id_cita = 1;

-- Consultar el historial de estados para un estado específico
SELECT * FROM HistorialEstados
WHERE id_estado = 2;

-- Consultar el historial de estados en un rango de fechas
SELECT * FROM HistorialEstados
WHERE fecha_cambio BETWEEN '2024-09-01' AND '2024-09-30';

-- Consultar el historial de estados con detalles de la cita
SELECT h.id_historial, h.id_cita, c.fecha, e.estado, h.fecha_cambio
FROM HistorialEstados h
JOIN Cita c ON h.id_cita = c.id_cita
JOIN Estado e ON h.id_estado = e.id_estado
ORDER BY h.fecha_cambio DESC;

-- Consultar el historial de estados con detalles del paciente y doctor
SELECT h.id_historial, h.id_cita, c.fecha, e.estado, h.fecha_cambio, p.nombre AS paciente_nombre, d.nombre AS doctor_nombre
FROM HistorialEstados h
JOIN Cita c ON h.id_cita = c.id_cita
JOIN Estado e ON h.id_estado = e.id_estado
JOIN Paciente p ON c.id_paciente = p.numero_documento
JOIN Doctor d ON c.id_doctor = d.id_doctor
ORDER BY h.fecha_cambio DESC;

-- Consultar el historial de estados de citas asignadas por una secretaria
SELECT h.id_historial, h.id_cita, c.fecha, e.estado, h.fecha_cambio, s.nombre AS secretaria_nombre
FROM HistorialEstados h
JOIN Cita c ON h.id_cita = c.id_cita
JOIN Estado e ON h.id_estado = e.id_estado
JOIN Secretaria s ON c.id_secretaria = s.id_secretaria
ORDER BY h.fecha_cambio DESC;











-- ! Estas son consultas utiles para la tabla relacional`Secretaria_Publicacion`
-- Consultar todos los registros de Secretaria_Publicacion
SELECT * FROM Secretaria_Publicacion;

-- Consultar las publicaciones de una secretaria específica
SELECT * FROM Secretaria_Publicacion
WHERE id_secretaria = 1;

-- Consultar las secretarias asociadas a una publicación específica
SELECT * FROM Secretaria_Publicacion
WHERE id_publicacion = 2;

-- Insertar registros en la tabla AsignacionCita
INSERT INTO AsignacionCita (id_cita, id_secretaria, fecha_asignacion) VALUES
(1, 1, '2024-09-01 09:00:00'),
(2, 2, '2024-09-02 10:00:00'),
(3, 3, '2024-09-03 11:00:00');

-- Consultar todos los registros de AsignacionCita
SELECT * FROM AsignacionCita;

-- Consultar las citas asignadas por una secretaria específica
SELECT * FROM AsignacionCita
WHERE id_secretaria = 1;

-- Consultar las publicaciones junto con la información de las secretarias que las han creado
SELECT 
    sp.id_secretaria,
    s.nombre AS secretaria_nombre,
    s.apellido AS secretaria_apellido,
    sp.id_publicacion,
    p.titulo AS publicacion_titulo,
    p.contenido AS publicacion_contenido,
    p.fecha_publicacion
FROM Secretaria_Publicacion sp
JOIN Secretaria s ON sp.id_secretaria = s.id_secretaria
JOIN Publicacion p ON sp.id_publicacion = p.id_publicacion;


-- ! Consulta  de info completa de tabla `AsignacionCita`
-- Consultar las citas junto con la información de los pacientes, doctores y secretarias asignadas
SELECT 
    ac.id_asignacion,
    c.id_cita,
    p.nombre AS paciente_nombre,
    p.apellido AS paciente_apellido,
    d.nombre AS doctor_nombre,
    d.apellido AS doctor_apellido,
    s.nombre AS secretaria_nombre,
    s.apellido AS secretaria_apellido,
    ac.fecha_asignacion
FROM AsignacionCita ac
JOIN Cita c ON ac.id_cita = c.id_cita
JOIN Paciente p ON c.id_paciente = p.numero_documento
JOIN Doctor d ON c.id_doctor = d.id_doctor
LEFT JOIN Secretaria s ON ac.id_secretaria = s.id_secretaria;


--!Consulta de info completa de la tabla `Factura`
-- Consultar las facturas junto con la información del paciente y el servicio (cita o afiliación)
SELECT 
    f.id_factura,
    f.tipo_servicio,
    p.nombre AS paciente_nombre,
    p.apellido AS paciente_apellido,
    f.fecha_emision,
    f.monto_total,
    f.estado_pago,
    f.descripcion,
    s.nombre AS servicio_nombre
FROM Factura f
JOIN Paciente p ON f.id_paciente = p.numero_documento
LEFT JOIN (
    SELECT 
        c.id_cita AS id_servicio,
        'Cita' AS tipo_servicio,
        c.fecha AS servicio_fecha
    FROM Cita c
    UNION ALL
    SELECT 
        a.id_afiliacion AS id_servicio,
        'Afiliacion' AS tipo_servicio,
        NULL AS servicio_fecha
    FROM Afiliacion a
) s ON f.id_servicio = s.id_servicio AND f.tipo_servicio = s.tipo_servicio;







--!Consulta de info completa de la tabla `Pago`
-- Consultar los pagos junto con la información de las facturas y pacientes
SELECT 
    p.id_pago,
    p.fecha_pago,
    p.monto,
    p.metodo_pago,
    f.id_factura,
    f.fecha_emision,
    f.monto_total,
    pac.nombre AS paciente_nombre,
    pac.apellido AS paciente_apellido
FROM Pago p
JOIN Factura f ON p.id_factura = f.id_factura
JOIN Paciente pac ON f.id_paciente = pac.numero_documento;






--!Consulta de info completa de la tabla `Observacion`
-- Consultar las observaciones junto con la información de las citas y los pacientes
SELECT 
    o.id_observacion,
    o.observacion,
    o.fecha_observacion,
    c.id_cita,
    p.nombre AS paciente_nombre,
    p.apellido AS paciente_apellido,
    d.nombre AS doctor_nombre,
    d.apellido AS doctor_apellido
FROM Observacion o
JOIN Cita c ON o.id_cita = c.id_cita
JOIN Paciente p ON c.id_paciente = p.numero_documento
JOIN Doctor d ON c.id_doctor = d.id_doctor;


--!Consulta de solicitante:
SELECT 
    C.id_cita,
    C.fecha,
    C.hora,
    C.tipo_cita,
    C.costo,
    CASE 
        WHEN C.solicitante_tipo = 'paciente' THEN P.nombre
        WHEN C.solicitante_tipo = 'secretaria' THEN S.nombre
    END AS solicitante_nombre
FROM 
    Cita C
LEFT JOIN 
    Paciente P ON C.solicitante_tipo = 'paciente' AND C.solicitante_id = P.numero_documento
LEFT JOIN 
    Secretaria S ON C.solicitante_tipo = 'secretaria' AND C.solicitante_id = S.numero_documento;


-- vedr el historial medico
SELECT 
    hc.id_historial_clinico,
    c.id_cita,
    o.observacion,
    o.fecha_observacion
FROM 
    HistorialClinico hc
JOIN 
    HistorialClinico_Cita hcc ON hc.id_historial_clinico = hcc.id_historial
JOIN 
    Cita c ON hcc.id_cita = c.id_cita
JOIN 
    Observacion o ON c.id_cita = o.id_cita
WHERE 
    hc.id_paciente = 123456789;  -- Reemplaza con el número de documento del paciente


INSERT INTO HistorialClinico_Cita (id_historial, id_cita)
VALUES (1, LAST_INSERT_ID());
