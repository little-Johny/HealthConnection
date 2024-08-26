-- Creación de la base de datos
CREATE DATABASE Health_connection;
USE Health_connection;

-- Tabla de Tipos de Documento
CREATE TABLE TiposDocumento (
    id_tipo_documento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Ciudad
CREATE TABLE Ciudad (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Especialidad
CREATE TABLE Especialidad (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100)
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
    id_afiliacion INT AUTO_INCREMENT PRIMARY KEY,
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
    tipo_doc INT NOT NULL,
    fecha_de_nacimiento DATE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    direccion INT NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    id_afiliacion INT NULL,
    FOREIGN KEY (id_afiliacion) REFERENCES Afiliacion(id_afiliacion),
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (tipo_doc) REFERENCES TiposDocumento(id_tipo_documento)
);

-- Tabla de Doctores
CREATE TABLE Doctor (
    id_doctor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento INT NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    id_especialidad INT NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad),
    FOREIGN KEY (tipo_documento) REFERENCES TiposDocumento(id_tipo_documento)
);

-- Tabla de Secretarias
CREATE TABLE Secretaria (
    id_secretaria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento INT NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    direccion INT NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    FOREIGN KEY (direccion) REFERENCES Direccion(id_direccion),
    FOREIGN KEY (tipo_documento) REFERENCES TiposDocumento(id_tipo_documento)
);

-- Tabla de Categorías de Cita
CREATE TABLE CategoriaCita (
    id_categoria_cita INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla de Citas
CREATE TABLE Cita (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,
    id_secretaria INT,
    fecha DATETIME NOT NULL,
    tipo_cita ENUM('Medicina General', 'Especialista', 'Examen') NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    categoria INT NOT NULL,
    requiere_autorizacion BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_paciente) REFERENCES Paciente(numero_documento),
    FOREIGN KEY (id_doctor) REFERENCES Doctor(id_doctor),
    FOREIGN KEY (id_secretaria) REFERENCES Secretaria(id_secretaria),
    FOREIGN KEY (categoria) REFERENCES CategoriaCita(id_categoria_cita)
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

-- Tabla Relacional para Publicaciones y Secretarias
CREATE TABLE Secretaria_Publicacion (
    id_secretaria INT,
    id_publicacion INT,
    PRIMARY KEY (id_secretaria, id_publicacion),
    FOREIGN KEY (id_secretaria) REFERENCES Secretaria(id_secretaria),
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion)
);

-- Tabla Asignacion de Cita
CREATE TABLE AsignacionCita (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT,
    id_secretaria INT,
    fecha_asignacion DATETIME NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES Cita(id_cita),
    FOREIGN KEY (id_secretaria) REFERENCES Secretaria(id_secretaria)
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
