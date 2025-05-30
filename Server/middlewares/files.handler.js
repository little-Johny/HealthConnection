const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Metodo para obtener la ip
function getWSLIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (
                net.family === 'IPv4'
        && !net.internal
        && net.address.startsWith('172.')
            ) {
                return net.address; // Devuelve la Ip de WSL
            }
        }
    }

    return 'localhost'; // en caso de error
}

const serverIP = getWSLIP();

// Ruta de la carpeta para almacenar imágenes de usuarios
const usersUploadDir = path.join(__dirname, '../../Uploads/users');
const postsUploadDir = path.join(__dirname, '../../Uploads/posts');

// Crear la carpeta si no existe
[usersUploadDir, postsUploadDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuración de almacenamiento
const createStorage = (uploadDir) => multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e8)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// Validación de archivos permitidos
const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
];
const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(
            new Error(`Tipo de archivo no permitido: ${file.mimetype}`),
            false,
        );
    }
    cb(null, true);
};

// Límite de tamaño de archivo (5MB)
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// Middleware de subida
const userUpload = multer({
    storage: createStorage(usersUploadDir),
    fileFilter,
    limits: { fileSize: FILE_SIZE_LIMIT },
});

const postsUpload = multer({
    storage: createStorage(postsUploadDir),
    fileFilter,
    limits: { fileSize: FILE_SIZE_LIMIT },
});

function getUploadedFileURL(folder, filename) {
    return `http://${serverIP}:3000/Uploads/${folder}/${filename}`;
}

module.exports = { userUpload, postsUpload, getUploadedFileURL };
