-- Crear base de datos
CREATE DATABASE Health_connection;
USE Health_connection;

-- Tabla de Roles
CREATE TABLE Rol(
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(30)
);

-- Tabla de Tipos de Documento
CREATE TABLE TiposDocumento (
    id_tipo_documento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Ciudades
CREATE TABLE Ciudades (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Direcciones
CREATE TABLE Direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(200) NOT NULL,
    id_ciudad INT,
    FOREIGN KEY (id_ciudad) REFERENCES Ciudades(id_ciudad)
);

-- Tabla de Planes de Afiliación
CREATE TABLE PlanesAfiliacion (
    id_plan_afiliacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plan VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL
);

-- Tabla de Pacientes
CREATE TABLE Pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento INT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    ciudad VARCHAR(100),
    contraseña VARCHAR(100) NOT NULL,
    FOREIGN KEY (tipo_documento) REFERENCES TiposDocumento(id_tipo_documento),
    FOREIGN KEY (direccion) REFERENCES Direcciones(id_direccion)
);

-- Tabla de Afiliaciones
CREATE TABLE Afiliaciones (
    id_afiliacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT ,
    id_plan_afiliacion INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado ENUM('Activa', 'Inactiva') NOT NULL,
    FOREIGN KEY (id_plan_afiliacion) REFERENCES PlanesAfiliacion(id_plan_afiliacion),
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente)
);

-- Tabla de Especialidad de Funcionarios
CREATE TABLE EspecialidadFuncionarios(
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Funcionarios
CREATE TABLE Funcionarios (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento INT NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    ciudad VARCHAR(100),
    especialidad INT NOT NULL,
    rol INT NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    FOREIGN KEY(rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (tipo_documento) REFERENCES TiposDocumento(id_tipo_documento),
    FOREIGN KEY (direccion) REFERENCES Direcciones(id_direccion),
    FOREIGN KEY (especialidad) REFERENCES EspecialidadFuncionarios(id_especialidad)
);

-- Tabla de Tipos de Servicios
CREATE TABLE TiposServicios (
    id_tipo_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Categorías de Citas
CREATE TABLE CategoriasCitas (
    id_categoria_cita INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Categorías de Exámenes
CREATE TABLE CategoriasExamenes (
    id_categoria_examen INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Exámenes
CREATE TABLE Examenes (
    id_examen INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_funcionario INT NOT NULL,
    fecha_examen DATETIME NOT NULL,
    resultado VARCHAR(250),
    id_categoria_examen INT NOT NULL,
    id_tipo_servicio INT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente),
    FOREIGN KEY (id_funcionario) REFERENCES Funcionarios(id_funcionario),
    FOREIGN KEY (id_categoria_examen) REFERENCES CategoriasExamenes(id_categoria_examen),
    FOREIGN KEY (id_tipo_servicio) REFERENCES TiposServicios(id_tipo_servicio)
);

-- Tabla de Citas
CREATE TABLE Citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_funcionario INT NOT NULL,
    fecha_cita DATETIME NOT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada') NOT NULL,
    id_categoria_cita INT NOT NULL,
    id_tipo_servicio INT NOT NULL,
    notificaciones BOOLEAN NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente),
    FOREIGN KEY (id_funcionario) REFERENCES Funcionarios(id_funcionario),
    FOREIGN KEY (id_categoria_cita) REFERENCES CategoriasCitas(id_categoria_cita),
    FOREIGN KEY (id_tipo_servicio) REFERENCES TiposServicios(id_tipo_servicio)
);

-- Tabla de Pagos
CREATE TABLE Pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_cita INT NULL,
    id_examen INT NULL,
    id_afiliacion INT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME NOT NULL,
    descripcion VARCHAR(50),
    tipo_servicio INT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente),
    FOREIGN KEY (id_cita) REFERENCES Citas(id_cita),
    FOREIGN KEY (id_examen) REFERENCES Examenes(id_examen),
    FOREIGN KEY (id_afiliacion) REFERENCES Afiliaciones(id_afiliacion),
    FOREIGN KEY (tipo_servicio) REFERENCES TiposServicios(id_tipo_servicio)
);



-- Tabla de Publicaciones
CREATE TABLE Publicaciones (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    fecha_publicacion DATETIME NOT NULL,
    autor INT NOT NULL,
    FOREIGN KEY (autor) REFERENCES Funcionarios(id_funcionario)
);

-- Tabla de Agenda de Doctores
CREATE TABLE AgendaDoctor (
    id_agenda INT AUTO_INCREMENT PRIMARY KEY,
    id_funcionario INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionarios(id_funcionario)
);

-- PROCEDIMIENTOS ALMACENADOS


-- Procedimiento para insertar un Rol
CREATE PROCEDURE SP_InsertarRol(
    IN p_rol VARCHAR(30)
    )
BEGIN
    INSERT INTO Rol (rol) 
    VALUES (p_rol);
END 

-- Procedimiento para actualizar un Rol
CREATE PROCEDURE SP_ActualizarRol(
    IN p_id_rol INT, 
    IN p_rol VARCHAR(30)
    )
BEGIN
    UPDATE Rol 
    SET rol = p_rol 
    WHERE id_rol = p_id_rol;
END 

-- Procedimiento para eliminar un Rol
CREATE PROCEDURE Eliminar_Rol(
    IN p_id_rol INT
    )
BEGIN
    DELETE FROM Rol 
    WHERE id_rol = p_id_rol;
END 

-- Procedimiento para consultar Roles con filtro
CREATE PROCEDURE Consultar_Rol(
    IN p_rol VARCHAR(30)
    )
BEGIN
    SELECT * FROM Rol 
    WHERE rol LIKE CONCAT('%', p_rol, '%');
END 

-- Procedimiento para insertar un Tipo de Documento
CREATE PROCEDURE Insertar_TipoDocumento(
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO TiposDocumento (nombre_tipo, descripcion) 
    VALUES (p_nombre_tipo, p_descripcion);
END 

-- Procedimiento para actualizar un Tipo de Documento
CREATE PROCEDURE Actualizar_TipoDocumento(
    IN p_id_tipo_documento INT, 
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE TiposDocumento 
    SET nombre_tipo = p_nombre_tipo, 
        descripcion = p_descripcion 
    WHERE id_tipo_documento = p_id_tipo_documento;
END 

-- Procedimiento para eliminar un Tipo de Documento
CREATE PROCEDURE Eliminar_TipoDocumento(
    IN p_id_tipo_documento INT
    )
BEGIN
    DELETE FROM TiposDocumento 
    WHERE id_tipo_documento = p_id_tipo_documento;
END 

-- Procedimiento para consultar Tipos de Documento con filtro
CREATE PROCEDURE Consultar_TipoDocumento(
    IN p_nombre_tipo VARCHAR(50)
    )
BEGIN
    SELECT * FROM TiposDocumento 
    WHERE nombre_tipo LIKE CONCAT('%', p_nombre_tipo, '%');
END 

-- Procedimiento para insertar una Ciudad
CREATE PROCEDURE Insertar_Ciudad(
    IN p_nombre_ciudad VARCHAR(100), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO Ciudades (nombre_ciudad, descripcion) 
    VALUES (p_nombre_ciudad, p_descripcion);
END 

-- Procedimiento para actualizar una Ciudad
CREATE PROCEDURE Actualizar_Ciudad(
    IN p_id_ciudad INT, 
    IN p_nombre_ciudad VARCHAR(100), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE Ciudades 
    SET nombre_ciudad = p_nombre_ciudad, 
        descripcion = p_descripcion 
    WHERE id_ciudad = p_id_ciudad;
END 

-- Procedimiento para eliminar una Ciudad
CREATE PROCEDURE Eliminar_Ciudad(
    IN p_id_ciudad INT
    )
BEGIN
    DELETE FROM Ciudades
    WHERE id_ciudad = p_id_ciudad;
END 

-- Procedimiento para consultar Ciudades con filtro
CREATE PROCEDURE Consultar_Ciudad(
    IN p_nombre_ciudad VARCHAR(100)
    )
BEGIN
    SELECT * FROM Ciudades 
    WHERE nombre_ciudad LIKE CONCAT('%', p_nombre_ciudad, '%');
END 

-- Procedimiento para insertar una Dirección
CREATE PROCEDURE Insertar_Direccion(
    IN p_direccion VARCHAR(200), 
    IN p_id_ciudad INT
    )
BEGIN
    INSERT INTO Direcciones (direccion, id_ciudad) 
    VALUES (p_direccion, p_id_ciudad);
END 

-- Procedimiento para actualizar una Dirección
CREATE PROCEDURE Actualizar_Direccion(
    IN p_id_direccion INT, 
    IN p_direccion VARCHAR(200), 
    IN p_id_ciudad INT
    )
BEGIN
    UPDATE Direcciones 
    SET direccion = p_direccion, 
        id_ciudad = p_id_ciudad 
    WHERE id_direccion = p_id_direccion;
END 

-- Procedimiento para eliminar una Dirección
CREATE PROCEDURE Eliminar_Direccion(
    IN p_id_direccion INT
    )
BEGIN
    DELETE FROM Direcciones 
    WHERE id_direccion = p_id_direccion;
END 

-- Procedimiento para consultar Direcciones con filtro
CREATE PROCEDURE Consultar_Direccion(
    IN p_direccion VARCHAR(200)
    )
BEGIN
    SELECT * FROM Direcciones 
    WHERE direccion LIKE CONCAT('%', p_direccion, '%');
END 

-- Procedimiento para insertar un Plan de Afiliación
CREATE PROCEDURE Insertar_PlanAfiliacion(
    IN p_nombre_plan VARCHAR(50), 
    IN p_descripcion VARCHAR(50), 
    IN p_precio DECIMAL(10,2)
    )
BEGIN
    INSERT INTO PlanesAfiliacion (nombre_plan, descripcion, precio) 
    VALUES (p_nombre_plan, p_descripcion, p_precio);
END 

-- Procedimiento para actualizar un Plan de Afiliación
CREATE PROCEDURE Actualizar_PlanAfiliacion(
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
END 

-- Procedimiento para eliminar un Plan de Afiliación
CREATE PROCEDURE Eliminar_PlanAfiliacion(
    IN p_id_plan_afiliacion INT
    )
BEGIN
    DELETE FROM PlanesAfiliacion 
    WHERE id_plan_afiliacion = p_id_plan_afiliacion;
END 

-- Procedimiento para consultar Planes de Afiliación con filtro
CREATE PROCEDURE Consultar_PlanAfiliacion(
    IN p_nombre_plan VARCHAR(50)
    )
BEGIN
    SELECT * FROM PlanesAfiliacion 
    WHERE nombre_plan LIKE CONCAT('%', p_nombre_plan, '%');
END 

-- Procedimiento para insertar un Paciente
CREATE PROCEDURE Insertar_Paciente(
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
    INSERT INTO Pacientes (nombre, apellido, tipo_documento, fecha_nacimiento, sexo, telefono, email, direccion, ciudad, contraseña) 
    VALUES (p_nombre, p_apellido, p_tipo_documento, p_fecha_nacimiento, p_sexo, p_telefono, p_email, p_direccion, p_ciudad, p_contraseña);
END 

-- Procedimiento para actualizar un Paciente
CREATE PROCEDURE Actualizar_Paciente(
    IN p_id_paciente INT,
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
    UPDATE Pacientes 
    SET nombre = p_nombre, apellido = p_apellido, 
        tipo_documento = p_tipo_documento, 
        fecha_nacimiento = p_fecha_nacimiento, 
        sexo = p_sexo, 
        telefono = p_telefono, 
        email = p_email, 
        direccion = p_direccion, 
        ciudad = p_ciudad, 
        contraseña = p_contraseña
    WHERE id_paciente = p_id_paciente;
END 

-- Procedimiento para eliminar un Paciente
CREATE PROCEDURE Eliminar_Paciente(
    IN p_id_paciente INT
    )
BEGIN
    DELETE FROM Pacientes 
    WHERE id_paciente = p_id_paciente;
END 

-- Procedimiento para consultar Pacientes con filtro
CREATE PROCEDURE Consultar_Paciente(
    IN p_nombre VARCHAR(100)
    )
BEGIN
    SELECT * FROM Pacientes 
    WHERE nombre LIKE CONCAT('%', p_nombre, '%');
END 

-- Procedimiento para insertar una Afiliación
CREATE PROCEDURE Insertar_Afiliacion(
    IN p_id_paciente INT,
    IN p_id_plan_afiliacion INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_estado ENUM('Activa', 'Inactiva')
)
BEGIN
    INSERT INTO Afiliaciones (id_paciente, id_plan_afiliacion, fecha_inicio, fecha_fin, estado) 
    VALUES (p_id_paciente, p_id_plan_afiliacion, p_fecha_inicio, p_fecha_fin, p_estado);
END 

-- Procedimiento para actualizar una Afiliación
CREATE PROCEDURE Actualizar_Afiliacion(
    IN p_id_afiliacion INT,
    IN p_id_paciente INT,
    IN p_id_plan_afiliacion INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_estado ENUM('Activa', 'Inactiva')
)
BEGIN
    UPDATE Afiliaciones 
    SET id_paciente = p_id_paciente, 
        id_plan_afiliacion = p_id_plan_afiliacion, 
        fecha_inicio = p_fecha_inicio, 
        fecha_fin = p_fecha_fin, 
        estado = p_estado
    WHERE id_afiliacion = p_id_afiliacion;
END 

-- Procedimiento para eliminar una Afiliación
CREATE PROCEDURE Eliminar_Afiliacion(
    IN p_id_afiliacion INT
    )
BEGIN
    DELETE FROM Afiliaciones 
    WHERE id_afiliacion = p_id_afiliacion;
END 

-- Procedimiento para consultar Afiliaciones con filtro
CREATE PROCEDURE Consultar_Afiliacion(
    IN p_id_paciente INT
    )
BEGIN
    SELECT * FROM Afiliaciones 
    WHERE id_paciente = p_id_paciente;
END 

-- Procedimiento para insertar una Especialidad de Funcionario
CREATE PROCEDURE Insertar_EspecialidadFuncionario(
    IN p_nombre_especialidad VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO EspecialidadFuncionarios (nombre_especialidad, descripcion) 
    VALUES (p_nombre_especialidad, p_descripcion);
END 

-- Procedimiento para actualizar una Especialidad de Funcionario
CREATE PROCEDURE Actualizar_EspecialidadFuncionario(
    IN p_id_especialidad INT, 
    IN p_nombre_especialidad VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE EspecialidadFuncionarios 
    SET nombre_especialidad = p_nombre_especialidad, 
        descripcion = p_descripcion 
    WHERE id_especialidad = p_id_especialidad;
END 

-- Procedimiento para eliminar una Especialidad de Funcionario
CREATE PROCEDURE Eliminar_EspecialidadFuncionario(
    IN p_id_especialidad INT
    )
BEGIN
    DELETE FROM EspecialidadFuncionarios 
    WHERE id_especialidad = p_id_especialidad;
END 

-- Procedimiento para consultar Especialidades de Funcionario con filtro
CREATE PROCEDURE Consultar_EspecialidadFuncionario(
    IN p_nombre_especialidad VARCHAR(50)
    )
BEGIN
    SELECT * FROM EspecialidadFuncionarios 
    WHERE nombre_especialidad LIKE CONCAT('%', p_nombre_especialidad, '%');
END 

-- Procedimiento para insertar un Funcionario
CREATE PROCEDURE Insertar_Funcionario(
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
    INSERT INTO Funcionarios (nombre, apellido, tipo_documento, numero_documento, telefono, email, direccion, ciudad, especialidad, rol, contraseña) 
    VALUES (p_nombre, p_apellido, p_tipo_documento, p_numero_documento, p_telefono, p_email, p_direccion, p_ciudad, p_especialidad, p_rol, p_contraseña);
END 

-- Procedimiento para actualizar un Funcionario
CREATE PROCEDURE Actualizar_Funcionario(
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
    UPDATE Funcionarios 
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
END 

-- Procedimiento para eliminar un Funcionario
CREATE PROCEDURE Eliminar_Funcionario(
    IN p_id_funcionario INT
    )
BEGIN
    DELETE FROM Funcionarios 
    WHERE id_funcionario = p_id_funcionario;
END 

-- Procedimiento para consultar Funcionarios con filtro
CREATE PROCEDURE Consultar_Funcionario(IN p_nombre VARCHAR(100))
BEGIN
    SELECT * FROM Funcionarios 
    WHERE nombre LIKE CONCAT('%', p_nombre, '%');
END 

-- Procedimiento para insertar un Tipo de Servicio
CREATE PROCEDURE Insertar_TipoServicio(
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO TiposServicios (nombre_tipo, descripcion) 
    VALUES (p_nombre_tipo, p_descripcion);
END 

-- Procedimiento para actualizar un Tipo de Servicio
CREATE PROCEDURE Actualizar_TipoServicio(
    IN p_id_tipo_servicio INT, 
    IN p_nombre_tipo VARCHAR(50), 
    IN p_descripcion VARCHAR(50))
BEGIN
    UPDATE TiposServicios 
    SET nombre_tipo = p_nombre_tipo, 
        descripcion = p_descripcion 
    WHERE id_tipo_servicio = p_id_tipo_servicio;
END 

-- Procedimiento para eliminar un Tipo de Servicio
CREATE PROCEDURE Eliminar_TipoServicio(
    IN p_id_tipo_servicio INT
    )
BEGIN
    DELETE FROM TiposServicios 
    WHERE id_tipo_servicio = p_id_tipo_servicio;
END 

-- Procedimiento para consultar Tipos de Servicio con filtro
CREATE PROCEDURE Consultar_TipoServicio(
    IN p_nombre_tipo VARCHAR(50)
    )
BEGIN
    SELECT * FROM TiposServicios 
    WHERE nombre_tipo LIKE CONCAT('%', p_nombre_tipo, '%');
END 

-- Procedimiento para insertar una Categoría de Cita
CREATE PROCEDURE Insertar_CategoriaCita(
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO CategoriasCitas (nombre_categoria, descripcion) 
    VALUES (p_nombre_categoria, p_descripcion);
END 

-- Procedimiento para actualizar una Categoría de Cita
CREATE PROCEDURE Actualizar_CategoriaCita(
    IN p_id_categoria_cita INT, 
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE CategoriasCitas 
    SET nombre_categoria = p_nombre_categoria, 
        descripcion = p_descripcion 
    WHERE id_categoria_cita = p_id_categoria_cita;
END 

-- Procedimiento para eliminar una Categoría de Cita
CREATE PROCEDURE Eliminar_CategoriaCita(
    IN p_id_categoria_cita INT
    )
BEGIN
    DELETE FROM CategoriasCitas 
    WHERE id_categoria_cita = p_id_categoria_cita;
END 

-- Procedimiento para consultar Categorías de Cita con filtro
CREATE PROCEDURE Consultar_CategoriaCita(
    IN p_nombre_categoria VARCHAR(50)
    )
BEGIN
    SELECT * FROM CategoriasCitas 
    WHERE nombre_categoria LIKE CONCAT('%', p_nombre_categoria, '%');
END 

-- Procedimiento para insertar una Categoría de Examen
CREATE PROCEDURE Insertar_CategoriaExamen(
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    INSERT INTO CategoriasExamenes (nombre_categoria, descripcion) 
    VALUES (p_nombre_categoria, p_descripcion);
END 

-- Procedimiento para actualizar una Categoría de Examen
CREATE PROCEDURE Actualizar_CategoriaExamen(
    IN p_id_categoria_examen INT, 
    IN p_nombre_categoria VARCHAR(50), 
    IN p_descripcion VARCHAR(50)
    )
BEGIN
    UPDATE CategoriasExamenes 
    SET nombre_categoria = p_nombre_categoria, 
        descripcion = p_descripcion 
    WHERE id_categoria_examen = p_id_categoria_examen;
END 

-- Procedimiento para eliminar una Categoría de Examen
CREATE PROCEDURE Eliminar_CategoriaExamen(
    IN p_id_categoria_examen INT
    )
BEGIN
    DELETE FROM CategoriasExamenes 
    WHERE id_categoria_examen = p_id_categoria_examen;
END 

-- Procedimiento para consultar Categorías de Examen con filtro
CREATE PROCEDURE Consultar_CategoriaExamen(
    IN p_nombre_categoria VARCHAR(50)
    )
BEGIN
    SELECT * FROM CategoriasExamenes 
    WHERE nombre_categoria LIKE CONCAT('%', p_nombre_categoria, '%');
END 

-- Procedimiento para insertar un Examen
CREATE PROCEDURE Insertar_Examen(
    IN p_id_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_examen DATETIME, 
    IN p_resultado VARCHAR(250), 
    IN p_id_categoria_examen INT, 
    IN p_id_tipo_servicio INT
)
BEGIN
    INSERT INTO Examenes (id_paciente, id_funcionario, fecha_examen, resultado, id_categoria_examen, id_tipo_servicio) 
    VALUES (p_id_paciente, p_id_funcionario, p_fecha_examen, p_resultado, p_id_categoria_examen, p_id_tipo_servicio);
END 

-- Procedimiento para actualizar un Examen
CREATE PROCEDURE Actualizar_Examen(
    IN p_id_examen INT, 
    IN p_id_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_examen DATETIME, 
    IN p_resultado VARCHAR(250), 
    IN p_id_categoria_examen INT, 
    IN p_id_tipo_servicio INT
)
BEGIN
    UPDATE Examenes 
    SET id_paciente = p_id_paciente, 
        id_funcionario = p_id_funcionario, 
        fecha_examen = p_fecha_examen, 
        resultado = p_resultado, 
        id_categoria_examen = p_id_categoria_examen, 
        id_tipo_servicio = p_id_tipo_servicio
    WHERE id_examen = p_id_examen;
END 

-- Procedimiento para eliminar un Examen
CREATE PROCEDURE Eliminar_Examen(
    IN p_id_examen INT
    )
BEGIN
    DELETE FROM Examenes 
    WHERE id_examen = p_id_examen;
END 

-- Procedimiento para consultar Exámenes con filtro
CREATE PROCEDURE Consultar_Examen(
    IN p_id_paciente INT
    )
BEGIN
    SELECT * FROM Examenes 
    WHERE id_paciente = p_id_paciente;
END 

-- Procedimiento para insertar una Cita
CREATE PROCEDURE Insertar_Cita(
    IN p_id_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_cita DATETIME, 
    IN p_estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada'), 
    IN p_id_categoria_cita INT, 
    IN p_id_tipo_servicio INT,
    IN p_notificaciones BOOLEAN
)
BEGIN
    INSERT INTO Citas (id_paciente, id_funcionario, fecha_cita, estado, id_categoria_cita, id_tipo_servicio, notificaciones) 
    VALUES (p_id_paciente, p_id_funcionario, p_fecha_cita, p_estado, p_id_categoria_cita, p_id_tipo_servicio, p_notificaciones);
END 

-- Procedimiento para actualizar una Cita
CREATE PROCEDURE Actualizar_Cita(
    IN p_id_cita INT,
    IN p_id_paciente INT, 
    IN p_id_funcionario INT, 
    IN p_fecha_cita DATETIME, 
    IN p_estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada'), 
    IN p_id_categoria_cita INT, 
    IN p_id_tipo_servicio INT,
    IN p_notificaciones BOOLEAN
)
BEGIN
    UPDATE Citas 
    SET id_paciente = p_id_paciente, 
        id_funcionario = p_id_funcionario, 
        fecha_cita = p_fecha_cita, 
        estado = p_estado, 
        id_categoria_cita = p_id_categoria_cita, 
        id_tipo_servicio = p_id_tipo_servicio, 
        notificaciones = p_notificaciones
    WHERE id_cita = p_id_cita;
END 

-- Procedimiento para eliminar una Cita
CREATE PROCEDURE Eliminar_Cita(
    IN p_id_cita INT
    )
BEGIN
    DELETE FROM Citas 
    WHERE id_cita = p_id_cita;
END 

-- Procedimiento para consultar Citas con filtro
CREATE PROCEDURE Consultar_Cita(
    IN p_id_paciente INT
    )
BEGIN
    SELECT * FROM Citas 
    WHERE id_paciente = p_id_paciente;
END 

-- Procedimiento para insertar un Pago
CREATE PROCEDURE Insertar_Pago(
    IN p_id_paciente INT, 
    IN p_id_cita INT, 
    IN p_id_examen INT, 
    IN p_id_afiliacion INT, 
    IN p_monto DECIMAL(10,2), 
    IN p_fecha_pago DATETIME, 
    IN p_descripcion VARCHAR(50),
    IN p_tipo_servicio INT
)
BEGIN
    INSERT INTO Pagos (id_paciente, id_cita, id_examen, id_afiliacion, monto, fecha_pago, descripcion, tipo_servicio) 
    VALUES (p_id_paciente, p_id_cita, p_id_examen, p_id_afiliacion, p_monto, p_fecha_pago, p_descripcion, p_tipo_servicio);
END 

-- Procedimiento para actualizar un Pago
CREATE PROCEDURE Actualizar_Pago(
    IN p_id_pago INT,
    IN p_id_paciente INT, 
    IN p_id_cita INT, 
    IN p_id_examen INT, 
    IN p_id_afiliacion INT, 
    IN p_monto DECIMAL(10,2), 
    IN p_fecha_pago DATETIME, 
    IN p_descripcion VARCHAR(50),
    IN p_tipo_servicio INT
)
BEGIN
    UPDATE Pagos 
    SET id_paciente = p_id_paciente, 
        id_cita = p_id_cita, 
        id_examen = p_id_examen, 
        id_afiliacion = p_id_afiliacion, 
        monto = p_monto, 
        fecha_pago = p_fecha_pago, 
        descripcion = p_descripcion, 
        tipo_servicio = p_tipo_servicio
    WHERE id_pago = p_id_pago;
END 

-- Procedimiento para eliminar un Pago
CREATE PROCEDURE Eliminar_Pago(
    IN p_id_pago INT
    )
BEGIN
    DELETE FROM Pagos 
    WHERE id_pago = p_id_pago;
END 

-- Procedimiento para consultar Pagos con filtro
CREATE PROCEDURE Consultar_Pago(
    IN p_id_paciente INT
)
BEGIN
    SELECT * FROM Pagos 
    WHERE id_paciente = p_id_paciente;
END 

-- Procedimiento para insertar una Publicación
CREATE PROCEDURE Insertar_Publicacion(
    IN p_titulo VARCHAR(100), 
    IN p_contenido TEXT, 
    IN p_imagen VARCHAR(255), 
    IN p_fecha_publicacion DATETIME, 
    IN p_autor INT
)
BEGIN
    INSERT INTO Publicaciones (titulo, contenido, imagen, fecha_publicacion, autor) 
    VALUES (p_titulo, p_contenido, p_imagen, p_fecha_publicacion, p_autor);
END 

-- Procedimiento para actualizar una Publicación
CREATE PROCEDURE Actualizar_Publicacion(
    IN p_id_publicacion INT,
    IN p_titulo VARCHAR(100), 
    IN p_contenido TEXT, 
    IN p_imagen VARCHAR(255), 
    IN p_fecha_publicacion DATETIME, 
    IN p_autor INT
)
BEGIN
    UPDATE Publicaciones 
    SET titulo = p_titulo, contenido = p_contenido, imagen = p_imagen, fecha_publicacion = p_fecha_publicacion, autor = p_autor
    WHERE id_publicacion = p_id_publicacion;
END 

-- Procedimiento para eliminar una Publicación
CREATE PROCEDURE Eliminar_Publicacion(
    IN p_id_publicacion INT
    )
BEGIN
    DELETE FROM Publicaciones 
    WHERE id_publicacion = p_id_publicacion;
END 

-- Procedimiento para consultar Publicaciones con filtro
CREATE PROCEDURE Consultar_Publicacion(
    IN p_titulo VARCHAR(100)
    )
BEGIN
    SELECT * FROM Publicaciones 
    WHERE titulo LIKE CONCAT('%', p_titulo, '%');
END 

-- Procedimiento para insertar un horario en la Agenda del Doctor
CREATE PROCEDURE Insertar_HorarioAgenda(
    IN p_id_funcionario INT, 
    IN p_fecha DATE, 
    IN p_hora_inicio TIME, 
    IN p_hora_fin TIME, 
    IN p_disponible BOOLEAN
)
BEGIN
    INSERT INTO AgendaDoctor (id_funcionario, fecha, hora_inicio, hora_fin, disponible) 
    VALUES (p_id_funcionario, p_fecha, p_hora_inicio, p_hora_fin, p_disponible);
END 

-- Procedimiento para actualizar un horario en la Agenda del Doctor
CREATE PROCEDURE Actualizar_HorarioAgenda(
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
END 

-- Procedimiento para eliminar un horario en la Agenda del Doctor
CREATE PROCEDURE Eliminar_HorarioAgenda(
    IN p_id_agenda INT
    )
BEGIN
    DELETE FROM AgendaDoctor 
    WHERE id_agenda = p_id_agenda;
END 

-- Procedimiento para consultar la Agenda del Doctor con filtro
CREATE PROCEDURE Consultar_HorarioAgenda(
    IN p_id_funcionario INT
    )
BEGIN
    SELECT * FROM AgendaDoctor 
    WHERE id_funcionario = p_id_funcionario;
END 

-- VISTAS SIMPLES

-- Vista para la tabla de Roles
CREATE VIEW vista_Roles AS
SELECT * FROM Rol;

-- Vista para la tabla de Tipos de Documento
CREATE VIEW vista_TiposDocumento AS
SELECT * FROM TiposDocumento;

-- Vista para la tabla de Ciudades
CREATE VIEW vista_Ciudades AS
SELECT * FROM Ciudades;

-- Vista para la tabla de Direcciones
CREATE VIEW vista_Direcciones AS
SELECT * FROM Direcciones;

-- Vista para la tabla de Planes de Afiliación
CREATE VIEW vista_PlanesAfiliacion AS
SELECT * FROM PlanesAfiliacion;

-- Vista para la tabla de Pacientes
CREATE VIEW vista_Pacientes AS
SELECT * FROM Pacientes;

-- Vista para la tabla de Afiliaciones
CREATE VIEW vista_Afiliaciones AS
SELECT * FROM Afiliaciones;

-- Vista para la tabla de Especialidad de Funcionarios
CREATE VIEW vista_EspecialidadFuncionarios AS
SELECT * FROM EspecialidadFuncionarios;

-- Vista para la tabla de Funcionarios
CREATE VIEW vista_Funcionarios AS
SELECT * FROM Funcionarios;

-- Vista para la tabla de Tipos de Servicios
CREATE VIEW vista_TiposServicios AS
SELECT * FROM TiposServicios;

-- Vista para la tabla de Categorías de Citas
CREATE VIEW vista_CategoriasCitas AS
SELECT * FROM CategoriasCitas;

-- Vista para la tabla de Categorías de Exámenes
CREATE VIEW vista_CategoriasExamenes AS
SELECT * FROM CategoriasExamenes;

-- Vista para la tabla de Exámenes
CREATE VIEW vista_Examenes AS
SELECT * FROM Examenes;

-- Vista para la tabla de Citas
CREATE VIEW vista_Citas AS
SELECT * FROM Citas;

-- Vista para la tabla de Pagos
CREATE VIEW vista_Pagos AS
SELECT * FROM Pagos;

-- Vista para la tabla de Publicaciones
CREATE VIEW vista_Publicaciones AS
SELECT * FROM Publicaciones;

-- Vista para la tabla de Agenda de Doctores
CREATE VIEW vista_AgendaDoctor AS
SELECT * FROM AgendaDoctor;
