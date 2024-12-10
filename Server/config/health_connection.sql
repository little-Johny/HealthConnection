-- Creación de la base de datos
CREATE DATABASE health_connection;
USE health_connection;

-- Tabla de usuarios
CREATE TABLE Usuario (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('administrador', 'doctor', 'paciente', 'asistente') NOT NULL,
    activo BOOLEAN DEFAULT true,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pacientes
CREATE TABLE Paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- Relación con Usuario
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    foto VARCHAR(255) NULL, -- URL o ruta de la foto
    tipo_documento ENUM('c.c', 't.i', 'c.e', 'r.c') NOT NULL,
    numero_documento VARCHAR(50) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('masculino', 'femenino') NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabla de historia clínica
CREATE TABLE HistoriaClinica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL, -- Relación con Paciente
    grupo_sanguineo VARCHAR(10),
    enfermedades TEXT,
    condiciones_familiares TEXT,
    cirugias TEXT,
    alergias TEXT,
    habitos TEXT,
    FOREIGN KEY (paciente_id) REFERENCES Paciente(id)
);

-- Tabla de observaciones de citas
CREATE TABLE Observacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    historia_clinica_id INT NOT NULL, -- Relación con Historia Clínica
    motivo TEXT,
    sintomas TEXT,
    signos_vitales TEXT,
    hallazgos TEXT,
    conclusion TEXT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (historia_clinica_id) REFERENCES HistoriaClinica(id)
);

-- Tabla de tratamientos
CREATE TABLE Tratamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    historia_clinica_id INT NOT NULL, -- Relación con Historia Clínica
    descripcion TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    FOREIGN KEY (historia_clinica_id) REFERENCES HistoriaClinica(id)
);

-- Tabla de especialidades
CREATE TABLE Especialidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    costo DECIMAL(10,2) NOT NULL -- Costo por consulta o especificar el tipo de costo
);

-- Tabla de doctores
CREATE TABLE Doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- Relación con Usuario
    especialidad_id INT NOT NULL, -- Relación con Especialidades
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    foto VARCHAR(255) NULL, -- URL o ruta de la foto
    tipo_documento ENUM('c.c', 't.i', 'c.e', 'rc') NOT NULL,
    genero ENUM('masculino', 'femenino'),
    telefono VARCHAR(30),
    correo VARCHAR(100),
    horario TEXT,
    fecha_contratacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (especialidad_id) REFERENCES Especialidad(id)
);

-- Tabla de personal administrativo
CREATE TABLE PersonalAdministrativo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- Relación con Usuario
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    foto VARCHAR(255) NULL, -- URL o ruta de la foto
    tipo_documento ENUM('dni', 'pasaporte', 'c.c', 't.i', 'c.e') NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    genero ENUM('masculino', 'femenino'),
    telefono VARCHAR(30),
    correo VARCHAR(100),
    horario TEXT,
    fecha_contratacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabla de tipos de cita
CREATE TABLE TipoCita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    costo_adicional DECIMAL(10,2) NOT NULL
);

-- Tabla de citas
CREATE TABLE Cita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL, -- Relación con Paciente
    doctor_id INT NOT NULL, -- Relación con Doctor
    tipo_cita_id INT NOT NULL, -- Relación con Tipos de Cita
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    requiere_autorizacion BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (paciente_id) REFERENCES Paciente(id),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
    FOREIGN KEY (tipo_cita_id) REFERENCES TipoCita(id)
);

-- Tabla de estados de citas
CREATE TABLE Estado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Historial de estados de citas
CREATE TABLE HistorialEstado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL, -- Relación con Cita
    estado_id INT NOT NULL, -- Relación con Estado
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES Cita(id),
    FOREIGN KEY (estado_id) REFERENCES Estado(id)
);

-- Tabla de publicaciones
CREATE TABLE Publicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL, -- Título de la publicación
    contenido TEXT NULL, -- Contenido de la publicación
    imagen_url VARCHAR(255) NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última actualización
    autor_id INT NOT NULL, -- Relación con Personal Administrativo
    FOREIGN KEY (autor_id) REFERENCES PersonalAdministrativo(id)
);
