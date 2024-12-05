const express = require('express');
require('express-async-errors'); // Se cargará globalmente si se usa en rutas
const cors = require('cors');
const path = require('path');

const {
    logError, 
    errorHandler, 
    boomErrorHandler
} = require('./middlewares/error.handler');
const connection = require('./config/db');
const routerApi = require('./routers');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Servir archivos estáticos de la carpeta "uploads"
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads'))); // Ruta absoluta

routerApi(app);

// Implementación de middlewares
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

// Función para probar la conexión a la base de datos
const testDbConnection = async () => {
    try {
        const [connectionStatus] = await connection.query(`SELECT 'Connection successful' AS result`);
        console.log(`Database connection status: ${connectionStatus[0]?.result || 'Query failed'}`);
    } catch (error) {
        console.error(`Error connecting to database: ${process.env.DB_NAME}.`, error.message);
        throw new Error('Database connection failed.');
    }
};

// Iniciar el servidor
(async () => {
    try {
        await testDbConnection(); // Verificar conexión con la base de datos
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}.`);
        });
    } catch (error) {
        console.error(`Failed to start the server: ${error.message}`);
        process.exit(1); // Terminar proceso si no hay conexión a la base de datos
    }
})();

// Manejar errores no atrapados (opcional, pero recomendable)
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1); // Finaliza el proceso de forma controlada
});
