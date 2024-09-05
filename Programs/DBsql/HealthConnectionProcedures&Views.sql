-- PROCEDIMIENTOS ALMACENADOS

DELIMITER //
-- Procedimiento para insertar un Rol
CREATE PROCEDURE SP_InsertarRol(
    IN p_rol VARCHAR(30)
    )
BEGIN
    INSERT INTO Rol (rol) 
    VALUES (p_rol);
END //

-- Procedimiento para actualizar un Rol
CREATE PROCEDURE SP_ActualizarRol(
    IN p_id_rol INT, 
    IN p_rol VARCHAR(30)
    )
BEGIN
    UPDATE Rol 
    SET rol = p_rol 
    WHERE id_rol = p_id_rol;
END //

-- Procedimiento para eliminar un Rol
CREATE PROCEDURE SP_EliminarRol(
    IN p_id_rol INT
    )
BEGIN
    DELETE FROM Rol 
    WHERE id_rol = p_id_rol;
END //

-- Procedimiento para consultar Roles con filtro
CREATE PROCEDURE SP_ConsultarRol(
    IN p_rol VARCHAR(30)
    )
BEGIN
    SELECT * FROM Rol 
    WHERE rol LIKE CONCAT('%', p_rol, '%');
END //

-- Procedimiento para insertar un Tipo de Documento
CREATE PROCEDURE Insertar_TipoDocumento(
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO TiposDocumento (nombre_tipo, descripcion) 
    VALUES (p_nombre_tipo, p_descripcion);
END //

-- Procedimiento para actualizar un Tipo de Documento
CREATE PROCEDURE SP_ActualizarTipoDocumento(
    IN p_id_tipo_documento INT, 
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE TiposDocumento 
    SET nombre_tipo = p_nombre_tipo, 
        descripcion = p_descripcion 
    WHERE id_tipo_documento = p_id_tipo_documento;
END //

-- Procedimiento para eliminar un Tipo de Documento
CREATE PROCEDURE SP_EliminarTipoDocumento(
    IN p_id_tipo_documento INT
    )
BEGIN
    DELETE FROM TiposDocumento 
    WHERE id_tipo_documento = p_id_tipo_documento;
END //

-- Procedimiento para consultar Tipos de Documento con filtro
CREATE PROCEDURE SP_ConsultarTipoDocumento(
    IN p_nombre_tipo VARCHAR(50)
    )
BEGIN
    SELECT * FROM TiposDocumento 
    WHERE nombre_tipo LIKE CONCAT('%', p_nombre_tipo, '%');
END //

-- Procedimiento para insertar una Ciudad
CREATE PROCEDURE SP_InsertarCiudad(
    IN p_nombre_ciudad VARCHAR(100), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO Ciudad (nombre_ciudad, descripcion) 
    VALUES (p_nombre_ciudad, p_descripcion);
END //

-- Procedimiento para actualizar una Ciudad
CREATE PROCEDURE SP_ActualizarCiudad(
    IN p_id_ciudad INT, 
    IN p_nombre_ciudad VARCHAR(100), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE Ciudad 
    SET nombre_ciudad = p_nombre_ciudad, 
        descripcion = p_descripcion 
    WHERE id_ciudad = p_id_ciudad;
END //

-- Procedimiento para eliminar una Ciudad
CREATE PROCEDURE SP_EliminarCiudad(
    IN p_id_ciudad INT
    )
BEGIN
    DELETE FROM Ciudad
    WHERE id_ciudad = p_id_ciudad;
END //

-- Procedimiento para consultar Ciudad con filtro
CREATE PROCEDURE SP_ConsultarCiudad(
    IN p_nombre_ciudad VARCHAR(100)
    )
BEGIN
    SELECT * FROM Ciudad 
    WHERE nombre_ciudad LIKE CONCAT('%', p_nombre_ciudad, '%');
END //


-- Procedimiento para insertar una Dirección
CREATE PROCEDURE SP_InsertarDireccion(
    IN p_direccion VARCHAR(200), 
    IN p_id_ciudad INT
    )
BEGIN
    INSERT INTO Direccion (direccion, id_ciudad) 
    VALUES (p_direccion, p_id_ciudad);
END //

-- Procedimiento para actualizar una Dirección
CREATE PROCEDURE SP_ActualizarDireccion(
    IN p_id_direccion INT, 
    IN p_direccion VARCHAR(200), 
    IN p_id_ciudad INT
    )
BEGIN
    UPDATE Direccion 
    SET direccion = p_direccion, 
        id_ciudad = p_id_ciudad 
    WHERE id_direccion = p_id_direccion;
END //

-- Procedimiento para eliminar una Dirección
CREATE PROCEDURE SP_EliminarDireccion(
    IN p_id_direccion INT
    )
BEGIN
    DELETE FROM Direccion 
    WHERE id_direccion = p_id_direccion;
END //

-- Procedimiento para consultar Direccion con filtro
CREATE PROCEDURE SP_ConsultarDireccion(
    IN p_direccion VARCHAR(200)
    )
BEGIN
    SELECT * FROM Direccion 
    WHERE direccion LIKE CONCAT('%', p_direccion, '%');
END //

-- Procedimiento para insertar un Plan de Afiliación
CREATE PROCEDURE SP_InsertarPlanAfiliacion(
    IN p_nombre_plan VARCHAR(50), 
    IN p_descripcion VARCHAR(50), 
    IN p_precio DECIMAL(10,2)
    )
BEGIN
    INSERT INTO PlanesAfiliacion (nombre_plan, descripcion, precio) 
    VALUES (p_nombre_plan, p_descripcion, p_precio);
END //

-- Procedimiento para actualizar un Plan de Afiliación
CREATE PROCEDURE SP_ActualizarPlanAfiliacion(
    IN p_id_plan_afiliacion INT, 
    IN p_nombre_plan VARCHAR(50), 
    IN p_descripcion VARCHAR(50), 
    IN p_precio DECIMAL(10,2)
    )
BEGIN
    UPDATE PlanesAfiliacion 
    SET nombre_plan = p_nombre_plan, 
        descripcion = p_descripcion, 
        precio = p_precio 
    WHERE id_plan_afiliacion = p_id_plan_afiliacion;
END //

-- Procedimiento para eliminar un Plan de Afiliación
CREATE PROCEDURE SP_EliminarPlanAfiliacion(
    IN p_id_plan_afiliacion INT
    )
BEGIN
    DELETE FROM PlanesAfiliacion 
    WHERE id_plan_afiliacion = p_id_plan_afiliacion;
END //

-- Procedimiento para consultar Planes de Afiliación con filtro
CREATE PROCEDURE SP_ConsultarPlanAfiliacion(
    IN p_nombre_plan VARCHAR(50)
    )
BEGIN
    SELECT * FROM PlanesAfiliacion 
    WHERE nombre_plan LIKE CONCAT('%', p_nombre_plan, '%');
END //

-- Procedimiento para insertar un Paciente
CREATE PROCEDURE SP_InsertarPaciente(
    IN p_nombre VARCHAR(100), 
    IN p_apellido VARCHAR(100), 
    IN p_tipo_documento INT, 
    IN p_fecha_nacimiento DATE, 
    IN p_sexo ENUM('Masculino', 'Femenino', 'Otro'), 
    IN p_telefono VARCHAR(20), 
    IN p_email VARCHAR(100), 
    IN p_direccion INT, 
    IN p_ciudad INT, 
    IN p_contraseña VARCHAR(100)
)
BEGIN
    INSERT INTO Paciente (nombre, apellido, tipo_documento, fecha_nacimiento, sexo, telefono, email, direccion, ciudad, contraseña) 
    VALUES (p_nombre, p_apellido, p_tipo_documento, p_fecha_nacimiento, p_sexo, p_telefono, p_email, p_direccion, p_ciudad, p_contraseña);
END //

-- Procedimiento para actualizar un Paciente
CREATE PROCEDURE SP_ActualizarPaciente(
    IN p_documento_paciente INT,
    IN p_nombre VARCHAR(100), 
    IN p_apellido VARCHAR(100), 
    IN p_tipo_documento INT, 
    IN p_fecha_nacimiento DATE, 
    IN p_sexo ENUM('Masculino', 'Femenino', 'Otro'), 
    IN p_telefono VARCHAR(20), 
    IN p_email VARCHAR(100), 
    IN p_direccion INT, 
    IN p_ciudad VARCHAR(100), 
    IN p_contraseña VARCHAR(100)
)
BEGIN
    UPDATE Paciente 
    SET nombre = p_nombre, apellido = p_apellido, 
        tipo_documento = p_tipo_documento, 
        fecha_nacimiento = p_fecha_nacimiento, 
        sexo = p_sexo, 
        telefono = p_telefono, 
        email = p_email, 
        direccion = p_direccion, 
        ciudad = p_ciudad, 
        contraseña = p_contraseña
    WHERE documento_paciente = p_documento_paciente;
END //

-- Procedimiento para eliminar un Paciente
CREATE PROCEDURE SP_EliminarPaciente(
    IN p_documento_paciente INT
    )
BEGIN
    DELETE FROM Paciente 
    WHERE documento_paciente = p_documento_paciente;
END //

-- Procedimiento para consultar Paciente con filtro
CREATE PROCEDURE SP_ConsultarPaciente(
    IN p_nombre VARCHAR(100)
    )
BEGIN
    SELECT * FROM Paciente 
    WHERE nombre LIKE CONCAT('%', p_nombre, '%');
END //
-- Procedimiento para insertar una Afiliación
CREATE PROCEDURE SP_InsertarAfiliacion(
    IN p_documento_paciente INT,
    IN p_id_plan_afiliacion INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_estado ENUM('Activa', 'Inactiva')
)
BEGIN
    INSERT INTO Afiliacion (documento_paciente, id_plan_afiliacion, fecha_inicio, fecha_fin, estado) 
    VALUES (p_documento_paciente, p_id_plan_afiliacion, p_fecha_inicio, p_fecha_fin, p_estado);
END //

-- Procedimiento para actualizar una Afiliación
CREATE PROCEDURE SP_ActualizarAfiliacion(
    IN p_id_afiliacion INT,
    IN p_documento_paciente INT,
    IN p_id_plan_afiliacion INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_estado ENUM('Activa', 'Inactiva')
)
BEGIN
    UPDATE Afiliacion 
    SET documento_paciente = p_documento_paciente, 
        id_plan_afiliacion = p_id_plan_afiliacion, 
        fecha_inicio = p_fecha_inicio, 
        fecha_fin = p_fecha_fin, 
        estado = p_estado
    WHERE id_afiliacion = p_id_afiliacion;
END //

-- Procedimiento para eliminar una Afiliación
CREATE PROCEDURE SP_EliminarAfiliacion(
    IN p_id_afiliacion INT
    )
BEGIN
    DELETE FROM Afiliacion 
    WHERE id_afiliacion = p_id_afiliacion;
END //

-- Procedimiento para consultar Afiliacion con filtro
CREATE PROCEDURE SP_ConsultarAfiliacion(
    IN p_documento_paciente INT
    )
BEGIN
    SELECT * FROM Afiliacion 
    WHERE documento_paciente = p_documento_paciente;
END //

-- Procedimiento para insertar una Especialidad de Funcionario
CREATE PROCEDURE SP_InsertarEspecialidadFuncionario(
    IN p_nombre_especialidad VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO EspecialidadFuncionario (nombre_especialidad, descripcion) 
    VALUES (p_nombre_especialidad, p_descripcion);
END //

-- Procedimiento para actualizar una Especialidad de Funcionario
CREATE PROCEDURE SP_ActualizarEspecialidadFuncionario(
    IN p_id_especialidad INT, 
    IN p_nombre_especialidad VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE EspecialidadFuncionario 
    SET nombre_especialidad = p_nombre_especialidad, 
        descripcion = p_descripcion 
    WHERE id_especialidad = p_id_especialidad;
END //

-- Procedimiento para eliminar una Especialidad de Funcionario
CREATE PROCEDURE SP_EliminarEspecialidadFuncionario(
    IN p_id_especialidad INT
    )
BEGIN
    DELETE FROM EspecialidadFuncionario 
    WHERE id_especialidad = p_id_especialidad;
END //

-- Procedimiento para consultar Especialidades de Funcionario con filtro
CREATE PROCEDURE SP_ConsultarEspecialidadFuncionario(
    IN p_nombre_especialidad VARCHAR(50)
    )
BEGIN
    SELECT * FROM EspecialidadFuncionario 
    WHERE nombre_especialidad LIKE CONCAT('%', p_nombre_especialidad, '%');
END //

-- Procedimiento para insertar un Funcionario
CREATE PROCEDURE SP_InsertarFuncionario(
    IN p_nombre VARCHAR(100), 
    IN p_apellido VARCHAR(100), 
    IN p_tipo_documento INT, 
    IN p_numero_documento VARCHAR(20), 
    IN p_telefono VARCHAR(20), 
    IN p_email VARCHAR(100), 
    IN p_direccion INT, 
    IN p_ciudad VARCHAR(100), 
    IN p_especialidad INT, 
    IN p_rol INT, 
    IN p_contraseña VARCHAR(100)
)
BEGIN
    INSERT INTO Funcionario (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, ciudad, especialidad, rol, contraseña) 
    VALUES (p_nombre, p_apellido, p_tipo_documento, p_numero_documento, p_telefono, p_email, p_direccion, p_ciudad, p_especialidad, p_rol, p_contraseña);
END //

-- Procedimiento para actualizar un Funcionario
CREATE PROCEDURE SP_ActualizarFuncionario(
    IN p_id_funcionario INT,
    IN p_nombre VARCHAR(100), 
    IN p_apellido VARCHAR(100), 
    IN p_tipo_documento INT, 
    IN p_numero_documento VARCHAR(20), 
    IN p_telefono VARCHAR(20), 
    IN p_email VARCHAR(100), 
    IN p_direccion INT, 
    IN p_ciudad VARCHAR(100), 
    IN p_especialidad INT, 
    IN p_rol INT, 
    IN p_contraseña VARCHAR(100)
)
BEGIN
    UPDATE Funcionario 
    SET nombre = p_nombre, 
        apellido = p_apellido, 
        tipo_documento = p_tipo_documento, 
        numero_documento = p_numero_documento, 
        telefono = p_telefono, email = p_email, 
        direccion = p_direccion, 
        ciudad = p_ciudad, 
        especialidad = p_especialidad,
        rol = p_rol, 
        contraseña = p_contraseña
    WHERE id_funcionario = p_id_funcionario;
END //

-- Procedimiento para eliminar un Funcionario
CREATE PROCEDURE SP_EliminarFuncionario(
    IN p_id_funcionario INT
    )
BEGIN
    DELETE FROM Funcionario 
    WHERE id_funcionario = p_id_funcionario;
END //

-- Procedimiento para consultar Funcionario con filtro
CREATE PROCEDURE SP_ConsultarFuncionario(
    IN p_nombre VARCHAR(100)
    )
BEGIN
    SELECT * FROM Funcionario 
    WHERE nombre LIKE CONCAT('%', p_nombre, '%');
END //

-- Procedimiento para insertar un Tipo de Servicio
CREATE PROCEDURE SP_InsertarTipoServicio(
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO TipoServicio (nombre_tipo, descripcion) 
    VALUES (p_nombre_tipo, p_descripcion);
END //

-- Procedimiento para actualizar un Tipo de Servicio
CREATE PROCEDURE SP_ActualizarTipoServicio(
    IN p_id_tipo_servicio INT, 
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE TipoServicio 
    SET nombre_tipo = p_nombre_tipo, 
        descripcion = p_descripcion 
    WHERE id_tipo_servicio = p_id_tipo_servicio;
END //

-- Procedimiento para eliminar un Tipo de Servicio
CREATE PROCEDURE SP_EliminarTipoServicio(
    IN p_id_tipo_servicio INT
    )
BEGIN
    DELETE FROM TipoServicio 
    WHERE id_tipo_servicio = p_id_tipo_servicio;
END //

-- Procedimiento para consultar Tipos de Servicio con filtro
CREATE PROCEDURE SP_ConsultarTipoServicio(
    IN p_nombre_tipo VARCHAR(50)
    )
BEGIN
    SELECT * FROM TipoServicio 
    WHERE nombre_tipo LIKE CONCAT('%', p_nombre_tipo, '%');
END //

-- Procedimiento para insertar una Categoría de Cita
CREATE PROCEDURE SP_InsertarCategoriaCita(
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO CategoriaCita (nombre_categoria, descripcion) 
    VALUES (p_nombre_categoria, p_descripcion);
END //

-- Procedimiento para actualizar una Categoría de Cita
CREATE PROCEDURE SP_ActualizarCategoriaCita(
    IN p_id_categoria_cita INT, 
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE CategoriaCita 
    SET nombre_categoria = p_nombre_categoria, 
        descripcion = p_descripcion 
    WHERE id_categoria_cita = p_id_categoria_cita;
END //

-- Procedimiento para eliminar una Categoría de Cita
CREATE PROCEDURE SP_EliminarCategoriaCita(
    IN p_id_categoria_cita INT
    )
BEGIN
    DELETE FROM CategoriaCita 
    WHERE id_categoria_cita = p_id_categoria_cita;
END //

-- Procedimiento para consultar Categorías de Cita con filtro
CREATE PROCEDURE SP_ConsultarCategoriaCita(
    IN p_nombre_categoria VARCHAR(50)
    )
BEGIN
    SELECT * FROM CategoriaCita 
    WHERE nombre_categoria LIKE CONCAT('%', p_nombre_categoria, '%');
END //

-- Procedimiento para insertar una Categoría de Examen
CREATE PROCEDURE SP_InsertarCategoriaExamen(
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO CategoriasExamen (nombre_categoria, descripcion) 
    VALUES (p_nombre_categoria, p_descripcion);
END //

-- Procedimiento para actualizar una Categoría de Examen
CREATE PROCEDURE SP_ActualizarCategoriaExamen(
    IN p_id_categoria_examen INT, 
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE CategoriasExamen 
    SET nombre_categoria = p_nombre_categoria, 
        descripcion = p_descripcion 
    WHERE id_categoria_examen = p_id_categoria_examen;
END //

-- Procedimiento para eliminar una Categoría de Examen
CREATE PROCEDURE SP_EliminarCategoriaExamen(
    IN p_id_categoria_examen INT
    )
BEGIN
    DELETE FROM CategoriasExamen 
    WHERE id_categoria_examen = p_id_categoria_examen;
END //

-- Procedimiento para consultar Categorías de Examen con filtro
CREATE PROCEDURE SP_ConsultarCategoriaExamen(
    IN p_nombre_categoria VARCHAR(50)
    )
BEGIN
    SELECT * FROM CategoriasExamen 
    WHERE nombre_categoria LIKE CONCAT('%', p_nombre_categoria, '%');
END //

-- Procedimiento para insertar un Examen
CREATE PROCEDURE SP_InsertarExamen(
    IN p_documento_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_examen DATETIME, 
    IN p_resultado VARCHAR(250), 
    IN p_id_categoria_examen INT, 
    IN p_id_tipo_servicio INT
)
BEGIN
    INSERT INTO Examen (documento_paciente, id_funcionario, fecha_examen, resultado, id_categoria_examen, id_tipo_servicio) 
    VALUES (p_documento_paciente, p_id_funcionario, p_fecha_examen, p_resultado, p_id_categoria_examen, p_id_tipo_servicio);
END //

-- Procedimiento para actualizar un Examen
CREATE PROCEDURE SP_ActualizarExamen(
    IN p_id_examen INT, 
    IN p_documento_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_examen DATETIME, 
    IN p_resultado VARCHAR(250), 
    IN p_id_categoria_examen INT, 
    IN p_id_tipo_servicio INT
)
BEGIN
    UPDATE Examen 
    SET documento_paciente = p_documento_paciente, 
        id_funcionario = p_id_funcionario, 
        fecha_examen = p_fecha_examen, 
        resultado = p_resultado, 
        id_categoria_examen = p_id_categoria_examen, 
        id_tipo_servicio = p_id_tipo_servicio
    WHERE id_examen = p_id_examen;
END //

-- Procedimiento para eliminar un Examen
CREATE PROCEDURE SP_EliminarExamen(
    IN p_id_examen INT
    )
BEGIN
    DELETE FROM Examen 
    WHERE id_examen = p_id_examen;
END //

-- Procedimiento para consultar Exámenes con filtro
CREATE PROCEDURE SP_ConsultarExamen(
    IN p_documento_paciente INT
    )
BEGIN
    SELECT * FROM Examen 
    WHERE documento_paciente = p_documento_paciente;
END //

-- Procedimiento para insertar un registro en la tabla EstadosDeCita
DELIMITER $$
CREATE PROCEDURE SP_InsertarEstadoCita (
    IN p_descripcion VARCHAR(100),
    IN p_fecha_registro TIMESTAMP
)
BEGIN
    INSERT INTO EstadosDeCita (descripcion, fecha_registro)
    VALUES (p_descripcion, p_fecha_registro);
END$$
DELIMITER ;

-- Procedimiento para actualizar un registro en la tabla EstadosDeCita
DELIMITER $$
CREATE PROCEDURE SP_ActualizarEstadoCita (
    IN p_id_estado INT,
    IN p_descripcion VARCHAR(100),
    IN p_fecha_registro TIMESTAMP
)
BEGIN
    UPDATE EstadosDeCita
    SET descripcion = p_descripcion, fecha_registro = p_fecha_registro
    WHERE id_estado = p_id_estado;
END$$
DELIMITER ;

-- Procedimiento para borrar un registro en la tabla EstadosDeCita
DELIMITER $$
CREATE PROCEDURE SP_BorrarEstadoCita (
    IN p_id_estado INT
)
BEGIN
    DELETE FROM EstadosDeCita
    WHERE id_estado = p_id_estado;
END$$
DELIMITER ;

-- Procedimiento para consultar registros con un filtro en la tabla EstadosDeCita
DELIMITER $$
CREATE PROCEDURE SP_ConsultarEstadosCita (
    IN p_descripcion VARCHAR(100)
)
BEGIN
    SELECT * FROM EstadosDeCita
    WHERE descripcion LIKE CONCAT('%', p_descripcion, '%');
END$$
DELIMITER ;


-- Procedimiento para insertar una Cita
CREATE PROCEDURE SP_InsertarCita(
    IN p_documento_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_cita DATETIME, 
    IN p_estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada'), 
    IN p_id_categoria_cita INT, 
    IN p_id_tipo_servicio INT,
    IN p_notificacion BOOLEAN
)
BEGIN
    INSERT INTO Cita (documento_paciente, id_funcionario, fecha_cita, estado, id_categoria_cita, id_tipo_servicio, notificacion) 
    VALUES (p_documento_paciente, p_id_funcionario, p_fecha_cita, p_estado, p_id_categoria_cita, p_id_tipo_servicio, p_notificacion);
END //

-- Procedimiento para actualizar una Cita
CREATE PROCEDURE SP_ActualizarCita(
    IN p_id_cita INT,
    IN p_documento_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_cita DATETIME, 
    IN p_estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada'), 
    IN p_id_categoria_cita INT, 
    IN p_id_tipo_servicio INT,
    IN p_notificacion BOOLEAN
)
BEGIN
    UPDATE Cita 
    SET documento_paciente = p_documento_paciente, 
        id_funcionario = p_id_funcionario, 
        fecha_cita = p_fecha_cita, 
        estado = p_estado, 
        id_categoria_cita = p_id_categoria_cita, 
        id_tipo_servicio = p_id_tipo_servicio, 
        notificacion = p_notificacion
    WHERE id_cita = p_id_cita;
END //

-- Procedimiento para eliminar una Cita
CREATE PROCEDURE SP_EliminarCita(
    IN p_id_cita INT
    )
BEGIN
    DELETE FROM Cita 
    WHERE id_cita = p_id_cita;
END //

-- Procedimiento para consultar Cita con filtro
CREATE PROCEDURE SP_ConsultarCita(
    IN p_documento_paciente INT
    )
BEGIN
    SELECT * FROM Cita 
    WHERE documento_paciente = p_documento_paciente;
END //

-- Procedimiento para insertar un Pago
CREATE PROCEDURE SP_InsertarPago(
    IN p_documento_paciente INT, 
    IN p_id_cita INT, 
    IN p_id_examen INT, 
    IN p_id_afiliacion INT, 
    IN p_monto DECIMAL(10,2), 
    IN p_fecha_pago DATETIME, 
    IN p_descripcion VARCHAR(50),
    IN p_tipo_servicio INT
)
BEGIN
    INSERT INTO Pago (documento_paciente, id_cita, id_examen, id_afiliacion, monto, fecha_pago, descripcion, tipo_servicio) 
    VALUES (p_documento_paciente, p_id_cita, p_id_examen, p_id_afiliacion, p_monto, p_fecha_pago, p_descripcion, p_tipo_servicio);
END //

-- Procedimiento para actualizar un Pago
CREATE PROCEDURE SP_ActualizarPago(
    IN p_id_pago INT,
    IN p_documento_paciente INT, 
    IN p_id_cita INT, 
    IN p_id_examen INT, 
    IN p_id_afiliacion INT, 
    IN p_monto DECIMAL(10,2), 
    IN p_fecha_pago DATETIME, 
    IN p_descripcion VARCHAR(50),
    IN p_tipo_servicio INT
)
BEGIN
    UPDATE Pago 
    SET documento_paciente = p_documento_paciente, 
        id_cita = p_id_cita, 
        id_examen = p_id_examen, 
        id_afiliacion = p_id_afiliacion, 
        monto = p_monto, 
        fecha_pago = p_fecha_pago, 
        descripcion = p_descripcion, 
        tipo_servicio = p_tipo_servicio
    WHERE id_pago = p_id_pago;
END //

-- Procedimiento para eliminar un Pago
CREATE PROCEDURE SP_EliminarPago(
    IN p_id_pago INT
    )
BEGIN
    DELETE FROM Pago 
    WHERE id_pago = p_id_pago;
END //

-- Procedimiento para consultar Pago con filtro
CREATE PROCEDURE SP_ConsultarPago(
    IN p_documento_paciente INT
)
BEGIN
    SELECT * FROM Pago 
    WHERE documento_paciente = p_documento_paciente;
END //

-- Procedimiento para insertar una Publicación
CREATE PROCEDURE SP_InsertarPublicacion(
    IN p_titulo VARCHAR(100), 
    IN p_contenido TEXT, 
    IN p_imagen VARCHAR(255), 
    IN p_fecha_publicacion DATETIME, 
    IN p_autor INT
)
BEGIN
    INSERT INTO Publicacion (titulo, contenido, imagen, fecha_publicacion, autor) 
    VALUES (p_titulo, p_contenido, p_imagen, p_fecha_publicacion, p_autor);
END //

-- Procedimiento para actualizar una Publicación
CREATE PROCEDURE SP_ActualizarPublicacion(
    IN p_id_publicacion INT,
    IN p_titulo VARCHAR(100), 
    IN p_contenido TEXT, 
    IN p_imagen VARCHAR(255), 
    IN p_fecha_publicacion DATETIME, 
    IN p_autor INT
)
BEGIN
    UPDATE Publicacion 
    SET titulo = p_titulo, contenido = p_contenido, imagen = p_imagen, fecha_publicacion = p_fecha_publicacion, autor = p_autor
    WHERE id_publicacion = p_id_publicacion;
END //

-- Procedimiento para eliminar una Publicación
CREATE PROCEDURE SP_EliminarPublicacion(
    IN p_id_publicacion INT
    )
BEGIN
    DELETE FROM Publicacion 
    WHERE id_publicacion = p_id_publicacion;
END //

-- Procedimiento para consultar Publicacion con filtro
CREATE PROCEDURE SP_ConsultarPublicacion(
    IN p_titulo VARCHAR(100)
    )
BEGIN
    SELECT * FROM Publicacion 
    WHERE titulo LIKE CONCAT('%', p_titulo, '%');
END //

-- Procedimiento para insertar un horario en la Agenda del Doctor
CREATE PROCEDURE SP_InsertarHorarioAgenda(
    IN p_id_funcionario INT, 
    IN p_fecha DATE, 
    IN p_hora_inicio TIME, 
    IN p_hora_fin TIME, 
    IN p_disponible BOOLEAN
)
BEGIN
    INSERT INTO AgendaDoctor (id_funcionario, fecha, hora_inicio, hora_fin, disponible) 
    VALUES (p_id_funcionario, p_fecha, p_hora_inicio, p_hora_fin, p_disponible);
END //

-- Procedimiento para actualizar un horario en la Agenda del Doctor
CREATE PROCEDURE SP_ActualizarHorarioAgenda(
    IN p_id_agenda INT,
    IN p_id_funcionario INT, 
    IN p_fecha DATE, 
    IN p_hora_inicio TIME, 
    IN p_hora_fin TIME, 
    IN p_disponible BOOLEAN
)
BEGIN
    UPDATE AgendaDoctor 
    SET id_funcionario = p_id_funcionario, fecha = p_fecha, hora_inicio = p_hora_inicio, hora_fin = p_hora_fin, disponible = p_disponible
    WHERE id_agenda = p_id_agenda;
END //

-- Procedimiento para eliminar un horario en la Agenda del Doctor
CREATE PROCEDURE SP_EliminarHorarioAgenda(
    IN p_id_agenda INT
    )
BEGIN
    DELETE FROM AgendaDoctor 
    WHERE id_agenda = p_id_agenda;
END //

-- Procedimiento para consultar la Agenda del Doctor con filtro
CREATE PROCEDURE SP_ConsultarHorarioAgenda(

    IN p_id_funcionario INT
    )
BEGIN
    SELECT * FROM AgendaDoctor 
    WHERE id_funcionario = p_id_funcionario;
END //

DELIMITER ;

/* -- Procedimiento para insertar un registro en la tabla Funcionario_has_Cita
DELIMITER $$

CREATE PROCEDURE InsertarFuncionarioCita(
    IN p_id_funcionario INT,
    IN p_id_cita INT,
    IN p_participacion ENUM('Asignador', 'Atendió')
)
BEGIN
    -- Verificar que el funcionario existe
    IF EXISTS (SELECT 1 FROM Funcionario WHERE id_funcionario = p_id_funcionario) THEN
        -- Verificar que la cita existe
        IF EXISTS (SELECT 1 FROM Cita WHERE id_cita = p_id_cita) THEN
            -- Insertar en la tabla de relación
            INSERT INTO Funcionario_has_Cita(id_funcionario, id_cita, participacion)
            VALUES (p_id_funcionario, p_id_cita, p_participacion);
        ELSE
            -- Mensaje de error si la cita no existe
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cita no encontrada';
        END IF;
    ELSE
        -- Mensaje de error si el funcionario no existe
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Funcionario no encontrado';
    END IF;
END$$

DELIMITER ;

/* CALL InsertarFuncionarioCita(1, 1, 'Asignador');
 */

-- Procedimiento para actualizar un registro en la tabla Funcionario_has_Cita
DELIMITER $$

CREATE PROCEDURE ActualizarFuncionarioCita(
    IN p_id_funcionario_actual INT,
    IN p_id_cita_actual INT,
    IN p_id_funcionario_nuevo INT,
    IN p_id_cita_nueva INT,
    IN p_participacion_nueva ENUM('Asignador', 'Atendió')
)
BEGIN
    -- Verificar que el nuevo funcionario existe
    IF EXISTS (SELECT 1 FROM Funcionario WHERE id_funcionario = p_id_funcionario_nuevo) THEN
        -- Verificar que la nueva cita existe
        IF EXISTS (SELECT 1 FROM Cita WHERE id_cita = p_id_cita_nueva) THEN
            -- Actualizar en la tabla de relación
            UPDATE Funcionario_has_Cita
            SET id_funcionario = p_id_funcionario_nuevo, 
                id_cita = p_id_cita_nueva, 
                participacion = p_participacion_nueva
            WHERE id_funcionario = p_id_funcionario_actual AND id_cita = p_id_cita_actual;
        ELSE
            -- Mensaje de error si la nueva cita no existe
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Nueva cita no encontrada';
        END IF;
    ELSE
        -- Mensaje de error si el nuevo funcionario no existe
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Nuevo funcionario no encontrado';
    END IF;
END$$

DELIMITER ;


/* CALL ActualizarFuncionarioCita(1, 1, 2, 2, 'Atendió');
-- Procedimiento para borrar un registro en la tabla Funcionario_has_Cita
DELIMITER $$
CREATE PROCEDURE SP_BorrarFuncionarioCita (
    IN p_id_funcionario INT,
    IN p_id_cita INT
)
BEGIN
    DELETE FROM Funcionario_has_Cita
    WHERE id_funcionario = p_id_funcionario AND id_cita = p_id_cita;
END$$
DELIMITER ;

-- Procedimiento para consultar registros con un filtro en la tabla Funcionario_has_Cita
DELIMITER $$
CREATE PROCEDURE SP_ConsultarFuncionarioCita (
    IN p_id_funcionario INT
)
BEGIN
    SELECT * FROM Funcionario_has_Cita
    WHERE id_funcionario = p_id_funcionario;
END$$
DELIMITER ;



-- Procedimiento para insertar un registro en la tabla Cita_has_Estados
DELIMITER $$
CREATE PROCEDURE SP_InsertarCitaEstado (
    IN p_id_estado INT,
    IN p_id_cita INT
)
BEGIN
    INSERT INTO Cita_has_Estados (id_estado, id_cita)
    VALUES (p_id_estado, p_id_cita);
END$$
DELIMITER ;

-- Procedimiento para actualizar un registro en la tabla Cita_has_Estados
DELIMITER $$
CREATE PROCEDURE SP_ActualizarCitaEstado (
    IN p_id_estado INT,
    IN p_id_cita INT
)
BEGIN
    UPDATE Cita_has_Estados
    SET id_estado = p_id_estado
    WHERE id_cita = p_id_cita;
END$$
DELIMITER ;

-- Procedimiento para borrar un registro en la tabla Cita_has_Estados
DELIMITER $$
CREATE PROCEDURE SP_BorrarCitaEstado (
    IN p_id_estado INT,
    IN p_id_cita INT
)
BEGIN
    DELETE FROM Cita_has_Estados
    WHERE id_estado = p_id_estado AND id_cita = p_id_cita;
END$$
DELIMITER ;

-- Procedimiento para consultar registros con un filtro en la tabla Cita_has_Estados
DELIMITER $$
CREATE PROCEDURE SP_ConsultarCitaEstado (
    IN p_id_estado INT
)
BEGIN
    SELECT * FROM Cita_has_Estados
    WHERE id_estado = p_id_estado;
END$$
DELIMITER ; */

-- VISTAS SIMPLES

-- Vista para la tabla de Roles
CREATE VIEW vista_Roles AS
SELECT * FROM Rol;

-- Vista para la tabla de Tipos de Documento
CREATE VIEW vista_TiposDocumento AS
SELECT * FROM TiposDocumento;

-- Vista para la tabla de Ciudad
CREATE VIEW vista_Ciudad AS
SELECT * FROM Ciudad;

-- Vista para la tabla de Direccion
CREATE VIEW vista_Direccion AS
SELECT * FROM Direccion;

-- Vista para la tabla de Planes de Afiliación
CREATE VIEW vista_PlanesAfiliacion AS
SELECT * FROM PlanesAfiliacion;

-- Vista para la tabla de Paciente
CREATE VIEW vista_Paciente AS
SELECT * FROM Paciente;

-- Vista para la tabla de Afiliacion
CREATE VIEW vista_Afiliacion AS
SELECT * FROM Afiliacion;

-- Vista para la tabla de Especialidad de Funcionario
CREATE VIEW vista_EspecialidadFuncionario AS
SELECT * FROM EspecialidadFuncionario;

-- Vista para la tabla de Funcionario
CREATE VIEW vista_Funcionario AS
SELECT * FROM Funcionario;

-- Vista para la tabla de Tipos de Servicios
CREATE VIEW vista_TipoServicio AS
SELECT * FROM TipoServicio;

-- Vista para la tabla de Categorías de Cita
CREATE VIEW vista_CategoriaCita AS
SELECT * FROM CategoriaCita;

-- Vista para la tabla de Categorías de Exámenes
CREATE VIEW vista_CategoriasExamen AS
SELECT * FROM CategoriasExamen;

-- Vista para la tabla de Exámenes
CREATE VIEW vista_Examen AS
SELECT * FROM Examen;

CREATE VIEW Vista_EstadosDeCita AS
SELECT * FROM EstadosDeCita;

-- Vista para la tabla de Cita
CREATE VIEW vista_Cita AS
SELECT * FROM Cita;

-- Vista para la tabla de Pago
CREATE VIEW vista_Pago AS
SELECT * FROM Pago;

-- Vista para la tabla de Publicacion
CREATE VIEW vista_Publicacion AS
SELECT * FROM Publicacion;

-- Vista para la tabla de Agenda de Doctores
CREATE VIEW vista_AgendaDoctor AS
SELECT * FROM AgendaDoctor;

CREATE VIEW Vista_Funcionario_has_Cita AS
SELECT 
    f.id_funcionario,
    f.nombre AS nombre_funcionario,
    c.id_cita,
    c.fecha_cita,
    f_c.participacion
FROM 
    Funcionario_has_Cita f_c
JOIN 
    Funcionario f ON f_c.id_funcionario = f.id_funcionario
JOIN 
    Cita c ON f_c.id_cita = c.id_cita;


FROM 

CREATE VIEW Vista_Cita_has_Estados AS
SELECT 
    c.id_cita,
    c.fecha_cita,
    e.id_estado,
    e.descripcion AS descripcion_estado,
    e.fecha_registro AS fecha_registro_estado
FROM 
    Cita_has_Estados c_e
JOIN 
    Cita c ON c_e.id_cita = c.id_cita
JOIN 
    EstadosDeCita e ON c_e.id_estado = e.id_estado;
