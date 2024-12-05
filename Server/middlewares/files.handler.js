const multer =  require('multer');
const path= require('path');
const fs = require('fs');
const { object, date } = require('joi');
const { application } = require('express');

//funcion para crear directorios dinamicamente
function createDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
};

//configuracion de directorios
const uploadsDir = path.join(__dirname, '../../Uploads');
const directories = {
    pacientes: path.join(uploadsDir, 'pacientes'),
    doctoresFotoes: path.join(uploadsDir, 'doctores'),
    doctoresFoto: path.join(uploadsDir, 'doctores/fotos'),
    doctoresTarjeta: path.join(uploadsDir, 'doctores/tarjetas'),
    administrativos: path.join(uploadsDir, 'administrativos'),
    publicaciones: path.join(uploadsDir, 'publicaciones'),
};

//creamos las carpetas necesarias para almacenar los documentos
for(const dir of Object.values(directories)){
    createDirectory(dir);
};

// Configuración de almacenamiento dinámico
function createStorage(folder) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            createDirectory(folder); // Asegurarse de que el folder exista
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
}

//validacion de tipos de archivos
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error(`Tipo de archivo no permitido: ${file.mimetype}`);
        error.code = 'FILE_TYPE_NOT_ALLOWED';
        return cb(error, false);
    }
    cb(null, true);
};

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// Crear middleware dinámico
const createUploadMiddleware = (folder) => multer({
    storage: createStorage(folder),
    fileFilter,
    limits: { fileSize: FILE_SIZE_LIMIT },
});

const pacienteUpload = createUploadMiddleware(directories.pacientes);
const doctoresFotoUpload = createUploadMiddleware(directories.doctoresFoto);
const doctoresTarjetaUpload = createUploadMiddleware(directories.doctoresTarjeta);
const administrativoUpload = createUploadMiddleware(directories.administrativos);

module.exports = { pacienteUpload, doctoresFotoUpload, doctoresTarjetaUpload, administrativoUpload };