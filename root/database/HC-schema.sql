-- Creación de la base de datos
CREATE DATABASE Health_connection;
USE Health_connection;


-- !1 Tabla de Rol
CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);


-- !2 Tabla de Ciudad
CREATE TABLE Ciudad (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL
);


-- !3 Tabla de Direccion
CREATE TABLE Direccion (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(200) NOT NULL,
    id_ciudad INT,
    FOREIGN KEY (id_ciudad) REFERENCES Ciudad(id_ciudad)
);


-- !4 Tabla de Especialidad
CREATE TABLE Especialidad (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(255) NOT NULL,
    costo DECIMAL(10,2) NOT NULL  -- Costo de la especialidad
);


-- !5 Tabla de TipoCita
CREATE TABLE TipoCita (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    costo_adicional DECIMAL(10,2) NOT NULL
);


-- !6 Tabla de Afiliacion
CREATE TABLE Afiliacion (
    id_afiliacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plan VARCHAR(50) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) NOT NULL,
    max_beneficiarios INT NOT NULL,
    descripcion TEXT NULL
);


-- !7 Tabla Paciente
CREATE TABLE Paciente (
    numero_documento INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_doc VARCHAR(30) NOT NULL,
    fecha_de_nacimiento DATE NOT NULL,
    genero CHAR(1) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    contraseña VARBINARY(255) NOT NULL,
    id_plan_afiliacion INT NULL,
    foto_perfil VARCHAR(255) NULL,
    id_rol INT NOT NULL,  -- Asociar el rol desde la tabla Rol
    estado ENUM('activo', 'inactivo') DEFAULT 'inactivo',  -- Estado de la afiliación
    afiliado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_plan_afiliacion) REFERENCES Afiliacion(id_afiliacion),
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);


-- !8 Tabla de Doctores
CREATE TABLE Doctor (
    id_doctor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento INT UNIQUE NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    id_especialidad INT NOT NULL,
    contraseña VARBINARY(255) NOT NULL,
    foto_perfil VARCHAR(255) NULL,
    genero CHAR(1) NOT NULL,
    id_rol INT NOT NULL,  -- Asociar el rol desde la tabla Rol =2
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);


-- !9 Tabla de Administrativos
CREATE TABLE Administrativos (
    id_Administrativos INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    id_rol INT NOT NULL,  -- Asociar el rol desde la tabla Rol
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento INT UNIQUE NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    contraseña VARBINARY(255) NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion)
);


-- !10 Tabla de Secretaria
CREATE TABLE Secretaria (
    id_Secretaria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    id_rol INT NOT NULL,  -- Asociar el rol desde la tabla Rol
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento INT UNIQUE NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    contraseña VARBINARY(255) NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion)
);


-- !11 Tabla de Estados
CREATE TABLE Estado (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);


-- !12 Tabla Cita
CREATE TABLE Cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,-- Para quien es la cita
    id_doctor INT NOT NULL,-- el que atendera
    asignador INT NULL,-- el que asigna
    solicitante INT NULL,-- el que solicita
    tipo_solicitante ENUM('paciente','secretaria'),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_cita INT NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    especialidad INT NOT NULL,
    requiere_autorizacion BOOLEAN DEFAULT FALSE,
    documento_autorizacion VARCHAR(255) NULL,  -- Ruta del documento de autorización
    estado INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_doctor) REFERENCES Doctor(id_doctor),
    FOREIGN KEY (asignador) REFERENCES Administrativos(id_Administrativos),
    FOREIGN KEY (tipo_cita) REFERENCES TipoCita(id_tipo),
    FOREIGN KEY (especialidad) REFERENCES Especialidad(id_especialidad),
    FOREIGN KEY (estado) REFERENCES Estado(id_estado)
);


-- !13 Tabla de Autorizaciones
CREATE TABLE Autorizacion (
    id_autorizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,  -- Paciente al que se le autoriza el procedimiento
    id_doctor INT NOT NULL,    -- Doctor que solicita y/o asigna la autorización
    asignador INT NULL, -- Administrador que aprueba o rechaza la autorización
    tipo_cita INT NOT NULL,    -- Tipo de examen
    fecha_resolucion DATETIME, -- Cuándo se aprobó/rechazó
    fecha_procedimiento DATE NOT NULL, -- Fecha solicitada para el procedimiento
    descripcion TEXT,
    firma_doctor VARCHAR(255),
    estado INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP, -- Cuándo se solicitó la autorización
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_doctor) REFERENCES Doctor(id_doctor),
    FOREIGN KEY (asignador) REFERENCES Administrativos(id_Administrativos),
    FOREIGN KEY (tipo_cita) REFERENCES TipoCita(id_tipo), 
    FOREIGN KEY (estado) REFERENCES Estado (id_estado)
);


-- !14 Tabla HistorialAutorizacion (Tabla Relacional para almacenar el historial de estados de autorizaciones)
CREATE TABLE HistorialAutorizacion (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_autorizacion INT NOT NULL, -- La autorización a la que pertenece el estado
    id_estado INT NOT NULL, -- El estado de la autorización
    fecha_cambio DATETIME NOT NULL, -- Fecha del cambio de estado
    FOREIGN KEY (id_autorizacion) REFERENCES Autorizacion(id_autorizacion),
    FOREIGN KEY (id_estado) REFERENCES Estado(id_estado)
);


-- !15 Tabla HistorialCita(Tabla Relacional para almacenar el historial de estados de citas)
CREATE TABLE HistorialCita (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL,
    id_estado INT NOT NULL,
    fecha_cambio DATETIME NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita),
    FOREIGN KEY (id_estado) REFERENCES Estado(id_estado)
);


-- !16 Tabla de HitoriaClinica del paciente
CREATE TABLE HistorialClinico (
    id_historial_clinico INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    procedimientos TEXT,
    observaciones TEXT,
    alergias TEXT,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento)
);


-- !17 Tabla de HistorialClinico_Cita 
CREATE TABLE HistorialClinico_Cita (
    id_historial INT NOT NULL,
    id_cita INT NOT NULL,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_historial, id_cita),
    FOREIGN KEY (id_historial) REFERENCES HistorialClinico(id_historial_clinico),
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita)
);


-- !18 Tabla de Publicaciones
CREATE TABLE Publicacion (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    imagen_publicacion VARCHAR(255) NULL,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATETIME NOT NULL
);


-- !19 Tabla Relacional para Publicaciones y Administrativoss
CREATE TABLE Administrativos_Publicacion (
    id_Administrativos INT,
    id_publicacion INT,
    PRIMARY KEY (id_Administrativos, id_publicacion),
    FOREIGN KEY (id_Administrativos) REFERENCES Administrativos(id_Administrativos),
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion)
);


-- !20 Tabla Relacional para Secretarias y Publicaciones
CREATE TABLE Secretaria_Publicacion (
    id_Secretaria INT,
    id_publicacion INT,
    PRIMARY KEY (id_Secretaria, id_publicacion),
    FOREIGN KEY (id_Secretaria) REFERENCES Secretaria(id_Secretaria),
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion)
);



-- !21 Tabla de Facturas
CREATE TABLE Factura (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    id_servicio INT NULL,-- !Si es cita sera el id de la cita, pero si es afiliacion sera el id del plan de afiliacion, y para identeificarlo mejor se usara el paciente 
    tipo_servicio ENUM('Cita', 'Afiliacion') NOT NULL,
    paciente INT NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATETIME NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado_pago ENUM('Pendiente', 'Pagado') NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (paciente) REFERENCES Paciente(numero_documento)
);


-- !22 Tabla de Pagos
CREATE TABLE Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'Cheque') NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES Factura(id_factura)
);


-- !23 Tabla de Observaciones
CREATE TABLE Observacion (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL,
    observacion TEXT NOT NULL,
    fecha_observacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita)
);
