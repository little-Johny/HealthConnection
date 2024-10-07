-- Creación de la base de datos
CREATE DATABASE Health_connection;
USE Health_connection;

-- !1 Tabla Rol
CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(50) NOT NULL UNIQUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo','inactivo') DEFAULT 'activo'
);

-- !2 Tabla Especialidad
CREATE TABLE Especialidad (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad TEXT NOT NULL,
    costo DECIMAL(10,2) NOT NULL,  -- Costo de la especialidad
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_especialidad ENUM('activo','inactivo') DEFAULT 'activo'
);

-- !3 Tabla TipoCita
CREATE TABLE TipoCita (
    id_tipo_cita INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    costo_tipo_cita DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_tipo_cita ENUM('activo','inactivo') DEFAULT 'activo'
);

-- !4 Tabla TipoExamen
CREATE TABLE TipoExamen (
    id_tipo_examen INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    costo_tipo_examen DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_tipo_examen ENUM('activo','inactivo') DEFAULT 'activo'
);

-- !5 Tabla Afiliacion
CREATE TABLE Afiliacion (
    id_afiliacion INT AUTO_INCREMENT PRIMARY KEY,
    afiliacion VARCHAR(50) NOT NULL,
    beneficios_afiliacion TEXT NOT NULL,
    max_beneficiarios INT NOT NULL DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP, 
    estado_afiliacion ENUM('activo','inactivo') DEFAULT 'activo',
    descuento DECIMAL(5,2) NOT NULL,
    costo_afiliacion DECIMAL(10,2) NULL
);

-- !6 Tabla Paciente
CREATE TABLE Paciente (
    numero_documento INT PRIMARY KEY,
    tipo_doc VARCHAR(30) NOT NULL,
    nombre_paciente VARCHAR(100) NOT NULL,
    apellido_paciente VARCHAR(100) NOT NULL,
    genero_paciente CHAR(1) NOT NULL,
    grupo_sanguineo ENUM('-O','+O','-A','+A','-B','+B','-AB'.'+AB'),
    nacimiento_paciente DATE NOT NULL,
    ciudad_paciente VARCHAR NOT NULL,
    direccion_paciente VARCHAR NOT NULL,
    telefono_paciente VARCHAR(30),
    email_paciente VARCHAR(100) NOT NULL,
    foto_paciente VARCHAR(255) NOT NULL,
    contraseña_paciente VARBINARY(255) NOT NULL,
    estado_paciente ENUM('activo','inactivo') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    afiliado BOOLEAN DEFAULT FALSE,
    rol INT NOT NULL,  -- Asociar el rol desde la tabla Rol
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- !7 Tabla Paciente_has_Afiliacion
CREATE TABLE Paciente_has_Afiliacion (
    id_pacienteAfiliacion INT NOT NULL PRIMARY_KEY AUTO_INCREMENT,
    id_cotizante INT NOT NULL,
    id_afiliacion INT NOT NULL,
    fecha_adquisicion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_pago DATE,
    estado_pacienteAfiliacion ENUM('activo','inactivo') DEFAULT 'activo',
    FOREIGN KEY (id_cotizante) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_afiliacion) REFERENCES Autorizacion(id_autorizacion) 
);

-- !8 Tabla Beneficiario
CREATE TABLE Beneficiario (
    id_beneficiario INT NOT NULL PRIMARY KEY,
    id_cotizante INT NOT NULL,
    id_paciente INT NOT NULL,
    id_pacienteAfiliacion INT NOT NULL,
    parentezco_beneficiario VARCHAR(100) NOT NULL,
    fecha_registro_beneficiario DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_beneficiario ENUM('activo','inactivo') DEFAULT 'activo',
    FOREIGN KEY (id_cotizante) REFERENCES Paciente (numero_documento),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (numero_documento),
    FOREIGN KEY (id_pacienteAfiliacion) REFERENCES Paciente_has_Afiliacion(id_pacienteAfiliacion)
);

-- !9 Tabla Historia Clinica
CREATE TABLE Historia_Clinica (
    id_historiaClinica INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnostico VARCHAR(255) DEFAULT 'N/N',
    medicinas VARCHAR(255) DEFAULT 'N/N',
    alergias VARCHAR(255) DEFAULT 'N/N',
    procedimientos VARCHAR(255) DEFAULT 'N/N',
    tratamientos VARCHAR(255) DEFAULT 'N/N',
    FOREIGN KEY (id_paciente) REFERENCES Paciente (numero_documento)
);

-- !10 Tabla Diagnostico
CREATE TABLE Diagnostico (
    id_diagnostico INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT NOT NULL,
    fecha_diagnostico DATETIME DEFAULT CURRENT_TIMESTAMP,
    detalles_diagnostico VARCHAR(255),
    gravedad_diagnostico ENUM('alta','moderada','leve'),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (numero_documento)
);

-- !11 Tabla Consultorio
CREATE TABLE Consultorio (
    id_consultorio INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    piso_consultorio VARCHAR(10) NOT NULL,
    consultorio VARCHAR(15) NOT NULL,
    disponibilidad_consultorio ENUM('ocupado','disponible','mantenimiento') DEFAULT 'disponible',
    equipamiento_consultorio VARCHAR(255) DEFAULT 'no aplica',
    estado_consultorio ENUM('activo','inactivo') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- !12 Tabla Funcionario
CREATE TABLE Funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    num_doc INT UNIQUE NOT NULL,
    tipo_doc VARCHAR(30) NOT NULL,
    nombre_funcionario VARCHAR(100) NOT NULL,
    apellido_funcionario VARCHAR(100) NOT NULL,
    ciudad_funcionario VARCHAR(255) NOT NULL,
    direccion_funcionario VARCHAR(255) NOT NULL,
    telefono_funcionario VARCHAR(30),
    email_funcionario VARCHAR(100) NOT NULL,
    contraseña_funcionario VARBINARY(255) NOT NULL,
    estado_funcionario ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    rol INT NOT NULL,  
    especialidad_funcionario INT NULL,
    consultorio_funcionario INT NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol (id_rol),
    FOREIGN KEY (especialidad_funcionario) REFERENCES Especialidad (id_especialidad),
    FOREIGN KEY (consultorio_funcionario) REFERENCES Consultorio (id_consultorio) 
);

-- !13 Tabla de Publicaciones
CREATE TABLE Publicacion (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo_publicacion VARCHAR(100) NOT NULL,
    contenido_publicacion VARCHAR(255) NOT NULL,
    imagen_publicacion VARCHAR(255) NULL,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_publicacion ENUM('activo','inactivo') DEFAULT 'activo',
    autor_publicacion INT NOT NULL,
    FOREIGN KEY(autor_publicacion) REFERENCES Funcionario (id_funcionario)
);

-- !14 Tabla de Estados
CREATE TABLE Estado (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

-- !15 Tabla de Autorizaciones
CREATE TABLE Autorizacion (
    id_autorizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,  -- Paciente al que se le autoriza el procedimiento
    id_doctor INT NOT NULL,    -- Doctor que solicita y/o asigna la autorización
    id_funcionario_asignador INT NULL, -- Administrador que aprueba o rechaza la autorización
    tipo_cita INT NOT NULL,    -- Tipo examen/especialista
    tipo_examen INT NOT NULL,
    especialidad_autorizacion INT NOT NULL,
    estado_autorizacion INT NOT NULL,
    fecha_procedimiento DATETIME NOT NULL, -- Fecha solicitada para el procedimiento
    fecha_resolucion DATETIME, -- Cuándo se aprobó/rechazó
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion_autorizacion VARCHAR(255) NOT NULL,
    firma_doctor VARCHAR(255),
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_doctor) REFERENCES Funcionario (id_funcionario),
    FOREIGN KEY (id_funcionario_asignador) REFERENCES Funcionario (id_funcionario),
    FOREIGN KEY (tipo_cita) REFERENCES TipoCita(id_tipo_cita), 
    FOREIGN KEY (tipo_examen) REFERENCES TipoExamen(id_tipo_examen), 
    FOREIGN KEY (especialidad_autorizacion) REFERENCES Especialidad (id_especialidad),
    FOREIGN KEY (estado_autorizacion) REFERENCES Estado (id_estado)
);

-- !16 Tabla Cita
CREATE TABLE Cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,-- Para quien es la cita
    id_doctor INT NOT NULL,-- el que atendera
    id_funcionario_asignador INT NULL,-- el que asigna
    tipo_cita INT NOT NULL,
    especialidad_cita INT NOT NULL,
    tipo_solicitante_cita ENUM('paciente','secretaria'),
    solicitante_cita INT NULL,-- el que solicita
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    costo_cita DECIMAL(10,2) NOT NULL,
    auto_req BOOLEAN DEFAULT FALSE,
    auto_doc VARCHAR(255) NULL,  
    fecha_registro_cita DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_examen INT NOT NULL,
    id_autorizacion INT NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES Paciente (numero_documento),
    FOREIGN KEY (id_doctor) REFERENCES Funcionario (id_funcionario),
    FOREIGN KEY (id_funcionario_asignador) REFERENCES Funcionario (id_funcionario),
    FOREIGN KEY (tipo_cita) REFERENCES TipoCita (id_tipo_cita),
    FOREIGN KEY (especialidad_cita) REFERENCES Especialidad (id_especialidad),
    FOREIGN KEY (tipo_examen) REFERENCES TipoExamen (id_tipo_examen),
    FOREIGN KEY (id_autorizacion) REFERENCES Autorizacion (id_autorizacion)
);

-- !17 Tabla Cita_has_Estado
CREATE TABLE Cita_has_Estado (
    id_citaEstado INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cita INT NOT NULL,
    id_estado INT NOT NULL,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- !18 Tabla Observacion
CREATE TABLE Observacion (
    id_observacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL,
    observacion TEXT NOT NULL,
    fecha_observacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES Cita (id_cita)
);

-- !19 Tabla Resultado
CREATE TABLE Resultado (
    id_resultado INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_cita INT NOT NULL,
    tipo_examen INT NOT NULL,
    descripcion_resultado VARCHAR(255),
    resultado VARCHAR(255),
    documento_adjunto VARCHAR(255),
    fecha_resultado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES Cita (id_cita),
    FOREIGN KEY (tipo_examen) REFERENCES TipoExamen (id_tipo_examen)
);

-- !20 Tabla Pago
CREATE TABLE Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_afiliacion INT NULL,
    id_cita INT NULL,
    tipo_servicio ENUM('Cita', 'Afiliacion') NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATETIME NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado_pago ENUM('Pendiente', 'Pagado') NOT NULL,
    descripcion VARCHAR(255),
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_afiliacion) REFERENCES Paciente_has_Afiliacion (id_pacienteAfiliacion),
    FOREIGN KEY (id_cita) REFERENCES Cita (id_cita)
);


-- !21 Tabla Ticket
CREATE TABLE Ticket (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_pago INT NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'Cheque') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pago) REFERENCES Pago (id_pago)
);



