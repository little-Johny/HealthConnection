-- Creación de la base de datos
CREATE DATABASE Health_connection;
USE Health_connection;


-- Tabla de Ciudad
CREATE TABLE Ciudad (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL
);

-- Tabla de Especialidad
CREATE TABLE Especialidad (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(255) NOT NULL,
    costo DECIMAL(10,2) NOT NULL  -- Costo de la especialidad
);


-- Tabla de Direccion
CREATE TABLE Direccion (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(200) NOT NULL,
    id_ciudad INT,
    FOREIGN KEY (id_ciudad) REFERENCES Ciudad(id_ciudad)
);

-- Tabla de Afiliacion
CREATE TABLE Afiliacion (
    id_afiliacion INT AUTO_INCREMENT PRIMARY KEY ,
    nombre_plan VARCHAR(50) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) NOT NULL,
    max_beneficiarios INT NOT NULL
);

-- Tabla de Paciente
CREATE TABLE Paciente (
    numero_documento INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_doc VARCHAR(30) NOT NULL,
    fecha_de_nacimiento DATE NOT NULL,
    genero CHAR NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    id_afiliacion INT NULL,
    FOREIGN KEY (id_afiliacion) REFERENCES Afiliacion(id_afiliacion),
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion)
);

-- Tabla de Doctores
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
    contraseña VARCHAR(255) NOT NULL,
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad)
);

-- Tabla de Administrativos
CREATE TABLE Administrativos (
    id_Administrativos INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol ENUM('Administrador','Secretaria') NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento INT UNIQUE NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion)
);

-- Tabla de tipo_cita
CREATE TABLE TipoCita (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    costo_adicional DECIMAL(10,2) NOT NULL
);

-- Tabla de Citas
CREATE TABLE Cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,
    id_Administrativos INT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_cita INT NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    especialidad INT NOT NULL,
    requiere_autorizacion BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_doctor) REFERENCES Doctor(id_doctor),
    FOREIGN KEY (id_Administrativos) REFERENCES Administrativos(id_Administrativos),
    FOREIGN KEY (tipo_cita) REFERENCES TipoCita(id_tipo),
    FOREIGN KEY (especialidad) REFERENCES Especialidad(id_especialidad)
);

-- Tabla de Estados
CREATE TABLE Estado (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);

-- Tabla de Historial de Estados (Tabla Relacional)
CREATE TABLE HistorialEstados (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT,
    id_estado INT,
    fecha_cambio DATETIME NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita),
    FOREIGN KEY (id_estado) REFERENCES Estado(id_estado)
);

-- Tabla de Publicaciones
CREATE TABLE Publicacion (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATETIME NOT NULL
);

-- Tabla Relacional para Publicaciones y Administrativoss
CREATE TABLE Administrativos_Publicacion (
    id_Administrativos INT,
    id_publicacion INT,
    PRIMARY KEY (id_Administrativos, id_publicacion),
    FOREIGN KEY (id_Administrativos) REFERENCES Administrativos(id_Administrativos),
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion)
);

-- Tabla Asignacion de Cita
CREATE TABLE AsignacionCita (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT,
    id_Administrativos INT,
    fecha_asignacion DATETIME NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita),
    FOREIGN KEY (id_Administrativos) REFERENCES Administrativos(id_Administrativos)
);

-- Tabla de Facturas
CREATE TABLE Factura (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    id_servicio INT NULL,
    tipo_servicio ENUM('Cita', 'Afiliacion') NOT NULL,
    id_paciente INT NOT NULL,
    fecha_emision DATETIME NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    estado_pago ENUM('Pendiente', 'Pagado') NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento)
);

-- Tabla de Pagos
CREATE TABLE Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    fecha_pago DATETIME NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'Cheque') NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES Factura(id_factura)
);

-- Tabla de Observaciones
CREATE TABLE Observacion (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL,
    observacion TEXT NOT NULL,
    fecha_observacion DATETIME NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita)
);

-- Tabla de Autorizaciones
CREATE TABLE Autorizacion (
    id_autorizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    nombre_paciente VARCHAR(100) NOT NULL, -- Nombre del paciente
    id_administrativo_asignador INT NOT NULL,
    nombre_administrativo_asignador VARCHAR(100) NOT NULL, -- Nombre del administrativo asignador
    id_doctor_aprobador INT,
    nombre_doctor_aprobador VARCHAR(100), -- Nombre del doctor aprobador (puede ser NULL)
    tipo_cita INT NOT NULL, -- Tipo de examen
    fecha_solicitud DATETIME NOT NULL,
    fecha_resolucion DATETIME,
    fecha_solicitada DATE NOT NULL,
    estado_autorizacion ENUM('Pendiente', 'Aprobada', 'Rechazada') NOT NULL,
    descripcion TEXT,
    documento_url VARCHAR(255),
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_administrativo_asignador) REFERENCES Administrativos(id_Administrativos),
    FOREIGN KEY (id_doctor_aprobador) REFERENCES Doctor(id_doctor),
    FOREIGN KEY (tipo_cita)REFERENCES TipoCita(id_tipo)
);
